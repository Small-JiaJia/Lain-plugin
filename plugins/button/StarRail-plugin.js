// @requiredPlugin StarRail-plugin


// 来自 StarRail-plugin.js
const Component0 = (() => {
/** StarRail-plugin 专属快捷入口。 */
class StarRailButtons {
  constructor () {
    this.plugin = {
      name: 'StarRail 按钮',
      dsc: '为星铁帮助与查询结果添加快捷入口',
      requiredPlugin: 'StarRail-plugin',
      priority: 450,
      rule: [{ reg: '^#星铁(帮助|help|体力|面板(列表)?|抽卡帮助|攻略)$', fnc: 'guide' }]
    }
  }

  guide () {
    return Bot.Button([
      { label: '星铁体力', data: '#星铁体力' },
      { label: '星铁面板列表', data: '#星铁面板列表' },
      { label: '星铁深渊', data: '#星铁深渊' },
      { label: '星铁抽卡帮助', data: '#星铁抽卡帮助' },
      { label: '星铁攻略', data: '#星铁攻略' }
    ])
  }
}
return StarRailButtons
})()

// 来自 archive-星铁深渊按钮.js
const Component1 = (() => {
class Button {
    constructor() {
      this.plugin = {
        requiredPlugin: 'StarRail-plugin',
        name: "星铁深渊按钮",
        dsc: "星铁深渊按钮",
        priority: 1101,
        rule: [
            {
              reg: '^#?(星铁)?(深渊|忘却(之庭)?|(混沌)?回忆)',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?(星铁)?(模拟宇宙|宇宙|模拟)',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?(星铁)?(虚构叙事|构事|狗屎|虚构|虚狗|叙事)',
              fnc: 'buttonCenter'
            },
            {
              reg: '^#?(星铁)?上期(深渊|忘却(之庭)?|(混沌)?回忆)',
              fnc: 'buttonCenter'
            }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const list = [
        [
          { label: '忘却之庭', callback: `/${game}忘却之庭` },
          { label: '模拟宇宙', callback: `/${game}模拟宇宙` },
        ],[
          { label: '虚构叙事', callback: `/${game}虚构叙事` },
          { label: '上期深渊', callback: `/${game}上期深渊` },
        ],[
          { label: '扫码绑定', callback: `/扫码绑定`, style: 4 },
          { label: '刷新CK', callback: `/刷新ck`, style: 4 },
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
    this.components = [new Component0(), new Component1()]
    this.plugin = {
      name: 'StarRail-plugin 按钮',
      requiredPlugin: 'StarRail-plugin',
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
          sourceFile: `plugins/button/${['StarRail-plugin.js', 'archive-星铁深渊按钮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
