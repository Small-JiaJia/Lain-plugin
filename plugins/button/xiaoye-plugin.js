/** xiaoye-plugin 专属快捷入口。 */
export default class XiaoyeButtons {
  constructor () {
    this.plugin = {
      name: '小叶插件按钮',
      dsc: '为小叶插件帮助页添加圣遗物入口',
      requiredPlugin: 'xiaoye-plugin',
      priority: 580,
      rule: [{ reg: '^#?小叶(插件)?帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '刷圣遗物', data: '#刷圣遗物' },
      { label: '查看上次圣遗物', data: '#查看上次圣遗物' },
      { label: '保存圣遗物', data: '#保存圣遗物' },
      { label: '查看圣遗物', data: '#查看圣遗物' }
    ])
  }
}
