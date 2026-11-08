# 🎮 高阶益智游戏合集

20 款益智 / 对战 / 记忆 / 策略休闲游戏，纯 HTML/CSS/JS 实现，零依赖。

## 游戏列表

| # | 游戏 | 类型 | 说明 |
|---|------|------|------|
| 1 | 进阶猜数字 | 推理 | 1-100 范围推理 |
| 2 | 记忆翻牌 | 记忆 | 6卡配对 |
| 3 | 石头剪刀布PK | 对战 | 五局三胜 |
| 4 | 反应速度测试 | 反应 | 毫秒级测速 |
| 5 | 骰子竞猜 | 运气 | 猜大小 |
| 6 | 水果老虎机 | 运气 | 三图匹配 |
| 7 | 词语接龙 | 文字 | 首尾接龙 |
| 8 | 色彩辨识 | 识别 | 颜色判断 |
| 9 | 密码破解 | 推理 | 4位密码+提示 |
| 10 | 表情记忆 | 记忆 | 8卡配对 |
| 11 | 文字默写 | 记忆 | 5句渐进默写 |
| 12 | 限时速算 | 数学 | 10秒速算 |
| 13 | 硬币博弈 | 运气 | 连续猜正反 |
| 14 | 数字大小挑战 | 推理 | 比大小+连击 |
| 15 | 随机抽签 | 工具 | 自定义名单 |
| 16 | 手速挑战 | 反应 | 5秒点击 |
| 17 | 精准计时 | 反应 | 精确到毫秒 |
| 18 | 综合闯关 | 综合 | 10关混合挑战 |
| 19 | 队伍分组 | 工具 | 随机分组 |
| 20 | 攻防对战 | 策略 | 克制+防御+连击 |

## 特性

- 零依赖，纯前端实现
- 响应式设计，支持手机端
- 统一游戏框架，所有定时器统一登记并在返回/切换游戏时清理
- 20 款游戏全部可玩
- PWA 支持：可安装到主屏幕，离线打开

## 攻防对战规则

- ✊ 石头克 ✌️ 剪刀，✌️ 剪刀克 🖐️ 布，🖐️ 布克 ✊ 石头
- 克制对手：造成 20 + 连击加成伤害
- 平局：双方各受 15 点伤害
- 🛡️ 防御：本回合不造成伤害，受到的攻击伤害减半（20 → 10）

## 单文件小游戏

12 款经典小游戏，每个都是独立的单 HTML 文件（零依赖），直接在浏览器打开即玩。

| 游戏 | 文件 | 游戏 | 文件 |
|------|------|------|------|
| 打砖块 | [games/breakout.html](games/breakout.html) | 扫雷 | [games/minesweeper.html](games/minesweeper.html) |
| 飞扬的小鸟 | [games/flappy-bird.html](games/flappy-bird.html) | 弹球台 | [games/pinball.html](games/pinball.html) |
| 2048 | [games/2048.html](games/2048.html) | 数字华容道 | [games/puzzle-15.html](games/puzzle-15.html) |
| 跳一跳 | [games/jump-jump.html](games/jump-jump.html) | 贪吃蛇 | [games/snake.html](games/snake.html) |
| 消消乐 | [games/match-3.html](games/match-3.html) | 太空射击 | [games/space-shooter.html](games/space-shooter.html) |
| 翻牌记忆 | [games/memory.html](games/memory.html) | 俄罗斯方块 | [games/tetris.html](games/tetris.html) |

## PWA 离线使用

- `manifest.webmanifest` 定义应用名称、图标与独立窗口模式
- `sw.js` 预缓存主页面、清单、图标与 12 款单文件小游戏
- 通过 HTTP(S) 打开后会自动注册 Service Worker，断网也能继续玩
- 本地直接用 `file://` 打开时不会注册 Service Worker，不影响单文件玩法

## 开发与校验

零依赖自动化校验，检查游戏入口、内联脚本语法、DOM id 引用、定时器注册与 PWA 文件：

```bash
npm test        # 或 npm run validate
```

GitHub Actions 会在 push / pull request 时自动执行同一套校验。

## 许可证

MIT License，详见 [LICENSE](LICENSE)。
