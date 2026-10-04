// @requiredPlugin yenai-plugin


// 来自 yenai-plugin.js
const Component0 = (() => {
/** yenai-plugin 专属快捷入口。 */
class YenaiButtons {
  constructor () {
    this.plugin = {
      name: '椰奶插件按钮',
      dsc: '为椰奶帮助页添加搜索与群管入口',
      requiredPlugin: 'yenai-plugin',
      priority: 590,
      rule: [{ reg: '^#?椰奶(插件)?(群管|涩涩)?(帮助|菜单|功能)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '椰奶状态', data: '#椰奶状态' },
      { label: '搜索菜单', data: '#搜索菜单' },
      { label: '收益曲线帮助', data: '#收益曲线帮助' },
      { label: '群管帮助', data: '#椰奶群管帮助' }
    ])
  }
}
return YenaiButtons
})()

// 来自 archive-今日xx事件.js
const Component1 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'yenai-plugin',
        name: "今日事件",
        dsc: "今日事件",
        priority: 1100,
        rule: [
          {
            reg: "^#?(抽取|随机)?(今日)?(小猪|猪|猪猪|🐷)$",
            fnc: "pig"
          },
          {
            reg: "^#(抽取|随机)?(今日)?doro结局",
            fnc: "doro"
          },
          {
            reg: '^#?抽签$|^#?求签$|^#?今日运势$',
            fnc: '随机抽签'
          },
        ]
      }
    }

    async pig(){
      const list = [
        [
          { label: '今日猪猪', callback: `/今日猪猪`, style: 4 },
          { label: '今日doro结局', callback: `/今日doro结局`, style: 4 },
          { label: '今日运势', callback: `/今日运势`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }

    async doro(){
      const list = [
        [
          { label: '今日猪猪', callback: `/今日猪猪`, style: 4 },
          { label: '今日doro结局', callback: `/今日doro结局`, style: 4 },
          { label: '今日运势', callback: `/今日运势`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }

    async 随机抽签(){
      const list = [
        [
          { label: '今日猪猪', callback: `/今日猪猪`, style: 4 },
          { label: '今日doro结局', callback: `/今日doro结局`, style: 4 },
          { label: '今日运势', callback: `/今日运势`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-喜报按钮.js
const Component2 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'yenai-plugin',
        name: "喜报",
        dsc: "喜报",
        priority: 1100,
        rule: [
          {
            reg: "^#?(喜报|xb|悲报|bb)",
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '喜报', data: `/喜报`, style: 4 },
          { label: '悲报', data: `/悲报`, style: 4 },
        ]
    ]
    return Bot.Button(list)
  }
}
return Button
})()

// 来自 archive-漂流瓶按钮.js
const Component3 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'yenai-plugin',
        name: "漂流瓶",
        dsc: "漂流瓶",
        priority: 1100,
        rule: [
            {
                reg: '^#?(扔|丢)漂流瓶(.*)$',
                fnc: 'buttonCenter'
            },
            {
                reg: '^#?(捡|捞)?漂流瓶$',
                fnc: 'buttonCenter'
            },
            {
                reg: '^#?(查询|获取)?漂流瓶(数|数量)$',
                fnc: 'buttonCenter'
            }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '丢漂流瓶', data: '/丢漂流瓶', style: 4 },
          { label: '捞漂流瓶', callback: `/捞漂流瓶`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-虚空帮助.js
const Component4 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'yenai-plugin',
        name: "椰奶状态按钮",
        dsc: "椰奶状态按钮",
        priority: 1101,
        rule: [
            {
              reg: '^#?虚空帮助',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?锻炼',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?闭关突破',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?虚空做委托',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?虚空(十连)抽武器',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?领取低保',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?娶群友',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?我的武器',
              fnc: 'buttonCenter'
            }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const list = [
        [
          { label: '虚空帮助', callback: `/虚空帮助` },
          { label: '锻炼', callback: `/锻炼` },
        ],[
          { label: '闭关突破', callback: `/闭关突破` },
          { label: '虚空做委托', callback: `/虚空做委托` },
        ],[
          { label: 'dau', callback: `/dau` },
          { label: '帮助', callback: `/帮助` },
        ],[
          { label: '虚空抽武器', callback: `/虚空抽武器` },
          { label: '虚空十连抽武器', callback: `/虚空十连抽武器` }
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-预估按钮.js
const Component5 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'yenai-plugin',
        name: "预估",
        dsc: "预估",
        priority: 1101,
        rule: [
          {
            reg: '^#?((原神|原石|gs)|(星铁|星琼|sr)|(崩坏三|崩三|水晶|bbb|bh3|bhs)|(绝区零|绝区|菲林|邦布券|邦布|zzz))(预估|盘点)$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '原石预估', callback: `/原石预估`, style: 4 },
          { label: '星琼预估', callback: `/星琼预估`,},
          { label: '菲林预估', callback: `/菲林预估`, style: 4},
          { label: '水晶预估', callback: `/水晶预估`,},
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
    this.components = [new Component0(), new Component1(), new Component2(), new Component3(), new Component4(), new Component5()]
    this.plugin = {
      name: 'yenai-plugin 按钮',
      requiredPlugin: 'yenai-plugin',
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
          sourceFile: `plugins/button/${['yenai-plugin.js', 'archive-今日xx事件.js', 'archive-喜报按钮.js', 'archive-漂流瓶按钮.js', 'archive-虚空帮助.js', 'archive-预估按钮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
