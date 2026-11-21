# 欢迎使用游戏工作区

这是看板的指南页（示例实体，可随时删除或替换）。

## 这个看板读什么

- 看板是**只读视图**：所有内容来自工作区文件，修改请回到文件本身（或让 Agent 改）。
- 左侧列表来自根目录 `workspace.json` 注册表；右侧渲染实体的内容页签。
- 支持的内容类型：Markdown 文档（`.md`）与资产卡（`*.card.json`，gallery 图库视图）。

## 日常三件事

1. **立项**：`processes/godot-project-setup.md` —— 建项目目录、独立 git 仓库、注册实体。
2. **入库**：`processes/asset-intake.md` —— 素材进 `inbox/` 后分类、登记、评审。
3. **同步看板**：改了文件后，在 `dashboard/` 执行 `npm run sync`（`dev`/`build` 会自动执行）。

## 规则在哪

- 总契约：`AGENTS.md`
- 注册表格式：`docs/registry.schema.json`
- 资产卡格式：`docs/asset-card.schema.json`
