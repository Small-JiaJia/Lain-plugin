// @requiredPlugin ZZZ-Plugin


// 来自 ZZZ-Plugin.js
const Component0 = (() => {
  /** ZZZ-Plugin 专属快捷入口。 */
  class ZZZButtons {
    constructor() {
      this.plugin = {
        name: 'ZZZ 按钮',
        dsc: '为绝区零指令添加快捷入口',
        requiredPlugin: 'ZZZ-Plugin',
        priority: 460,
        rule: [{ reg: '^((#(zzz|ZZZ|绝区零))|%)(帮助|菜单|功能|命令)$', fnc: 'guide' }]
      }
    }

    guide() {
      return Bot.Button([
        { label: '签到', data: '签到' },
        { label: '体力', data: '体力' },
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
    constructor() {
      this.plugin = {
        requiredPlugin: 'ZZZ-Plugin',
        name: 'zzz-plugin',
        dsc: 'zzz-plugin',
        priority: 1095,
        rule: [
          {
            reg: `^(?:#绝区零更新面板|#绝区零面板更新|#绝区零刷新面板|#绝区零面板刷新|%更新面板)$`,
            fnc: 'profile1',
          },
          {
            reg: '^(?:#绝区零帮助|%帮助)$',
            fnc: 'help',
          },
          {
            reg: '^(?:#绝区零.+面板.*|%.+面板.*)$',
            fnc: 'handleRule',
          },
        ]
      }
    }

    async profile1(e) {
      const button = []

      const list3 = [
        { label: `更新面板`, callback: `/绝区零更新面板` },
        { label: '绑定UID', data: `/绝区零绑定` },
        { label: '扫码绑定', callback: `/扫码绑定` },
      ]
      button.push(...Bot.Button(list3))

      // 动态角色列表（随用户面板数据/插件更新变化），不再依赖 global.zzzroleList
      const roleList = await this.getRoleList(e)
      const safeRoleList = Array.isArray(roleList) ? roleList : []
      const list1 = []
      for (const role of safeRoleList) {
        list1.push({ label: role, callback: `/绝区零${role}面板` })
        if (list1.length === 12) {
          break // 最多 12 个角色按钮
        }
      }
      if (list1.length) button.push(...Bot.Button(list1, 3))
      return button
    }

    /**
     * 动态获取角色列表：
     * 1. 优先通过 ZZZ-Plugin 注册的 zzz.tool.panelList handler 获取当前用户展柜里的角色
     *    （与插件自带 lain.support.js 同款逻辑，随用户面板数据变化）
     * 2. 拿不到时回退读取 ZZZ-Plugin/defSet/alias.yaml 的全角色表
     *    （顶层 key 即全部角色标准名，新角色在前，随插件更新自动增减）
     */
    async getRoleList(e) {
      try {
        const uid = await this.getZzzUid(e)
        if (uid) {
          const handler = e?.runtime?.handler
          if (handler?.has?.('zzz.tool.panelList')) {
            const panelData = await handler.call('zzz.tool.panelList', uid, false)
            if (Array.isArray(panelData)) {
              const names = panelData.map(item => item?.name_mi18n || '').filter(Boolean)
              if (names.length) return names
            }
          }
        }
      } catch (error) {
        logger.debug(`[ZZZ按钮] 获取用户展柜角色失败，回退全角色表: ${error?.message || error}`)
      }
      try {
        const fs = (await import('node:fs')).default
        const { fileURLToPath } = await import('node:url')
        const yaml = (await import('yaml')).default
        // 相对按钮文件自身定位 ZZZ-Plugin 的别名表（不依赖进程启动目录）
        // plugins/Lain-plugin/plugins/button/ → plugins/ZZZ-Plugin/defSet/alias.yaml
        const file = fileURLToPath(new URL('../../../ZZZ-Plugin/defSet/alias.yaml', import.meta.url))
        const data = yaml.parse(fs.readFileSync(file, 'utf8'))
        if (data && typeof data === 'object') return Object.keys(data)
      } catch (error) {
        logger.debug(`[ZZZ按钮] 读取 alias.yaml 失败: ${error?.message || error}`)
      }
      return []
    }

    /** 获取当前用户绑定的绝区零 uid（复用 ZZZ-Plugin 同款 miao 用户系统） */
    async getZzzUid(e) {
      try {
        const NoteUser = (await import('../../../genshin/model/mys/NoteUser.js')).default
        const user = await NoteUser.create(e)
        return user?.getUid('zzz') || ''
      } catch {
        return ''
      }
    }

    handleRule(e) {
      const command = String(e?.qqbot_button_command || e?.msg || '').trim()
      const charName = command
        .replace(/^(?:#绝区零|%)/, '')
        .replace(/面板.*$/, '')
        .trim()

      const button = []
      const list = [
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
          { label: `${charName}攻略`, callback: `/绝区零${charName}攻略` },
        ], [
          { label: `绝区零帮助`, callback: `/绝区零帮助` },
        ]
      ]
      button.push(...Bot.Button(list2))
      return button
    }

    help() {
      const button = [
        [
          { label: '签到', callback: `/签到` },
          { label: '体力', callback: `/体力` },
          { label: '深渊', callback: `/绝区零深渊` },
        ], [
          { label: '个人信息', callback: `/绝区零个人信息` },
          { label: '练度统计', callback: `/绝区零练度统计` },
          { label: '上期深渊', callback: `/绝区零上期深渊` },
        ], [
          { label: '更新面板', callback: `/绝区零更新面板` },
          { label: `绑定UID`, data: `/绝区零绑定` },
          { label: '扫码绑定', callback: `/扫码绑定` },
        ], [
          { label: '更新抽卡记录', callback: `/绝区零更新抽卡记录` },
        ], [
          { label: '填满呐呐', link: 'https://afdian.com/a/ye3011' },
          { label: '反馈群聊', link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=dGwUMbO9IBj9TPGmGLmZ1HMBw5b6zaTK&authKey=e9KIcoWA2QVtQ2N0%2BBIzF3DzyR7JoSwSZkNPkXc4aI6nKzO%2Bl9KAmd%2FQ5ZXtMB4b&noverify=0&group_code=692425673' },
        ]
      ]
      return Bot.Button(button)
    }
  }
  return Button
})()

/** 每个上游插件只加载一个扩展文件，原组件的匹配优先级保存在每条规则上。 */
export default class MergedButtons {
  constructor() {
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
