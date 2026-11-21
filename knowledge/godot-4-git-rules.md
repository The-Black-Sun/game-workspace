# Godot 4 与 Git：已知规则备忘

> 决策记录，供所有项目遵循。来源：Godot 4 官方文档的 VCS 建议 + 社区通行实践。

## 必须入库

- `project.godot` —— 工程配置本体。
- `*.import` —— Godot 4 的导入元数据，与资产文件同目录同名（`a.png` → `a.png.import`）。
  缺少它，换机器后导入设置（压缩、过滤、mipmaps）全部丢失并触发重新导入。
- `*.uid` —— Godot 4.4+ 为每个资源生成的 UID 文件。资源间引用走 UID，
  删了它引用会断。生成后保持稳定，不要手动编辑或重建。
- `export_presets.cfg` —— **默认忽略**（可能含 keystore 路径）；确需入库时
  先确认其中没有密码或绝对路径泄露。

## 必须忽略

- `.godot/` —— 编辑器/导入缓存，由 `.import` 元数据重建，体积大且机器相关。
- `.mono/`、`data_*/` —— C# 构建缓存。
- `/builds/`、`/export/` —— 导出产物。
- `.env`、`*.keystore`、`*.p12` —— 凭证。

## 大二进制策略

- 首选 Git LFS：纹理源、音频、视频、`.blend`、`.psd` 按扩展名 track。
- 备选外置资产库：超大或复用频繁的素材放工作区 `library/`（外层仓库，
  本身也建议 LFS），项目内只放导入用导出件，并用
  `tools/asset-manifest.mjs` 生成哈希清单做完整性登记。

## 嵌套仓库边界

- 外层工作区仓库通过 `.gitignore` 排除 `projects/*/`；项目目录内 `git init`
  后，两边互不知晓对方存在。不要用 submodule——纯嵌套，职责见
  `projects/README.md`。
