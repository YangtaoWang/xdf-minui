/* eslint-disable no-console */
const _ = require('./utils')

Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties'
    },
  },
  data: {
    flag: false,
  },
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: () => {
          this.setData({
            flag: _.getFlag(),
          })
        }
      })
    }
  },
  methods: {
    confirm(e) {
      console.log('33')
      // eslint-disable-next-line no-console
      console.log('e', e)
    }
  }
})
