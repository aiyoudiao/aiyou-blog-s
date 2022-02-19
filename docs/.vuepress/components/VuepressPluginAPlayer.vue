<script>
import 'APlayer/dist/APlayer.min.css'
import APlayer from 'APlayer'

export default {
  name: 'VuepressPluginAPlayer',
  mounted() {
    this.initAPlayer()
  },
  methods: {
    /**
     * 初始化APlayer
     */
    initAPlayer() {
      const ap = new APlayer({
        container: document.getElementById('VuepressPluginAPlayer'),
        fixed: true,
        volume: 0.2,
        theme: '#1da1f2',
        lrcType: 3,
        audio: [
          {
            name: "星河万里",
            artist: 'Rom邢锐',
            url: "http://m701.music.126.net/20220218161537/dfec08093a18b71af9a2e0fac1388740/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/8864849128/d537/67f7/7baa/592c959a8405b1bb4828c35f17d65bde.mp3",
            lrc: "http://m701.music.126.net/20220218161537/dfec08093a18b71af9a2e0fac1388740/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/8864849128/d537/67f7/7baa/592c959a8405b1bb4828c35f17d65bde.lrc",
            cover: "https://p1.music.126.net/QYOtbVhmJ-jpPzCPWqjZUw==/109951165965398413.jpg?param=90y90",
          },
          {
            name: '初恋',
            artist: '回春丹',
            url: 'http://m701.music.126.net/20220218161900/f9163e842cdcc9d81125b974753bf1c8/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/10534605664/afa0/a422/c18f/76eadc75043bb36aeda62993121914f5.mp3',
            lrc: 'http://m701.music.126.net/20220218161900/f9163e842cdcc9d81125b974753bf1c8/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/10534605664/afa0/a422/c18f/76eadc75043bb36aeda62993121914f5.lrc',
            cover: 'https://p1.music.126.net/4NJvc1HOi4uv7cs4501Bjg==/109951166324714668.jpg?param=90y90',
          },
        ],
      })
      ap.lrc.hide()
    },
  },
  render() {
    return <div id="VuepressPluginAPlayer" />
  },
}
</script>
