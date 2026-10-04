// @requiredPlugin waves-plugin


// 来自 archive-waves-plugin.js
const Component0 = (() => {
class Button {
  constructor () {
    this.plugin = {
      requiredPlugin: 'waves-plugin',
      name: 'waves-plugin',
      dsc: 'waves-plugin',
      priority: 1000,
      rule: [
        {
          reg: "^(～|~|#?鸣潮)帮助$", //避免与方舟插件冲突，移除~前缀
          fnc: 'help'
        },
        {
          reg: "^(～|~|#?鸣潮)(常驻(武器|角色)|限定(武器|角色))?抽卡(统计|分析|记录)([\\s\\S]*)$",
          fnc: 'gachaCount'
        },
        {
          reg: "^(～|~|#?鸣潮)(波片|体力|日常数据)$",
          fnc: 'querySanity'
        },
        {
          reg: "^(～|~|#?鸣潮)(随机)?(表情包)$",
          fnc: 'emoji'
        },
        {
          reg: "^(～|~|#?鸣潮)?(数据坞|声骸)(\\d{9})?$",
          fnc: "calabash"
        }
      ]
    }
  }
  help (){
    const button = [
      { label: '探索', callback: `/鸣潮探索` },
      { label: '数据坞', callback: `/鸣潮数据坞` },
      { label: '卡片', callback: `/鸣潮卡片` },

      { label: '库洛签到', callback: `/鸣潮签到` },
      { label: '鸣潮体力', callback: `/鸣潮体力` },
      { label: '绑定账户', callback: `/鸣潮登录` },

      { label: '全息战略', callback: `/鸣潮全息战略` },
      { label: '抽卡模拟', data: `/鸣潮十连` },
      { label: '登录帮助', callback: `/鸣潮登录帮助`, style: 4 },
    ]
    return Bot.Button(button)
  }
  gachaCount (){
    const button = [
      { label: '抽卡帮助', callback: `/鸣潮抽卡帮助` },
      { label: '鸣潮帮助', callback: `/鸣潮帮助` },
      { label: '账号卡片', callback: `/鸣潮卡片` },
    ]
    return Bot.Button(button)
  }
  querySanity (){
    const button = [
      { label: '库洛签到', callback: `/鸣潮签到` },
      { label: '鸣潮体力', callback: `/鸣潮体力` },
    ]
    return Bot.Button(button)
  }
 emoji (){
    const button = [
      { label: '再来一张', callback: `/鸣潮随机表情包` },
      { label: '鸣潮帮助', callback: `/鸣潮帮助` }
    ]
    return Bot.Button(button)
  }
 calabash (){
    const button = [
      { label: '鸣潮登录', callback: `/鸣潮登录` },
      { label: '角色卡片', callback: `/鸣潮卡片` },
      { label: '鸣潮帮助', callback: `/鸣潮帮助` }
    ]
    return Bot.Button(button)
  }
}
return Button
})()

// 来自 archive-鸣潮.js
const Component1 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'waves-plugin',
        name: "鸣潮插件",
        dsc: "鸣潮",
        priority: 1000,
        rule: [
          {
            reg: "^(～|~|#?鸣潮)(登录|登陆|绑定)帮助$",
            fnc: 'bindHelp'
          },
          {
            reg: "^(～|~|#?鸣潮)(登录|登陆|绑定)\\s*\\+?.*$",
            fnc: "bindToken"
          },
        ]
      }
    }
    async bindHelp(e){
      const list = [
        [
          { label: '快捷登录' , callback: '/鸣潮登录', style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
    async bindToken(e){
      const list = [
        [
          { label: '快捷登录' , callback: '/鸣潮登录', style: 4 },
        ],
        [
          { label: '登录帮助' , callback: '/鸣潮登录帮助'},
          { label: 'Via浏览器' , link: 'https://viayoo.com/zh-cn/'}
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
      name: 'waves-plugin 按钮',
      requiredPlugin: 'waves-plugin',
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
          sourceFile: `plugins/button/${['archive-waves-plugin.js', 'archive-鸣潮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
