#!/usr/bin/env node
/**
 * asset-manifest.mjs — 资产交付哈希清单工具（离线，Node 22+）
 *
 * 用途：为一批资产记录尺寸与 SHA-256，之后可校验文件是否被改动。
 * 只证明文件完整性，不代表质量/引擎就绪验收。
 *
 * 用法：
 *   node tools/asset-manifest.mjs build --plan plan.json --root . --out delivery.json
 *   node tools/asset-manifest.mjs verify --manifest delivery.json --root .
 *
 * plan.json 格式：
 *   {
 *     "entity_id": "my-asset-card",      // workspace.json 中的实体 id（可选）
 *     "step": "delivery-2026-11",        // 本次交付里程碑名（可选）
 *     "files": [
 *       { "path": "library/textures/rock.png", "role": "主纹理", "kind": "output" }
 *     ]
 *   }
 * 约束：path 为相对 --root 的正斜杠路径；kind 为 input|output；至少一个 output；
 *       拒绝重复路径、目录穿越、符号链接逃逸；build 不覆盖已存在的 --out。
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

const VERSION = 1;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[++i];
    else args._.push(argv[i]);
  }
  return args;
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(2);
}

async function hashFile(abs) {
  const buf = await readFile(abs);
  return { sha256: createHash('sha256').update(buf).digest('hex'), size: buf.length };
}

function checkRelPath(p) {
  if (typeof p !== 'string' || !p) fail('文件条目缺少 path');
  if (path.isAbsolute(p) || p.includes('\\')) fail(`路径必须是相对正斜杠形式: ${p}`);
  const norm = path.posix.normalize(p);
  if (norm.startsWith('..') || norm === '..' || p.split('/').includes('..'))
    fail(`路径越出根目录: ${p}`);
  return norm;
}

async function collect(root, files) {
  const seen = new Set();
  const out = [];
  let hasOutput = false;
  for (const f of files) {
    const rel = checkRelPath(f.path);
    if (seen.has(rel)) fail(`重复路径: ${rel}`);
    seen.add(rel);
    const kind = f.kind ?? 'output';
    if (!['input', 'output'].includes(kind)) fail(`kind 必须是 input|output: ${rel}`);
    if (kind === 'output') hasOutput = true;
    const abs = path.join(root, rel);
    const st = await lstat(abs).catch(() => fail(`文件不存在: ${rel}`));
    if (!st.isFile()) fail(`不是常规文件: ${rel}`);
    const real = await realpath(abs);
    if (!path.resolve(real).startsWith(path.resolve(root) + path.sep) && path.resolve(real) !== path.resolve(abs))
      fail(`符号链接越出根目录: ${rel}`);
    const { sha256, size } = await hashFile(abs);
    out.push({ path: rel, role: f.role ?? '', kind, size, sha256 });
  }
  if (!hasOutput) fail('清单至少需要一个 kind=output 的文件');
  return out;
}

async function build(args) {
  if (!args.plan) fail('build 需要 --plan');
  const root = path.resolve(args.root ?? '.');
  const plan = JSON.parse(await readFile(args.plan, 'utf8'));
  if (!Array.isArray(plan.files) || plan.files.length === 0) fail('plan.files 不能为空');
  const manifest = {
    format: 'gws-asset-manifest',
    version: VERSION,
    entity_id: plan.entity_id ?? null,
    step: plan.step ?? null,
    created: new Date().toISOString(),
    root_hint: path.basename(root),
    files: await collect(root, plan.files),
  };
  const text = JSON.stringify(manifest, null, 2) + '\n';
  if (args.out) {
    await writeFile(args.out, text, { flag: 'wx' })
      .catch((e) => fail(e.code === 'EEXIST' ? `拒绝覆盖已存在文件: ${args.out}` : e.message));
    console.log(`已生成 ${args.out}（${manifest.files.length} 个文件）`);
  } else {
    process.stdout.write(text);
  }
}

async function verify(args) {
  if (!args.manifest) fail('verify 需要 --manifest');
  const root = path.resolve(args.root ?? '.');
  const manifest = JSON.parse(await readFile(args.manifest, 'utf8'));
  if (manifest.format !== 'gws-asset-manifest' || manifest.version !== VERSION)
    fail('清单格式或版本不受支持');
  let bad = 0;
  for (const f of manifest.files) {
    const rel = checkRelPath(f.path);
    const abs = path.join(root, rel);
    try {
      const { sha256, size } = await hashFile(abs);
      if (sha256 !== f.sha256 || size !== f.size) {
        console.error(`CHANGED  ${rel}`);
        bad++;
      }
    } catch {
      console.error(`MISSING  ${rel}`);
      bad++;
    }
  }
  if (bad) {
    console.error(`校验失败：${bad}/${manifest.files.length} 个文件有变动或缺失`);
    process.exit(1);
  }
  console.log(`校验通过：${manifest.files.length} 个文件完整`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
if (cmd === 'build') await build(args);
else if (cmd === 'verify') await verify(args);
else fail('用法: asset-manifest.mjs <build|verify> [--plan|--manifest file] [--root dir] [--out file]');
