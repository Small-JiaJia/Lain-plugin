/** xiaofei-plugin 专属快捷入口。 */
export default class XiaofeiButtons {
  constructor () {
    this.plugin = {
      name: '小飞插件按钮',
      dsc: '为小飞插件帮助页添加常用查询入口',
      requiredPlugin: 'xiaofei-plugin',
      priority: 560,
      rule: [{ reg: '^#?小飞(插件)?帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '天气查询', data: '#天气' },
      { label: '点歌', data: '#点歌' },
      { label: '注册时间', data: '#原神注册时间' },
      { label: '小飞插件帮助', data: '#小飞帮助' }
    ])
  }
}
