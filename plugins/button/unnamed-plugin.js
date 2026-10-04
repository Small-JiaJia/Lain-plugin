/** unnamed-plugin 专属快捷入口。 */
export default class UnnamedButtons {
  constructor () {
    this.plugin = {
      name: '无名插件按钮',
      dsc: '为无名插件帮助页添加语音工具入口',
      requiredPlugin: 'unnamed-plugin',
      priority: 530,
      rule: [{ reg: '^[/#]?无名帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '支持角色列表', data: '#支持角色列表' },
      { label: '语音接口切换', data: '#语音接口切换' },
      { label: '无名帮助', data: '#无名帮助' }
    ])
  }
}
