/** ws-plugin 专属快捷入口。 */
export default class WsButtons {
  constructor () {
    this.plugin = {
      name: 'ws 插件按钮',
      dsc: '为 ws-plugin 帮助页添加管理入口',
      requiredPlugin: 'ws-plugin',
      priority: 550,
      rule: [{ reg: '^#ws帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: 'ws 状态', data: '#ws状态' },
      { label: '获取群成员列表', data: '#ws获取群成员列表' },
      { label: 'ws 版本', data: '#ws版本' }
    ])
  }
}
