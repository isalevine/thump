import './style/main.scss'

import * as audio from './lib/audio.js'
import * as dom from './lib/dom.js'

window.audio = audio
window.dom = dom


window.onload = () => {
}

window.onresize = () => {
  //width = canvas.width = window.innerWidth
  //height = canvas.height = window.innerHeight
  //ctx.clearRect(0, 0, width, height)
  //draw()
}
