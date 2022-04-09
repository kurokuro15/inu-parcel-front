import { formToJSON } from '../GlobalSelectors.js'
import Ui from './Ui.js'
export default class Validator {
  /**
   * Validación del cuerpo del formulario de registro
   * @param {Event} e evento Submit
   * @param {function} callback Llamada de vuelta a una función que se ejecutará si la validación resulta.
   */
  static validateSignin (e, callback) {
    e.preventDefault()
    Validator.ui = new Ui()
    Validator.data = formToJSON(e.target)
    const today = new Date()
    const {
      birthday,
      country,
      dni,
      email,
      lastname,
      municipality,
      name,
      numberHouse,
      parish,
      password,
      phone,
      reference,
      sex,
      state,
      street,
      username,
      zipcode
    } = Validator.data
    console.log(Validator.data)

    // validamos que no estén vacíos los requeridos
    if (!(birthday &&
      country &&
      dni &&
      email &&
      lastname &&
      municipality &&
      name &&
      numberHouse &&
      parish &&
      password &&
      phone &&
      sex &&
      state &&
      street &&
      username)
    ) {
      return this.ui.printAlert('error', 'Los campos son obligatorios.')
    }

    // Validamos Username
    const maxUsernameLength = 12
    if (Validator._validateField(username, maxUsernameLength)) {
      return this.ui.alertInput('error', e.target.querySelector('#username'))
    }

    // Validamos Nombres y apellidos
    const maxNameLength = 26
    const refName = Validator._returnTheReference(name)
    if (Validator._havMaxLength(name, maxNameLength)) {
      return (() => {
        this.ui.printAlert('error', `Máximo ${maxNameLength} carácteres en el campo ${refName}`)
        this.ui.alertInput('error', e.target.querySelector('#name'))
      })()
    }

    const maxLastnameLength = 26
    const refLastname = Validator._returnTheReference(lastname)
    if (Validator._havMaxLength(lastname, maxLastnameLength)) {
      return (() => {
        this.ui.printAlert('error', `Máximo ${maxLastnameLength} carácteres en el campo ${refLastname}`)
        this.ui.alertInput('error', e.target.querySelector('#lastname'))
      })()
    }

    // revisar que no hayan espacios en algunos fields
    if (
      Validator._havSpace(username) ||
      Validator._havSpace(numberHouse) ||
      Validator._havSpace(phone) ||
      Validator._havSpace(zipcode)
    ) {
      return this.ui.printAlert(
        'error',
        'no puede haber espacios en el campo usuario, contraseña, código postal, teléfono '
      )
    }

    // Validamos que la contraseña tenga más de 8 carácteres, minúsculas, mayúsculas y símbolos.
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passRegex.test(password)) {
      return (() => {
        this.ui.printAlert('error', 'Ingrese una contraseña válida')
        this.ui.alertInput('error', e.target.querySelector('#password'))
      })()
    }

    // Validamos que la fecha de nacimiento sea válida (no sea mayor al día de hoy)
    if (new Date(birthday) > today) {
      return (() => {
        this.ui.printAlert('error', 'Fecha de nacimiento inválida.')
        this.ui.alertInput('error', e.target.querySelector('#birthday'))
      })()
    }

    // Validamos el correo electrónico
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(email)) {
      return (() => {
        this.ui.printAlert('error', 'Correo electrónico inválido')
        this.ui.alertInput('error', e.target.querySelector('#email'))
      })()
    }

    // Validamos el teléfono celular
    const phoneRegex = /^\x2b(\d{0,3})\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/
    if (!phoneRegex.test(phone)) {
      return (() => {
        this.ui.printAlert('error', 'Número de teléfono erróneo')
        this.ui.alertInput('error', e.target.querySelector('#phone'))
      })()
    }
    const dniRegex = /^[VvEeJjGg]-\d{0,3}.\d{0,3}.\d{0,3}-?\d{0,1}/
    if (!dniRegex.test(dni)) {
      return (() => {
        this.ui.printAlert('error', 'Número de Cédula erróneo')
        this.ui.alertInput('error', e.target.querySelector('#dni'))
      })()
    }

    // Validamos el campo de referencia
    const maxReferenceLength = 120
    const refReference = Validator._returnTheReference(reference)
    if (Validator._havMaxLength(reference, maxReferenceLength)) {
      return (() => {
        this.ui.printAlert('error', `Máximo ${maxReferenceLength} carácteres en el campo ${refReference}`)
        this.ui.alertInput('error', e.target.querySelector('#reference'))
      })()
    }

    // Si todo pasa entonces:
    // Guardamos en localstorage el objeto validado.
    globalThis.localStorage.setItem('signinForm', JSON.stringify(Validator.data))
    // llamamos a la función que imprimirá la siguiente vista
    callback()
  }

  /**
   * Verifica si hay espacios en el string que se le pasa como parámetro
   * @param {string} string
   * @returns {boolean}
   */
  static _havSpace (string) {
    if (string.includes(' ')) {
      return true
    }
    return false
  }

  /**
   * Retorna True si el string tiene el tamaño recibido como parámetro o superior.
   * @param {string} string
   * @param {number} maxLength
   * @returns {boolean}
   */
  static _havMaxLength (string, maxLength) {
    if (string.length >= maxLength) {
      return true
    }
    return false
  }

  /**
   * Verifica si hay símbolos en el string que se le pasa como parámetro
   * @param {string} string
   * @returns {boolean}
   */
  static _havSymbols (string) {
    const regex = /\W+/
    return regex.test(string)
  }

  /**
   * Valida que el campo tenga un máximo de {maxLength} caracteres y no tenga simbolos no admitidos
   * @param {string} reference
   * @param {number} maxLength
   * @returns
   */
  static _validateField (reference, maxLength) {
    const field = Validator._returnTheReference(reference)
    if (Validator._havMaxLength(reference, maxLength)) {
      return (
        true &&
        this.ui.printAlert('error', `Máximo ${maxLength} carácteres en el campo ${field}`)
      )
    }
    if (Validator._havSymbols(reference)) {
      return (
        true &&
        this.ui.printAlert('error', `No son admitidos los símbolos en el campo ${field}`)
      )
    }
    return false
  }

  /**
   * Retorna el nombre de la propiedad que se esté pasando
   * @param {string} prop
   * @returns {string}
   */
  static _returnTheReference (prop) {
    const tObj = Object.entries(this.data)
      .filter(e => e.includes(prop))
      .flat()
    const name = tObj.shift()
    return name
  }
}
