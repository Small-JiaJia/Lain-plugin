/** Atlas 图鉴插件专属快捷入口。 */
export default class AtlasButtons {
  constructor () {
    this.plugin = {
      name: 'Atlas 图鉴按钮',
      dsc: '为 Atlas 帮助页添加图鉴查询入口',
      requiredPlugin: 'Atlas',
      priority: 410,
      rule: [{ reg: '^[#/](图鉴|wiki|百科|Atlas)(\\s*)(帮助|菜单|功能|help)', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '原神图鉴', data: '#原神图鉴' },
      { label: '星铁图鉴', data: '#星铁图鉴' },
      { label: '绝区零图鉴', data: '#绝区零图鉴' }
    ])
  }
}
