Component({
  properties: {
    holder: String,
    focus: Boolean,
    static: Boolean,
    url: String
  },

  data: {
    value: null
  },
  search: undefined,
  methods: {
    clear() {
      this.setData({
        value: null,
				
      })
    },
    input(event) {
      clearTimeout(this.search)
      const value = event.detail.value
      if (!value) return
      this.setData({
        value
      })
      this.search = setTimeout(() => {
        this.triggerEvent('klsearch', {
          value
        }, {})
      }, 500)
    }
  }
})