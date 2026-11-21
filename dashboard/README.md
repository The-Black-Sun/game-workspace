# 游戏工作区看板（dashboard）

工作区的本地网页看板：**只读视图**，渲染根目录 `workspace.json` 注册表与
各实体的 Markdown 文档 / 资产卡（`*.card.json`）。

## 运行

```sh
npm install        # 首次
npm run dev        # 开发预览（自动先执行 sync）
```

## 数据同步

看板不直接读工作区文件，而是由 `scripts/sync-data.mjs` 把工作区数据复制到
`public/data/`（该目录已被 git 忽略，属于生成物）：

- `npm run sync` 手动同步；`npm run dev` / `npm run build` 会自动先同步
- 改了工作区文件（注册表、卡片、文档）后重新执行 sync 即可看到最新内容
- 跳过 `.git` / `.godot` / `node_modules` / `builds` / `export` 与 >8MB 文件

## 结构

```text
src/types.ts            与 docs/*.schema.json 对齐的类型
src/lib/data.ts         数据加载（fetch public/data）
src/lib/meta.ts         状态/类型语义（颜色、中文标签）
src/components/         Overview（总览）、EntityDetail（实体详情）、
                        CardGallery（资产图库 + 灯箱）、Markdown、bits
scripts/sync-data.mjs   数据同步脚本
```

## 技术

React 19 + TypeScript + Vite + Tailwind CSS，markdown-it 渲染文档
（`html:false`，原始 HTML 不执行，与工作区规则一致）。
