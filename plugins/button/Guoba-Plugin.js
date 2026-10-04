/** Guoba-Plugin 专属快捷入口。 */
export default class GuobaButtons {
  constructor () {
    this.plugin = {
      name: 'Guoba 按钮',
      dsc: '为锅巴帮助页添加管理入口',
      requiredPlugin: 'Guoba-Plugin',
      priority: 440,
      rule: [{ reg: '^#?锅巴(帮助|菜单|说明|功能|指令|命令|使用说明|help)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '锅巴登录', data: '#锅巴登录' },
      { label: '锅巴版本', data: '#锅巴版本' },
      { label: '锅巴帮助', data: '#锅巴帮助' }
    ])
  }
}
