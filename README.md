# Game Workspace

多项目游戏开发工作区（初期面向 Godot 引擎），设计参考 [Mr. Mak Workspace 调研总结](../mr-mak-workspace-research.md)。

## 核心理念

- **文件即真相**：无数据库，所有内容都是普通文件；注册表 `workspace.json` 只是索引。
- **目录即契约**：每个一级目录有单一语义，Agent 与人共用同一套约定（见 `AGENTS.md`）。
- **评审与实现分离**：资产先入库、登记、评审（状态机），通过后才进引擎工程。
- **可移植**：流程写在 `processes/`，经验写在 `knowledge/`，换项目/换引擎时随仓库带走。
- **单人使用**：本工作区为单人 + AI Agent 场景设计，流程按个人节奏裁剪，无协作审批环节。

## Git 结构：嵌套独立仓库

本工作区使用**两层 git 仓库**（纯嵌套，不用 submodule）：

- **外层仓库**（本目录根）：管理工作区自身——流程、模板、注册表、共享资产库、
  工具脚本。通过 `.gitignore` 排除 `projects/` 下各项目目录的内容。
- **项目仓库**（`projects/<name>/`）：每个游戏项目在项目目录内 `git init`，
  独立管理自己的代码、资产与提交历史。规则见 `projects/README.md`。

## 目录结构

```text
game-workspace/
  AGENTS.md            # Agent 行为契约（必读）
  workspace.json       # 项目/资产注册表
  README.md            # 本文件
  projects/            # 每个游戏项目一个子目录（独立 git 仓库，外层不跟踪其内容）
    <project>/
      project.md       # 概念 + 玩法契约 + 参考索引 + 下一步
      godot/           # Godot 工程本体（project.godot 所在）
      assets-src/      # 可编辑源资产（.blend / .psd / 概念图等）
  library/             # 跨项目共享资产库（素材按类型归档 + 资产卡索引）
  processes/           # 可复用流程文档
  knowledge/           # 经验教训与决策记录
  inbox/               # 待分类素材、临时输入
  skills/              # 项目技能（给 Agent 的可复用操作手册）
  tools/               # 脚本工具（资产哈希清单等）
  templates/           # 新项目模板（Godot 工程 .gitignore、project.md）
  docs/                # 工作区自身的规范（schema 等）
```

## 快速上手

1. 新资产进入工作区 → 按 `processes/asset-intake.md` 入库登记。
2. 新建游戏项目 → 按 `processes/godot-project-setup.md` 创建
   （含项目独立 git 仓库初始化）并在 `workspace.json` 注册。
3. 每次实质性变更后更新注册表中对应条目的 `updated` 日期。
4. 提交前先想清楚改动属于哪一层：工作区功能/内容 → 外层仓库；
   某游戏的代码与资产 → 该项目的仓库。
