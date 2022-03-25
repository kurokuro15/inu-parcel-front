// Acá estarán ubicados selectores para usar globalmente y funciones que requieren del dom

// Selectors
export const container = globalThis.document.querySelector('div.container')
export const selecter = selector => globalThis.document.querySelector(selector)
// Functions
export const createElement = element => globalThis.document.createElement(element)

export const parcelObj = {
  value: null,
  length: null,
  width: null,
  high: null,
  weight: null,
  type: null,
  senderAddress: null,
  receivingAddress: null
}

export function parcelData (e) {
  parcelObj[e.target.id] = e.target.value
}

export function validationWhatSend (e) {
  e.preventDefault()
  const montReg = /\d+\.?\d*/
  const { value, length, width, high, weight, type } =
    parcelObj
  if (
    !value ||
    !length ||
    !width ||
    !high ||
    !weight ||
    !type
  ) {
    return 'Todos los campos son requeridos.'
  }
  if (isNaN(value) || !montReg.test(value)) {
    return 'Ingrese un monto válido'
  }
  if ((isNaN(length) || isNaN(width) || isNaN(high)) || (!montReg.test(length) || !montReg.test(width) || !montReg.test(high))) {
    return 'Ingrese una medida válida'
  }
  if (isNaN(weight) || !montReg.test(weight)) {
    return 'Ingrese un peso válido'
  }
  return 'success'
}

export function reset () {
  for (const key in parcelObj) {
    parcelObj[key] = 0
  }
}
