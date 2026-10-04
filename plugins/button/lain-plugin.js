// @requiredPlugin Lain-plugin


// 来自 lain-plugin.js
const Component0 = (() => {
/** Lain-plugin 专属快捷入口。 */
class LainPluginButtons {
  constructor () {
    this.plugin = {
      name: 'Lain-plugin 按钮',
      dsc: '为 Lain-plugin 帮助回复添加快捷入口',
      requiredPlugin: 'Lain-plugin',
      priority: 400,
      rule: [{ reg: '^#(Lain|铃音)(.*)帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: 'QQBot 账号', data: '#QQBot账号', admin: true },
      { label: 'QQBot 日活', data: '#QQBotDAU', admin: true },
      { label: '铃音帮助', data: '#铃音帮助' }
    ])
  }
}
return LainPluginButtons
})()

// 来自 archive-QQBot公告.js
const Component1 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'Lain-plugin',
        name: "机器人公告",
        dsc: "机器人公告",
        priority: 1000,
        rule: [
          {
            reg: '^#?机器人公告$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '机器人公告', callback: `/机器人公告`, style: 1  },
        ],[
          { label: '填满呐呐' , link: 'https://afdian.com/a/ye3011', style: 4},
          { label: '反馈群聊' , link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=dGwUMbO9IBj9TPGmGLmZ1HMBw5b6zaTK&authKey=e9KIcoWA2QVtQ2N0%2BBIzF3DzyR7JoSwSZkNPkXc4aI6nKzO%2Bl9KAmd%2FQ5ZXtMB4b&noverify=0&group_code=692425673', style: 4},
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-免艾特权限按钮.js
const Component2 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'Lain-plugin',
        name: "权限设置",
        dsc: "权限设置与主动权限开启",
        priority: 1100,
        rule: [
          {
            reg: '^#?(权限设置|开启全量).*$',
          fnc: "generateUrl"
          }
        ]
      }
    }
    async generateUrl(){
      const list = [
        [
          { label: '设置免艾特', callback: '权限设置' , style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-艾特回复.js
const Component3 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'Lain-plugin',
        name: "按钮中心",
        dsc: "按钮中心",
        priority: 1100,
        rule: [
          {
            reg: '^#按钮中心$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '原神绑定UID', data: `/绑定` },
          { label: '星铁绑定UID', data: `/星铁绑定` },
          { label: '鸣潮绑定UID', data: `ww绑定` },
          { label: '绝区绑定UID', data: `/绝区零绑定` },
        ],[
          { label: '原神更新面板', callback: '/原神更新面板' },
          { label: '星铁更新面板', callback: '/星铁更新面板' },
          { label: '鸣潮更新面板', callback: 'ww更新面板' },
          { label: '绝区更新面板', callback: '/绝区零更新面板' },
        ],[
          { label: '签到', callback: '/签到' },
          { label: '体力', callback: '/体力' },
          { label: '社区', callback: '/米游社原神签到' },
        ],[
          { label: '扫码绑定', callback: '/扫码绑定' },
          { label: '刷新CD', callback: '/刷新CD' },
        ],[
          { label: '自动签到' , link: 'https://afdian.com/a/ye3011', style: 4},
          { label: '拉我入群' , link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=3889005294&robot_appid=102082668&biz_type=0', style: 4},
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
    this.components = [new Component0(), new Component1(), new Component2(), new Component3()]
    this.plugin = {
      name: 'Lain-plugin 按钮',
      requiredPlugin: 'Lain-plugin',
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
          sourceFile: `plugins/button/${['lain-plugin.js', 'archive-QQBot公告.js', 'archive-免艾特权限按钮.js', 'archive-艾特回复.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
