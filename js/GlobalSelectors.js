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

export function validationWhatSend (e) {
  const montReg = /\d+\.?\d*/
  const { target } = e
  const value = parcelObj[target.id]

  const valObj = {
    type: (!value) ? 'Seleccione un tipo de encomienda' : '',
    value: (!value || isNaN(value) || !montReg.test(value)) ? 'Ingrese un monto válido.' : '',
    length: (isNaN(value) || !montReg.test(value)) ? 'Ingrese una medida válida' : '',
    width: (isNaN(value) || !montReg.test(value)) ? 'Ingrese una medida válida' : '',
    high: (isNaN(value) || !montReg.test(value)) ? 'Ingrese una medida válida' : '',
    weight: (isNaN(value) || !montReg.test(value)) ? 'Ingrese un peso válido' : ''

  }
  console.log(target)
  return valObj[target.id]
}
