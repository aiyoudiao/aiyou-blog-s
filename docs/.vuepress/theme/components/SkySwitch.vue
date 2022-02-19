<script>
import storage from 'good-storage' // 本地存储

export default {
  name: 'SkySwitch',
  data() {
    return {
      modeSwitch: false,
    }
  },
  watch: {
    modeSwitch: {
      handler(newValue) {
        this.$refs['toggle'].checked = newValue
      },
    },
  },
  created() {
    this.modeSwitch = storage.get('mode') === 'dark' ? true : false
  },
  mounted() {
    this.modeObserver()
  },
  methods: {
    switch() {
      this.modeSwitch = !this.modeSwitch
      const themeMode = this.modeSwitch ? 'dark' : 'light'
      this.$emit('toggle-theme-mode', themeMode)
      document.body.className = 'theme-mode-' + themeMode
    },
    /**
     * 观察body的class名，来判断是夜间模式还是别的
     */
    modeObserver() {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByTagName('body')[0]

      // 观察器的配置（需要观察什么变动）
      const config = { attributes: true, childList: false, subtree: false }

      // 当观察到变动时执行的回调函数
      const callback = (mutationsList, observer) => {
        this.modeSwitch = 'theme-mode-dark' === mutationsList[0].target.classList[0] ? true : false
      }

      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback)

      // 以上述配置开始观察目标节点
      observer.observe(targetNode, config)

      // 组件销毁之后，可停止观察
      this.$once('hook:beforeDestroy', () => observer.disconnect())
    },
  },
  render() {
    return (
      <div class="sky-switch">
        <label for="toggle">
          <input
            ref="toggle"
            id="toggle"
            type="checkbox"
            onClick={() => {
              this.switch()
            }}
          />
          <div />
        </label>
      </div>
    )
  },
}
</script>

<style lang="stylus" scoped>
.sky-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
  width: 100%;

  $button-width = 3rem;
  $button-height = 1.77rem;
  $toggle-diameter = 1.53rem;
  $button-toggle-offset = ($button-height - $toggle-diameter) / 2;
  $toggle-shadow-offset = 0.06rem;
  $toggle-wider = 2.01rem;
  $color-grey = var(--stitchColor);

  div {
    position: relative;
    width: $button-width;
    height: $button-height;
    background: $color-grey;
    border-radius: 0.88rem;
    transition: 0.3s all ease-in-out;
    &::after {
      content: '🐱';
      cursor: pointer;
      position: absolute;
      top: $button-toggle-offset;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $toggle-diameter;
      height: $toggle-diameter;
      font-size: $toggle-diameter;
      line-height: $toggle-diameter;
      border-radius: 0.765rem;
      transform: translateX($button-toggle-offset);
      box-shadow: 0.06rem 0 0.06rem * 4 rgba(0, 0, 0, 0.1);
      transition: 0.3s all ease-in-out;
    }
  }
  input[type='checkbox'] {
    display: none;
    &:checked {
      & + div {
        &::after {
          content: '🐯';
          transform: translateX($button-width - $toggle-diameter - $button-toggle-offset);
          box-shadow: 0.06rem * -1 0 0.06rem * 4 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>
