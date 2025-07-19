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
    console.log(`Paket ${name} başarıyla çalıştırıldı.`);
  } catch (err) {
    console.error(`\n[!] Paket çalıştırılırken hata oluştu:`, err);
  }
}


program
  .name('inh')
  .description(`Welcome to \"I'm Not Hacker\"! This is an open-source development platform designed as a web terminal, enabling developers and enthusiasts to create and enhance their own terminal experience by writing JavaScript code.`)
  .version('1.2.0');

program
  .command('status')
  .description('Sunucuyu kontrol et')
  .action(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (!res.ok) throw new Error('Bağlantı başarısız');

      const data = await res.json();
      console.log(`✅ Sunucu aktif.`);
      console.log(`📦 Paket sayısı: ${data.packageCount}`);
      console.log(`🕒 Zaman: ${new Date(data.timestamp).toLocaleString()}`);
    } catch (e) {
      console.log('❌ Sunucu pasif');
    }
  });

program
  .command('update')
  .description('CLI aracını güncelle (GitHub üzerinden)')
  .action(async () => {
    const remoteUrl = 'https://raw.githubusercontent.com/<kullanıcı-adı>/<repo-adi>/main/cli.js';
    const localPath = new URL(import.meta.url).pathname;

    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) throw new Error('Güncellenmiş CLI alınamadı.');

      const updatedCode = await res.text();

      await fs.writeFile(localPath, updatedCode, 'utf8');
      console.log('✅ CLI başarıyla güncellendi.');
    } catch (err) {
      console.error('❌ Güncelleme başarısız:', err.message);
    }
  });

// Komut: inh install <paket>
program
  .command('install <name>')
  .alias('i')
  .description('Bir paketi indir ve kur')
  .action(async (name) => {
    try {
      const res = await axios.get(`${API_BASE}/packages/${name}`);
      const pkg = res.data;

      const zipUrl = `${pkg.repo}/archive/refs/heads/main.zip`;
      const targetPath = path.join(PKG_DIR, name);

      console.log(`[+] ${name} paketi indiriliyor...`);
      const zipRes = await axios({ url: zipUrl, responseType: 'stream' });

      await fs.emptyDir(targetPath);
      await new Promise((resolve, reject) => {
        zipRes.data
          .pipe(unzipper.Extract({ path: targetPath }))
          .on('close', resolve)
          .on('error', reject);
      });

      // iç içe klasör varsa düzleştir
      const subDirs = await fs.readdir(targetPath);
      if (subDirs.length === 1) {
        const inner = path.join(targetPath, subDirs[0]);
        await fs.copy(inner, targetPath);
        await fs.remove(inner);
      }

      // npm install (varsa package.json)
      if (fs.existsSync(path.join(targetPath, 'package.json'))) {
        console.log('[+] Bağımlılıklar kuruluyor...');
        execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
      }

      console.log(`[✓] ${name} başarıyla kuruldu.`);
    } catch (err) {
      console.error('❌ Paket kurulurken hata oluştu:', err.message || err);
    }
  });

// Komut: inh uninstall <paket>
program
  .command('uninstall <name>')
  .alias('u')
  .description('Paketi sil')
  .action((name) => {
    const target = path.join(PKG_DIR, name);
    if (fs.existsSync(target)) {
      fs.removeSync(target);
      console.log(`[✓] ${name} kaldırıldı.`);
    } else {
      console.log(`[!] ${name} yüklü değil.`);
    }
  });
  
// Komut: inh run <paket>
program
  .command('run <name>')
  .description('Kurulu bir paketi çalıştır')
  .action(async (name) => {
    await runPackage(name);
  });


// Komut: inh upload
program
  .command('upload <githubUrl>')
  .description('GitHub reposundaki inh.json dosyasını indirip sunucuya yükle')
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

      console.log('İndirilen raw URL:', rawUrl);

      // ❗ FS yerine axios ile dosya içeriğini alıyoruz:
      const response = await axios.get(rawUrl);
      const inhJson = response.data;

      const res = await axios.post(`${API_BASE}/upload`, { packageData: inhJson });
      console.log('✅ Paket yüklendi:', res.data);
    } catch (err) {
      console.error('❌ Paket yüklenemedi:', err.response?.data || err.message);
    }
  });


// Komut: inh list
program
  .command('list')
  .description('Paketleri listeler')
  .option('--my', 'Yüklü olan paketleri gösterir')
  .option('--all', 'Tüm paketleri merkezi sunucudan gösterir')
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
    return console.log('🔍 Herhangi bir paket yüklenmemiş.');
  }

  const dirs = fs.readdirSync(PKG_DIR);
  if (dirs.length === 0) return console.log('📦 Yüklü paket yok.');

  console.log('📦 Yüklü Paketler:');
  dirs.forEach((pkg) => {
    const metaPath = path.join(PKG_DIR, pkg, 'inh.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      console.log(`- ${meta.name} (${meta.version})`);
    } else {
      console.log(`- ${pkg} (meta bulunamadı)`);
    }
  });
}

export async function listAllPackages() {
  try {
    const res = await axios.get(`${API_BASE}/packages`);
    const packages = res.data;

    if (!Array.isArray(packages) || packages.length === 0) {
      console.log('🛈 Şu anda yüklenebilir bir paket bulunamadı.');
      return;
    }

    console.log(`\n📦 ${packages.length} adet paket bulundu:\n`);

    packages.forEach((pkg) => {
      console.log(`🔹 ${pkg.name} - ${pkg.description || 'Açıklama yok'}`);
    });

    console.log('\n🛈 Bir paketi yüklemek için: inh -i <paket-adi>\n');
  } catch (err) {
    console.error('❌ Paketler alınamadı:', err.message);
  }
}

program.parse();
