# projects/ — 独立项目仓库区

本目录下每个子目录（如 `projects/my-game/`）是一个**独立的 git 仓库**，
用于管理该游戏项目的实际代码与资产。外层工作区仓库通过 `.gitignore`
排除这些子目录的全部内容——两边互不跟踪，互不提交。

## 规则

1. 新建项目时，在项目目录内执行 `git init`，并用
   `templates/godot-project/` 下的模板初始化 `.gitignore` 与 `project.md`。
   详见 `../processes/godot-project-setup.md`。
2. 外层仓库只通过根目录 `workspace.json` 的注册条目引用项目
   （`folder: "projects/<name>"`），项目内部结构对外层透明。
3. 项目仓库的提交、分支、远端完全独立；外层仓库的提交只描述
   工作区自身的功能与内容更新（流程、模板、注册表、共享库等）。
4. 不要把项目仓库再注册为外层仓库的 submodule——本工作区使用
   纯嵌套独立仓库，不用 submodule 机制。

本文件（`projects/README.md`）是外层仓库在本目录下唯一跟踪的文件。
