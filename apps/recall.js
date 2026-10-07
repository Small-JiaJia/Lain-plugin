import { getRecallReference, recallMessage } from '../lib/common/recall.js'

/** 引用撤回与发送后撤回共用所有适配器的 ICQQ 兼容接口。 */
export class RecallTest extends plugin {
  constructor () {
    super({
      name: '撤回测试',
      dsc: '引用消息撤回，或发送一条测试消息再撤回',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: /^#(?:(?:QQBot)?测试撤回|(?:QQBot)?撤回测试|引用撤回|撤回)$/i,
          fnc: 'recall'
        }
      ]
    })
  }

  async recall (e) {
    const isTest = /测试/.test(String(e.msg || e.raw_message || ''))
    let reference = getRecallReference(e)
    if (!reference && !isTest) {
      return await e.reply('请先引用一条机器人发送的消息，再发送 #撤回；也可以发送 #测试撤回。')
    }

    try {
      if (!reference) {
        reference = await e.reply('这是一条撤回测试消息。')
        if (!reference) throw new Error('测试消息发送失败，未返回消息信息')
      }
      const count = await recallMessage(e, reference)
      return await e.reply(`撤回成功：已撤回 ${count} 条${isTest ? '测试或引用' : '引用'}消息。`)
    } catch (error) {
      return await e.reply(`撤回失败：${error?.message || String(error)}`)
    }
  }
}
