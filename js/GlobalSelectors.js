// Acá estarán ubicados selectores para usar globalmente y funciones que requieren del dom

// Selectors
export const container = globalThis.document.querySelector('div.container')
export const selecter = selector => globalThis.document.querySelector(selector)
// Functions
export const createElement = element => globalThis.document.createElement(element)

export const parcelObj = {
  value: 0,
  length: 0,
  width: 0,
  high: 0,
  weight: 0,
  type: '',
  senderAddress: 0,
  receivingAddress: 0
}

export function parcelData (e) {
  parcelObj[e.target.id] = e.target.value
  console.log(parcelObj)
}

export function validationWhatSend (e, callback) {
  const montReg = /\d+\.?\d*/
  const { value, length, width, high, weight, type } = parcelObj
  if (!type) {
    return 'Seleccione un tipo de encomienda'
  } else if (!value || isNaN(value) || !montReg.test(value)) {
    return 'Ingrese un monto válido.'
  } else if (
    isNaN(length) ||
    isNaN(width) ||
    isNaN(high) ||
    !montReg.test(length) ||
    !montReg.test(width) ||
    !montReg.test(high)
  ) {
    return 'Ingrese una medida válida'
  } else if (isNaN(weight) || !montReg.test(weight)) {
    return 'Ingrese un peso válido'
  }
  callback()
}
