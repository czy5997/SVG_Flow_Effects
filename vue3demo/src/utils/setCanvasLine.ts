import SvgPath from 'svg-path-to-canvas'

type point = {
  x: number
  y: number
  color: string
  allLine: []
  ballCount?: number
}
type circle = {
  x: number
  y: number
  r: number // 半径
  angle: number // 角度
  direction: number // 大于0是顺时针，反之逆时针
}
type svgInfo = {
  canvas: SVGElement
  color: string
}
let animeId = NaN
export class svgFlow {
  ctx: CanvasRenderingContext2D
  w: number
  h: number
  svgDoms: svgInfo[]
  constructor(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    svgDoms: svgInfo[]
  ) {
    this.ctx = ctx
    this.w = w
    this.svgDoms = svgDoms
    this.h = h
  }
  public setCanvasAnime() {
    svgToCanvasLine(this.ctx, this.svgDoms, this.w, this.h)
  }
  public stopAnimeAndClear() {
    // console.log(animeId)
    window.cancelAnimationFrame(animeId)
    this.ctx.clearRect(0, 0, this.w, this.h)
  }
}
export function svgToCanvasLine(
  ctx: CanvasRenderingContext2D,
  svgDoms: svgInfo[],
  canvasW: number,
  canvasH: number
) {
  const ballLine = []
  // const mainDom = document.getElementById('home')
  // const containRect = mainDom.getBoundingClientRect()
  svgDoms.forEach((svgDom: svgInfo, i: number) => {
    // console.log(svgDom)
    // 需要画图的svg图形
    // return
    const path = svgDom.canvas.getElementsByTagName('path')[0]
    const svgPosition = svgDom.canvas.getBoundingClientRect()

    const offectX = svgPosition.x
    const offecty = svgPosition.y
    // 获取path便签的d属性
    const svgD = path.getAttribute('d')
    // 计算path标签的所在位置
    const svgDarr = svgD.split(' ')
    const allLine = []
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(255,165,0,0)'
    const newSvgD = svgDarr.join(' ')
    const line = new SvgPath(newSvgD)

    const lineLenth = line.getTotalLength()
    let ballCount = 40
    const stepNum = lineLenth > 100 ? 2 : 1
    if (lineLenth > 200) {
      ballCount = 50
    } else if (lineLenth < 200 && lineLenth > 100) {
      ballCount = 40
    } else if (lineLenth < 100 && lineLenth > 50) {
      ballCount = 30
    } else {
      ballCount = 20
    }
    for (let i = 0; i <= lineLenth; i += stepNum) {
      const point = line.getPointAtLength(i) as any
      // console.log(point)
      allLine.push({ x: point[0] + offectX, y: point[1] + offecty })
    }
    // console.log(line.getTotalLength())
    const canvasPath = new Path2D(newSvgD)
    // if (i === 0) {
    //   console.log(newSvgD)
    //   console.log(path)
    //   console.log(rect)
    // }
    ctx.stroke(canvasPath)
    ballLine.push({ allLine, color: svgDom.color, ballCount })
  })
  // console.log(ballLine)
  drawAnime(ctx, ballLine, canvasW, canvasH)
}

function drawAnime(
  ctx: CanvasRenderingContext2D,
  ballLine: point[],
  canvasW: number,
  canvasH: number
) {
  const balls = []
  ballLine.forEach((ball: point) => {
    balls.push({
      ballCount: ball.ballCount,
      bubbleNumber: 0,
      time: 0,
      bubbles: [
        {
          a: 1, //透明度
          s: 1, //圆尺寸
          x: 1, //圆心X坐标
          y: 1, //圆心Y坐标
        },
      ],
      color: ball.color,
      allLine: ball.allLine,
    })
  })
  function draw() {
    balls.forEach((b: any) => {
      b.bubbleNumber++
      b.time++
      //以下代码将绘制彗星
      //首先，如果彗星数组元素超过50，则移除最早加进来的坐标，保持彗星长度为50
      if (b.bubbleNumber > b.ballCount) {
        b.bubbles.shift()
      }
      //更新当前彗星数组中的透明度和圆尺寸定义
      // 让小球慢慢变大
      for (let i = 0; i < b.bubbles.length; i++) {
        b.bubbles[i].a = (i + 1) * 0.05
        b.bubbles[i].s = (i + 1) * 0.03
      }
      //  每一帧 获取当前的贝塞尔曲线坐标
      const x = b.allLine[b.time].x
      const y = b.allLine[b.time].y
      const newB = {
        a: 0.3, //透明度
        s: 1, //圆尺寸
        x, //圆心X坐标
        y, //圆心Y坐标
        color: b.color,
      }
      //将取到的下一个彗星头部
      b.bubbles.push(newB)
      for (let j = 0; j < b.bubbles.length; j++) {
        const currentB = b.bubbles[j]
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = currentB.a // 值是0-1,0代表完全透明，1代表完全不透明
        ctx.fillStyle = b.bubbles[j].color
        ctx.arc(currentB.x, currentB.y, currentB.s * 1.6, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.restore()
      }
      //若彗星移动到了路径末尾则从头开始
      // if (time === bezierPoint.length - 1) {
      //   time = 0
      // }

      if (b.time === b.allLine.length - 1) {
        b.time = 0
      }
    })
    animeId = window.requestAnimationFrame(draw)
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.restore()
  }
  draw()
}
