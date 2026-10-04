/** windoge-plugin 专属快捷入口。 */
export default class WindogeButtons {
  constructor () {
    this.plugin = {
      name: 'windoge 插件按钮',
      dsc: '为 windoge 帮助页添加便笺与素材入口',
      requiredPlugin: 'windoge-plugin',
      priority: 540,
      rule: [{ reg: '^#?(windoge)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '便笺', data: '#便笺' },
      { label: '参考面板说明', data: '#参考面板说明' },
      { label: '天赋素材', data: '#天赋素材' },
      { label: '原石预估', data: '#原石预估' }
    ])
  }
}
