/** achievements-plugin 专属快捷入口。 */
export default class AchievementsButtons {
  constructor () {
    this.plugin = {
      name: '成就按钮',
      dsc: '为成就查询结果添加成就工具入口',
      requiredPlugin: 'achievements-plugin',
      priority: 470,
      rule: [{ reg: '^#成就(查询|搜索|查找|查漏|统计|重置|重新配置|清空)', fnc: 'achievement' }]
    }
  }

  achievement () {
    return Bot.Button([
      { label: '成就查询', data: '#成就查询食神' },
      { label: '成就查漏', data: '#成就查漏' },
      { label: '成就统计', data: '#成就统计' }
    ])
  }
}
