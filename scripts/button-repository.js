import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const buttonRepositoryURL = 'https://github.com/win-syswow64/Lain-plugin-button.git'
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const stamp = () => `${Date.now()}-${process.pid}`
const backupRoot = root => path.join(root, 'data/button-backups')
const pendingFile = root => path.join(root, 'data/button-migration.json')

/** 旧版本升级前备份完整按钮目录，清理本体曾跟踪的按钮改动。 */
export function prepareButtonUpdate (root = defaultRoot) {
  const tracked = git(root, ['ls-files', '-z', '--', 'plugins/button']).split('\0').filter(Boolean)
  if (!tracked.length || fs.existsSync(pendingFile(root))) return null
  const button = path.join(root, 'plugins/button')
  if (!fs.existsSync(button)) return null
  const backup = path.join(backupRoot(root), `before-update-${stamp()}`)
  fs.mkdirSync(path.dirname(backup), { recursive: true })
  fs.cpSync(button, backup, { recursive: true })
  fs.writeFileSync(`${backup}.staged.patch`, git(root, ['diff', '--cached', '--binary', '--', 'plugins/button']))
  fs.writeFileSync(pendingFile(root), JSON.stringify({ backup }))
  // 只还原本体跟踪的按钮文件，用户内容完整保存在 backup 中。
  // 使用旧版 Git 也支持的命令，兼容测试服务器上的 Git。
  git(root, ['reset', 'HEAD', '--', 'plugins/button'])
  git(root, ['checkout', '--', 'plugins/button'])
  return backup
}

/** 已有独立仓库不覆盖；首次安装从随插件分发的 Git bundle 初始化。 */
export function ensureButtonRepository (root = defaultRoot) {
  const button = path.join(root, 'plugins/button')
  const pending = pendingFile(root)
  if (fs.existsSync(pending)) {
    const { backup } = JSON.parse(fs.readFileSync(pending, 'utf8'))
    const safeBase = path.resolve(backupRoot(root)) + path.sep
    if (!path.resolve(backup).startsWith(safeBase) || !fs.existsSync(backup)) {
      throw new Error('按钮迁移备份无效，保留迁移记录以便恢复')
    }
    if (fs.existsSync(button)) {
      fs.renameSync(button, path.join(backupRoot(root), `after-update-${stamp()}`))
    }
    fs.cpSync(backup, button, { recursive: true })
  }
  if (fs.existsSync(path.join(button, '.git'))) {
    fs.mkdirSync(path.join(button, 'example'), { recursive: true })
    if (fs.existsSync(pending)) fs.unlinkSync(pending)
    return button
  }
  const bundle = path.join(root, 'resources/button.bundle')
  if (!fs.existsSync(bundle)) throw new Error('缺少 resources/button.bundle，无法初始化独立按钮仓库')
  const staging = path.join(root, 'temp', `button-clone-${stamp()}`)
  fs.mkdirSync(path.dirname(staging), { recursive: true })
  git(root, ['clone', '--quiet', bundle, staging])
  // bundle 是离线种子；后续 pull 使用独立按钮远程。
  git(staging, ['remote', 'set-url', 'origin', buttonRepositoryURL])
  const seedIgnore = fs.readFileSync(path.join(staging, '.gitignore'), 'utf8')
  try {
    if (fs.existsSync(button)) {
      if (!fs.lstatSync(button).isDirectory()) throw new Error('plugins/button 必须是目录')
      fs.cpSync(button, staging, { recursive: true })
      const oldIgnore = fs.readFileSync(path.join(staging, '.gitignore'), 'utf8')
      if (oldIgnore !== seedIgnore) fs.writeFileSync(path.join(staging, '.gitignore'), `${oldIgnore}\n${seedIgnore}`)
      const backup = path.join(backupRoot(root), `before-init-${stamp()}`)
      fs.mkdirSync(path.dirname(backup), { recursive: true })
      fs.renameSync(button, backup)
    }
    fs.mkdirSync(path.dirname(button), { recursive: true })
    fs.renameSync(staging, button)
    if (fs.existsSync(pending)) fs.unlinkSync(pending)
    return button
  } catch (error) {
    // staging 和已有备份保留，避免初始化失败时丢失自定义文件。
    throw new Error(`初始化按钮仓库失败：${error.message}；暂存目录 ${staging}`, { cause: error })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--prepare-update')) console.log(`按钮备份：${prepareButtonUpdate() || '无需迁移'}`)
  else console.log(`独立按钮仓库：${ensureButtonRepository()}`)
}
