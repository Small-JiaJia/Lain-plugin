import fs from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginRoot = path.resolve(__dirname, '../..')
import chokidar from 'chokidar'
import { ensureButtonRepository } from '../../scripts/button-repository.js'

class Button {
  constructor () {
    this.plugin = pluginRoot + '/plugins'
    this.botModules = []
    this.buttonWatcher = null
    this.buttonParentWatcher = null
    this.buttonReloading = new Map()
    this.initialize()
  }

  /** 加载按钮 */
  async loadModule (filePath) {
    filePath = filePath.replace(/\\/g, '/')
    try {
      const absPath = path.resolve(pluginRoot, filePath)
      // 含静态 import 的扩展必须先检查依赖，否则缺插件时 import 已经报错。
      const header = fs.readFileSync(absPath, 'utf8').slice(0, 2048)
      const required = header.match(/^\/\/ @requiredPlugin ([\w-]+)$/m)?.[1]
      if (required && !this.isPluginInstalled(required)) {
        logger.debug(`按钮模块 ${filePath} 依赖的插件未安装，跳过加载：${required}`)
        return
      }
      const fileUrl = pathToFileURL(absPath)
      fileUrl.searchParams.set('t', String(Date.now()) + Math.random().toString(36).slice(2))
      const mod = await import(fileUrl.href)
      const PluginClass = mod.default
      if (typeof PluginClass !== 'function') {
        logger.error(`导入按钮模块 ${filePath} 时出错：default export 不是构造函数 (类型: ${typeof PluginClass})`)
        return
      }
      const instance = new PluginClass()
      if (!instance.plugin || !Array.isArray(instance.plugin.rule) || !Number.isFinite(Number(instance.plugin.priority))) {
        logger.error(`按钮模块 ${filePath} 格式错误：需要 plugin.rule 数组和数字 priority`)
        return
      }
      for (const rule of instance.plugin.rule) {
        if (!rule || typeof instance[rule.fnc] !== 'function') {
          logger.error(`按钮模块 ${filePath} 格式错误：规则 fnc 没有对应方法`)
          return
        }
      }
      const requiredPlugins = instance.plugin?.requiredPlugin
        ? (Array.isArray(instance.plugin.requiredPlugin) ? instance.plugin.requiredPlugin : [instance.plugin.requiredPlugin])
        : []
      const missingPlugins = requiredPlugins.filter(pluginName => !this.isPluginInstalled(pluginName))
      if (missingPlugins.length) {
        logger.debug(`按钮模块 ${filePath} 依赖的插件未安装，跳过加载：${missingPlugins.join(', ')}`)
        return
      }
      instance.plugin._path = filePath
      this.botModules.push(instance)
      /** 排序 */
      this.botModules.sort((a, b) => a.plugin.priority - b.plugin.priority)
      logger.debug(`按钮模块 ${filePath} 已加载。`)
      return true
    } catch (error) {
      logger.error(`导入按钮模块 ${filePath} 时出错：${error.message}`)
    }
  }

  /** 检查 Yunzai/plugins 下的可选按钮依赖是否存在。 */
  isPluginInstalled (pluginName) {
    if (typeof pluginName !== 'string' || !pluginName.trim()) return false
    const yunzaiPluginRoot = path.resolve(pluginRoot, '..')
    const pluginPath = path.resolve(yunzaiPluginRoot, pluginName)
    if (!pluginPath.startsWith(yunzaiPluginRoot + path.sep)) return false
    try {
      return fs.statSync(pluginPath).isDirectory()
    } catch {
      return false
    }
  }

  /** 卸载指定文件路径的模块 */
  unloadModule (filePath) {
    const index = this.botModules.findIndex(module => module.plugin._path === filePath)
    if (index !== -1) this.botModules.splice(index, 1)
    /** 排序 */
    this.botModules.sort((a, b) => a.plugin.priority - b.plugin.priority)
  }

  /**
   * 处理文件变化事件
   * @param {string} filePath - 文件路径
   * @param {string} eventType - 事件类型 ('add', 'change', 'unlink')
   */
  async handleFileChange (filePath, eventType, state) {
    filePath = filePath.replace(/\\/g, '/')
    if (filePath.endsWith('.js')) {
      if (eventType === 'add') {
        this.unloadModule(filePath)
        const loaded = await this.loadModule(filePath)
        if (!state && loaded) logger.mark(`[Lain-plugin][新增按钮插件][${filePath}]`)
      } else if (eventType === 'change') {
        this.unloadModule(filePath)
        if (await this.loadModule(filePath)) logger.mark(`[Lain-plugin][修改按钮插件][${filePath}]`)
      } else if (eventType === 'unlink') {
        this.unloadModule(filePath)
        logger.mark(`[Lain-plugin][卸载按钮插件][${filePath}]`)
      }
    }
  }

  /** 初始化 */
  async initialize () {
    try {
      ensureButtonRepository(pluginRoot)
      const filesList = []
      /** 遍历插件目录 */
      const List = fs.readdirSync(this.plugin)
      for (let folder of List) {
        const folderPath = this.plugin + `/${folder}`
        /** 检查是否为文件夹 */
        if (!fs.lstatSync(folderPath).isDirectory()) continue
        /** 保存插件包目录 */
        filesList.push(this.plugin + `/${folder}/lain.support.js`)
      }

      /** 热更新 */
      filesList.map(folder => {
        let state = true
        const watcher = chokidar.watch(folder, { ignored: /[\/\\]\./, persistent: true })
        watcher
          .on('add', async filePath => {
            await this.handleFileChange(filePath, 'add', state)
            if (state) state = false
          })
          .on('change', async filePath => await this.handleFileChange(filePath, 'change'))
          .on('unlink', async filePath => await this.handleFileChange(filePath, 'unlink'))

        return watcher
      })

      // button 目录可能在启动后才创建；父目录 watcher 负责发现它，目录 watcher
      // 负责文件新增、修改和删除。路径统一转换为 plugins/button/<file>，避免
      // Windows 下 chokidar 返回反斜杠路径导致 unload/load 使用的 key 不一致。
      await this.watchButtonDirectory()
      this.watchButtonDirectoryParent()

      return this.botModules
    } catch (error) {
      logger.error(`读取插件目录时出错：${error.message}`)
    }
  }

  normalizeFilePath (filePath) {
    return String(filePath || '').replace(/\\/g, '/')
  }

  samePath (left, right) {
    return path.resolve(left) === path.resolve(right)
  }

  /** 加载顶层扩展，以及 example 下任意层级的自定义扩展。 */
  getButtonRelativePath (filePath) {
    const buttonDir = path.resolve(this.plugin, 'button')
    const normalized = this.normalizeFilePath(filePath)
    const absolute = path.isAbsolute(normalized)
      ? path.resolve(normalized)
      : path.resolve(pluginRoot, normalized)
    const relative = path.relative(buttonDir, absolute)
    if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return ''
    const parts = relative.split(path.sep)
    if (parts.some(part => part.startsWith('.') || part === 'node_modules')) return ''
    if ((parts.length > 1 && parts[0] !== 'example') || !relative.toLowerCase().endsWith('.js')) return ''
    return `plugins/button/${this.normalizeFilePath(relative)}`
  }

  /** 串行处理同一个文件的快速连续 change 事件，避免旧模块覆盖新模块。 */
  async reloadButtonFile (filePath, eventType) {
    const relPath = this.getButtonRelativePath(filePath)
    if (!relPath) return false

    const previous = this.buttonReloading.get(relPath) || Promise.resolve()
    const task = previous.catch(() => {}).then(async () => {
      if (eventType === 'unlink') {
        this.unloadModule(relPath)
        logger.mark(`[Lain-plugin][卸载按钮插件][${relPath}]`)
        return true
      }

      this.unloadModule(relPath)
      const loaded = await this.loadModule(relPath)
      if (loaded) {
        const label = eventType === 'add' ? '新增' : '热更新'
        logger.mark(`[Lain-plugin][${label}按钮插件][${relPath}]`)
      }
      return !!loaded
    })
    this.buttonReloading.set(relPath, task)

    try {
      return await task
    } catch (error) {
      logger.error(`[Lain-plugin][按钮插件${eventType}失败][${relPath}] ${error?.stack || error}`)
      return false
    } finally {
      if (this.buttonReloading.get(relPath) === task) this.buttonReloading.delete(relPath)
    }
  }

  async watchButtonDirectory (buttonDir = path.resolve(this.plugin, 'button')) {
    if (this.buttonWatcher || !fs.existsSync(buttonDir)) return false

    try {
      if (!fs.statSync(buttonDir).isDirectory()) return false
    } catch {
      return false
    }

    const btnFiles = fs.readdirSync(buttonDir).filter(file => file.toLowerCase().endsWith('.js'))
    for (const file of btnFiles) {
      await this.reloadButtonFile(path.join(buttonDir, file), 'add')
    }
    const scanExample = async directory => {
      if (!fs.existsSync(directory)) return
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        const file = path.join(directory, entry.name)
        if (entry.isDirectory()) await scanExample(file)
        else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) await this.reloadButtonFile(file, 'add')
      }
    }
    await scanExample(path.join(buttonDir, 'example'))

    this.buttonWatcher = chokidar.watch(buttonDir, {
      ignored: /(?:[\/\\]\.|[\/\\]node_modules(?:[\/\\]|$))/,
      persistent: true,
      ignoreInitial: true
    })
      .on('add', filePath => this.reloadButtonFile(filePath, 'add'))
      .on('change', filePath => this.reloadButtonFile(filePath, 'change'))
      .on('unlink', filePath => this.reloadButtonFile(filePath, 'unlink'))
      .on('unlinkDir', filePath => {
        if (this.samePath(filePath, buttonDir)) {
          this.buttonWatcher?.close()
          this.buttonWatcher = null
        }
      })
      .on('error', error => logger.error(`[Lain-plugin][按钮目录监听失败] ${error?.message || error}`))

    return true
  }

  watchButtonDirectoryParent () {
    if (this.buttonParentWatcher) return
    const buttonDir = path.resolve(this.plugin, 'button')
    this.buttonParentWatcher = chokidar.watch(this.plugin, {
      ignored: /[\/\\]\./,
      persistent: true,
      ignoreInitial: true,
      depth: 1
    })
      .on('addDir', filePath => {
        if (this.samePath(filePath, buttonDir)) {
          this.watchButtonDirectory(buttonDir).catch(error => {
            logger.error(`[Lain-plugin][按钮目录加载失败] ${error?.stack || error}`)
          })
        }
      })
      .on('unlinkDir', filePath => {
        if (this.samePath(filePath, buttonDir)) {
          this.buttonWatcher?.close()
          this.buttonWatcher = null
        }
      })
      .on('error', error => logger.error(`[Lain-plugin][按钮父目录监听失败] ${error?.message || error}`))
  }
}

const plugin = new Button()
export default plugin.botModules
