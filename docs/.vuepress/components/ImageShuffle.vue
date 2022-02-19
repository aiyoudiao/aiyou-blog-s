<template>
  <div class="image-shuffle">
    <div class="action">
      <button @click="add">
        <span v-show="adding">下载中……</span>
        <span v-show="!adding">追加图片</span>
      </button>
      <button @click="shuffle">乱序图片</button>
      <button @click="reset">重置</button>
    </div>

    <div v-if="loading" class="loading">正在加载图片……</div>

    <div v-else class="wrap">
      <div v-for="src in imgs" :key="src" class="img-wrap">
        <img ref="imgs" class="img" :src="src" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageShuffle',
  data() {
    return {
      adding: false,
      loading: false,
      getSister: getSisterGenerator(),
      imgs: [],
      imgHeights: [],
      imgsLoaded: false,
      leftImgIndexes: [],
      rightImgIndexes: [],
    }
  },
  async mounted() {
    this.loading = true
    const imgs = this.getSister()
    await preload(imgs)
    this.imgs = imgs
    this.loading = false
  },
  methods: {
    /**
     * 追加图片
     */
    async add() {
      if (this.adding) {
        return
      }

      this.adding = true
      const newData = this.getSister()
      await preload(newData)
      this.adding = false

      this.scheduleAnimation(() => {
        this.imgs = newData.concat(this.imgs)
      })
    },
    /**
     * 乱序图片
     */
    shuffle() {
      this.scheduleAnimation(() => {
        // 打乱顺序
        this.imgs = shuffle(this.imgs)
      })
    },
    scheduleAnimation(update) {
      // 浅拷贝img dom 数组
      const prevImgs = this.$refs.imgs.slice()
      /**
       * 利用reduce 生成一个对象 乱序之前的照片保存之前的位置
       * {
       *  'url1': {
       *    img: DOM,
       *    left: number,
       *    top: number,
       *  },
       *  'url2': {
       *     img: DOM,
       *     left: number,
       *     top: number,
       *   }
       * }
       */
      const prevSrcRectMap = this.createSrcRectMap(prevImgs)
      console.info('prevSrcRectMap', prevSrcRectMap)
      // 更新数据
      update()
      // DOM更新后
      this.$nextTick(() => {
        const currentSrcRectMap = this.createSrcRectMap(prevImgs)
        console.info('createSrcRectMap', currentSrcRectMap)

        Object.keys(prevSrcRectMap).forEach(src => {
          const currentRect = currentSrcRectMap[src]
          const prevRect = prevSrcRectMap[src]

          const invert = {
            left: prevRect.left - currentRect.left,
            top: prevRect.top - currentRect.top,
          }

          const keyframes = [
            {
              transform: `translate(${invert.left}px, ${invert.top}px)`,
            },
            { transform: 'translate(0, 0)' },
          ]
          const options = {
            duration: 300,
            easing: 'cubic-bezier(0,0,0.32,1)',
          }

          const animation = currentRect.img.animate(keyframes, options)
          console.info(animation)
        })
      })
    },
    /**
     * 重置
     */
    reset() {
      this.getSister = getSisterGenerator()
      this.imgs = this.getSister()
    },
    createSrcRectMap(imgs) {
      return imgs.reduce((prev, img) => {
        const rect = img.getBoundingClientRect()
        const { left, top } = rect
        prev[img.src] = { left, top, img }
        return prev
      }, {})
    },
  },
}

const SISTERS = [
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-09eefac19ac282684f60a202aa9abb2c_r.jpg',
  'https://pic2.zhimg.com/v2-37860484a1a73257178e95267c7db641_r.jpg',
  'https://pic2.zhimg.com/v2-7fc30291c807d07d2d26c5a8ffdd3b89_r.jpg',
  'https://pic4.zhimg.com/v2-02efe89495be4f68f6b7b6c510da36cf_r.jpg',
  'https://pic4.zhimg.com/v2-aeadbc3d02af2631e3a7acd0dc72b01b_r.jpg',
  'https://pic3.zhimg.com/v2-a71fad6a1fee2614ad95a4bae0376eb6_r.jpg',
  'https://pic3.zhimg.com/v2-861f71f28e361237003aa1c88188f326_r.jpg',
  'https://pic4.zhimg.com/v2-525c8002eb619387e7a31f67169f8a2b_r.jpg',
  'https://pic4.zhimg.com/v2-0dcbcf5a48a97afab7439e09af65c98f_r.jpg',
  'https://pic1.zhimg.com/v2-d640737ff5eac65fe30375f324512d00_r.jpg',
  'https://pic1.zhimg.com/v2-6e92b4576b93302ad5fe04c7e95e375c_r.jpg',
  'https://pic1.zhimg.com/v2-5e4a1221996179cbacc5d7450d25f908_r.jpg',
  'https://pic3.zhimg.com/v2-7f58a7d6e8b1ed3f653a96ae9d6e1e2e_r.jpg',
  'https://pic4.zhimg.com/v2-fb767fd3f56591a3c4b2b4089c47776f_r.jpg',
  'https://pic2.zhimg.com/v2-6b9847e11d3a8cac8ac0ef52bffd9af5_r.jpg',
  'https://pic2.zhimg.com/v2-6f2119f99200fc61abc246eea36f25b1_r.jpg',
  'https://pic4.zhimg.com/v2-2103acaf025ceda331a0dd59022443ab_r.jpg',
  'https://pic2.zhimg.com/v2-edc1b118c420939c545b1449344139b5_r.jpg',
  'https://pic2.zhimg.com/v2-d94530f491f23c61659ef458ac8a9db5_r.jpg',
  'https://pic2.zhimg.com/v2-ff15820a9c1cb8e2bb0af1048ea81145_r.jpg',
  'https://pic4.zhimg.com/v2-a8fb0a1d8581e4bfce905791271711c7_r.jpg',
  'https://pic2.zhimg.com/v2-1008cd2c72129809cc348cdc04310475_r.jpg',
]

// 初始大小
const initialSize = 8
// 随机数组
const randomSize = [1, 2, 3, 4]

const getSisterGenerator = () => {
  const source = SISTERS.slice()
  let initial = true
  return () => {
    if (initial) {
      initial = false
      return source.splice(0, initialSize)
    }
    const size = getRandomInt(0, randomSize.length - 1)
    return source.splice(0, randomSize[size])
  }
}

const preload = imgs => {
  return new Promise(resolve => {
    if (!imgs.length) {
      resolve()
    }
    const length = imgs.length
    let count = 0

    const load = src => {
      const img = new Image()
      const checkIfFinished = () => {
        count++
        if (count === length) {
          resolve()
        }
      }

      img.onload = checkIfFinished
      img.onerror = checkIfFinished

      img.src = src
    }
    imgs.forEach(load)
  })
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 打乱图片数组
 * @param {Array} oldDomList DOM数组
 * @return {Array} 返回一个打乱后的DOM数组
 */
const shuffle = oldDomList => {
  let newDomList = oldDomList.slice()
  for (let i = 0; i < newDomList.length; i++) {
    let j = getRandomInt(0, i)
    // 交换位置
    let t = newDomList[i]
    newDomList[i] = newDomList[j]
    newDomList[j] = t
  }
  return newDomList
}
</script>

<style lang="stylus" scoped>
.image-shuffle {
  flex-direction: column;
  max-width: 500px;
  margin: auto;

  .action {
    justify-content: space-evenly;
    margin: 12px;
  }

  .action button {
    margin-right: 8px;
  }

  .link {
    display: block;
    padding: 8px;
    text-align: center;
    color: red;
  }

  .loading {
    margin: 12px;
    text-align: center;
  }

  .wrap {
    display: flex;
    flex-wrap: wrap;
    column-count: 4;

    .img-wrap {
      width: 25%;
      padding: 8px;

      .img {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        object-fit: cover;
      }
    }
  }

  .move {
    transition: transform 1s;
  }
}
</style>
