'use strict'

let MateLight = require('./MateLight').MateLight

// send an image
new MateLight().image('schnabli.jpg').send((ctx) => {
	ctx.close()
})

// cycle through mate crates
let crate = { x: 0, y: 0 }

setInterval(() => {
	let color = {
		r: (Math.floor(Math.random() * 256)) + 1,
		g: (Math.floor(Math.random() * 256)) + 1,
		b: (Math.floor(Math.random() * 256)) + 1
	}
	new MateLight('localhost').crate(crate.x, crate.y, color.r, color.g, color.b).send((ctx) => {})

	crate.x++

	if(crate.x >= 8) {
		crate.x = 0
		crate.y += 1
	}

	if(crate.y >= 4) {
		crate.y = 0
	}
}, 100)