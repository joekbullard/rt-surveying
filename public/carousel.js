window.testimonialSlideshow = function(slides) {
	return {
		title: 'Testimonials',
		state: {
			moving: false,
			currentSlide: 0,
			looping: false,
			order: [],
			nextSlideDirection: '',
			userInteracted: false,
			usedKeyboard: false,
		},
		autoplayTimer: null,
		attributes: {
			direction: 'right-left',
			duration: 1000,
			timer: 7000,
		},
		slides: [],
		setup() {
			this.slides = slides.map((slide, index) => { slide.id = index + Date.now(); return slide })
				
			// Cache the original order so that we can reorder on transition (to skip inbetween slides)
			this.state.order = this.slides.map(slide => slide.id)
			const newSlideOrder = this.slides.filter(slide => this.current.id != slide.id)
			newSlideOrder.unshift(this.current)
			this.slides = newSlideOrder
				
			// Start the autoslide
			this.attributes.timer && this.autoPlay()
		},
		get current() {
			return this.slides.find(slide => slide.id == this.state.order[this.state.currentSlide])
		},
		get previousSlide() {
			return (this.state.currentSlide - 1) > -1 ? this.state.currentSlide - 1 : this.state.currentSlide
		},
		get nextSlide() {
			return (this.state.currentSlide + 1) < this.slides.length ? this.state.currentSlide + 1 : this.state.currentSlide
		},
		updateCurrent(nextSlide) {
			if (nextSlide == this.state.currentSlide) return
			if (this.state.moving) return
			this.state.moving = true

			const next = this.slides.find(slide => slide.id == this.state.order[nextSlide])

			// Reorder the slides for a smoother transition
			const newSlideOrder = this.slides.filter(slide => {
				return ![this.current.id, this.state.order[nextSlide]].includes(slide.id)
			})

			const activeSlides = [this.current, next]
			this.state.nextSlideDirection = nextSlide > this.state.currentSlide ? 'right-to-left' : 'left-to-right'

			newSlideOrder.unshift(...(this.state.nextSlideDirection == 'right-to-left' ? activeSlides : activeSlides.reverse()))
			this.slides = newSlideOrder
			this.state.currentSlide = nextSlide
			setTimeout(() => {
				this.state.moving = false
				// TODO: possibly a better check to determine whether autoplay should resume
				this.attributes.timer && !this.autoplayTimer && this.autoPlay()
			}, this.attributes.duration)

		},
		transitions(state, $dispatch) {
			const rightToLeft = this.state.nextSlideDirection === 'right-to-left'
			switch (state) {
				case 'enter':
					return `transition-all duration-${this.attributes.duration}`
				case 'enter-start':
					return rightToLeft ? 'transform translate-x-full' : 'transform -translate-x-full'
				case 'enter-end':
					return 'transform translate-x-0'
				case 'leave':
					return `absolute top-0 transition-all duration-${this.attributes.duration}`
				case 'leave-start':
					return 'transform translate-x-0'
				case 'leave-end':
					return rightToLeft ? 'transform -translate-x-full' : 'transform translate-x-full'
			}
		},
		autoPlay() {
			this.loop = () => {
				const next = (this.state.currentSlide === (this.slides.length - 1)) ? 0 : this.state.currentSlide + 1
				this.updateCurrent(this.state.looping ? next : this.currentSlide)
				this.autoplayTimer = setTimeout(() => {
					requestAnimationFrame(this.loop)
				}, this.attributes.timer + this.attributes.duration)
				
			}
			this.autoplayTimer = setTimeout(() => {
				this.state.looping = true
				requestAnimationFrame(this.loop)
			}, this.attributes.timer)
		},
		stopAutoplay() {
			clearTimeout(this.autoplayTimer)
			this.autoplayTimer = null
		}
	}
}

window.slides = [
	{
		content: `"I had contacted George to support with tree climbing
	    requirements on a long term project and I found him to be extremely responsive and offered
		excellent communication. George does very well in offering his experience and expertise in
		aspects of the ecology and arboriculture field, to help provide the best working solutions.
		He is extremely flexible and dedicated to the task at hand, while also offering a friendly
		and open platform for communication. He is very knowledgeable about his field and can
		provide advice where others are unsure."`,
		author: 'Russell Goodchild BSc (Hons) MCIEEM',
		position: 'Principal Consultant Ecologist ECUS Ltd'
	},
	{
		content: `“George has worked well for us in recent years,
		turning up to site
		punctually and completing his work to a high standard. I always get data from him in a
		timely
		manner and he takes good initiative on site, going further than the average subby.”`,
		author: 'Daniel Tackie BSc (Hons.) MSc',
		position: 'Ecological consultant RSK Biocensus Ltd.'
	},
]