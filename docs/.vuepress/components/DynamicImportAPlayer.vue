<script>
import { isMobile } from 'mobile-device-detect'

export default {
  name: 'DynamicImportAPlayer',
  data() {
    return {
      dynamicImportComponent: null,
    }
  },
  mounted() {
    !isMobile && this.dynamicImport()
  },
  methods: {
    async dynamicImport() {
      try {
        const module = await import('./VuepressPluginAPlayer')
        this.dynamicImportComponent = module.default
      } catch (error) {
        console.info(error)
      }
    },
  },
  render() {
    const self = this

    return (
      self.dynamicImportComponent && (
        <Component
          {...{
            is: self.dynamicImportComponent,
          }}
        />
      )
    )
  },
}
</script>
