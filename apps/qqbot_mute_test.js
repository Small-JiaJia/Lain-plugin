import QQBotIdMap from '../model/qqbot-id-map.js'

/** 手动验证 QQBot 群成员禁言：在群内发送 #禁言测试 并 @ 一名成员。 */
export class qqbotMuteTest extends plugin {
  constructor () {
    super({
      name: 'QQBot 禁言测试',
      dsc: '获取被 @ 的群成员并默认禁言 60 秒',
      event: 'message',
      priority: 200,
      rule: [{
        reg: /^#(?:qqbot)?禁言测试(?:\s+\d+(?:秒|s)?)?$/i,
        fnc: 'run',
        permission: 'master'
      }]
    })
  }

  async run (e) {
    const bot = this.getQQBot(e)
    if (!bot) return await e.reply('该命令仅支持 QQBot。')
    if (e.message_type !== 'group' || !(e.group_openid || e.group_id)) {
      return await e.reply('请在 QQBot 群聊中使用此测试命令。')
    }

    const target = this.getMentionedMember(e)
    if (!target) return await e.reply('请 @ 一名群成员，例如：#禁言测试 @某人')

    const duration = this.getDuration(e)
    try {
      await bot.setGroupMemberMute(e.group_openid || e.group_id, target, duration)
      return await e.reply(`禁言测试成功：已将 ${target} 禁言 ${duration} 秒。`)
    } catch (error) {
      return await e.reply(`禁言测试失败：${error?.message || error}`)
    }
  }

  getQQBot (e) {
    const candidates = [
      e.bot,
      e.bot?.qqbot_bot,
      e.qqbot_bot,
      Bot[e.self_id],
      Bot[e.qqbot_self_id],
      Bot[e.qqbot_appid]
    ].filter(Boolean)
    const isQQBotMarker = value => value === 'QQBot' || value?.id === 'QQBot' || value?.name === 'QQBot'
    const isQQBotEvent = Boolean(
      e.qqbot_self_id ||
      e.qqbot_appid ||
      isQQBotMarker(e.adapter) ||
      isQQBotMarker(e.bot?.adapter) ||
      isQQBotMarker(e.bot?.qqbot_bot?.adapter)
    )
    return isQQBotEvent
      ? candidates.find(bot => typeof bot?.setGroupMemberMute === 'function')
      : undefined
  }

  getDuration (e) {
    const text = String(e.msg || e.raw_message || '')
    const match = text.match(/^#(?:qqbot)?禁言测试(?:\s+(\d+)(?:秒|s)?)?$/i)
    const duration = Number(match?.[1] || 60)
    return Number.isInteger(duration) && duration > 0 ? duration : 60
  }

  getMentionedMember (e) {
    const selfIds = new Set([
      e.self_id,
      e.tiny_id,
      e.data?.self_id,
      e.bot?.uin,
      e.bot?.tiny_id,
      e.bot?.config?.appid
    ].map(id => this.cleanId(id)).filter(Boolean))

    const mentions = QQBotIdMap.getAtList(e, 'qqbot')
    const target = [...mentions, ...(e.at ? [{ id: e.at }] : [])].find(item => {
      const id = String(item?.id || '').trim()
      if (!id || /^(?:all|everyone)$/i.test(id)) return false
      return !selfIds.has(this.cleanId(id, selfIds))
    })
    return target?.id ? String(target.id).trim() : ''
  }

  cleanId (id, selfIds = new Set()) {
    let value = String(id || '').trim().replace(/^qg_/, '')
    for (const selfId of selfIds) {
      if (value.startsWith(`${selfId}-`)) value = value.slice(selfId.length + 1)
    }
    return value
  }
}
