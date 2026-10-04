/** auto-plugin 自动化插件专属快捷入口。 */
export default class AutoPluginButtons {
  constructor () {
    this.plugin = {
      name: '自动化插件按钮',
      dsc: '为自动化帮助页添加任务入口',
      requiredPlugin: 'auto-plugin',
      priority: 480,
      rule: [{ reg: '^#自动化帮助$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '指令表', data: '#指令表' },
      { label: '任务表', data: '#任务表' },
      { label: '批量启动任务', data: '#批量启动任务' }
    ])
  }
}
