/** GT-Manual-Plugin 手动签到专属快捷入口。 */
export default class GTManualButtons {
  constructor () {
    this.plugin = {
      name: 'GT 手动签到按钮',
      dsc: '为手动签到结果添加游戏签到入口',
      requiredPlugin: 'GT-Manual-Plugin',
      priority: 430,
      rule: [{ reg: '^#*(原神|星铁|米游社)?签到$', fnc: 'sign' }]
    }
  }

  sign () {
    return Bot.Button([
      { label: '原神签到', data: '#原神签到' },
      { label: '星铁签到', data: '#星铁签到' },
      { label: '米游社签到', data: '#米游社签到' }
    ])
  }
}
