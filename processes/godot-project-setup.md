# 流程：新建 Godot 项目

每个项目是 `projects/<name>/` 下的**独立 git 仓库**（外层工作区仓库不跟踪其内容）。

## 步骤

1. **立项**：在 `projects/` 下建 `<project-name>/`（小写连字符命名），复制模板：
   - `templates/godot-project/project.md` → `projects/<name>/project.md`，填写：
     一句话概念、**Godot 精确版本**（钉死，升级需单独确认）、玩法契约、
     参考索引、下一步实现（小而具体）。
   - `templates/godot-project/gitignore-template.txt` → `projects/<name>/.gitignore`。
2. **创建工程**：在 `projects/<project-name>/godot/` 内新建 Godot 工程
   （`project.godot` 位于该目录）。
3. **初始化项目仓库**（在项目目录内）：
   ```sh
   cd projects/<name>
   git init
   git add -A
   git commit -m "init: <name> 项目骨架（Godot <版本>）"
   ```
   大二进制多的项目此时决定是否启用 `git lfs`（见 `.gitignore` 模板注释）。
4. **注册**：在外层仓库的 `workspace.json` 添加实体：
   ```json
   {
     "id": "<project-name>",
     "title": "<显示名>",
     "type": "project",
     "category": "godot",
     "engine": "godot-4.3",
     "created": "YYYY-MM-DD",
     "updated": "YYYY-MM-DD",
     "folder": "projects/<project-name>",
     "status": "active",
     "pinned": false,
     "steps": [{ "name": "项目说明", "path": "project.md", "viewer": "md" }]
   }
   ```
5. **外层提交**：注册表变更属于工作区内容，在外层仓库单独提交。
6. **首个里程碑**：从最小可玩验证开始（一个场景 + 一个输入 + 一个反馈），
   完成后把构建版本、截图与验收结果记录进 `project.md`（项目仓库内提交）。

## 验收清单

- [ ] `project.md` 五个段落齐全，引擎版本已钉死
- [ ] `godot/project.godot` 存在且能在对应版本编辑器打开
- [ ] 项目目录内 `git log` 有首次提交；`git status` 干净且不出现 `.godot/`
- [ ] 外层仓库根目录执行 `git status` **看不到** `projects/<name>/` 内任何文件
- [ ] 外层 `workspace.json` 已注册且通过 `docs/registry.schema.json` 校验
