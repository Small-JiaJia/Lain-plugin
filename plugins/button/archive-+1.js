export default class Button {
  constructor () {
    this.plugin = {
      // 插件名称
      name: '通用按钮',
      // 描述
      dsc: '通用按钮',
      // 按钮优先级
      priority: 6100,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#回调按钮测试$',
          /** 执行方法 */
          fnc: 'test'
        },
      ]
    }
  }

  /** 执行方法 */
  test (e) {
    if (!e.group_id && !e.user_id) return false
    return Bot.Button([{ label: '测试回调 +1', callback: '#回调按钮测试 已点击', style: 1 }])
  }
 }
