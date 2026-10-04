// @requiredPlugin genshin


// 来自 genshin.js
const Component0 = (() => {
/** genshin 核心游戏功能专属快捷入口。 */
class GenshinButtons {
  constructor () {
    this.plugin = {
      name: 'genshin 按钮',
      dsc: '为体力与角色查询添加游戏快捷入口',
      requiredPlugin: 'genshin',
      priority: 500,
      rule: [{ reg: '^#?(原神|星铁|绝区零)?(体力|树脂|查询体力|抽卡帮助|记录帮助)$', fnc: 'game' }]
    }
  }

  game (e) {
    const game = e.msg.includes('星铁') ? '星铁' : e.msg.includes('绝区零') ? '绝区零' : '原神'
    return Bot.Button([
      { label: `${game}体力`, data: `#${game}体力` },
      { label: '绑定 UID', data: '#绑定uid' },
      { label: 'Cookie 帮助', data: '#cookie帮助' },
      { label: '角色养成计算', data: '#角色养成计算' }
    ])
  }
}
return GenshinButtons
})()

// 来自 archive-云原神帮助.js
const Component1 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'genshin',
        name: "云原神",
        dsc: "云原神帮助",
        priority: 1000,
        rule: [
          {
            reg: "^#?云原神帮助$",
            fnc: 'yun'
          }
        ]
      }
    }
    async yun(e){
      const list = [
        [
          { label: '云原神帮助' , link: 'https://docs.qq.com/doc/DUmVGZnlDemdvUUVj', style: 4}
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-兑换码按钮.js
const Component2 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'genshin',
        name: "兑换码",
        dsc: "兑换码",
        priority: 1100,
        rule: [
          {
            reg: /^(#|\*)?(原神|星铁|崩铁|崩三|崩坏三|崩坏3)?(直播|前瞻)?兑换码$/,
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '原神兑换码', callback: `/原神兑换码` },
          { label: '星铁兑换码', callback: `/星铁兑换码` },
        ]
    ]
    return Bot.Button(list)
  }
}
return Button
})()

/** 每个上游插件只加载一个扩展文件，原组件的匹配优先级保存在每条规则上。 */
export default class MergedButtons {
  constructor () {
    this.components = [new Component0(), new Component1(), new Component2()]
    this.plugin = {
      name: 'genshin 按钮',
      requiredPlugin: 'genshin',
      priority: Math.min(...this.components.map(component => Number(component.plugin.priority))),
      rule: []
    }
    this.components.forEach((component, componentIndex) => {
      component.plugin.rule.forEach((original, ruleIndex) => {
        const fnc = `_component_${componentIndex}_${ruleIndex}`
        this.plugin.rule.push({
          ...original,
          fnc,
          priority: Number(original.priority ?? component.plugin.priority),
          sourceFile: `plugins/button/${['genshin.js', 'archive-云原神帮助.js', 'archive-兑换码按钮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
