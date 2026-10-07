# Lain-plugin

Lain-plugin 是为 [Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai) 提供多平台接入的适配器插件。本仓库在原项目基础上维护了 QQBot API v2、群聊与 C2C 私聊、ICQQ 身份转译和按钮扩展等功能。

## 安装

在 `Miao-Yunzai` 根目录执行：

```bash
git clone --depth=1 https://github.com/win-syswow64/Lain-plugin.git ./plugins/Lain-plugin
pnpm install -P
```

如果只使用本插件接入机器人，无需登录 ICQQ，可在 `config/config/bot.yaml` 中设置 `skip_login: true`。请先安装并启动所需平台的连接端，再按对应文档配置账号。

| 适配器 | 接入说明 |
| --- | --- |
| QQBot（QQ群、频道、C2C 私聊） | [QQBot 接入与使用](./docs/QQBot.md) |
| PC 微信 | [WeChat](./docs/WeChat.md) |
| 网页版微信 | [WeXin](./docs/WeXin.md) |
| Shamrock | [Shamrock](./docs/Shamrock.md) |
| Lagrange.Core | [Lagrange.Core](./docs/Lagrange.Core.md) |
| LLOneBot、NapCat 等 OneBot 连接端 | 启用反向 WebSocket，地址为 `ws://localhost:2955/LLOneBot`；[LLOneBot 项目](https://github.com/LLOneBot/LLOneBot) |

插件还包含标准输入、QQ 频道、KOOK、Discord 等适配器。标准输入可在控制台输入 YunZai 指令，默认以主人身份执行；需要自定义状态头像时，将图片放在 `plugins/Lain-plugin/resources/avatar.jpg`。

## QQBot 主要功能

- 使用官方 API v2 接入 QQ 群、频道与 C2C 私聊。群消息可订阅“@ 机器人”或全量事件，并保留事件类型供插件判断。
- 支持 WebSocket 与 WebHook 两种 QQBot 连接方式；WebHook 回调入口为 `/QQBot`，群全量消息和频道私域模式分别配置。
- 在获得官方接口权限时，查询群接收类型和主动推送状态；可选白名单接口失败只留日志，功能必需接口被拒绝时返回账户不在接口白名单内的提示。发送主动群消息及禁言前检查权限。
- 提供 C2C 收发、文件、撤回、输入状态和流式 Markdown 回复，并缓存消息引用。私聊也可使用 ICQQ 身份转译。
- 支持群入群申请查询/审批、拒绝拉黑和自动审批策略 API。
- 将机器人及成员进退群事件转换为 ICQQ 的 `notice.group.increase` / `notice.group.decrease` 通知，并使用已保存的身份映射。
- 群聊和私聊可使用原生按钮、回调按钮和自定义底部按钮文件；`data` 默认填入输入框，`callback` 触发回调。缺少目标插件时跳过其专属按钮。Markdown 中的 `mqqapi://aio/inlinecmd` 会转换为原生输入按钮。
- 保存 QQ 与 QQBot 的身份映射；混合已映射和未映射用户时仍可转换已知的 @ 目标。

接入指令、配置字段、平台权限及代码示例见 [QQBot 接入与使用](./docs/QQBot.md)。按钮格式、测试指令和自定义文件写法见 [QQBot 按钮使用与开发](./docs/QQBot-Buttons.md)。

## 按钮扩展

已整理的扩展文件位于 `plugins/button/`，每个目标插件对应一个顶层 `.js` 文件。按钮加载器检查 `requiredPlugin`；未安装的插件不会加载其按钮。你可以在该目录新增自己的按钮文件，修改后会热更新。插件回复时，适配器按规则优先级匹配并附加按钮；按钮字段和完整示例请查看[开发文档](./docs/QQBot-Buttons.md)。

发送 `#回调按钮测试` 可查看仓库自带的回调按钮示例，点击“测试回调 +1”后会收到确认回复。

## ws-plugin 兼容补丁

仓库中的 `ws-plugin` 是指向其他仓库的 Git 记录，其工作区改动不会随 Lain-plugin 的提交传递。`patches/ws-plugin-qqbot.patch` 保存了本项目所需的兼容改动：OneBot 的普通发送接口按主动发送处理，避免误用最近消息的被动回复窗口，并补齐文件消息段。需要在独立安装的 `Miao-Yunzai/plugins/ws-plugin` 使用这些改动时，在 `Miao-Yunzai` 根目录运行：

```bash
cd plugins/ws-plugin
git apply --check ../Lain-plugin/patches/ws-plugin-qqbot.patch
git apply ../Lain-plugin/patches/ws-plugin-qqbot.patch
```

补丁基于 ws-plugin 提交 `2c814ab2e3897260d15230c4c5512312e0d447e7` 制作；若上游版本不同，先检查补丁是否仍可应用。已应用过补丁的工作区不需重复执行。

## 常用指令

- `#设置主人`：按控制台验证码设置主人；已有主人可用 `#设置主人@用户` 指定其他主人。
- `#取消主人@用户` 或 `#删除主人@用户`：移除指定主人。
- `#铃音更新` 或 `#Lain更新`：更新插件。

插件可通过 `e.adapter` 或 `Bot[uin].adapter` 判断适配器。常见值包括 `QQBot`、`QQGuild`、`LagrangeCore`、`LLOneBot`、`shamrock`、`ComWeChat`、`WeXin`、`Kook`、`Discord` 和 `stdin`。

## 致谢

[Miao-Yunzai](https://github.com/yoimiya-kokomi/Miao-Yunzai)、[原 Lain-plugin](https://github.com/Circle-money-run/Lain-plugin)、[QQBot 按钮库](https://gitee.com/lava081/button)、[ws-plugin](https://gitee.com/xiaoye12123/ws-plugin)、[OpenShamrock](https://github.com/whitechi73/OpenShamrock)、[LLOneBot](https://github.com/LLOneBot/LLOneBot)、[Lagrange.Core](https://github.com/LagrangeDev/Lagrange.Core)、[Yunzai-Kook-Plugin](https://github.com/TimeRainStarSky/Yunzai-KOOK-Plugin)、[XZhouQD-Lain](https://github.com/XZhouQD/Lain-plugin) 及其他贡献者。
