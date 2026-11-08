# 更新日志 - tiny-game

## v1.1.0 (2026-11-07)

### 修复
- 统一定时器生命周期：所有 `setTimeout` / `setInterval` 均通过 `addTimer` 登记，返回列表或切换游戏时由 `clearAllTimers` 统一清理，避免旧回调操作新 DOM
- 修正攻防对战规则：防御不再固定对敌方造成 8 点伤害，改为自身不造成伤害、受到的攻击伤害减半（20 → 10），并补充游戏内规则提示
- 修复随机抽签与队伍分组中输入框多行文本字符串未转义导致的脚本语法错误

### 新增
- 零依赖校验脚本 `scripts/validate.mjs`：检查 20 个游戏入口与实现、13 个 HTML 内联脚本语法、关键 DOM id 引用、未注册定时器模式、PWA 文件完整性
- `package.json` 脚本：`npm test` / `npm run validate`
- GitHub Actions 持续集成：push / PR 自动运行校验
- PWA 支持：`manifest.webmanifest`、`sw.js`、应用图标，支持安装与离线打开
- `CHANGELOG.md`

### 文档
- README 补充攻防规则、PWA 离线说明、开发校验命令
