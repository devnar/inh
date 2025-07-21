#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import unzipper from 'unzipper';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { pathToFileURL } from 'url';

const program = new Command();
const INH_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.inh');
const PKG_DIR = path.join(INH_DIR, 'packages');

fs.ensureDirSync(PKG_DIR);

const API_BASE = 'https://inh.onrender.com/api';

async function runPackage(name) {
  const pkgPath = path.join(PKG_DIR, name);

  try {
    const content = await fs.readFile(path.join(pkgPath, 'inh.json'), 'utf8');
    const meta = JSON.parse(content);
    const entry = path.join(pkgPath, meta.entry);

    const entryUrl = pathToFileURL(entry).href;
    await import(entryUrl);
    console.log(`✅ Package "${name}" executed successfully.`);
  } catch (err) {
    console.error(`\n[!] Error while running package "${name}":`, err);
  }
}

program
  .name('inh')
  .description(`🧠 INH Terminal (I'm Not Hacker)
A modular CLI platform to run JavaScript-based terminal packages.
Install, run, upload, and build terminal apps with ease.

Visit https://github.com/devnar/inh/wiki for more information.`)
  .version('1.3.0');

// Command: status
program
  .command('status')
  .description('Check if the remote registry server is online')
  .action(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (!res.ok) throw new Error('Failed to connect');

      const data = await res.json();
      console.log(`✅ Server is online.`);
      console.log(`📦 Package count: ${data.packageCount}`);
      console.log(`🕒 Time: ${new Date(data.timestamp).toLocaleString()}`);
    } catch (e) {
      console.log('❌ Server is offline or unreachable.');
    }
  });

// Command: update
program
  .command('update')
  .description('Update the CLI script from the GitHub source')
  .action(async () => {
    const remoteUrl = 'https://raw.githubusercontent.com/<your-username>/<repo-name>/main/cli.js';
    const localPath = new URL(import.meta.url).pathname;

    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) throw new Error('Failed to fetch updated CLI script.');

      const updatedCode = await res.text();
      await fs.writeFile(localPath, updatedCode, 'utf8');
      console.log('✅ CLI updated successfully.');
    } catch (err) {
      console.error('❌ Update failed:', err.message);
    }
  });

// Command: install
program
  .command('install <name>')
  .alias('i')
  .description('Download and install a package by name')
  .action(async (name) => {
    try {
      const res = await axios.get(`${API_BASE}/packages/${name}`);
      const pkg = res.data;

      const zipUrl = `${pkg.repo}/archive/refs/heads/main.zip`;
      const targetPath = path.join(PKG_DIR, name);

      console.log(`[+] Downloading package "${name}"...`);
      const zipRes = await axios({ url: zipUrl, responseType: 'stream' });

      await fs.emptyDir(targetPath);
      await new Promise((resolve, reject) => {
        zipRes.data
          .pipe(unzipper.Extract({ path: targetPath }))
          .on('close', resolve)
          .on('error', reject);
      });

      // Flatten if there's a single inner directory
      const subDirs = await fs.readdir(targetPath);
      if (subDirs.length === 1) {
        const inner = path.join(targetPath, subDirs[0]);
        await fs.copy(inner, targetPath);
        await fs.remove(inner);
      }

      // Install dependencies if package.json exists
      if (fs.existsSync(path.join(targetPath, 'package.json'))) {
        console.log('[+] Installing dependencies...');
        execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
      }

      console.log(`[✓] Package "${name}" installed successfully.`);
    } catch (err) {
      console.error('❌ Installation failed:', err.message || err);
    }
  });

// Command: uninstall
program
  .command('uninstall <name>')
  .alias('u')
  .description('Remove an installed package')
  .action((name) => {
    const target = path.join(PKG_DIR, name);
    if (fs.existsSync(target)) {
      fs.removeSync(target);
      console.log(`[✓] Package "${name}" removed.`);
    } else {
      console.log(`[!] Package "${name}" is not installed.`);
    }
  });

// Command: run
program
  .command('run <name>')
  .description('Run an installed package')
  .action(runPackage);

// Command: upload
program
  .command('upload <githubUrl>')
  .description('Upload a package to the registry')
  .action(async (githubUrl) => {
    try {
      let rawUrl = githubUrl;

      if (!rawUrl.includes('raw.githubusercontent.com')) {
        rawUrl = githubUrl
          .replace(/^https?:\/\//, '')
          .replace('github.com', 'raw.githubusercontent.com')
          .replace(/\/$/, '') + '/main/inh.json';
        rawUrl = 'https://' + rawUrl;
      }

      console.log('📥 Fetching inh.json from:', rawUrl);

      const response = await axios.get(rawUrl);
      const inhJson = response.data;

      const res = await axios.post(`${API_BASE}/upload`, { packageData: inhJson });
      console.log('✅ Package uploaded:', res.data);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err.message);
    }
  });

// Command: list
program
  .command('list')
  .description('List packages')
  .option('--my', 'Show locally installed packages')
  .option('--all', 'Show all available packages from the registry')
  .action((options) => {
    if (options.my) {
      listMyPackages();
    } else if (options.all) {
      listAllPackages();
    } else {
      listMyPackages();
    }
  });

export function listMyPackages() {
  if (!fs.existsSync(PKG_DIR)) {
    return console.log('📂 No packages installed.');
  }

  const dirs = fs.readdirSync(PKG_DIR);
  if (dirs.length === 0) return console.log('📦 No installed packages found.');

  console.log('📦 Installed Packages:');
  dirs.forEach((pkg) => {
    const metaPath = path.join(PKG_DIR, pkg, 'inh.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      console.log(`- ${meta.name} (${meta.version})`);
    } else {
      console.log(`- ${pkg} (missing metadata)`);
    }
  });
}

export async function listAllPackages() {
  try {
    const res = await axios.get(`${API_BASE}/packages`);
    const packages = res.data;

    if (!Array.isArray(packages) || packages.length === 0) {
      return console.log('ℹ️ No packages available at the moment.');
    }

    console.log(`📦 Available Packages (${packages.length}):\n`);
    packages.forEach((pkg) => {
      console.log(`🔹 ${pkg.name} - ${pkg.description || 'No description'}`);
    });

    console.log('\n🛈 Install a package using: inh install <package-name>');
  } catch (err) {
    console.error('❌ Failed to fetch packages:', err.message);
  }
}

program.parse();