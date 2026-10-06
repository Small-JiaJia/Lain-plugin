// @requiredPlugin miao-plugin
import Character from '../../../miao-plugin/models/Character.js'
import Player from '../../../miao-plugin/models/Player.js'
import Meta from '../../../miao-plugin/components/Meta.js'

// 来自 miao-plugin.js
const Component0 = (() => {
/** miao-plugin 专属快捷入口。 */
class MiaoButtons {
  constructor () {
    this.plugin = {
      name: '喵喵插件按钮',
      dsc: '为喵喵帮助页添加面板与游戏入口',
      requiredPlugin: 'miao-plugin',
      priority: 520,
      rule: [{ reg: '^[/#]?喵喵(命令|帮助|菜单|help|说明|功能|指令|使用说明)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '角色面板帮助', data: '#角色面板帮助' },
      { label: '更新全部面板', data: '#更新全部面板' },
      { label: '面板角色列表', data: '#面板角色列表' },
      { label: '喵喵版本', data: '#喵喵版本' }
    ])
  }
}
return MiaoButtons
})()

// 来自 archive-miao-plugin.js
const Component1 = (() => {
/* 原作者：[风间叶](https://github.com/xiaoye12123/), [Lain.](https://github.com/Zyy955/)

   自行去,崽\plugins\genshin\apps\user.js的49行加上(\s|\+)*不然官方机器人自带的空格指令会无响应
        {
   49     reg: /^#(原神|星铁|绝区零)?(我的)?(uid)?(\s|\+)*[0-9]{0,2}$/i,
          fnc: 'showUid'
        },

   绝区零插件https://github.com/ZZZure/ZZZ-Plugin
*/

class Button {
  constructor () {
    this.plugin = {
      requiredPlugin: 'miao-plugin',
      name: 'miao-plugin',
      dsc: 'miao-plugin',
      priority: 1101,
      rule: [
        {
          reg: '^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
          fnc: 'help'
        },
        {
          reg: /^#(星铁|原神)?获取游戏角色详情( )?(\d{9})?$/,
          fnc: 'profile'
        },
        {
          reg: /^[#*](星铁|原神)?(更新)?(全部)?面板(更新)?( )?(\d{9})?$/,
          fnc: 'profile'
        },
        {
          reg: /^#?(原神|星铁|绝区零)?(删除|解绑)uid(\s|\+)*([0-9]{1,2})?$/i,
          fnc: 'bingUid'
        },
        {
          reg: /^#(原神|星铁|绝区零)?绑定(uid)?(\s|\+)*((1[0-9]|[1-9])[0-9]{8}|[1-9][0-9]{7})$/i,
          fnc: 'bingUid'
        },
        {
          reg: /^#(原神|星铁|绝区零)?(我的)?(uid)?(\s|\+)*[0-9]{0,2}$/i,
          fnc: 'bingUid'
        },
        {
          reg: /^#?(原神|星铁)?(群|群内)?(排名|排行)?(最强|最高|最高分|最牛|第一)+.+/,
          fnc: 'rank'
        },
        {
          reg: /^#?(原神|星铁)?(群|群内)?(.*)(排名|排行)(榜)?$/,
          fnc: 'rank'
        },
        {
          reg: /^[#*]*([^#*]+)\s*(详细|详情|面板|面版|圣遗物|武器[1-7]|伤害([1-9]+\d*)?)\s*(\d{9})*(.*[换变改].*)?$/,
          fnc: 'detail'
        },
        {
          reg: '#喵喵角色卡片',
          fnc: 'avatarList'
        },
        {
          reg: '#喵喵WIKI',
          fnc: 'tip'
        },
        {
          reg: "#喵喵扩展WIKI",
          fnc: 'tip'
        },
        {
          reg: /.*(攻略|天赋|技能|行迹|命座|命之座|星魂|资料|图鉴|素材|材料|天赋)[0-9]?$/,
          fnc: 'tip'
        }
      ]
    }
  }
  help (){
    const button = [
      { label: '上传深渊', callback: `/上传深渊` },
      { label: '练度统计', callback: `/练度统计` },
      { label: '圣遗物列表', callback: `/圣遗物列表` },

      { label: '签到', callback: `/签到` },
      { label: '体力', callback: `/体力` },
      { label: '今日素材', callback: `/今日素材` },

      { label: '更新面板', callback: `/更新面板` },
      { label: '绑定UID', data: `/绑定` },
      { label: '扫码绑定', callback: `/扫码绑定` },
      [
        { label: '自动签到' , link: 'https://afdian.com/a/ye3011', style: 4},
        { label: '拉窝进群' , link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=3889005294&robot_appid=102082668&biz_type=0', style: 4},
      ]
    ]
    return Bot.Button(button)
  }

  profile (e) {
    let game = ''
    if (e.game === 'sr' || e.isSr) {
        game = '星铁'
    } else if (e.game === 'zzz' || e.isSr) {
        game = '绝区零'
    }
    const maxButtons = 12
    let roleList = e?.newChar ? Object.keys(e.newChar).slice(0, maxButtons) : []
    // 普通 #面板 查询不会设置 newChar；从当前 UID 的本地面板读取实际展示的角色。
    if (!roleList.length && e?.uid) {
      try {
        const profiles = Player.create(e)?.getProfiles() || {}
        roleList = Object.entries(profiles)
          .map(([id, profile]) => profile?.char?.name || Character.get(id)?.name)
          .filter(Boolean)
          .slice(0, maxButtons)
      } catch (error) {
        logger.debug(`喵喵面板角色按钮读取失败：${error?.message || error}`)
      }
    }

    const button = []

    const list = [
      { label: `更新面板`, callback: `/${game ? game + '更新面板' : '更新面板'}`, style: 4 },
      { label: '绑定UID', data: `/${game ? game + '绑定' : '绑定'}`, style: 4 },
      { label: '扫码绑定', callback: `/扫码绑定`, style: 4 },
    ]
    button.push(...Bot.Button(list))

    const list2 = []
    for (let role of roleList)
      list2.push({ label: role, callback: `/${game ? game + '' : ''}${role}面板` })
    button.push(...Bot.Button(list2, 3))
    return button
  }

  bingUid(e) {
    let game = ''
    if (e.game === 'sr' || e.isSr) {
        game = '星铁'
    } else if (e.game === 'zzz' || e.isSr) {
        game = '绝区零'
    }
    const list = [
      [
        { label: '原神绑定UID', data: `/绑定` },
        { label: '原神切换UID', data: `/uid` },
        { label: '原神删除UID', data: `/删除uid` },
      ],[
        { label: '星铁绑定UID', data: `/星铁绑定` },
        { label: '星铁切换UID', data: `/星铁uid` },
        { label: '星铁删除UID', data: `/星铁删除uid` },
      ],[
        { label: '绝区零绑定UID', data: `/绝区零绑定` },
        { label: '绝区零切换UID', data: `/绝区零uid` },
        { label: '绝区零删除UID', data: `/绝区零删除uid` },
      ]
    ]
    const list2 = [
      { label: '更新面板', callback: `/${game ? game + '更新面板' : '更新面板'}`, style: 4 },
      { label: '扫码绑定', callback: '/扫码绑定', style: 4 }
    ]
    const button = []
    button.push(...Bot.Button(list))
    button.push(...Bot.Button(list2))
    return button
  }

  async rank (e) {
    let role = e.msg.replace(/(#|星铁|原神|喵喵|最强|最高分|第一|词条|双爆|双暴|极限|最高|最多|最牛|圣遗物|评分|群内|群|排名|排行|面板|面版|详情|榜)/g, '')
    const char = Character.get(role)
    const game = (char.game === 'sr') ? '星铁' : ''
    if (!char) {
      if (e.msg.match(/#(最强|最高分)(面板|排行)/)) {
        role = ''
      } else return false
    }
    const list = [
      [
      { label: `最强${role}排行`, callback: `/最强${role}排行`, },
      { label: `最高分${role}排行`, callback: `/最高分${role}排行`, },
      ],[
      { label: `最强${ (role == '') ? '面板' : role }`, callback: `/${game}最强${role}` },
      { label: `最高分${ (role == '') ? '面板' : role }`, callback: `/${game}最高分${role}` },
      ],[
      { label: '最强排行', callback: `/最强排行` },
      { label: '最高分排行', callback: `/最高分排行` },
      ],[
      { label: `${role}面板`, callback: `/${e.game === 'sr' ? '星铁' : ''}${role}面板`, },
      { label: `极限${role}`, callback: `/${e.game === 'sr' ? '星铁' : ''}极限${role}`, },
    ]
    ]
    return Bot.Button(list, 2)
  }

  async detail (e) {
    const char = Character.get(e.avatar)
    const game = (char.game === 'sr') ? '星铁' : ''
    if (/(详情|详细|面板)更新$/.test(e.raw_message) || (/更新/.test(e.raw_message) && /(详情|详细|面板)$/.test(e.raw_message))) {
      const button = this.profile(e)
      return button
    } else {
      if (!char.name) return false
      const button = []
      const list = [
        [
        { label: `最强${char.name}`, callback: `/${e.game === 'sr' ? '星铁' : ''}最强${char.name}`, },
        { label: `极限${char.name}`, callback: `/${e.game === 'sr' ? '星铁' : ''}极限${char.name}`, },
      ],[
        { label: `${char.name}攻略`, callback: `/${e.game === 'sr' ? '星铁' : ''}${char.name}攻略`, },
        { label: `${char.name}排行`, callback: `/${e.game === 'sr' ? '星铁' : ''}${char.name}排行`, },
      ],[
        { label: `${char.name}天赋`, callback: `/${e.game === 'sr' ? '星铁' : ''}${char.name}天赋`, },
        { label: `${char.name}命座`, callback: `/${e.game === 'sr' ? '星铁' : ''}${char.name}命座`, },
      ],[
        { label: `${char.name}面板`, callback: `/${e.game === 'sr' ? '星铁' : ''}${char.name}面板`, },
        { label: `面板更换`, data: `/${game}${char.name}面板换`, },
        //{ label: `${char.name}COS`, callback: `/${e.game === 'sr' ? '星铁' : '原神'}cos${char.name}`, },
      ],
      ]
      button.push(...Bot.Button(list, 3))
      const list2 = [
        { label: '更新面板', callback: `/${game}更新面板`, style: 4 },
        { label: '绑定UID', data: `/${game}绑定`, style: 4 },
        { label: '扫码绑定', callback: `/扫码绑定`, style: 4 },
      ]
      button.push(...Bot.Button(list2))
      return button
    }
  }

  avatarList(e) {
    const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
    const list = [
      [
        { label: '角色', callback: `/${game}角色` },
        { label: '探索', callback: `/探索` },
      ],[
        { label: '深渊', callback: `/${game}深渊` },
        { label: '武器', callback: '/武器' },
      ],[
        { label: '原石', callback: `/原石` },
        { label: '星琼', callback: `/星琼` },
      ],[
        { label: '原石统计', callback: `/原石统计` },
        { label: '星琼统计', callback: `/${game}星琼统计` },
      ],[
        { label: '扫码绑定', callback: `/扫码绑定` },
        { label: '刷新CK', callback: `/刷新ck` },
      ]
    ]
    const button = Bot.Button(list,3)
    return button
  }

  async tip (e) {
    const role = e.msg
    .replace(/(攻略|天赋|技能|行迹|命座|命之座|星魂|资料|图鉴|素材|材料|天赋)[0-9]?/, '')
    .replace(/#|星铁|原神|喵喵/g, '')
    const char = e.char || Character.get(role)
    const game = (char.game === 'sr') ? '星铁' : ''
    if (!char) return false
    let material = ''
    if (!game) {
      material = char.getMaterials()
      .find(material => material.num == 168)
    }
    const list = [

      [
        { label: `${char.name}面板`, callback: `/${game}${char.name}面板` },
        { label: `${char.name}图鉴`, callback: `/${game}${char.name}图鉴` }

      ],
      [
        { label: `${char.name}天赋`, callback: `/${game}${char.name}天赋` },
        { label: `${char.name}命座`, callback: `/${game}${char.name}命座` }
      ],
      [
        { label: `${char.name}材料`, callback: `/${game}${char.name}材料` },
        { label: `${char.name}攻略`, callback: `/${game}${char.name}攻略` }
      ]
    ]

    if (material) {
      list.push([
        { label: `${material.label}点位`, callback: `/${material.label}在哪`, style: 4 }
      ])
    }
    return Bot.Button(list)
  }
}
return Button
})()

// 来自 archive-miao.js
const Component2 = (() => {
//*需要#绑定、*绑定等指令能触发的，在本体路径\lib\plugins\loader.js文件下第365行开始改成：
//case 'text':
            //替换前置符号，适配前后空格
            //e.msg = (e.msg || '') + (val.text || '').replace(/^\s*[＃井#]+\s*/, '#').replace(/^\s*[\\*※＊]+\s*/, '*').replace(/\s*[pP]anel\s*/, '面板').replace(/\s*[rR]enew\s*/, '更新').trim()
            //适配 /uid指令
            //e.msg = e.msg.replace(/^([#*]|#星铁|#绝区零)uid ?([0-9]{0,2}) ?(绑定|删除)? ?(\S*)$/, '$1$3uid$2$4').replace(/^([#*]|#星铁|#绝区零)绑定$/, '$1绑定uid')
            //break

class Button {
    constructor () {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: 'miao',
        dsc: 'miao',
        priority: 1900,
        rule: [
            {
                reg: /^(?!.*绝区零)[#*]*([^#*]+)\s*(详细|详情|面板|面版|圣遗物|武器[1-7]|伤害([1-9]+\d*)?)\s*(\d{9})*(.*[换变改].*)?$/,
                fnc: 'miaomb'
              },
              {
                reg: /^#?(原神)?绑定uid$/,
                fnc: 'miaomb'
              },
              {
                reg: /^#星铁绑定uid$/,
                fnc: 'miaomb'
              },
              {
                reg: /^#绝区零绑定uid$/,
                fnc: 'miaomb'
              }
        ]
      }
    }
    miaomb(e) {
    let game = ''
    if (e.game === 'sr' || e.isSr) {
        game = '星铁'
    } else if (e.game === 'zzz' || e.isSr) {
        game = '绝区零'
    }
    const button = [
      [
        { label: `绑定UID`, data: `/${game ? game + '绑定' : '绑定'}` },
        { label: `切换UID`, data: `/${game ? game + 'uid' : 'uid'}` },
        { label: `删除UID`, data: `/${game ? game + '删除uid' : '删除uid'}` },
      ],[
        { label: '扫码绑定', callback: '/扫码绑定' },
        { label: '更新面板', callback: `/${game ? game + '更新面板' : '更新面板'}` },
      ]
    ]
    return Bot.Button(button)
  }
}
return Button
})()

// 来自 archive-参考面板按钮.js
const Component3 = (() => {
/**
 * 在给定的文本中搜索与别名对象中任何别名匹配的字符串
 * @param {string} text 要搜索的文本
 * @param {boolean} isSr 是否为星铁
 * @returns {Promise<string|null>} 如果找到匹配的别名，则返回该别名；否则返回 null
 */

async function findCharacter (text, isSr) {
  const game = isSr ? 'sr' : 'gs'
  for (const nickname of Meta.getAlias(game, 'char')) {
    if (text.includes(nickname)) {
      return nickname
    }
  }
  return null
}

class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "参考面板",
        dsc: "参考面板",
        priority: 1100,
        rule: [
          {
            reg: '^#?(星铁)?\\S+(参考面板|收益曲线|进阶(攻略|参考)?)$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const name = await findCharacter(e.raw_message, game)
    if (!name) return false
    let material = ''
    if (!game) {
      material = Character.get(name).getMaterials()
        .find(material => material.num == 168)
    }
      const list = [
        [
          { label: `${name}面板`, callback: `/${game}${name}面板`, style: 4 },
        ]
      ]
      if (!game) {
        list[0].push({ label: '参考面板', callback: `/${game}${name}参考面板` })
      }
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-攻略按钮.js
const Component4 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "角色攻略",
        dsc: "角色攻略",
        priority: 1130,
        rule: [
            {
              reg: "#?(火主|水主|风主|雷主|草主|岩主)?攻略$",
              fnc: 'zhujue'
            },
            {
              reg: /^(?:#|喵喵)?(?:星铁)?(.*)(攻略|功略)$/,
              fnc: 'zhujue'
            }


        ]
      }
    }

    async zhujue (e) {
      const role = e.msg.replace(/(天赋|命座|图鉴|攻略)$/, '').replace(/#/, '').trim()
      const action = e.msg.match(/天赋|命座|图鉴|攻略/)
      if (!role) {
          return false
      }
      const char = e.char || Character.get(role)
      if (!char) {
          return false
      }
      const game = (char.game === 'sr') ? '星铁' : ''
        let material = ''
      if (!game) {
         material = char.getMaterials()
         .find(material => material.num == 168)
      }
      let list = []
      if (action) {
      list = [
          [
              { label: `${game}${role}面板`, callback: `/${game}${role}面板` },
              { label: `${game}${role}攻略`, callback: `/${game}${role}攻略` },
          ],
          [
              { label: `${game}${role}天赋`, callback: `/${game}${role}天赋` },
              { label: `${game}${role}命座`, callback: `/${game}${role}命座` }
          ]
        ]
        if (material) {
          list.push([
            { label: `${game}${role}图鉴`, callback: `/${game}${role}图鉴` },
            { label: `${material.label}点位`, callback: `/${material.label}在哪` }
          ])}
    }
      return Bot.Button(list)
  }
}
return Button
})()

// 来自 archive-角色养成.js
const Component5 = (() => {
/**
 * 在给定的文本中搜索与别名对象中任何别名匹配的字符串
 * @param {string} text 要搜索的文本
 * @param {boolean} isSr 是否为星铁
 * @returns {Promise<string|null>} 如果找到匹配的别名，则返回该别名；否则返回 null
 */

async function findCharacter (text, isSr) {
  const game = isSr ? 'sr' : 'gs'
  for (const nickname of Meta.getAlias(game, 'char')) {
    if (text.includes(nickname)) {
      return nickname
    }
  }
  return null
}

class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "角色养成",
        dsc: "角色养成",
        priority: 1100,
        rule: [
          {
            reg: '^#*(星铁)?(.*)(养成|计算)([0-9]|,|，| )*$',
            fnc: 'buttonCenter'
          },
          {
            reg: '^#*(星铁)?角色(养成|计算|养成计算)$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const name = await findCharacter(e.raw_message, game)
    if (!name) return false
    let material = ''
    if (!game) {
      material = Character.get(name).getMaterials()
        .find(material => material.num == 168)
    }
      const list = [
        [
        { label: `${name}养成`, data: `/${game}${name}养成`, style: 4 },
        ],[
        { label: '更新面板', callback: `/${game}更新面板` },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-圣遗物列表按钮.js
const Component6 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "圣遗物列表",
        dsc: "圣遗物列表",
        priority: 1099,
        rule: [
          {
            reg: /^#(星铁|原神)?(圣遗物|遗器)列表\s*(\d{9,10})?$/,
            fnc: 'buttonCenter'
          },
          {
            reg: '^#面板帮助$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const list = [
        [
          { label: '更新面板', callback: `/${game}更新面板` },
          { label: '扫码绑定', callback: `/扫码绑定` },
        ],[
          { label: '绑定UID', data: `/${game}绑定` },
          { label: '切换UID', data: `/${game}uid` },
        ],[
          { label: '圣遗物列表', callback: `/圣遗物列表`, style: 4 },
        ],[
          { label: '遗器列表', callback: `/星铁遗器列表`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-最强排行按钮.js
const Component7 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "最强排行",
        dsc: "最强排行",
        priority: 1100,
        rule: [
          {
            reg: '^#(星铁)?最强排行$',
            fnc: 'buttonCenter'
          },
          {
            reg: '^#(星铁)?最高分排行$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const list = [
        [
        { label: '最强排行', callback: `/${game}最强排行` },
        { label: '最高分排行', callback: `/${game}最高分排行` },
        ],[
        { label: '更新面板', callback: `/${game}更新面板`, style: 4 },
        { label: '极限面板', callback: `/${game}极限面板`, style: 4 }
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-本体查询按钮.js
const Component8 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "探索查询",
        dsc: "探索查询",
        priority: 1100,
        rule: [
          {
            reg: /^(#(原神|星铁)?(角色|查询|查询角色|角色查询|人物)[ |0-9]*$)|(^(#*uid|#*UID)\+*[1|2|5-9][0-9]{8}$)|(^#[+|＋]*[1|2|5-9][0-9]{8})/,
            fnc: 'buttonCenter'
          },{
            reg: '^(#(星铁)(角色|查询|查询角色|角色查询|人物|卡片)[ |0-9]*$)|(^(#*(星铁)uid|#*(星铁)UID)(\\+|\\s)*([1-9]|18)[0-9]{8}$)|(^#(星铁)[\\+|＋]*([1-9]|18)[0-9]{8})',
            fnc: 'buttonCenter'
          },{
            reg: '^#(宝箱|成就|尘歌壶|家园|探索|探险|声望|探险度|探索度)[ |0-9]*$',
            fnc: 'buttonCenter'
          },
          {
            reg: '^(#原石|#*札记|#*(星铁)?星琼)([0-9]|[一二两三四五六七八九十]+)*月*$',
            fnc: 'buttonCenter'
          },{
            reg: '^#[五星|四星|5星|4星]*武器[ |0-9]*$',
            fnc: 'buttonCenter'
          },{
            reg: '^#?(原石|札记|(星铁)?星琼)统计$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const game = (e.game === 'sr' || e.isSr) ? '星铁' : ''
      const list = [
        [
          { label: '角色', callback: `/${game}角色` },
          { label: '探索', callback: `/探索` },
          { label: '深渊', callback: `/${game}深渊` },
        ],[
          { label: '原石', callback: `/原石` },
          { label: '武器', callback: `/武器` },
          { label: '星琼', callback: `/${game}星琼` },
        ],[
          { label: '原石统计', callback: `/原石统计` },
          { label: '星琼统计', callback: `/${game}星琼统计` },
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

// 来自 archive-深渊按钮.js
const Component9 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "深渊按钮",
        dsc: "深渊按钮",
        priority: 1100,
        rule: [
            {
              reg: '^#?(原神)?(喵喵)?深渊(第?.{1,2}层)?(角色)?(出场|使用)(率|统计)',
              fnc: 'buttonCenter'
            },
            {
                reg: '^#?(原神)?深渊(组队|配队|配对)',
                fnc: 'buttonCenter'
            },
            {
                reg: '^#?(原神)?(喵喵|上传|本期|上期)*(深渊|深境|深境螺旋)[ |0-9]*(数据)?',
                fnc: 'buttonCenter'
            },
            {
                reg: '^#*[上期|往期|本期]*(深渊|深境|深境螺旋)[上期|往期|本期]*[第]*(9|10|11|12|九|十|十一|十二)层[ |0-9]*$',
                fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '本期深渊', callback: `/深渊` },
          { label: '上期深渊', callback: `/上期深渊` },
        ],[
          { label: '本期12层', callback: `/深渊12层` },
          { label: '上期12层', callback: `/上期深渊12层` },
        ],[
          { label: '上传深渊', callback: `/上传深渊` },
          { label: '深渊配队', callback: `/深渊配队` },
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

// 来自 archive-进阶查询按钮.js
const Component10 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "进阶查询按钮",
        dsc: "进阶查询按钮",
        priority: 1098,
        rule: [
            {
              reg: /^#(今日|今天|每日|我的|明日)*(素材|材料|天赋)[ |0-9]*$/,
              fnc: 'buttonCenter'
            },
            {
                reg: /^(#|喵喵)+(日历|日历列表)$/,
                fnc: 'buttonCenter'
            },
            {
                reg: /^#(星铁)+(日历|日历列表)$/,
                fnc: 'buttonCenter'
            },
            {
                reg: /^#?(原神|星铁)?练度统计[ |0-9]*$/,
                fnc: 'buttonCenter'
            },
            {
                reg: /^#*(我的)*(今日|今天|明日|明天|周.*)?(五|四|5|4|星)?(技能|天赋)+(汇总|统计|列表)?[ |0-9]*$/,
                fnc: 'buttonCenter'
            },
            {
                reg: /^#(强制)?(刷新|更新)(所有|角色)*(天赋|技能)$/,
                fnc: 'buttonCenter'
            },
            {
              reg: '^#?刷新充值记录$',
              fnc: "buttonCenter",
            }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '练度统计', callback: `/练度统计` },
          { label: '星铁练度', callback: `/星铁练度统计` },
        ],[
          { label: '刷新天赋', callback: `/刷新天赋` },
          { label: '充值记录', callback: `/刷新充值记录` },
        ],[
          { label: '今日素材', callback: `/今日素材` },
          { label: '明日素材', callback: `/明日素材` },
        ],[
          { label: '原神日历', callback: `/日历` },
          { label: '星铁日历', callback: `/星铁日历` },
        ],[
          { label: '扫码绑定', callback: `/扫码绑定` },
          { label: '刷新CK', callback: `/刷新ck` },
        ]
      ]
      return Bot.Button(list)
    }
  }
return Button
})()

// 来自 archive-队伍伤害按钮.js
const Component11 = (() => {
class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'miao-plugin',
        name: "队伍伤害",
        dsc: "队伍伤害",
        priority: 1100,
        rule: [
          {
            reg: /^#队伍伤害(详情|过程|全图)?(\d+)?(.*)$/,
            fnc: 'buttonCenter'
          },
          {
            reg: '^#成就(排行|排名|查询|统计)(.*)$',
            fnc: 'buttonCenter'
          },
          {
            reg: '^#宝箱(排行|排名|查询|统计)(.*)$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '绑定UID', data: `/绑定` },
          { label: '更新面板', callback: `/更新面板` },
        ],[
          { label: '扫码绑定', callback: `/扫码绑定` },
          { label: '刷新CK', callback: `/刷新ck` },
        ],[
          { label: '队伍伤害', data: `/队伍伤害`, style: 4 },
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
    this.components = [new Component0(), new Component1(), new Component2(), new Component3(), new Component4(), new Component5(), new Component6(), new Component7(), new Component8(), new Component9(), new Component10(), new Component11()]
    this.plugin = {
      name: 'miao-plugin 按钮',
      requiredPlugin: 'miao-plugin',
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
          sourceFile: `plugins/button/${['miao-plugin.js', 'archive-miao-plugin.js', 'archive-miao.js', 'archive-参考面板按钮.js', 'archive-攻略按钮.js', 'archive-角色养成.js', 'archive-圣遗物列表按钮.js', 'archive-最强排行按钮.js', 'archive-本体查询按钮.js', 'archive-深渊按钮.js', 'archive-进阶查询按钮.js', 'archive-队伍伤害按钮.js'][componentIndex]}`
        })
        this[fnc] = async e => {
          component.e = e
          return await component[original.fnc](e)
        }
      })
    })
  }
}
