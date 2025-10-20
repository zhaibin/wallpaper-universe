#!/usr/bin/env node

// 同步版本号到所有子项目

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 读取根版本号
const versionFile = join(rootDir, 'version.json');
const versionData = JSON.parse(readFileSync(versionFile, 'utf-8'));

console.log('🔄 同步版本号:', versionData.version);

// 更新 Web 应用
updatePackageJson(join(rootDir, 'apps/web/package.json'), versionData.apps.web);

// 更新桌面应用
updatePackageJson(join(rootDir, 'apps/desktop/package.json'), versionData.apps.desktop);

// 更新移动应用
updatePubspec(join(rootDir, 'apps/mobile/pubspec.yaml'), versionData.apps.mobile);

// 更新后端
updatePackageJson(join(rootDir, 'backend/api/package.json'), versionData.backend.api);
updatePackageJson(join(rootDir, 'backend/admin/package.json'), versionData.backend.admin);

console.log('✅ 版本号同步完成！');

function updatePackageJson(path, version) {
  try {
    const pkg = JSON.parse(readFileSync(path, 'utf-8'));
    pkg.version = version;
    writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  ✓ ${path} -> ${version}`);
  } catch (err) {
    console.error(`  ✗ ${path}:`, err.message);
  }
}

function updatePubspec(path, version) {
  try {
    let content = readFileSync(path, 'utf-8');
    content = content.replace(/^version: .+$/m, `version: ${version}+1`);
    writeFileSync(path, content);
    console.log(`  ✓ ${path} -> ${version}`);
  } catch (err) {
    console.error(`  ✗ ${path}:`, err.message);
  }
}
