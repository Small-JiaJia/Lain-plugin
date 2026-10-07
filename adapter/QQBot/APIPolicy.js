/** 官方标注仅白名单/内邀可用的接口（2026-10-07 核对 API v2 文档）。 */
export const restrictedAPIs = [
  ['GET', '/v2/groups/{group_openid}/info'],
  ['GET', '/v2/groups/{group_openid}/bot_state'],
  ['GET', '/v2/groups/{group_openid}/members'],
  ['GET', '/v2/groups/{group_openid}/members/{member_openid}'],
  ['POST', '/v2/groups/{group_openid}/batch_remove_members'],
  ['GET', '/v2/groups/{group_openid}/member_blacklist'],
  ['POST', '/v2/groups/{group_openid}/member_blacklist']
].map(([method, path]) => ({
  method,
  path,
  pattern: new RegExp('^' + path.replace(/\{[^}]+\}/g, '[^/]+') + '/?$')
}))

function getAPI (method, path) {
  const pathname = String(path || '').replace(/^https?:\/\/[^/]+/i, '').split('?')[0]
  return restrictedAPIs.find(api => api.method === String(method).toUpperCase() && api.pattern.test(pathname))
}

function safeMessage (value) {
  return String(value ?? '').replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/((?:access_token|token|secret|authorization)\s*[=:]\s*)[^\s&,;]+/gi, '$1[redacted]')
    .slice(0, 500)
}

/** 只保存错误码、文字和追踪 ID；不记录请求体、凭据或响应中的用户资料。 */
export function normalizeRestrictedAPIError (sdk, error, { method = 'GET', path = '' } = {}) {
  if (error?.qqbot_api_error) return error
  const api = getAPI(method, path)
  if (!api) return error
  const body = error?.response?.data || {}
  const code = Number(body.code ?? error?.code ?? String(error?.message || '').match(/code\((\d+)\)/)?.[1])
  const message = safeMessage(body.message || body.msg || error?.message || error)
    .replace(String(path), api.path)
  const noAccess = code === 11253 || /(?:白名单|whitelist|应用无接口访问权限)/i.test(message)
  const wrapped = new Error(noAccess
    ? `账户不在接口白名单内，无法使用该功能（${api.method} ${api.path}）`
    : `QQBot 接口调用失败（${api.method} ${api.path}）：${message}`, { cause: error })
  wrapped.qqbot_api_error = true
  wrapped.qqbot_whitelist_denied = noAccess
  wrapped.qqbot_api = api.path
  if (Number.isFinite(code)) wrapped.code = code
  const sample = {
    appid: String(sdk?.config?.appid || ''),
    method: api.method,
    api: api.path,
    status: error?.response?.status,
    code: Number.isFinite(code) ? code : undefined,
    message,
    trace_id: safeMessage(body.trace_id || error?.response?.headers?.['x-tps-trace-id'] || '')
  }
  const key = `${api.method}:${api.path}:${sample.code ?? sample.status ?? message}`
  sdk.qqbotAPIFailureSamples ||= new Map()
  const previous = sdk.qqbotAPIFailureSamples.get(key) || 0
  // 同一机器人、接口与错误一分钟留样一次，避免每条群消息都输出相同错误。
  if (Date.now() - previous >= 60000) {
    sdk.qqbotAPIFailureSamples.set(key, Date.now())
    globalThis.logger?.warn?.(`[QQBot 白名单接口异常留样] ${JSON.stringify(sample)}`)
  }
  return wrapped
}

/**
 * 保护 SDK 中的白名单接口调用；普通接口保持原有异常行为。
 * 可选请求显式传 { qqbotOptional: true }，失败返回 data:null 与错误信息。
 * 默认视为功能必需接口，拒绝 Promise，让插件将错误回复给用户。
 */
export function installQQBotAPIPolicy (sdk) {
  const request = sdk?.request
  if (!request || request._lainAPIPolicy) return
  Object.defineProperty(request, '_lainAPIPolicy', { value: true })
  for (const method of ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'request']) {
    if (typeof request[method] !== 'function') continue
    const original = request[method].bind(request)
    request[method] = async (...args) => {
      const config = method === 'request' ? (typeof args[0] === 'string' ? { ...args[1], url: args[0] } : args[0]) :
        ['post', 'put', 'patch'].includes(method) ? args[2] : args[1]
      const path = method === 'request' ? config?.url : args[0]
      const verb = method === 'request' ? config?.method || 'GET' : method
      if (!getAPI(verb, path)) return await original(...args)
      try {
        const response = await original(...args)
        // 有的网关用 HTTP 200 携带业务错误；不能把它当作成功或空数据。
        if (response?.data?.code != null && Number(response.data.code) !== 0) {
          throw Object.assign(new Error(response.data.message || response.data.msg || '接口返回异常响应'), { response })
        }
        return response
      } catch (error) {
        const wrapped = normalizeRestrictedAPIError(sdk, error, { method: verb, path })
        if (config?.qqbotOptional === true) return { data: null, qqbot_api_error: wrapped }
        throw wrapped
      }
    }
  }
}
