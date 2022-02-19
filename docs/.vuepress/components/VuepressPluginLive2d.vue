<script>
import { isMobile } from 'mobile-device-detect'

const isIntel = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

  return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL).includes('Intel')
}

export default {
  name: 'VuepressPluginLive2d',
  mounted() {
    !isMobile && !isIntel() && this._initLive2dWidget()
  },
  methods: {
    _initLive2dWidget() {
      setTimeout(() => {
        L2Dwidget.init({
          model: {
            scale: 0.5,
          },
          display: {
            position: 'right',
            width: 360,
            height: 520,
            hOffset: 0,
            vOffset: -20,
          },
          react: {
            opacityDefault: 0.7,
            opacityOnHover: 0.2,
          },
        })
      }, 1000)
    },
  },
  render() {
    return <div id="VuepressPluginLive2d" />
  },
}
</script>
