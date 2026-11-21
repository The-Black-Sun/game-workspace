# 流程：新资产入库

适用范围：任何进入工作区的素材——自制、外包交付、AI 生成、下载的参考图。

## 步骤

1. **暂存**：原始文件先放 `inbox/`，不做任何改名之外的改动。
2. **分类定址**：
   - 属于特定项目 → `projects/<project>/assets-src/`（可编辑源）或项目卡片 `media/`（参考图）
   - 跨项目通用 → `library/<类型>/`，类型如 `textures/` `audio/` `models/` `references/`
3. **登记**：
   - 新建或更新对应资产卡（`*.card.json`，schema 见 `docs/asset-card.schema.json`）
   - 在 `workspace.json` 注册新实体；已有实体更新 `updated` 日期
   - 条目字段：`status: idea` 起步；来源 URL、`license` 必填（自绘写「自绘」）
4. **留痕（可选但推荐）**：外部交付/AI 生成批次用清单工具记录哈希：
   ```sh
   node tools/asset-manifest.mjs build --plan plan.json --root . --out delivery.json
   ```
5. **评审**：状态推进到 `review` 后由人确认；通过置 `done`，才允许导入引擎工程。
6. **导入引擎**：见 `processes/godot-import-checklist.md`。导入后保持源资产不动。

## 禁忌

- 不删除 `inbox/` 原始文件，归档前只做复制。
- 不直接修改已置 `done` 的条目文件；迭代新增条目（ID 全新），旧条目置 `archived`。
- 未知字段/版本不写入卡片（schema 设了 `additionalProperties: false`，校验会拒绝）。
