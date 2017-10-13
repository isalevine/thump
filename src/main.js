import './style/main.scss'
import * as audio from './lib/gen.js'

window.audio = audio

//import * as synth from './lib/synth.js'

window.onEvent = (event) => (query, cb) => 
  document.querySelector(query).addEventListener(event, cb)

window.onClick = onEvent('click')
window.onMouseMove = onEvent('mousemove')
window.onClick = onEvent('click')
window.onClick = onEvent('click')


window.onload = () => {
}

window.onresize = () => {
  //width = canvas.width = window.innerWidth
  //height = canvas.height = window.innerHeight
  //ctx.clearRect(0, 0, width, height)
  //draw()
}
