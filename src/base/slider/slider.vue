<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      // 是否循环滚动
      loop: {
        type: Boolean,
        default: true
      },
      // 是否自动滚动
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 滚动时间间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20) // 浏览器默认刷新时间是17ms，这里设置大于17即可
      // 调整浏览器窗口大小时重新设置轮播图宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 计算轮播图sliderGroup的宽度，并根据实际轮播图图片个数初始化图片dom的长度以及添加slider-item类
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        // 轮播图视口宽度即为每张图片的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          // 给每张图片dom添加slider-item类
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 利用better-scroll插件实现轮播效果
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true, // 横向滚动
          scrollY: false,
          momentum: false, // 加速度为0，匀速滚动
          snap: true,
          snapLoop: this.loop, // 循环滚动
          snapThreshold: 0.3,
          snapSpeed: 400, // 滚动速度
          click: true  // 可点击
        })
        // 绑定scrollEnd事件，每次滚动结束时做相应处理
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          // 获取当前图片实际序号
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            this._play()
          }
        })
        // 绑定beforeScrollStart事件
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            // 清除上一个定时器
            clearTimeout(this.timer)
          }
        })
      },
      // 初始化dots
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        // 进入到下一张图片
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
