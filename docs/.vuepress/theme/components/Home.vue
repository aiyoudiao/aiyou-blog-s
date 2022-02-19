<template>
  <div class="home-wrapper">
    <!-- banner块 s -->
    <!-- <div class="banner" :class="{ 'hide-banner': !hideBanner || !showBanner }" :style="bannerBgStyle"> -->
    <div class="banner" :class="{ 'hide-banner': !hideBanner || !showBanner }">
      <canvas
        style="
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: -1;
        "
        id="canvas"
        >Your browser can not support canvas</canvas
      >

      <div class="content">
        <div class="home-header">
          <router-link class="link" to="/">
            <img
              class="home-logo"
              src="https://p3-passport.byteacctimg.com/img/user-avatar/794fdae4ff249d532da19a3c26d420ed~300x300.image"
              alt="aiyoudiao logo"
            />
          </router-link>
        </div>
        <div class="home-body">
          <div class="list">
            <router-link class="link" to="/articles"> 文章 </router-link>
            <router-link target="_blank" class="link" to="/project">
              项目
            </router-link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="link"
              href="https://github.com/aiyoudiao"
            >
              github
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="link"
              href="https://juejin.cn/user/3562073406845768"
            >
              掘金
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="link"
              href="http://www.hao6.website:999/#/"
            >
              作品
            </a>
          </div>
          <div class="introduce">前端码二，冲💪。技术爽文，发射🚀！！！</div>
        </div>
      </div>
    </div>
    <!-- banner块 e -->

    <MainLayout>
      <template #mainLeft>
        <!-- 简约版文章列表 -->
        <UpdateArticle
          class="card-box"
          v-if="homeData.postList === 'simple'"
          :length="5"
        />

        <!-- 详情版文章列表 -->
        <template
          v-else-if="!homeData.postList || homeData.postList === 'detailed'"
        >
          <PostList :currentPage="currentPage" :perPage="perPage" />
          <Pagination
            :total="total"
            :perPage="perPage"
            :currentPage="currentPage"
            @getCurrentPage="handlePagination"
            v-show="Math.ceil(total / perPage) > 1"
          />
        </template>

        <Content class="theme-vdoing-content custom card-box" />
      </template>

      <template #mainRight>
        <BloggerBar v-if="$themeConfig.blogger" />
        <CategoriesBar
          v-if="
            $themeConfig.category !== false &&
            $categoriesAndTags.categories.length
          "
          :categoriesData="$categoriesAndTags.categories"
          :length="10"
        />
        <TagsBar
          v-if="$themeConfig.tag !== false && $categoriesAndTags.tags.length"
          :tagsData="$categoriesAndTags.tags"
          :length="30"
        />
      </template>
    </MainLayout>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import MainLayout from "@theme/components/MainLayout";
import PostList from "@theme/components/PostList";
import UpdateArticle from "@theme/components/UpdateArticle";
import Pagination from "@theme/components/Pagination";
import BloggerBar from "@theme/components/BloggerBar";
import CategoriesBar from "@theme/components/CategoriesBar";
import TagsBar from "@theme/components/TagsBar";

import { isMobile } from "mobile-device-detect";

const MOBILE_DESKTOP_BREAKPOINT = 720; // refer to config.styl

BScroll.use(Slide);

export default {
  components: {
    NavLink,
    MainLayout,
    PostList,
    UpdateArticle,
    BloggerBar,
    CategoriesBar,
    TagsBar,
    Pagination,
  },
  data() {
    return {
      isMQMobile: false,

      slide: null,
      currentPageIndex: 0,
      playTimer: 0,
      mark: 0,

      gridBackground:
        "background: rgb(40,40,40) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)",

      total: 0, // 总长
      perPage: 10, // 每页长
      currentPage: 1, // 当前页
    };
  },
  computed: {
    /**
     * 如果是手机才显示banner
     */
    hideBanner() {
      return this.homeData.bannerShow || isMobile;
    },
    showBanner() {
      // 当分页不在第一页时隐藏banner栏
      return this.$route.query.p &&
        this.$route.query.p != 1 &&
        (!this.homeData.postList || this.homeData.postList === "detailed")
        ? false
        : true;
    },
    bannerBgStyle() {
      let bannerBg = this.homeData.bannerBg;
      if (!bannerBg || bannerBg === "auto") {
        // 默认
        if (this.$themeConfig.bodyBgImg) {
          // 当有bodyBgImg时，不显示背景
          return "";
        } else {
          // 网格纹背景
          return this.gridBackground;
        }
      } else if (bannerBg === "none") {
        // 无背景
        if (this.$themeConfig.bodyBgImg) {
          return "";
        } else {
          return "background: var(--mainBg);color: var(--textColor)";
        }
      } else if (bannerBg.indexOf("background") > -1) {
        // 自定义背景样式
        return bannerBg;
      } else if (bannerBg.indexOf(".") > -1) {
        // 大图
        return `background: url(${this.$withBase(
          bannerBg
        )}) center center / cover no-repeat`;
      }
    },
    homeData() {
      return {
        ...this.$page.frontmatter,
      };
    },
    actionLink() {
      return {
        link: this.homeData.actionLink,
        text: this.homeData.actionText,
      };
    },
  },
  watch: {
    "$route.query.p"() {
      if (!this.$route.query.p) {
        this.currentPage = 1;
      } else {
        this.currentPage = Number(this.$route.query.p);
      }

      if (this.currentPage === 1 && this.isMQMobile) {
        setTimeout(() => {
          this.slide && this.slide.destroy();
          this.init();
        }, 0);
      }
    },
  },
  created() {
    this.total = this.$sortPosts.length;
  },
  beforeMount() {
    this.isMQMobile =
      window.innerWidth < MOBILE_DESKTOP_BREAKPOINT ? true : false; // vupress在打包时不能在beforeCreate(),created()访问浏览器api（如window）
  },
  mounted() {
    // 先来一个流星背景
    showStar();

    if (this.$route.query.p) {
      this.currentPage = Number(this.$route.query.p);
    }

    if (this.isMQMobile && (!this.$route.query.p || this.$route.query.p == 1)) {
      this.init();
    }

    window.addEventListener("resize", () => {
      this.isMQMobile =
        window.innerWidth < MOBILE_DESKTOP_BREAKPOINT ? true : false;
      if (this.isMQMobile && !this.slide && !this.mark) {
        this.mark++;
        setTimeout(() => {
          this.init();
        }, 60);
      }
    });
    this.modeObserver();
  },
  beforeDestroy() {
    clearTimeout(this.playTimer);
    this.slide && this.slide.destroy();
  },
  methods: {
    init() {
      clearTimeout(this.playTimer);
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true, // x轴滚动
        scrollY: false, // y轴滚动
        slide: {
          loop: true,
          threshold: 100,
        },
        useTransition: true, // 使用css3 transition动画
        momentum: false,
        bounce: false, // 回弹
        stopPropagation: false, // 是否阻止事件冒泡
        probeType: 2,
        preventDefault: false,
      });

      // user touches the slide area
      this.slide.on("beforeScrollStart", () => {
        clearTimeout(this.playTimer);
      });
      // user touched the slide done
      this.slide.on("scrollEnd", () => {
        this.autoGoNext();
      });
      this.slide.on("slideWillChange", (page) => {
        this.currentPageIndex = page.pageX;
      });
      this.autoGoNext();
    },
    autoGoNext() {
      clearTimeout(this.playTimer);
      this.playTimer = setTimeout(() => {
        this.slide.next();
      }, 4000);
    },
    /**
     * 观察body的class名，来判断是夜间模式还是别的
     */
    modeObserver() {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByTagName("body")[0];

      // 观察器的配置（需要观察什么变动）
      const config = { attributes: true, childList: false, subtree: false };

      // 当观察到变动时执行的回调函数
      const callback = (mutationsList, observer) => {
        let color =
          "theme-mode-dark" === mutationsList[0].target.classList[0]
            ? true
            : false;
        if (color) {
          console.info("darkdark");
          this.gridBackground =
            "background: rgb(60,60,60) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)";
        } else {
          this.gridBackground =
            "background: rgb(40,40,40) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVFhH7c6xCQAgDAVRR9A6E4hLu4uLiWJ7tSnuQcIvr2TRYsw3/zOGGEOMIcYQY4gxxBhiDDGGGEOMIcYQY4gxxBhiDLkx52W4Gn1tuslCtHJvL54AAAAASUVORK5CYII=)";
        }
      };

      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback);

      // 以上述配置开始观察目标节点
      observer.observe(targetNode, config);

      // 组件销毁之后，可停止观察
      this.$once("hook:beforeDestroy", () => observer.disconnect());
    },
    handlePagination(i) {
      // 分页
      this.currentPage = i;
    },
    getScrollTop() {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      );
    },
  },
};

function showStar() {
  var doublePI = Math.PI * 2;

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var cx, cy;
  var starCanvas;
  var alphaChangeProbability = new AlphaChangeProbability();

  //色相
  var hue = 217;
  //星空背景颜色
  var bgColor = "hsl(" + hue + ", 60%, 5%)";

  //画布的外切圆半径
  var canvasRadius;
  //每旋转一圈要需要的帧数
  var radianStepCount;
  //星星的总个数
  var starCount;
  //群星
  var stars;

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    canvasRadius =
      Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2;
    radianStepCount = canvasRadius * 100;
    starCount = parseInt((canvas.width + canvas.height) * 0.5);
    stars = [];
    for (var i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
    //初始时要先绘制一层背景,否则第一波星星走过的路径会有画布底料涂抹不均匀的感觉
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    loop();
  }
  function init() {
    createStarCanvas();

    window.addEventListener("resize", onResize);
    onResize();
    // loop();
  }

  //在[min, max)范围内随机一个整数
  function randomInt(min, max) {
    if (arguments.length === 1) {
      max = min;
      min = 0;
    } else if (min > max) {
      var tmp = max;
      max = min;
      min = tmp;
    }
    return Math.floor(Math.random() * (max - min) + min);
  }

  //透明度改变的概率
  function AlphaChangeProbability() {
    //透明度改变的步长
    var alphaStep = 0.05;

    //透明度增加
    var plus = 1;
    //透明度减少
    var minus = 1;
    //透明度不变
    var invariant = 8;

    //总概率
    var totalChance = plus + minus + invariant;

    //获取随机的透明度改变值
    function getRandomChangeValue() {
      var value = Math.random() * totalChance;
      if (value < plus) {
        return alphaStep;
      }
      value -= plus;
      if (value < minus) {
        return -alphaStep;
      }
      return 0;
    }

    //随机改变alpha的值
    this.randomChangeAlpha = function (alpha) {
      alpha += getRandomChangeValue();
      if (alpha > 1) {
        alpha = 1;
      } else if (alpha < 0) {
        alpha = 0;
      }
      return alpha;
    };
  }

  //创建星星图片
  function createStarCanvas() {
    starCanvas = document.createElement("canvas");
    var ctx = starCanvas.getContext("2d");
    starCanvas.width = 100;
    starCanvas.height = 100;
    var cx = starCanvas.width / 2;
    var cy = starCanvas.height / 2;
    var radius = Math.max(cx, cy);
    var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0.025, "#CCC");
    gradient.addColorStop(0.1, "hsl(" + hue + ", 65%, 35%)");
    gradient.addColorStop(0.25, bgColor);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, doublePI);
    ctx.fill();
  }

  //星体对象
  var Star = function () {
    //星体运行的轨道半径
    this.orbitRadius = Math.random() * canvasRadius;
    //星体的半径
    this.radius = randomInt(60, this.orbitRadius) / 8;
    //星体透明度
    this.alpha = Math.random();
    //相对轨道中心(即画布中心)的角度
    this.theta = Math.random() * doublePI;
    //角速度
    this.speed = (Math.random() * this.orbitRadius) / radianStepCount;

    //获取当前坐标
    this.getPos = function () {
      return {
        x: cx + this.orbitRadius * Math.cos(this.theta),
        y: cy + this.orbitRadius * Math.sin(this.theta),
      };
    };
  };

  Star.prototype.update = function () {
    this.alpha = alphaChangeProbability.randomChangeAlpha(this.alpha);
    this.theta += this.speed;
    this.pos = this.getPos();
  };

  Star.prototype.draw = function () {
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(starCanvas, this.pos.x, this.pos.y, this.radius, this.radius);
  };

  function loop() {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }
    //绘制星体图样
    // ctx.globalCompositeOperation = "source-over";
    // ctx.globalAlpha = 1;
    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    // ctx.drawImage(starCanvas, 0, 0, starCanvas.width, starCanvas.height);
    // requestAnimationFrame(loop);
  }

  init();
}
</script>

<style lang="stylus" scoped>
.home-wrapper {
  .banner {
    width: 100%;
    min-height: 450px;
    margin-top: $navbarHeight;
    color: $bannerTextColor;
    position: relative;
    overflow: hidden;

    .banner-conent {
      max-width: $homePageWidth;
      margin: 0px auto;
      position: relative;
      z-index: 1;
      overflow: hidden;

      .hero {
        text-align: center;
        margin-top: 3rem;

        img {
          max-width: 100%;
          max-height: 240px;
          display: block;
          margin: 2rem auto 1.5rem;
        }

        h1 {
          margin: 0;
          font-size: 3.2rem;
        }

        .description, .action {
          margin: 1.5rem auto;
        }

        .description {
          max-width: 40rem;
          font-size: 1.1rem;
          line-height: 1.3;
          opacity: 0.9;
        }

        .action-button {
          display: inline-block;
          font-size: 1.2rem;
          background-color: $accentColor;
          padding: 0.8rem 1.6rem;
          border-radius: 4px;
          transition: background-color 0.1s ease;
          box-sizing: border-box;
          border-bottom: 1px solid darken($accentColor, 10%);
          color: #fff;

          &:hover {
            background-color: lighten($accentColor, 10%);
          }
        }
      }

      // pc端features
      .features {
        padding: 2rem 0;
        margin-top: 2.5rem;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: stretch;
        justify-content: space-between;
      }

      .feature {
        flex-grow: 1;
        flex-basis: 30%;
        max-width: 30%;
        text-align: center;

        a {
          // color lighten($bannerTextColor,10%)
          color: inherit;

          .feature-img {
            width: 10rem;
            height: 10rem;
            animation: heart 1.2s ease-in-out 0s infinite alternate;
            animation-play-state: paused;
          }

          h2 {
            font-weight: 500;
            font-size: 1.3rem;
            border-bottom: none;
            padding-bottom: 0;
          }

          p {
            opacity: 0.8;
            padding: 0 0.8rem;
          }
        }
      }

      .feature:hover {
        .feature-img {
          animation-play-state: running;
        }

        h2, p {
          color: $accentColor;
        }
      }
    }

    // 移动端滑动图标
    .slide-banner {
      margin-top: 2rem;

      .banner-wrapper {
        position: relative;
      }

      .slide-banner-scroll {
        min-height: 1px;
        overflow: hidden;
      }

      .slide-banner-wrapper {
        height: 300px;

        .slide-item {
          display: inline-block;
          height: 300px;
          width: 100%;
          text-align: center;

          a {
            // color lighten($bannerTextColor,10%)
            color: inherit;

            .feature-img {
              width: 10rem;
              height: 10rem;
            }

            h2 {
              font-size: 1.1rem;
              font-weight: 500;
              border-bottom: none;
              padding-bottom: 0;
            }

            p {
              opacity: 0.8;
              padding: 0 0.8rem;
            }
          }
        }
      }

      .docs-wrapper {
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);

        .doc {
          display: inline-block;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--textColor);
          opacity: 0.9;

          &.active {
            opacity: 0.5;
          }
        }
      }
    }
  }

  // 分页不在第一页时，隐藏banner栏
  .main-wrapper {
    margin-top: 2rem;
  }

  .banner.hide-banner {
    display: none;

    & + .main-wrapper {
      margin-top: ($navbarHeight + 0.9rem);
    }
  }

  .main-wrapper {
    .main-left {
      .card-box {
        margin-bottom: 0.9rem;
      }

      .pagination {
        margin-bottom: 4rem;
      }

      .theme-vdoing-content {
        padding: 0 2rem;
        overflow: hidden;

        &>:first-child {
          padding-top: 2rem;
        }

        &>:last-child {
          padding-bottom: 2rem;
        }
      }
    }
  }
}

@keyframes heart {
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(0, 8px);
  }
}

// 1025px以下
@media (max-width: 1025px) {
  .home-wrapper {
    .banner {
      .banner-conent {
        .hero {
          h1 {
            font-size: 2.5rem;
          }

          .description {
            font-size: 1rem;
          }
        }

        .feature {
          a {
            h2 {
              font-size: 1.1rem;
            }

            .feature-img {
              width: 9rem;
              height: 9rem;
            }
          }
        }
      }
    }
  }
}

// 719px以下
@media (max-width: $MQMobile) {
  .home-wrapper {
    .banner {
      .banner-conent {
        .features {
          display: none !important;
        }
      }
    }
  }
}

// 419px以下
@media (max-width: $MQMobileNarrow) {
  .home-wrapper {
    .banner-conent {
      padding-left: 1.5rem;
      padding-right: 1.5rem;

      .hero {
        img {
          max-height: 210px;
          margin: 2rem auto 1.2rem;
        }

        h1 {
          font-size: 2rem;
        }

        h1, .description, .action {
          margin: 1.2rem auto;
        }

        .description {
          font-size: 1.2rem;
        }

        .action-button {
          font-size: 1rem;
          padding: 0.6rem 1.2rem;
        }
      }

      .feature {
        h2 {
          font-size: 1.25rem;
        }
      }
    }
  }
}

.content {
  transform: scale3d(1,1,1);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  font-size: 20px;
  text-align: center;
  padding-top: 3%;

  .home-logo {
    transform: rotate(0deg) scale(1, 1);
    width: 160px;
    border-radius: 50%;
    animation: mylogo 3s;
    -moz-animation: mylogo 3s; /* Firefox */
    -webkit-animation: mylogo 3s; /* Safari and Chrome */
    -o-animation: mylogo 3s; /* Opera */
    animation-iteration-count: infinite;
  }

  .home-header {
    .link {
      display: block;
    }
  }

  .home-body {
    padding-top: 20px;

    .list {
      .link {
        display: inline-block;
        padding: 20px;
        color: #409eff;
        min-width: 80px;
      }

      .link:hover {
        color: rgb(155, 35, 35);
      }
    }
  }

  .introduce {
    padding-top: 20px;
    color: #fff;
  }

  @keyframes mylogo {
    0% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }

    25% {
      transform: rotate(0deg) scale(1, 1);
      opacity: 0.8;
    }

    100% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }
  }

  @keyframes mylogo {
    0% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }

    25% {
      transform: rotate(0deg) scale(1, 1);
      opacity: 0.8;
    }

    100% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }
  }

  @keyframes mylogo {
    0% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }

    25% {
      transform: rotate(0deg) scale(1, 1);
      opacity: 0.8;
    }

    100% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }
  }

  @keyframes mylogo {
    0% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }

    25% {
      transform: rotate(0deg) scale(1, 1);
      opacity: 0.8;
    }

    100% {
      transform: rotate(0deg) scale(0.8, 0.8);
      opacity: 1;
    }
  }
}
</style>
