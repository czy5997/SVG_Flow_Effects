<template>
  <div class="main-bg" id="home">
    <div class="svg-list">
      <!-- 圆形 -->
      <svg class="circle" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 95 100 m -75 0 a 75 75 0 1 0 150 0 a 75 75 0 1 0 -150 0"
          fill="none"
          stroke="white"
          stroke-width="2"
        />
        stroke="white" stroke-width="2" fill="transparent" />
      </svg>
      <!-- 曲线 -->
      <svg class="bessel" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
          stroke="white"
          stroke-width="2"
          fill="transparent"
        />
      </svg>

      <!-- 折线 -->
      <svg class="fold">
        <path
          d="M10 10, L200 200, V50 , H10, L10 10"
          stroke="white"
          stroke-width="2"
          fill="transparent"
        />
      </svg>
      <!-- 五角星 -->
      <svg>
        <path
          d="M100 10L40 180 190 60 10 60 160 180z"
          stroke="white"
          stroke-width="2"
          fill="transparent"
        />
      </svg>
      <!-- 不规则形状 -->
      <svg xmlns="http://www.w3.org/2000/svg">
        <path
          class="path"
          fill="transparent"
          stroke="white"
          stroke-width="3"
          d="M66.039,133.545c0,0-21-57,18-67s49-4,65,8
s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
C46.039,146.545,53.039,128.545,66.039,133.545z"
        />
      </svg>
    </div>
  </div>
  <canvas id="canvas"></canvas>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { svgFlow } from './utils/setCanvasLine'
let canvas = null
let drawFlow = null
// import HelloWorld from './components/HelloWorld.vue'
onMounted(() => {
  nextTick(() => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement
    beginCanvas()
  })
})
function beginCanvas() {
  const ctx = canvas.getContext('2d')
  const allSvg = document.getElementsByTagName('svg')
  // console.log(allSvg)
  const svgs = []

  for (let i = 0; i < allSvg.length; i++) {
    svgs.push({
      canvas: allSvg[i],
      color: 'red',
    })
  }

  canvas.width = document.getElementById('home').scrollWidth
  canvas.height = document.getElementById('home').scrollHeight
  // console.log(canvas.clientWidth, canvas.clientHeight)
  drawFlow = new svgFlow(ctx, canvas.clientWidth, canvas.clientHeight, svgs)
  drawFlow.setCanvasAnime()
  // console.log(allSvg)
}
</script>
<style scoped>
.main-bg {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #272d3a;
}
.svg-list {
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  width: 100%;
  height: 100%;
  z-index: 11;
  position: relative;
}
svg {
  height: 350px;
  width: 350px;
  /* position: absolute; */
}
/* .bessel {
  left: 200px;
}
.fold {
  left: 400px;
} */
#canvas {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 12;
}
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
