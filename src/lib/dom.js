'use strict'
export const onEvent = (event) => (query, cb) => 
  document.querySelector(query).addEventListener(event, cb)

export const onClick = onEvent('click')
export const onChange = onEvent('change')
export const onSubmit = onEvent('submit')
export const onMouseUp = onEvent('mouseup')
export const onMouseMove = onEvent('mousemove')
export const onMouseDown = onEvent('mousedown')
export const onMouseOver = onEvent('mouseover')
export const onMouseLeave= onEvent('mouseleave')
export const onMouseEnter = onEvent('mouseenter')
export const onDoubleClick = onEvent('dblclick')
