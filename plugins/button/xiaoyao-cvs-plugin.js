// @requiredPlugin xiaoyao-cvs-plugin


// 来自 xiaoyao-cvs-plugin.js
const Component0 = (() => {
/** xiaoyao-cvs-plugin 专属快捷入口。 */
class XiaoyaoCvsButtons {
  constructor () {
    this.plugin = {
      name: '逍遥插件按钮',
      dsc: '为逍遥图鉴帮助页添加游戏入口',
      requiredPlugin: 'xiaoyao-cvs-plugin',
      priority: 570,
      rule: [{ reg: '^#?(图鉴)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '图鉴版本', data: '#图鉴版本' },
      { label: '体力查询', data: '#体力' },
      { label: '米游社原神签到', data: '#米游社原神签到' },
      { label: '米游社帮助', data: '#米游社帮助' }
    ])
  }
}
return XiaoyaoCvsButtons
})()

// 来自 archive-xiaoyao-cvs-plugin.js
const Component1 = (() => {
class Button {
  constructor() {
    this.plugin = {
      requiredPlugin: 'xiaoyao-cvs-plugin',
      name: "xiaoyao-cvs-plugin",
      dsc: "xiaoyao-cvs-plugin",
      priority: 1100,
      rule: [
      {
        reg: "^#*((刷新|更新|获取|绑定)(ck|cookie))|((扫码|二维码|辅助)(登录|绑定|登陆))|((账号|密码)(密码)?(登录|绑定|登陆))|((图鉴|ck|cd|CD)帮助)$",
        fnc: "user",
      },
      {
        reg: `^#*(米游社|mys|社区)?(原神|星铁|崩坏3|崩坏2|未定事件簿|大别野|崩坏星穹铁道|绝区零|全部)?签到$`,
        fnc: "sign",
      },
      {
        reg: `^#*(原神|星铁|全部|全|多)?体力(帮助)?$`,
        fnc: "note",
      },
      {
        reg: `^#*(原神|星铁)?(((更新|获取|导出)?抽卡记录)|((全部)?(抽卡|抽奖|角色|武器|集录|常驻|up|新手|光锥|全部)池*(记录|祈愿|分析|统计))|((记录|抽卡|安卓|苹果|电脑|pc|ios)帮助))$`,
        fnc: "gacha",
      },
      {
        reg: 'authkey=',
        fnc: "gacha",
      },
      {
        reg: /\[uid\:\d+\]/,
        fnc: "gacha",
      },
      {
        reg: '(stoken|ct|login_ticket)=',
        fnc: "user",
      },
      {
        reg: '(ltoken|ltoken_v2).*(ltuid|login_uid|ltmid_v2)',
        fnc: "user",
      },
      ]
    }
  }

  async user(){
    const list = [
      { label: '签到', callback: `/签到`, style: 1  },
      { label: '体力', callback: `/体力`, style: 1  },
      { label: '社区', callback: `/米游社原神签到`, style: 1  },

      { label: `扫码绑定`, callback: `/扫码绑定`, style: 1  },
      { label: `刷新CK`, callback: `/刷新ck`, style: 1  },
      { label: `刷新CD`, callback: `/刷新CD`, style: 1  },

      { label: `更新抽卡记录`, callback: `/更新抽卡记录`, style: 4 },

      { label: `获取小助手记录`, callback: `/获取小助手记录`, style: 4 },
    ]
    return Bot.Button(list)
  }

  async sign(){
    const list = [
      [
        { label: `签到`, callback: `/签到`, style: 1  },
        { label: `体力`, callback: `/体力` , style: 1 },
        { label: '社区', callback: `/米游社原神签到`, style: 1  },
      ],[
        { label: `扫码绑定`, callback: `/扫码绑定`, style: 1  },
        { label: `刷新CK`, callback: `/刷新ck`, style: 1  },
      ],[
        { label: '自动签到' , link: 'https://afdian.com/a/ye3011', style: 4},
        { label: '拉窝进群' , link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=3889005294&robot_appid=102082668&biz_type=0', style: 4},
      ]
    ]
    return Bot.Button(list)
  }

  async note(){
    const list = [
      [
        { label: `签到`, callback: `/签到`, style: 1 },
        { label: `体力`, callback: `/体力`, style: 1 },
        { label: '社区', callback: `/米游社原神签到`, style: 1 },
      ],[
        { label: `扫码绑定`, callback: `/扫码绑定`, style: 1 },
        { label: `刷新CK`, callback: `/刷新ck`, style: 1 },
      ],[
        { label: '自动签到' , link: 'https://afdian.com/a/ye3011', style: 4},
        { label: '反馈群聊' , link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=dGwUMbO9IBj9TPGmGLmZ1HMBw5b6zaTK&authKey=e9KIcoWA2QVtQ2N0%2BBIzF3DzyR7JoSwSZkNPkXc4aI6nKzO%2Bl9KAmd%2FQ5ZXtMB4b&noverify=0&group_code=692425673', style: 4},
      ]
    ]
    return Bot.Button(list)
  }

  async gacha(e){
    const list = [
        { label: `角色记录`, callback: `/星铁角色记录`, style: 1  },
        { label: `光锥记录`, callback: `/星铁光锥记录`, style: 1  },
        { label: `全部记录`, callback: `/星铁全部记录`, style: 1  },

        { label: `角色统计`, callback: `/星铁角色统计`, style: 1  },
        { label: `光锥统计`, callback: `/星铁光锥统计`, style: 1  },
        { label: `全部统计`, callback: `/星铁全部统计`, style: 1  },
  ]
  return Bot.Button(list)
}
async gacha(e){
  const game = e.isSr ? '星铁' : ''
   const list = [
      [
        { label: `角色记录`, callback: `/${game}角色记录`, style: 1  },
        { label: `武器记录`, callback: `/${game}${game ? '光锥' : '武器'}记录`, style: 1  },
        { label: `常驻记录`, callback: `/${game}常驻记录`, style: 1  },
      ],[
        { label: `角色统计`, callback: `/${game}角色统计`, style: 1  },
        { label: `武器统计`, callback: `/${game}${game ? '光锥' : '武器'}统计`, style: 1  },
        { label: `常驻统计`, callback: `/${game}常驻统计`, style: 1  },
      ],[
        { label: `全部记录`, callback: `/${game}全部记录` , style: 1 },
        { label: `全部统计`, callback: `/${game}全部统计` , style: 1 },
        { label: `集录记录`, callback: `/集录记录`, style: 1  },
      ],[
        { label: `扫码绑定`, callback: `/扫码绑定`, style: 1  },
        { label: `刷新CK`, callback: `/刷新ck`, style: 1  },
        { label: `刷新CD`, callback: `/刷新CD`, style: 1  },
      ],[
        { label: `更新抽卡记录`, callback: `/更新抽卡记录`, style: 4 },
        { label: `获取小助手记录`, callback: `/获取小助手记录`, style: 4 },
      ]
    ]
    return Bot.Button(list)
  }
}

function toButton(list, line = 3) {
  let button = []
  let arr = []
  let index = 1
  for (const i of list) {
    arr.push({
      id: String(Date.now()),
      render_data: {
        label: i.label,
        style: 1
      },
      action: {
        type: 2,
        permission: { type: 2 },
        data: i.data,
        unsupport_tips: "code: 45",
      }
    })
    if (index % line == 0 || index == list.length) {
      button.push({type: 'button',
        buttons: arr
      })
      arr = []
    }
    index++
  }
  return button
}
return Button
})()

// 来自 archive-全量抽卡记录按钮.js
const Component2 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'xiaoyao-cvs-plugin',
        name: "设置全量更新抽卡记录",
        dsc: "设置全量更新抽卡记录",
        priority: 1100,
        rule: [
          {
            reg: "^#?设置全量(更新|获取)(抽卡|祈愿)记录\s*(开|关|on|off)?$",
            fnc: 'setFetchFullLog'
          }
        ]
      }
    }
    async setFetchFullLog(e){
      const list = [
        [
          { label: `扫码绑定`, callback: `/扫码绑定`, style: 4 },
          { label: `刷新CK`, callback: `/刷新ck`, style: 4 },
          { label: `刷新CD`, callback: `/刷新CD`, style: 4 },
        ],[
          { label: `设置全量记录`, callback: `/设置全量更新抽卡记录` },
          { label: `更新抽卡记录`, callback: `/更新抽卡记录` },
        ],[
          { label: `获取小助手记录`, callback: `/获取小助手记录` }
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-刷新CD按钮.js
const Component3 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'xiaoyao-cvs-plugin',
        name: "刷新CD",
        dsc: "刷新CD",
        priority: 1100,
        rule: [
          {
            reg: '^#(刷新|清除|clean-)(CD|cd)\s*([1-9][0-9]{8})?$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '扫码绑定', callback: `/扫码绑定` },
          { label: '网页登录', callback: `/网页登录` },
          { label: `刷新CK`, callback: `/刷新ck` },
          { label: `刷新CD`, callback: `/刷新CD` },
        ],[
          { label: `更新抽卡记录`, callback: `/更新抽卡记录`, style: 4 },
          { label: '获取小助手记录', callback: `/获取小助手记录`, style: 4 }
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-星铁记录帮助按钮.js
const Component4 = (() => {
/*/自行【#添加全局*记录帮助】或【#添加全局/星铁记录帮助】或【#添加全局#星铁记录帮助】
文本：
星穹铁道抽卡记录链接获取教程

方法一：

需要下载软件操作，手机端比较麻烦

方法二：

手机端简单，通过网页云星铁获取，但需要你云星铁有免费时长或畅玩卡

把获取到的链接艾特QQbot一同发送即可】
/*/
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'xiaoyao-cvs-plugin',
        name: "星铁记录帮助",
        dsc: "星铁记录帮助",
        priority: 1099,
        rule: [
          {
            reg: /^#*(原神|星铁)?(记录|安卓|电脑|苹果|抽卡|抽卡记录)(帮助|教程|绑定|步骤)|(星铁)(更新|获取|导出)抽卡记录$/,
            fnc: "help"
          },
        ]
      }
    }
    async help(e){
      const list = [
        [
          { label: '更新记录' , callback: '/星铁更新抽卡记录', style: 4},
          { label: '抽卡记录' , callback: '/星铁抽卡记录', style: 4},

        ],
        [
          { label: '手机端云星铁快捷获取方法' , link: 'https://docs.qq.com/doc/DWmhNd1lubXdET0dM', style: 4},
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-获取小助手按钮.js
const Component5 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'xiaoyao-cvs-plugin',
        name: "获取小助手记录",
        dsc: "获取小助手记录",
        priority: 1100,
        rule: [
            {
              reg: '^#?(获取|更新)(提瓦特)?小助手(抽卡|祈愿)?(记录|历史)( *|"+NEWLINE+"*)(https.*)?',
              fnc: 'buttonCenter'
            },{
              reg:  /^#*确认$/,
              fnc: 'delLog'
            },{
              reg:  /^#*取消$/,
              fnc: 'delLog'
            },{
              reg: "^#删除抽卡记录",
              fnc: "delLog"
            },
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '扫码绑定', callback: `/扫码绑定` },
          { label: '更新记录', callback: `/更新抽卡记录` },
          { label: `集录记录`, callback: `/集录记录` },
        ],[
          { label: '全部记录', callback: `/全部记录` },
          { label: '角色记录', callback: `/角色记录` },
          { label: '武器记录', callback: `/武器记录` },
        ],[
          { label: '全部统计', callback: `/全部统计` },
          { label: '角色统计', callback: `/角色统计` },
          { label: '武器统计', callback: `/武器统计` },
        ],[
          { label: '获取小助手记录', callback: `/获取小助手记录` },
          { label: '删除抽卡记录', callback: `/删除抽卡记录` },
        ],[
          { label: '确认', callback: `确认` },
          { label: '取消', callback: `取消` },
        ]
      ]
      return Bot.Button(list)
    }

    async delLog(e){
      const list = [
        [
          { label: '获取小助手记录', callback: `/获取小助手记录` },
        ],[
          { label: '更新抽卡记录', callback: `/更新抽卡记录` },
          { label: '删除抽卡记录', callback: `/删除抽卡记录` },
        ],[
          { label: '确认', callback: `确认` },
          { label: '取消', callback: `取消` },
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
      name: 'xiaoyao-cvs-plugin 按钮',
      requiredPlugin: 'xiaoyao-cvs-plugin',
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
          sourceFile: `plugins/button/${['xiaoyao-cvs-plugin.js', 'archive-xiaoyao-cvs-plugin.js', 'archive-全量抽卡记录按钮.js', 'archive-刷新CD按钮.js', 'archive-星铁记录帮助按钮.js', 'archive-获取小助手按钮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
