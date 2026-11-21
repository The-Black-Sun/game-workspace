#!/usr/bin/env node
/**
 * sync-data.mjs — 把工作区数据同步进 dashboard/public/data/
 *
 * 数据源（dashboard 的上一级 = 工作区根）：
 *   workspace.json                 → public/data/workspace.json
 *   <entity.folder>/**             → public/data/entities/<folder>/**
 *
 * 跳过：.git / .godot / node_modules / builds / export 目录与 >8MB 的文件。
 * 由 npm run dev / build 的 pre 钩子自动执行，也可手动 `npm run sync`。
 */
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.dirname(dashboardDir);
const outDir = path.join(dashboardDir, 'public', 'data');
const SKIP_DIRS = new Set(['.git', '.godot', '.mono', 'node_modules', 'builds', 'export', '.mrmak']);
const MAX_FILE = 8 * 1024 * 1024;

async function copyEntityFolder(src, dest) {
  await mkdir(dest, { recursive: true });
  // 手写递归，避免额外依赖
  async function walk(s, d) {
    const entries = await readdir(s, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name) || e.name.startsWith('data_')) continue;
        await mkdir(path.join(d, e.name), { recursive: true });
        await walk(path.join(s, e.name), path.join(d, e.name));
      } else if (e.isFile()) {
        const st = await stat(path.join(s, e.name));
        if (st.size > MAX_FILE) {
          console.warn(`  跳过大文件（>${MAX_FILE / 1024 / 1024}MB）: ${path.relative(root, path.join(s, e.name))}`);
          continue;
        }
        await cp(path.join(s, e.name), path.join(d, e.name));
      }
    }
  }
  await walk(src, dest);
}

const registry = JSON.parse(await readFile(path.join(root, 'workspace.json'), 'utf8'));
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(path.join(root, 'workspace.json'), path.join(outDir, 'workspace.json'));

const manifest = { syncedAt: new Date().toISOString(), entities: [] };
for (const entity of registry.entities ?? []) {
  const src = path.join(root, entity.folder);
  let copied = false;
  try {
    if ((await stat(src)).isDirectory()) {
      await copyEntityFolder(src, path.join(outDir, 'entities', entity.folder));
      copied = true;
    }
  } catch {
    console.warn(`  实体文件夹不存在：${entity.folder}（${entity.id}）`);
  }
  manifest.entities.push({ id: entity.id, folder: entity.folder, copied });
}
await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`已同步 ${manifest.entities.filter((e) => e.copied).length}/${manifest.entities.length} 个实体 → dashboard/public/data/`);
