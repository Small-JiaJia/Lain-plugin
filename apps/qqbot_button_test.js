/** 手动验证 QQBot 回调按钮：发送 #回调按钮测试，然后点击底部按钮。 */
export class qqbotButtonTest extends plugin {
  constructor () {
    super({
      name: 'QQBot 回调按钮测试',
      dsc: '验证来自扩展按钮文件的回调能回到消息插件',
      event: 'message',
      priority: 200,
      rule: [{ reg: /^#回调按钮测试(?: 已点击)?$/, fnc: 'run' }]
    })
  }

  async run (e) {
    const isQQBot = e.bot?.adapter === 'QQBot' || e.qqbot_event_type || e.sub_type === 'callback'
    if (!isQQBot) return false
    const clicked = String(e.msg || e.raw_message || '').includes('已点击')
    return await this.reply(clicked ? '回调按钮测试成功' : '请点击下方的「测试回调 +1」按钮')
  }
}
