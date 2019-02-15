Component({
	properties:{
		holder:String,
		focus:Boolean
	},
	search: undefined,
	methods: {
		input(event) {
			clearTimeout(this.search)
			const value = event.detail.value
			if(!value) return
			this.search = setTimeout(() => {
				this.triggerEvent('klsearch', { value }, {})
			}, 500)
		}
	}
})