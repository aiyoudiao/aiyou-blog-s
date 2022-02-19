<script>
export default {
  name: 'DynamicImportPhotoSwipe',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dynamicComponent: null,
    }
  },
  async mounted() {
    const module = await import('vue-picture-swipe')
    this.dynamicComponent = module.default
  },
  render() {
    const { dynamicComponent, items } = this

    return (
      <div class="DynamicImportPhotoSwipe">
        {dynamicComponent ? (
          <dynamicComponent items={items} options={{ shareEl: false }} />
        ) : (
          items.map(item => <img src={item.src} key={item.src} />)
        )}
      </div>
    )
  },
}
</script>
