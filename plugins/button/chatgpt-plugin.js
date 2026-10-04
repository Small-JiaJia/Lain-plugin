/** ChatGPT-Plugin 专属快捷入口。 */
export default class ChatGPTButtons {
  constructor () {
    this.plugin = {
      name: 'ChatGPT 按钮',
      dsc: '为 ChatGPT 帮助页添加功能入口',
      requiredPlugin: 'chatgpt-plugin',
      priority: 490,
      rule: [{ reg: '^#(chatgpt|ChatGPT)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$', fnc: 'help' }]
    }
  }

  help () {
    return Bot.Button([
      { label: '聊天指令表', data: '#chatgpt指令表' },
      { label: '模式帮助', data: '#chatgpt模式帮助' },
      { label: '人物设定帮助', data: '#chatgpt设定帮助' },
      { label: '语音服务', data: '#chatgpt语音服务' }
    ])
  }
}
