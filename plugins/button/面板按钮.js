/**
 * 面板按钮插件（miao-plugin Button.create 风格）
 *
 * 演示 Button.create() 2D 数组用法
 * 仅匹配示例命令，避免抢占 miao-plugin 的 #面板角色按钮。
 */
export default class PanelButton {
  constructor () {
    this.plugin = {
      name: '面板按钮',
      dsc: '演示 Button.create() 的用法',
      priority: 300,
      rule: [
        {
          reg: '^#面板按钮示例$',
          fnc: 'panelButtons'
        }
      ]
    }
  }

  panelButtons (e) {
    return Bot.Button.create([
      [
        { text: '更新面板', data: '#更新面板' },
        { text: '角色列表', data: '#角色列表' }
      ],
      [
        { text: '面板帮助', data: '#面板帮助' },
        { text: '米游社', link: 'https://bbs.mihoyo.com' }
      ]
    ])
  }
}
