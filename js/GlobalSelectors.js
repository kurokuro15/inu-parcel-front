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

let count = 0

export function validationWhatSend (e) {
  count++
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

  if (count === 6) {
    count = 0
    let emply = 0
    for (const prop in parcelObj) {
      emply += parcelObj[prop] ? 0 : 1
    }
    if (emply <= 2) {
      return 'success'
    } else {
      return 'Todos los campos son válidos. Se valida cada 6 cambios.'
    }
  }
  return valObj[target.id]
}
