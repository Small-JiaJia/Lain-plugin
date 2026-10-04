// @requiredPlugin ZZZ-Plugin


// 来自 ZZZ-Plugin.js
const Component0 = (() => {
/** ZZZ-Plugin 专属快捷入口。 */
class ZZZButtons {
  constructor () {
    this.plugin = {
      name: 'ZZZ 按钮',
      dsc: '为绝区零指令添加快捷入口',
      requiredPlugin: 'ZZZ-Plugin',
      priority: 460,
      rule: [{ reg: '^((#(zzz|ZZZ|绝区零))|%)(帮助|菜单|功能|命令)$', fnc: 'guide' }]
    }
  }

  guide () {
    return Bot.Button([
      { label: '绝区零体力', data: '#绝区零体力' },
      { label: '绝区零图鉴', data: '#绝区零图鉴' },
      { label: '绝区零帮助', data: '#绝区零帮助' }
    ])
  }
}
return ZZZButtons
})()

// 来自 archive-zzz-plugin.js
const Component1 = (() => {
//代码源于：[xyz]https://gitee.com/xyzqwefd
//import Panel from '../../../../ZZZ-plugin/apps/panel.js'

class Button {
  constructor () {
    this.plugin = {
      requiredPlugin: 'ZZZ-Plugin',
      name: 'zzz-plugin',
      dsc: 'zzz-plugin',
      priority: 1095,
      rule: [
        {
          reg: `#绝区零更新面板|#绝区零面板更新|#绝区零刷新面板|#绝区零面板刷新$`,
          fnc: 'profile1',
        },
        {
          reg: '#绝区零帮助|%帮助$',
          fnc: 'help',
        },
        {
          reg: `#绝区零(.*)面板(.*)$`,
          fnc: 'handleRule',
        },
      ]
    }
  }

  profile1(e) {
    const roleList = global.zzzroleList
    const button = []

    const list3 = [
      { label: `更新面板`, callback: `/绝区零更新面板` },
      { label: '绑定UID', data: `/绝区零绑定` },
      { label: '扫码绑定', callback: `/扫码绑定` },
    ]
    button.push(...Bot.Button(list3))

    const list1 = []
    for (let role of roleList) {
      list1.push({ label: role, callback: `/绝区零${role}面板` })
    if (list1.length === 12) {
      break // 一旦达到12个按钮，停止添加更多
  }
}
    button.push(...Bot.Button(list1, 3))
    return button
  }

  handleRule (e) {
    const charName = e.msg.replace(/#绝区零|面板/g, '')
    let game = ''
    if (e.game === 'sr' || e.isSr) {
        game = '星铁'
    } else if (e.game === 'zzz' || e.isSr) {
        game = '绝区零'
    }

    const button = []
    const list =[
      [
        { label: `更新面板`, callback: `/绝区零更新面板` },
        { label: '绑定UID', data: `/绝区零绑定` },
        { label: '扫码绑定', callback: `/扫码绑定` },
      ]
    ]
    button.push(...Bot.Button(list, 3))
    const list2 = [
      [
        { label: `${charName}面板`, callback: `/绝区零${charName}面板` },
        { label: `${charName}攻略`,callback:`/绝区零${charName}攻略` },
      ],[
        { label: `绝区零帮助`,callback:`/绝区零帮助` },
      ]
   ]
   button.push(...Bot.Button(list2))
   return button
  }

  help () {
    const button = [
      [
        { label: '签到', callback: `/签到` },
        { label: '体力', callback: `/体力` },
        { label: '深渊', callback: `/绝区零深渊` },
      ],[
        { label: '个人信息', callback: `/绝区零个人信息` },
        { label: '练度统计', callback: `/绝区零练度统计` },
        { label: '上期深渊', callback: `/绝区零上期深渊` },
      ],[
        { label: '更新面板', callback: `/绝区零更新面板` },
        { label: `绑定UID`, data: `/绝区零绑定` },
        { label: '扫码绑定', callback: `/扫码绑定` },
      ],[
        { label: '更新抽卡记录', callback: `/绝区零更新抽卡记录` },
      ],[
        { label: '填满呐呐' , link: 'https://afdian.com/a/ye3011'},
        { label: '反馈群聊' , link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=dGwUMbO9IBj9TPGmGLmZ1HMBw5b6zaTK&authKey=e9KIcoWA2QVtQ2N0%2BBIzF3DzyR7JoSwSZkNPkXc4aI6nKzO%2Bl9KAmd%2FQ5ZXtMB4b&noverify=0&group_code=692425673'},
      ]
    ]
    return Bot.Button(button)
  }
}
return Button
})()

/** 每个上游插件只加载一个扩展文件，原组件的匹配优先级保存在每条规则上。 */
export default class MergedButtons {
  constructor () {
    this.components = [new Component0(), new Component1()]
    this.plugin = {
      name: 'ZZZ-Plugin 按钮',
      requiredPlugin: 'ZZZ-Plugin',
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
          sourceFile: `plugins/button/${['ZZZ-Plugin.js', 'archive-zzz-plugin.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
