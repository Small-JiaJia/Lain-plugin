// @requiredPlugin games-template-plugin-zolay-liulian
export default class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'games-template-plugin-zolay-liulian',
        name: "小游戏",
        dsc: "小游戏",
        priority: 1000,
        rule: [
          {
            reg: '^#?小游戏$',
            fnc: 'buttonCenter'
          }
        ]
      }
    }
    async buttonCenter(e){
      const list = [
        [
          { label: '修仙', callback: '/修仙', style: 4 },
          { label: '扫雷', callback: '/扫雷', style: 4 },
        ],[
          { label: '小掌机' , link: 'https://wxurl.cn/U0T'},
          { label: '小霸王' , link: 'http://yx.1dly.cn/'},
        ]
    ]
    return Bot.Button(list)
  }
}