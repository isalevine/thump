let canvas = document.getElementById('thump')
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let ctx = canvas.getContext('2d')
let rect = {
  x: width / 2 - 100,
  y: height / 2 - 100,
  width: 200,
  height: 200,
}

let isWithinBounds = ({clientX, clientY}, rect) => {
  return !( clientX < rect.x || 
    clientY < rect.y || 
    clientX > rect.x + rect.width || 
    clientY > rect.y + rect.height )
}

let draw = () => {
  ctx.fillStyle = '#000'
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}


// audio 
var audio= new (window.AudioContext || window.webkitAudioContext)();
//var oscillator = audioCtx.createOscillator();
//let gain = audioCtx.createGain()

let blip = ({duration=0.5, shape='square', freq=220, level=0.5}) => { 
  //patch
  let osc = audio.createOscillator()
  let gain = audio.createGain()
  osc.connect(gain)
  gain.connect(audio.destination)

  // signal
  let now = audio.currentTime
  osc.type = shape
  osc.frequency.setValueAtTime(freq, now)
  osc.frequency.exponentialRampToValueAtTime(freq / 2, now + duration)

  // envelope
  gain.gain.setValueAtTime(level, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

  // play
  osc.start(now)
  osc.stop(now + duration)
}

canvas.addEventListener('click', (e) => {
  if(isWithinBounds(e, rect)){
    console.log('wat')
    blip({freq: Math.random() * 500, duration: Math.random()  * 5})
  }
})
