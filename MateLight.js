'use strict'

let dgram = require('dgram')
let Canvas = require('canvas')

class MateLight {
	constructor(host, port) {
		this.host = host || 'matelight.rocks'
		this.port = port || 1337
		this.width = 40
		this.height = 16
		this.size = 1920
		this.ctx = new Canvas(this.width, this.height).getContext('2d')
		this.socket = dgram.createSocket('udp4')

		this.clean()

		return this
	}

	buffer(buffer) {
		this.buffer = buffer

		return this
	}

	bottle(x, y, r, g, b) {
		if(!this.buffer)
			this.clean()

		let n = (x * 3) + (y * this.width * 3)

		this.buffer[n + 0] = r
		this.buffer[n + 1] = g
		this.buffer[n + 2] = b

		return this
	}

	crate(x, y, r, g, b) {
		if(!this.buffer)
			this.clean()

		let bottles = []
		let crate = {
			width: 5,
			height: 4
		}

		x *= crate.width
		y *= crate.height

		for(let yo = 0; yo < crate.height; yo++) {
			for(let xo = 0; xo < crate.width; xo++) {
				this.bottle(x + xo, y + yo, r, g, b)
			}
		}

		return this
	}

	image(src) {
		let i = 0
		let j = 0
		let image = new Canvas.Image

		image.src = src

		if(!image.width)
			return this

		this.ctx.drawImage(image, 0, 0, this.width, this.height)

		let imageData = this.ctx.getImageData(0, 0, this.width, this.height).data

		while(i < this.size) {
			this.buffer[i++] = imageData[j++]
			this.buffer[i++] = imageData[j++]
			this.buffer[i++] = imageData[j++]
			j++
		}

		return this
	}

	clean() {
		this.buffer = new Buffer(this.size).slice(0)

		for(let i = 0; i < this.buffer.length; i++)
			this.buffer[i] = 0

		return this
	}

	send(callback) {
		this.socket.send(this.buffer, 0, this.buffer.length, this.port, this.host, (err) => callback(this))

		return this
	}

	close() {
		this.socket.close()

		return this
	}
}

module.exports = MateLight
