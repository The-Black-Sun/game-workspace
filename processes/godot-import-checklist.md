# Godot 资产导入检查单

资产从 `review` 通过到进入 `projects/<p>/godot/` 前逐项确认。

## 通用

- [ ] 资产卡条目状态为 `done`，来源与 `license` 已填写
- [ ] 文件命名：小写蛇形（`player_run_01.png`），无空格与中文
- [ ] 放入引擎目录后，其同名 `.import` 文件首次打开编辑器生成，随后一并提交
- [ ] Godot 4.4+ 生成的 `.uid` 文件一并提交，之后不要手动删除或改内容

## 纹理 / 2D

- [ ] 尺寸为 2 的幂或有明确理由；像素画导入预设选 `2D Pixel`（关闭过滤）
- [ ] 分辨率与目标显示规格一致，不把 4K 源图直接当游戏纹理
- [ ] 可编辑源（.psd/.krita/.aseprite）留在 `assets-src/`，引擎内只放导出 PNG/WebP

## 音频

- [ ] 音乐用 OGG Vorbis，短音效用 WAV（或按项目约定）
- [ ] 响度大致统一；循环音乐首尾无爆音
- [ ] 导入后分配到正确的 Audio Bus

## 模型（glTF 优先）

- [ ] 源文件 .blend 留 `assets-src/`，引擎内放 .glb/.gltf
- [ ] 比例检查：Godot 1 单位 = 1 米，导入缩放正确
- [ ] 动画 clip 命名与 `project.md` 的玩法事件约定一致

## 入库前最后一步

- [ ] `git status` 无 `.godot/`、无构建产物、无凭证
- [ ] 更新 `workspace.json` 中项目实体的 `updated` 日期
