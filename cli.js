#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import unzipper from 'unzipper';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';


const program = new Command();
const INH_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.inh');
const PKG_DIR = path.join(INH_DIR, 'packages');

fs.ensureDirSync(PKG_DIR);

const API_BASE = 'https://inh.onrender.com/api';

async function runPackage(name) {
  const pkgPath = path.join(PKG_DIR, name);

  try {
    const pkgJsonPath = path.join(pkgPath, 'package.json');

    const content = await fs.readFile(pkgJsonPath, 'utf8');
    const meta = JSON.parse(content);

    const entryPath = path.join(pkgPath, meta.main || 'index.js');
    if (!fs.existsSync(entryPath)) {
      throw new Error(`Entry file not found: ${entryPath}`);
    }

    const entryUrl = pathToFileURL(entryPath).href;

    await import(entryUrl);
    console.log(`✅ Package "${name}" executed successfully.`);
  } catch (err) {
    console.error(`\n[!] Error while running package "${name}":`, err.message);
  }
}

program
  .name('inh')
  .version('1.3.2')
  .usage('[command] or [packageName]')
  .description(`🧠 INH Terminal (I'm Not Hacker)
A modular CLI platform to run JavaScript-based terminal packages.
Install, upload, and build terminal apps with ease.

Visit https://github.com/devnar/inh/wiki for more information.`)
  .arguments('[packageName]')
  .action(async (packageName, cmdObj) => {
    if (!packageName) {
      program.help();
      return;
    }
    await runPackage(packageName);
  });

program
  .command('dev <folderPath>')
  .description('Run a local INH package from a folder path')
  .action(async (folderPath) => {
    try {
      const fullPath = path.resolve(folderPath);
      const pkgJsonPath = path.join(fullPath, 'package.json');

      if (!fs.existsSync(pkgJsonPath)) {
        throw new Error('package.json not found in the specified path');
      }

      const content = await fs.readFile(pkgJsonPath, 'utf8');
      const meta = JSON.parse(content);

      if (!meta.inh) {
        console.warn(`This package is not marked as an INH package (missing "inh": true)`);
      }

      const entry = meta.main || 'index.js';
      const entryPath = path.join(fullPath, entry);

      if (!fs.existsSync(entryPath)) {
        throw new Error(`Entry file not found: ${entryPath}`);
      }

      const entryUrl = pathToFileURL(entryPath).href;
      await import(entryUrl);

    } catch (err) {
      console.error(`[!] Failed to run local package: ${err.message}`);
    }
  });

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

      const subDirs = await fs.readdir(targetPath);
      if (subDirs.length === 1) {
        const inner = path.join(targetPath, subDirs[0]);
        await fs.copy(inner, targetPath);
        await fs.remove(inner);
      }

      if (fs.existsSync(path.join(targetPath, 'package.json'))) {
        console.log('[+] Installing dependencies...');
        execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
      }

      console.log(`[✓] Package "${name}" installed successfully.`);
    } catch (err) {
      console.error('❌ Installation failed:', err.message || err);
    }
  });

program
  .command('list')
  .description('List packages')
  .option('-a, --all', 'Show all available packages from the registry')
  .action((options) => {
    if (options.all) {
      listAllPackages();
    } else {
      listMyPackages();
    }
  });

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

program
  .command('update')
  .description('Update the CLI script from the GitHub source')
  .action(async () => {
    const currentVersion = program.version();
    const minimumVersion = bumpVersion(currentVersion);;

    function bumpVersion(version) {
      const parts = version.split('.').map(Number);
      parts[2] += 1;
      return parts.join('.');
    }

    function isVersionLess(v1, v2) {
      const a1 = v1.split('.').map(Number);
      const a2 = v2.split('.').map(Number);
      for (let i = 0; i < Math.max(a1.length, a2.length); i++) {
        const n1 = a1[i] || 0;
        const n2 = a2[i] || 0;
        if (n1 < n2) return true;
        if (n1 > n2) return false;
      }
      return false;
    }

    if (!isVersionLess(currentVersion, minimumVersion)) {
      console.log(`✅ INH is already up to date (v${currentVersion})`);
      return;
    }

    const remoteUrl = 'https://raw.githubusercontent.com/devnar/inh/main/cli.js';
    const localPath = fileURLToPath(import.meta.url);

    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) throw new Error(`Failed to fetch updated CLI script. Status: ${res.status}`);

      const updatedCode = await res.text();
      await fs.writeFile(localPath, updatedCode, 'utf8');
      console.log('✅ CLI updated successfully.');
    } catch (err) {
      console.error('❌ Update failed:', err.message);
    }
  });

program
  .command('upload <githubRepoUrl>')
  .description('Upload a package to the registry using a GitHub repo URL')
  .action(async (githubRepoUrl) => {
    try {
      const match = githubRepoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
      if (!match) {
        throw new Error('Invalid GitHub repository URL format. Expected: https://github.com/user/repo');
      }

      const [_, user, repo] = match;
      const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/main/package.json`;

      console.log('📥 Fetching package.json from:', rawUrl);

      const response = await axios.get(rawUrl);
      const pkgJson = response.data;

      if (!pkgJson.main) {
        throw new Error('Missing "main" field in package.json (entry point required)');
      }

      if (!pkgJson.inh) {
        throw new Error('This package is not marked as an INH package (inh: true is required).');
      }

      const res = await axios.post(`${API_BASE}/upload`, { repo: githubRepoUrl });
      console.log('✅ Package uploaded successfully:', res.data.message);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err.message);
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
    const metaPath = path.join(PKG_DIR, pkg, 'package.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      if (meta.inh) {
        console.log(`- ${meta.name} (${meta.version})`);
      }
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