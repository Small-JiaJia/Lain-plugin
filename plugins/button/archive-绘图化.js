// @requiredPlugin AIhuitu
export default class Button {
    constructor() {
      this.plugin = {
      requiredPlugin: 'AIhuitu',
        name: "figurine",
        dsc: "AIhuitu",
        priority: 1000,
        rule: [
  { reg: "^#?手办化6\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?手办化5\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?手办化4\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?手办化3\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?手办化2\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?手办化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?Q版化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?痛屋化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?痛车化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?cos化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?cos自拍\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?吃柠檬\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?女友化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?涩涩化\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?个签\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#?圣诞礼盒\\s*.*$", fnc: "makeFigurine" },
  { reg: "^#bnn\\s*([\\s\\S]+)$", fnc: "makeBnn" },
  { reg: "^#?(绘图化|手办化)帮助$", fnc: "showHelp" }
        ]
      }
    }

    async makeFigurine(e) {
      const list = [
        [
          { label: '我也要画', data: `/绘图化帮助`, style: 1 },
        ]
      ]
      return Bot.Button(list)
    }

    async makeBnn(e) {
      const list = [
        [
          { label: '我也要画', data: `/`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }

    async showHelp(e) {
      const list = [
        [
          { label: '我也要画', data: `/`, style: 4 },
          { label: '绘图化帮助', data: `/绘图化帮助`, style: 4 },
        ]
      ]
      return Bot.Button(list)
    }
}
