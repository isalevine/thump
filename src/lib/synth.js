let onEvent = (event) => (id, cb) => 
  document.getElementById(id).addEventListener(event, cb)

export const SET = 'set'
export const LINEAR = 'linear'
export const EXPONENTIAL = 'exponential'

export const SINE = 'sine'
export const SQUARE = 'square'
export const TRIANGLE = 'triangle'
export const SAWTOOTH = 'sawtooth'

export const audio = new (window.AudioContext || window.webkitAudioContext)();

class Bug extends Error {
  constructor({problem, cause, level=0, timestamp=new Date().toISOString()}){
    super(`__ERROR__ ${problem}: ${cause} (LEVEL ${level}) (TIMESTAMP ${timestamp})`)
    this.problem = problem
    this.cause = cause
    this.level = level
    this.timestamp = timestamp
  }
}

let set = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    value,
    enumerable: true,
  })
  return obj
}

let setHidden = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    value,
    enumerable: false,
  })
  return obj
}

let onClick = onEvent('click')
let onMouseDown = onEvent('mousedown')
let onMouseUp = onEvent('mouseup')
let onMouseOver = onEvent('mouseover')
let onChange = onEvent('change')

export const pipeline = (nodes)=> {
  if(!nodes) return 
  if(!nodes.length) return 
  for(let i=0; i<nodes.length - 1; i++){
    nodes[i].connect(nodes[i+1])
  }
  return {
    isPipeline: true, 
    nodes,
  }
}

export const pipelineConcat = (A, B) => {
  if(!A.isPipeline || !B.isPipeline) 
    throw new Bug({problem: 'cannot concat', cause: 'input A or B was not a valid pipline'})
  console.log(A)
  A.nodes[A.nodes.length -1].connect(B.nodes[0])
  return pipeline([...A.nodes, ...B.nodes])
}

export const output = (pipeline, destination=audio.destination) => {
  let {nodes} = pipeline
  nodes[nodes.length -1].connect(destination)
}

export const mod = ({type=SET, time=0, value=0}) => ({type, time, value})

export const applyModulation = ({subject, modulations}, context=audio) => {
  let now = context.currentTime
  modulations.forEach(mod => {
    switch(mod.type){
      case SET:
        subject.setValueAtTime(mod.value, now + mod.time)
        break;
      case LINEAR:
        subject.linearRampToValueAtTime(mod.value, now + mod.time)
        break;
      case EXPONENTIAL:
        subject.exponentialRampToValueAtTime(mod.value, now + mod.time)
        break;
    }
  })
}

export const gain = ({levels=[]} ,context=audio) => {
  let box = context.createGain()
  let now = context.currentTime
  applyModulation({
    subject: box.gain, 
    modulations: levels,
  })
  return pipeline([box])
}

export const fm = ({
  carrierShape=SINE, 
  carrierFreq=220,
  carrierLevel=1,
  modularShape=SINE,
  modularFreq=200,
  modularLevel=1000,
  stop=1,
  context=audio,
}) => {
  let now = context.currentTime

  let modular = context.createOscillator()
  let modularGain = context.createGain()
  modular.connect(modularGain)
  modularGain.gain.value = modularLevel 
  modular.type = modularShape
  modular.frequency.value = modularFreq

  let carrier = context.createOscillator()
  let carrierGain = context.createGain()
  carrierGain.gain.value = carrierLevel
  carrier.type = carrierShape
  carrier.frequency.value = carrierFreq
  modularGain.connect(carrier.frequency)

  modular.start(now)
  modular.stop(now + stop)
  carrier.start(now)
  carrier.stop(now + stop)

  carrier.connect(carrierGain)
  return pipeline([carrierGain])
}


export const osc = ({shape=SINE, freqs=[], levels=[], start=0, stop=1 ,context=audio}) => {
  let signal = context.createOscillator()
  let now = context.currentTime
  signal.type = shape
  applyModulation({
    subject: signal.frequency, 
    modulations: freqs,
  })
  signal.start(now + start)
  signal.stop(now + stop)
  return pipelineConcat(pipeline([signal]), gain({levels}))
}

//export const delay = ({offset=4, context=audio}) => {
  //let input = context.createGain()
  //let output = context.createGain()
  //input.gain.value = 1
  //output.gain.value = 1

  //let box = context.createDelay()
  //box.delayTime.setValueAtTime(0.01, context.currentTime)
//subject.linearRampToValueAtTime(mod.value, now + mod.time)

  //input.connect(box)
  //box.connect(input)
  //input.connect(output)
  //box.connect(output)


  //return pipeline([input, box])
//}

//output(pipelineConcat(
  //fm({
    //carrierShape: SINE,
    ////modularShape: SINE,
    //modularLevel: 1000,
    //modularFreq: 1100,
  //}),
  //delay({})
//))

export const blip = ({scaler=1, shape=SINE}) => { 
  let signal = osc({
    shape,
    freqs: [
      mod({value: scaler * 220}), 
      mod({value: scaler * 440, time: 0.25, type: EXPONENTIAL}),
      mod({value: scaler * 660, time: 0.44,}),
    mod({value: scaler * 220, time: 0.6}), 
      mod({value: scaler * 660, time: 0.75, type: EXPONENTIAL}),
      mod({value: scaler * 550, time: 0.8}), 
      mod({value: scaler * 440, time: 0.9}),
    ],
    levels: [
      mod({value: 0.01}),  // inital
      mod({value: 1, time: 0.1, type: LINEAR}), //attach
      mod({value: 0.8, time: 0.2, type: EXPONENTIAL}), //decay
      mod({value: 0.01, time: 1, type: EXPONENTIAL}), // release
    ],
  })

  output(signal)
}


//blip({})

export const boing = (scaler) => {
  output(osc({
    shape: SQUARE, 
    stop: 1,
    freqs:[
      mod({value: scaler * 220}),
      mod({value: scaler * 440, time: 0.5, type: EXPONENTIAL}),
    ], 
    levels: [
      mod({value: 0.01}),
      mod({value: 1, time: 0.2, type: LINEAR}),
      mod({value: 0.01, time: 0.1, type: LINEAR}),
    ]
  }))
}

//boing(1.1, SINE)
//boing(1.2)
//boing(1.5)

let scalers = {
  A: 1,
  B: 2,
  C: 4,
  D: 6,
}

let tenth = (num) => num / 10

let shape = 'sine'
onChange('WAVE_SHAPE', (e) => shape = e.target.value)

let setButton = (id) => {
  onMouseUp(id, () => blip({shape, scaler: 1 + tenth(scalers[id])}))
  onMouseDown(id, () => blip({shape, scaler: 0 + tenth(scalers[id])}))
  onChange(`${id}_SCALER`, (e) => scalers[id] = e.target.value)
}

setButton('A')
setButton('B')
setButton('C')
setButton('D')


//blip({})
//setInterval(() => blip({scaler: Math.random(), shape}), 500)
//
//
//
// DELAY TEST
let s = audio.createOscillator()
s.frequency.value = 440
s.start()
s.stop(audio.currentTime + 1)
console.log('cool')


let w = audio.createOscillator()
w.frequency.value = 1000
w.type = SAWTOOTH
w.start()
w.stop(audio.currentTime + 1)

let n = audio.createOscillator()
n.frequency.value = 440
n.type = SQUARE
n.start()
n.stop(audio.currentTime + 1)

let SX = audio.createGain()
SX.gain.value = 1000
SX.gain.linearRampToValueAtTime(0, audio.currentTime + 1)
s.connect(SX)

SX.connect(w.frequency)



// mixer
let merge = audio.createGain()
merge.gain.value = 0.4


// patch
s.connect(merge)
w.connect(merge)
n.connect(merge)
merge.connect(audio.destination)
