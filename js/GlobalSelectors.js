// Acá estarán ubicados selectores para usar globalmente y funciones que requieren del dom

// localStorage class
export const localStorage = globalThis.localStorage

// Selectors
export const containerNavbar = globalThis.document.querySelector('div.container-navbar')
export const container = globalThis.document.querySelector('div.container')
export const selecter = (selector = '') => globalThis.document.querySelector(selector)

// Functions

/**
 * Función para crear elementos HTML según el string pasado
 * @param {string} element
 * @returns {HTMLElement}
 */
export const createElement = element => globalThis.document.createElement(element)

/**
 * Objeto intermediario para validaciones y cálculo de la encomienda
 */
export const dataObjParcel = {
  value: null,
  length: null,
  width: null,
  high: null,
  weight: null,
  type: null,
  senderAddress: null,
  receivingAddress: null
}

/**
 * Método para insertar data en el dataObjParcel
 * @param {HTMLElement} e elemento html a insertar
 */
export function insertDataObj (e) {
  dataObjParcel[e.target.id] = e.target.value
}

/**
 * Función para validar el objeto de Parcel
 * @param {object} e Objeto Parcel que se ha de validar
 * @returns {string}
 */
export function validationDataObj (e) {
  e.preventDefault()
  const montReg = /\d+\.?\d*/
  const { value, length, width, high, weight, type } = dataObjParcel
  if (!value || !length || !width || !high || !weight || !type) {
    return 'Todos los campos son requeridos.'
  }
  if (isNaN(value) || !montReg.test(value)) {
    return 'Ingrese un monto válido'
  }
  if (
    isNaN(length) ||
    isNaN(width) ||
    isNaN(high) ||
    !montReg.test(length) ||
    !montReg.test(width) ||
    !montReg.test(high)
  ) {
    return 'Ingrese una medida válida'
  }
  if (isNaN(weight) || !montReg.test(weight)) {
    return 'Ingrese un peso válido'
  }
  return 'success'
}

/**
 * Método para limpiar el objeto dataObjParcel
 */
export function resetDataObj () {
  for (const key in dataObjParcel) {
    dataObjParcel[key] = 0
  }
}

/**
 * Función que toma el objeto Tarjet (debe ser un formulario) y busca convertirlo en un json del tipo {HTMLElement.name : HTMLElement.value}
 * @param {HTMLFormElement} target Formulario
 * @returns {object} {HTMLElement.name : HTMLElement.value, ...}
 */
export function formToJSON (target) {
  return Object.fromEntries(new globalThis.FormData(target))
}

/**
 * Función de Fetch que 'reescribe' la provista por el lenguaje.
 * Permite la obtención de la respuesta directamente en formato JSON
 * @param {string} url  Enlace a donde se realizará el fetch
 * @param {Response} init Objeto Response que se enviará. Por defecto está vacio
 * @returns {object | string} Retorna un JSON en caso de éxito, en caso contrario tratará de parsear a Texto la respuesta o devolver el error en crudo
 */
export async function fetch (url = '', init = {}) {
  const response = await globalThis.fetch(url, init)

  if (response) {
    // obtener cuerpo de la respuesta (método debajo)
    try {
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
      try {
        const text = await response.text()
        return text
      } catch (error) {
        return error
      }
    }
  }
}
