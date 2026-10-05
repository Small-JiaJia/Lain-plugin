# QQBot 底部按钮：使用与开发

Lain-plugin 为 QQBot 提供原生 `keyboard` 按钮消息。按钮可以发送指令、触发回调或打开网页；扩展按钮可在插件回复时自动附加到底部。按钮消息遵循 [QQ 机器人官方按钮文档](https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/trans/msg-btn.html)。

## 使用现成按钮

QQBot 的 `e.reply()` 和 `e.markdown()` 会根据当前消息扫描已加载的按钮扩展。消息匹配某个扩展文件的规则后，适配器将该文件返回的按钮附加到回复底部。

按钮点击后有三种动作：

| 动作 | 简写 | 点击后的行为 |
| --- | --- | --- |
| 输入 | `data` 或 `input` | 把文本放入当前会话输入框；`send: true` 时直接发送 |
| 回调 | `callback` | 触发 QQBot `interaction` 回调，再作为消息交给 YunZai 插件 |
| 链接 | `link` | 打开 HTTP/HTTPS 网页 |

`data` 默认作为输入按钮发送，适合执行 YunZai 指令。按钮行最多 5 个按钮，键盘最多 5 行。私聊中的普通指令按钮自动改为回调按钮，点击后用户不会发送聊天消息；群状态接口返回 `recv_msg_setting=all` 时，群内指令按钮也会改为回调，避免客户端自动插入 `@bot`。其他群接收类型保留官方指令按钮行为。显式 `mqqapi://aio/inlinecmd` 保留原生输入动作。回调按钮会生成唯一 ID，并保留原消息所在会话。

需要用户继续填写参数的按钮会保留为普通输入按钮，点击后只把命令放入输入框，不会立即执行。适配器会识别“绑定/切换 UID”“登录账号”“面板更换”等常见入口，并排除扫码、帮助和“换一批”等无需填写内容的操作。自定义按钮建议显式标记 `requiresInput: true`；`inputOnly`、`requires_input` 也可用：

```js
{
  label: '绑定 UID',
  data: '/绑定',
  requiresInput: true
}
```

如果某个按钮命令虽然包含上述关键词、但不需要输入，可设置 `requiresInput: false` 覆盖自动判断。

回调点击会产生 `INTERACTION_CREATE` 事件。机器人先用事件体 `d.id` 确认互动，再用 Gateway 事件最外层的 `id` 作为消息接口的 `event_id` 被动回复。这两个 ID 不可混用，否则消息接口可能返回 `40034025`。该回复受官方被动回复时效和次数限制；脱离入站消息或互动上下文发送的消息按主动消息处理。参考[官方互动事件](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/interaction_create.html)和[单聊消息发送接口](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_openid_messages.post.html)。

开启斜杠前缀转换时，按钮命令 `/面板` 会作为 `#面板` 传给插件。想让插件收到字面量 `/面板`，让按钮的 `callback` 或 `data` 实际内容为 `\/面板`；在 JavaScript 源码中写作 `callback: '\\/面板'`。反斜杠在传给插件前会被移除，普通消息也遵循相同规则。

回调按钮只处理群消息和 C2C 私聊中的消息按钮/单聊快捷菜单互动；频道互动由 `QQGuild` 适配器处理。适配器会先确认互动，再把按钮数据作为一次 YunZai 消息交给对应场景的插件。按钮上下文中的 `e.reply()`、`e.markdown()` 和 `e.sendMsg()` 会继续使用这次互动的被动回复上下文；不要把互动事件体的 `d.id` 当作消息接口的 `event_id`。

## 在插件代码中添加按钮

### `Bot.Button()`

```js
await e.reply([
  '请选择操作：',
  ...Bot.Button([
    { label: '签到', data: '#签到' },
    { label: '帮助', data: '#帮助' },
    { label: '项目主页', link: 'https://example.com' }
  ])
])
```

也可以用二维数组明确指定行：

```js
await e.reply([
  '常用功能',
  ...Bot.Button([
    [
      { label: '体力', data: '#原神体力' },
      { label: '面板', data: '#角色面板帮助' }
    ],
    [
      { label: '帮助', data: '#喵喵帮助' }
    ]
  ])
])
```

### `e.markdown()`

```js
await e.markdown('# 今日状态\n请选择下一步：', {
  buttons: [[
    { label: '刷新', data: '#刷新状态' },
    { label: '帮助', data: '#帮助' }
  ]]
})
```

`buttons` 或 `button` 已经提供按钮时，适配器不会再自动附加另一组规则按钮，避免重复。按钮字段也可使用 `text` 替代 `label`，使用 `visited_label` 设置点击后的显示文字；`style` 为样式数值，`Bot.Button()` 常用 `0`/`1`。

权限字段：

```js
{ label: '管理员操作', data: '#管理操作', admin: true }
{ label: '指定用户', data: '#用户操作', list: ['用户 OpenID'] }
```

`admin: true` 将按钮限制给管理员；`list` 只允许列表中的用户点击。官方权限仍受 QQ 平台和机器人权限配置约束。

### `Bot.Button.create()` 与 `Bot.Button.nav()`

适配器也提供保留二维行结构的按钮构造器，适合直接返回一个官方 `keyboard` 消息段：

```js
return Bot.Button.create([
  [
    { text: '上一页', data: '#上一页' },
    { text: '下一页', data: '#下一页' }
  ],
  [{ text: '打开主页', link: 'https://example.com' }]
])

// nav() 等价于只有一行的 create()
return Bot.Button.nav([
  { text: '返回', data: '#返回' },
  { text: '帮助', data: '#帮助' }
])
```

`create()` 返回带 `_isButton` 标记的 `keyboard` 段；发送时适配器最多保留 5 行、每行最多 5 个按钮。把它作为 `e.reply()` 消息的一部分传入时，适配器不会再叠加规则按钮。`Bot.Button()` 仍适合与旧版按钮扩展兼容。

## mqqapi 内联命令

Markdown 中的 `mqqapi://aio/inlinecmd` 链接会自动转换成 QQBot 原生输入按钮。点击时在当前会话发送 `command` 的内容，不会把自定义协议作为第三方应用外链打开。

```js
await e.markdown(
  '[设置免艾特](mqqapi://aio/inlinecmd?command=权限设置&reply=false&enter=true)'
)
```

适配器会显示“设置免艾特”作为按钮文字，并将 `权限设置` 作为输入内容。`enter=true` 表示点击后立即发送；`enter=false` 表示先填入输入框。这个显式内联命令即使在私聊或群全量模式下也保留输入动作。链接可带 URL 编码后的中文，`&` 查询参数也可以按 Markdown 原样书写。

`Bot.Button()` 和自定义扩展文件中的 `link` 如果填写同类 mqqapi 链接，也会转换成输入按钮。普通 HTTP/HTTPS 链接仍作为网页按钮发送。

发送 `#面板` 时，安装了 `miao-plugin` 的环境会使用其专属按钮扩展，显示“更新面板 / 绑定UID / 扫码绑定”和当前 UID 的本地面板角色按钮（最多 12 个）。即使喵喵插件的回复自带一组按钮，`#面板` 也会以这组角色按钮为准。`#面板按钮示例` 才会显示仓库自带的四个通用演示按钮。

普通指令按钮和回调按钮不会使用第三方应用跳转动作。适配器只会对 `mqqapi://aio/inlinecmd` 做协议解析并转换为原生输入按钮；显式填写的 HTTP/HTTPS `link` 仍按网页链接处理。

官方群消息接口标注 `enter` 和 `reply` 的新客户端自动发送选项仅支持单聊；群内按钮以客户端实际行为为准。群全量模式使用回调，因此无需依赖群内 `enter` 自动发送。

## 回调按钮测试

回调示例已整理为独立的 `plugins/button/archive-+1.js`，配套消息命令在 `apps/qqbot_button_test.js`。向 QQBot 发送 `#回调按钮测试`，回复底部应出现“测试回调 +1”；点击后应收到“回调按钮测试成功”。该示例在群聊和私聊都可用。群全量模式下，点击不会把机器人自己的 @ 段传给插件。

原始归档中的组件已按上游插件合并到仓库的 `plugins/button/`：喵喵、逍遥、绝区零、星铁、椰奶、原神、铃音和鸣潮各使用一个顶层扩展文件。同一文件内的原规则仍保留各自的优先级；没有重复归属的示例继续作为独立 `archive-*.js` 文件。原始压缩包无需下载或放入插件目录。缺少 `requiredPlugin` 指定的插件时跳过加载。含静态导入的扩展在文件首行使用 `// @requiredPlugin <目录名>`，以便加载器在导入前检查依赖。

## 创建自定义底部按钮文件

### 1. 创建文件

在 Miao-Yunzai 的 Lain-plugin 目录下创建 `plugins/button`（没有时自行新建），并在该目录顶层新建一个 `.js` 文件。目录首次新建后会自动开始监听；添加、修改或删除按钮文件时会热更新，无需反复重启 YunZai。目录示例：

```text
Miao-Yunzai/
└── plugins/
    └── Lain-plugin/
        └── plugins/
            └── button/
                └── miao-plugin.js
```

加载器会读取该目录顶层的 `.js` 文件，并监听新增、修改和删除事件以热更新。监听路径会兼容 Windows 的反斜杠；子目录中的文件不会被当作按钮模块加载。文件必须默认导出一个构造函数。

### 2. 填写插件规则和按钮方法

下面的例子为 `miao-plugin` 的帮助回复增加操作按钮：

```js
export default class MiaoButtons {
  constructor () {
    this.plugin = {
      name: '喵喵插件按钮',
      dsc: '为喵喵帮助回复添加快捷入口',
      requiredPlugin: 'miao-plugin',
      priority: 100,
      rule: [
        {
          reg: '^#喵喵帮助$',
          fnc: 'help'
        }
      ]
    }
  }

  help (e) {
    return Bot.Button([
      [
        { label: '角色面板帮助', data: '#角色面板帮助' },
        { label: '更新面板', data: '#更新面板' }
      ],
      [
        { label: '喵喵版本', data: '#喵喵版本' }
      ]
    ])
  }
}
```

规则中的 `reg` 匹配当前事件的 `e.msg`，`fnc` 指向同一类中的方法。方法返回 `Bot.Button(...)` 后，适配器会将按钮附加在当前回复底部。返回 `false` 或空值时不附加按钮，后续优先级规则仍可继续匹配。

### 3. 只在对应插件存在时加载

为插件专属按钮声明 `requiredPlugin`：

```js
requiredPlugin: 'miao-plugin'
```

适配器会检查 `Miao-Yunzai/plugins/miao-plugin` 目录。插件目录不存在时跳过这个按钮文件；该字段也可以是目录名数组。安装了插件后重启 YunZai，或重新保存按钮文件触发加载。

不依赖外部插件的自定义按钮可以省略 `requiredPlugin`。路径填写 Yunzai `plugins` 目录下的插件目录名，不要填写 `Lain-plugin/plugins/button`。

### 4. 设置匹配优先级

适配器按规则优先级从小到大检查，优先读取 `rule.priority`，未设置时使用所在按钮文件的 `plugin.priority`。第一个匹配并返回按钮的规则会提供这次回复的按钮；如果方法返回 `false` 或空值，则继续检查后面的规则。全局兜底规则应使用较大的优先级数值，并在方法中判断是否需要显示。

## 按钮字段参考

| 字段 | 用途 |
| --- | --- |
| `label` / `text` | 按钮显示文字 |
| `data` / `input` | 输入到当前会话的文本 |
| `send` / `enter` | 是否点击后立即发送输入文本 |
| `requiresInput` / `inputOnly` / `requires_input` | 保留为输入按钮，不转换为点击即执行的回调；可设为 `false` 覆盖自动判断 |
| `callback` | 回调按钮的数据，触发 interaction 事件 |
| `link` | HTTP/HTTPS 网页地址；mqqapi inlinecmd 会转为输入按钮 |
| `style` | 样式数值；`Bot.Button()` 常用 `0` 灰色、`1` 蓝色，具体可用值以 QQ 客户端为准 |
| `visited_label` / `clicked_text` | 点击后的按钮文字 |
| `admin` | 仅管理员可点击 |
| `list` / `permission` | 限制可点击的用户 |
| `tips` / `unsupport_tips` | 客户端不支持时显示的提示 |

## 插件包内的按钮文件

也可以在插件包顶层使用 `lain.support.js` 导出同样的按钮类。此方式适合插件作者把扩展和自己的插件一起发布。个人配置或跨插件快捷入口建议放在 `plugins/button/<文件名>.js`，并用 `requiredPlugin` 声明目标插件。两种来源使用同一套 `plugin.rule` 和按钮构造方式。

## 排查

- QQBot 来源消息的 `e.reply()`、`e.markdown()` 都会检查自动按钮。启用 ICQQ 身份转译后，即使 `e.adapter` 显示兼容适配器名称，回复仍由 QQBot 发送并保留按钮。
- 回复中已经提供 `keyboard` 或 `button` 时，不再叠加规则按钮；`e.reply(msg, { markdown: true })` 也支持自动按钮。
- 检查 `rule.reg` 是否匹配当前 `e.msg`，以及 `fnc` 方法是否返回按钮。
- 检查目标插件的目录名是否与 `requiredPlugin` 完全相同。
- 只有顶层 `.js` 文件会被 `plugins/button` 加载；文件放在子目录时不会自动递归读取。
- 点击后无响应时，确认按钮是输入动作且 `data` 是插件可识别的指令；回调动作则检查 QQBot interaction 事件权限。
- 回调按钮点击成功但机器人未回复时，查看日志中的“QQBot 按钮互动回应失败”或“QQBot 按钮命令处理失败”；回调回复使用官方互动 ID，并会按群聊或私聊消息交给插件。
- 同一 AppID 同时接入 QQ 群和频道时，按钮互动按官方 `scene` 分流；群和 C2C 按钮由 QQBot 适配器处理，频道按钮由 QQGuild 适配器处理。
- 回调上下文只在互动被确认后交给插件；`qqbot_interaction_id` 用于确认，`qqbot_event_id` 用于被动回复。若日志提示缺少 Gateway 事件 ID，需检查 SDK 是否保留了事件信封的 `id`。
