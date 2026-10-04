# QQBot 接入与使用

本文按 QQ 机器人官方“启动接入”文档同步，并补充 Lain-plugin 当前支持的群聊、C2C 私聊和配置方式。

> 官方页面显示更新时间为 **2026-07-21**。页面响应的 `Last-Modified` 为 **2026-09-24**；本文于 **2026-10-05** 核对。官方文档：[启动接入](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/getting-started.html)。

## 官方接入准备

1. 在 [QQ 开放平台](https://q.qq.com/) 注册并创建机器人。
2. 在开发设置中获取机器人 `AppID` 与 `AppSecret`。`AppID` 是机器人 ID，`AppSecret` 用于申请访问凭证。
3. 按官方 [获取访问凭证](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/access-token.html) 文档使用 Access Token。官方已经废弃 `Token` 鉴权，不要再把旧 Token 当作当前鉴权凭证。
4. 按需选择官方 SDK 示例：[Go](https://github.com/tencent-connect/botgo)、[Python](https://github.com/tencent-connect/botpy)、[Node.js](https://github.com/tencent-connect/qqbot-nodejs)。SDK 只作为接入参考，能力和限制以 QQ 机器人官方文档为准。

## 在 Miao-Yunzai 中添加机器人

在 QQ 开放平台创建机器人后，在 Miao-Yunzai 控制台执行以下指令。请将示例值替换为自己的凭证，不要公开 AppSecret。

```text
#QQ群设置 0:1:你的AppID::你的AppSecret
```

配置格式：

```text
#QQBot设置 沙盒:私域:AppID:旧Token占位:AppSecret
```

- `沙盒`、`私域` 使用 `1` 或 `0`，沿用插件现有配置指令的字段顺序。
- 官方 Token 已废弃。适配器为兼容旧配置保留了第四个字段；无需填写时保留两个冒号，例如 `AppID::AppSecret`。
- `#QQBot设置` 同时连接 QQ 群与频道；`#QQ群设置` 只连接 QQ 群；`#QQ频道设置` 只连接频道。
- 默认群模式只订阅“群 @ 机器人”消息。需要收取机器人所在群的全量消息时，在配置末尾添加第 7 个字段 `1`，并确保开放平台已给机器人开通对应事件权限。例如：

  ```text
  #QQ群设置 0:0:你的AppID::你的AppSecret::1
  ```

  第 6 个字段是 WebHook 开关；没有使用 WebHook 时填 `0`，再用第 7 个字段启用群全量消息。`#QQBot账号` 会显示这一配置。
- 查询已添加账号：`#QQBot账号`。再次使用相同指令可删除对应账号配置，重启后生效。

凭证会写入 Lain-plugin 的 `config/token.yaml`。该文件包含密钥，请勿提交到公开仓库或粘贴到公开聊天中。

## 消息、Markdown 与媒体

QQBot v2 的文本通过 Markdown 内容发送。适配器支持 `e.reply()`、`e.markdown()` 和 `e.replyMarkdown()`；Markdown 无需配置旧版模板 ID。旧的 `#QQBot设置MD` 配置入口已经废弃。

```js
await e.markdown('# 查询结果\n已完成。')

await e.markdown('请选择操作：', {
  buttons: [[
    { label: '查看详情', data: '#详情' },
    { label: '返回帮助', data: '#帮助' }
  ]]
})
```

有关按钮自动附加、交互类型、mqqapi 内联命令转换，以及自定义底部按钮扩展文件，请看[QQBot 按钮使用与开发](./QQBot-Buttons.md)。

图片、语音和视频需要可供 QQ 平台访问的公网 URL。可通过 `Bot.imageToUrl`、`Bot.audioToUrl`、`Bot.videoToUrl` 提供自定义转换，也可按 Lain-plugin 配置启用公网临时文件服务。具体代码示例见仓库内的 `plugins/纯文模板.js` 和 `plugins/纯文模板-优化混排.js`。

## QQ 群全量消息与 @ 机器人消息

QQBot 将 `GROUP_AT_MESSAGE_CREATE`（群 @ 机器人）和 `GROUP_MESSAGE_CREATE`（群全量消息）作为不同 Gateway 事件处理。适配器把原始事件名保存在 `e.qqbot_event_type`，并提供 `e.qqbot_is_group_at`、`e.qqbot_is_group_all` 两个布尔值。`e.atme` 表示这条消息调用了机器人。

收到群消息时，适配器调用官方 `GET /v2/groups/{group_openid}/bot_state`，并在事件上设置 `e.qqbot_group_state`、`e.qqbot_recv_msg_setting`（`all`、`only_mention` 或 `mention_and_context`）和 `e.qqbot_allow_proactive_msg`。状态短暂缓存 15 秒，避免超过官方 30 QPM 限制。接口未开放时，`e.qqbot_group_state_error` 记录原因；全量事件仍按自身事件类型决定按钮行为。该接口仅对获白名单权限的机器人开放。

群回复的指令按钮在 `recv_msg_setting=all` 时自动改用回调动作，点击不会由 QQ 客户端插入 `@bot`；其他接收类型保留官方指令按钮的 `@bot` 行为。回调事件在兼容层中标记 `atme=true`，但消息数组不会传入一个指向机器人自己的 `at` 段。主动调用 `Bot[appid].pickGroup(groupOpenID).sendMsg(...)` 时先检查 `allow_proactive_msg`，未开启或无法查询时抛出明确错误；被动回复仍使用消息或事件 ID。

群 @ 事件自身已经表示“@ 机器人”。适配器会从供插件使用的 `e.message` 中移除机器人自己的 at 段，避免 ICQQ 兼容层再次将它识别成普通 @ 目标；消息正文、`e.atme` 和其他用户的 at 段仍然保留。全量消息不设置 `e.atme`，除非消息内容确实包含机器人 mention。

只有开放平台授予全量群消息权限后，`groupAllMsg` 配置才能收到全量事件。不开启该选项时仍接收群 @ 机器人消息。

## C2C 私聊 API

QQ 机器人 C2C 私聊使用 `user_openid`，群聊使用 `member_openid`。两种 OpenID 不能按字符串相同处理；适配器会保留完整 OpenID，包括其中可能出现的连字符。私聊 OpenID 已绑定 QQ 号及机器人 QQ 号时，事件会按 ICQQ 兼容结构呈现；未绑定时仍使用带 AppID 前缀的 QQBot 用户 ID。

需要私聊身份转译时，在与机器人单聊中发送 `#绑定qq<自己的QQ号>`，并用 `#绑定机器人qq<机器人QQ号>` 建立机器人身份映射。后续私聊事件会保留 `e.user_openid` 和 QQBot 回复接口，同时提供数字 `e.user_id`、`e.self_id`、ICQQ 风格的 `e.sender` 和 `e.friend`。如果 C2C 与群聊使用同一个 OpenID，已有群用户映射也可在收到私聊时复用；如果 OpenID 不同，需要在私聊里单独绑定。两侧适配器都收到同一条已映射私聊消息时，转译层会按发送者、正文和时间窗口去重。

适配器支持 C2C 消息收发、被动回复、私聊撤回、文件上传、输入状态通知和流式 Markdown 消息：

```js
// e.friend 来自这条 C2C 入站消息，sendMsg 使用该消息的被动回复上下文。
await e.friend.sendMsg('收到，正在查询。')

// 输入状态通知：提示客户端机器人正在输入。
await e.friend.sendInputNotify({ inputSecond: 30 })

// 流式内容通过完整快照替换；update 会按间隔合并请求。
const stream = e.friend.openStream()
await stream.update('# 查询中\n正在读取数据…')
await stream.update('# 查询中\n找到 3 条结果…')
await stream.complete('# 查询完成\n共找到 3 条结果。')

// 也可用 OneBot 兼容文件入口发送文件。
await e.friend.sendFile('/path/to/report.pdf', 'report.pdf')
```

`openStream()` 需要来自 C2C 入站消息的上下文；从 `Bot[appid].pickFriend(openid)` 主动取得的好友对象没有该上下文，不能直接创建被动流。流式更新是 Markdown 全量快照，默认节流 500ms，最短 300ms；`complete(text)` 发送最终快照并结束流，结束后不能继续更新。

C2C 主要接口和行为：

- 普通私聊消息：`POST /v2/users/{openid}/messages`。`msg_type` 支持文本 `0`、Markdown `2`、Ark `3`、Embed `4`、媒体 `7`；输入状态通知使用 `msg_type: 6`。
- 回复使用前置消息的 `msg_id` 与 `msg_seq`；按钮交互、C2C 接收许可通知和好友添加通知可使用官方允许的 `event_id`。`message_reference` 目前不支持，适配器不会把它发给 C2C 接口。
- 流式回复：`POST /v2/users/{openid}/stream_messages`，适配器按官方 `input_mode: "replace"` 协议更新同一条消息，并在结束时发送 `input_state: 10`。
- 撤回：`DELETE /v2/users/{openid}/messages/{message_id}`。
- C2C 文件使用 `/files`、`/upload_prepare` 与 `/upload_part_finish` 上传流程，发送消息时携带 `msg_type: 7` 和 `media.file_info`。
- 私聊入站消息的 `e.reply()`、`e.friend.sendMsg()` 使用消息 ID 被动回复；按钮交互和好友通知可使用 `event_id` 回复。主动调用 `Bot[appid].sendPrivateMsg()` 或无入站上下文的 `pickFriend().sendMsg()` 不带被动回复 ID。
- 私聊被动回复窗口为 60 分钟，每条入站消息最多被动回复 4 次。主动发送受平台频率、用户设置和机器人权限限制；消息类型、权限及限制请以官方发送消息文档为准。

流式协议和输入状态通知由 QQ 官方 Node SDK 的当前实现提供参考；如平台修改字段或限制，请以 [官方 C2C 消息 API 文档](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_openid_messages.post.html)、[官方单聊事件文档](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/c2c_message_create.html)、[官方流式会话实现](https://github.com/tencent-connect/qqbot-nodejs/blob/main/src/streaming.ts) 与 [腾讯 QQBot Node.js SDK](https://github.com/tencent-connect/qqbot-nodejs) 为准。

## QQ 与 QQBot 用户映射

转换记录按机器人、群和成员 OpenID 保存。用户有映射时，适配器会在该群的 QQBot 事件和 ICQQ 事件间建立对应关系。

- 一条消息中即使只有部分 @ 目标已有映射，已保存的目标仍会转换为 QQ 号。
- 未映射的 @ 目标保留为原始 OpenID；它不会阻断已映射目标的转换。
- 发言用户尚未映射时，仍会尝试将消息中已映射的 @ 目标转换；消息与 QQ 侧事件匹配后会补充发言用户映射。
- 发言用户已映射但 @ 目标未映射时，发言用户和群仍按已有映射转换，未映射目标保留原 ID。

这允许未转换状态用户 @ 已保存转换信息的用户，也允许已转换用户 @ 尚未保存转换信息的用户。

## QQ 群管理

QQ 群机器人可以使用官方 API v2 查询入群申请、审批申请、管理禁言规则。禁言和查询禁言前会先查询 `bot_state.member_role`；禁言前还会逐个查询目标成员的 `member_role`，只允许普通成员。机器人不是管理员、目标是群主或管理员、接口未开放时，调用会抛出带原因的错误，不会发送禁言请求。群禁言最长 30 天，批量一次最多 20 人。

```js
const bot = Bot['机器人 AppID']
const group = bot.pickGroup('群 OpenID')

// 禁言 10 分钟；传 0 解除禁言
try {
  await group.muteMember('成员 OpenID', 600)
} catch (error) {
  await e.reply(error.message)
}

// 查询机器人在群内的官方状态
const state = await group.getBotState()
// state.member_role / state.recv_msg_setting / state.allow_proactive_msg

// 获取禁言状态
const status = await group.getMuteStatus()

// 查看待处理入群申请
const { list, next_cursor } = await group.getJoinRequests({ limit: 20 })

// 审批申请
await group.approveJoinRequest('成员 OpenID', true, {
  join_request_id: list[0].join_request_id
})
```

收到入群申请时，适配器会发送兼容事件 `request.group.add`，可用 `e.approve(true)` 同意申请。主人也可在 QQ 群或私聊中使用：

```text
#QQBot入群申请列表 [单页数量] [cursor]
#QQBot审批入群申请 <成员OpenID> <同意|拒绝> [申请ID] [理由]
```

在非目标群或私聊中操作时，首个参数使用群 OpenID：

```text
#QQBot入群申请列表 <群OpenID> [单页数量] [cursor]
#QQBot审批入群申请 <群OpenID> <成员OpenID> <同意|拒绝> [申请ID] [理由]
```

自动审批策略支持创建、查询、更新、执行和删除；执行后会异步扫描关联群的申请。详细参数可查看适配器 API 实现或 QQ 机器人官方群管理文档。

`/bot_state` 和成员详情接口在官方文档中标注为白名单或内邀能力。若尚未获得权限，适配器会报告原始 API 错误并阻止禁言及主动发送；需在 QQ 开放平台申请相应权限。可查看[机器人群内状态](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_bot_state.get.html)、[群成员详情](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members_member_openid.get.html)、[设置成员禁言](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_restrict_chat_setting.post.html)及[群消息发送](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_messages.post.html)。

## 相关文档

- [QQBot 按钮使用与开发](./QQBot-Buttons.md)
- [官方启动接入](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/getting-started.html)
- [官方获取访问凭证](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/access-token.html)
- [官方发送消息](https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/send-receive/send.html)
- [腾讯 QQBot Node.js SDK](https://github.com/tencent-connect/qqbot-nodejs)
