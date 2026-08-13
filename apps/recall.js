import plugin from '../../lib/plugins/plugin.js'

/** 引用一条机器人发送的消息后发送 #撤回，用于测试各适配器的撤回能力。 */
export class RecallTest extends plugin {
  constructor () {
    super({
      name: '撤回测试',
      dsc: '引用消息后发送 #撤回，撤回被引用的消息',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: /^#撤回$/,
          fnc: 'recall'
        }
      ]
    })
  }

  /** 从云崽标准 source 或原始 reply 消息段取得被引用消息的 ID。 */
  getReferencedMessageId (e) {
    const source = e.source || {}
    const sourceId = source.message_id ?? source.id ?? source.seq ?? source.time
    if (sourceId !== undefined && sourceId !== null && String(sourceId).trim()) return String(sourceId)

    const reply = Array.isArray(e.message)
      ? e.message.find(item => item?.type === 'reply')
      : undefined
    const replyId = reply?.id ?? reply?.data?.id
    return replyId === undefined || replyId === null || !String(replyId).trim()
      ? undefined
      : String(replyId)
  }

  async recall (e) {
    const messageId = this.getReferencedMessageId(e)
    if (!messageId) {
      return await e.reply('请先引用一条机器人发送的消息，再发送 #撤回。', true)
    }

    try {
      if (e.group_id) {
        const group = e.group || e.bot?.pickGroup?.(e.group_id)
        if (typeof group?.recallMsg !== 'function') throw new Error('当前适配器不支持撤回群消息')
        await group.recallMsg(messageId)
      } else {
        const friend = e.friend || e.bot?.pickFriend?.(e.user_id)
        if (typeof friend?.recallMsg !== 'function') throw new Error('当前适配器不支持撤回私聊消息')
        await friend.recallMsg(messageId)
      }
    } catch (error) {
      const detail = error?.message || String(error)
      return await e.reply(`撤回失败（消息 ID：${messageId}）：${detail}`, true)
    }

    return await e.reply(`已请求撤回引用消息（消息 ID：${messageId}）。`, true)
  }
}
