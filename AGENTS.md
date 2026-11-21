# AGENTS.md — Agent 行为契约

本仓库是一个多项目游戏开发工作区（初期面向 Godot）。开始任何工作前，先读
`README.md`、相关项目的 `projects/<project>/project.md`，并检查 `processes/`
中是否已有对应流程、`knowledge/` 中是否已有相关经验。

## 工作规则

1. **登记义务**：新增或实质性修改项目/资产后，更新 `workspace.json` 中对应条目的
   `updated` 日期；新实体必须先注册再使用。文件夹命名约定：`YYYY-MM-DD_名称`。
2. **资产状态机**：资产条目状态为 `idea → in-progress → review → done`（外加
   `archived`）。未经 `review` 通过的资产不导入引擎工程目录。
3. **评审分离**：实现、视觉/功能评审、最终验收是三个独立步骤，不合并跳过。
4. **源资产保留**：可编辑源文件（.blend/.psd/工程文件）放 `assets-src/` 或
   `library/`，引擎目录内只放导入用导出件；不覆盖原始素材。
5. **Git 分层**：本工作区是嵌套独立仓库（不用 submodule）。外层仓库管理
   工作区自身内容，`.gitignore` 已排除 `projects/*/`；每个游戏项目是
   `projects/<name>/` 内的独立仓库。提交前先判断改动属于哪一层，不要把
   项目文件提交进外层仓库，也不要在项目仓库里提交工作区级文件。
   项目内：`.godot/` 导入缓存、构建产物、凭证（`.env`、keystore）不入库；
   `.import` 与 `.uid` 元数据文件必须入库。大二进制资产优先用 Git LFS 或外置
   资产库 + `tools/asset-manifest.mjs` 哈希清单登记。
6. **交付留痕**：对外交付或接收外部资产（外包/AI 生成）时，用
   `tools/asset-manifest.mjs` 生成 SHA-256 清单。清单只证明文件完整性，
   不代表质量验收。
7. **最小变更**：修改限定在任务所需范围；不重构无关文件；提交前检查是否混入
   个人数据、凭证与无关改动。
8. **引擎版本**：每个 Godot 项目在 `project.md` 中钉死精确引擎版本（如 4.3.stable），
   升级版本是一个需要单独确认的决策。
9. **不确定就问**：缺失的偏好、风格、技术选型不要自行编造，先提问。

## 目录语义

- `projects/` — 游戏项目（规格 + 引擎工程 + 源资产）
- `library/` — 跨项目共享资产库
- `processes/` — 可复用流程
- `knowledge/` — 经验与决策
- `inbox/` — 待分类输入
- `skills/` — 项目技能
- `tools/` — 脚本工具
- `docs/` — 工作区规范
