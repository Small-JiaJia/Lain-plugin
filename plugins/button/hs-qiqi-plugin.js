/** hs-qiqi-plugin（枫叶插件）专属快捷入口。 */
export default class HsQiqiButtons {
  constructor () {
    this.plugin = {
      name: '枫叶插件按钮',
      dsc: '为枫叶插件帮助页添加常用指令',
      requiredPlugin: 'hs-qiqi-plugin',
      priority: 510,
      rule: [{ reg: '^#?枫叶(插件)?帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '今日新闻', data: '#今日新闻' },
      { label: '数字炸弹', data: '#数字炸弹' },
      { label: '开奖帮助', data: '#开奖帮助' },
      { label: '枫叶设置', data: '#枫叶设置' }
    ])
  }
}
