Component({
	properties:{
		holder:String,
		focus:Boolean,
		static: Boolean,
		url: String
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