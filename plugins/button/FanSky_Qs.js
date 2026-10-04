/** FanSky_Qs 插件专属快捷入口。 */
export default class FanSkyButtons {
  constructor () {
    this.plugin = {
      name: 'FanSky 按钮',
      dsc: '为 FanSky 帮助页添加常用功能入口',
      requiredPlugin: 'FanSky_Qs',
      priority: 420,
      rule: [{ reg: '^#?(fan|Fansky|Fan|fans).*?(帮助|菜单|help|功能)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '打卡', data: '#打卡' },
      { label: '魔晶抽卡', data: '#魔晶抽卡' },
      { label: 'FanSky 设置', data: '#fan设置' }
    ])
  }
}
