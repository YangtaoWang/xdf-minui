/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/*
 * @Author: wangyangtao@xdf.cn
 * @Date: 2022-02-25 14:39:08
 * @LastEditors: wangyangtao@xdf.cnn
 * @LastEditTime: 2022-05-20 14:49:43
 * @Description: 绑定输入框组件
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoSubmit: { // 输入六位后是否自动提交
      type: Boolean,
      value: false
    },
    submitCallback: { // 输入六位后是否自动提交回调
      type: Function,
      value: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputFocus: false,
    codeList: [],
    code: '',
    activeIndex: 0,
    keyCodeMap: { // keyCode映射键盘数字和删除
      48: 0,
      49: 1,
      50: 2,
      51: 3,
      52: 4,
      53: 5,
      54: 6,
      55: 7,
      56: 8,
      57: 9,
      8: 'BackSpace'
    },
    isIOS: false
  },
  observers: {
    codeList(codeList) {
      this.setData({
        code: codeList.map(item => item.value).join('')
      })
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.codeListInit()
      this.setCaret(0)
      // this.controlFocus(true)
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    controlFocus(flag) { // 控制是否键盘弹起，通过设置input获取光标
      this.setData({
        inputFocus: flag
      })
    },
    coverTap() { // 点击整个输入框长条
      this.controlFocus(true)
    },
    onLongPress() { // 长按输入格
    },
    paste(clipText) { // 处理粘贴
      const arr = this.data.codeList.map((item, index) => {
        return Object.assign(
          item,
          {value: index >= this.data.activeIndex && index < this.data.activeIndex + clipText.length ? clipText.charAt(index - this.data.activeIndex) : item.value}
        )
      })
      const i = this.data.activeIndex > 5 ? 5 : this.data.activeIndex + clipText.length
      this.setCaret(i)
      this.setData({
        codeList: arr
      })
    },
    boxTap(e) { // 点击输入格,设置光标位置，弹起键盘
      const index = e.currentTarget.dataset.index
      this.setCaret(index)
      this.controlFocus(true)
    },
    validateKeyCode(keyCode) { // 校验输入的是否是数字和删除
      return Object.keys(this.data.keyCodeMap).includes(keyCode + '')
    },
    onInput(e) { // 监听输入框输入事件
      const keyCode = e.detail.keyCode
      if (this.validateKeyCode(keyCode)) {
        const key = this.data.keyCodeMap[keyCode]
        if (key === 'BackSpace') {
          this.dealBackspace()
        } else {
          this.dealNum(key)
        }
      }
    },
    codeListInit() { // 初始化输入格
      const codeList = new Array(6).fill('').map(() => {
        return {
          value: ''
        }
      })
      this.setData({
        codeList
      })
    },
    setCaret(i) { // 激活光标位
      let activeIndex = i
      if (i >= 5) {
        activeIndex = 5
      }
      if (i <= 0) {
        activeIndex = 0
      }
      this.setData({
        activeIndex
      })
    },
    dealBackspace() { // 处理删除
      // eslint-disable-next-line arrow-body-style
      const arr = this.data.codeList.map((item, index) => {
        return Object.assign(item, {value: index === this.data.activeIndex ? '' : item.value})
      })
      this.setData({
        codeList: arr
      })
      this.setCaret(this.data.activeIndex - 1)
    },
    dealNum(key) { // 处理数字
      const arr = this.data.codeList.map((item, index) => {
        return {...item, value: index === this.data.activeIndex ? key : item.value}
      })
      this.setData({
        codeList: arr
      })
      const i = this.data.activeIndex > 5 ? 5 : this.data.activeIndex + 1
      this.setCaret(i)
      if (this.data.code.length >= 6 && this.properties.autoSubmit) { // 输入六位，且配置的自动提交时，处理回调
        // this.properties.submitCallback(this.data.code)
        this.confirm()
        wx.showToast({
          title: this.data.code
        })
        this.controlFocus(false)
        this.setData({
          activeIndex: 999
        })
      }
    },
    confirm() { // 点击绑定，回调事件
      this.triggerEvent('confirm', this.data.code)
    }
  }
})
