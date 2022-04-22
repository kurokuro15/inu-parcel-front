import { formToJSON, selecter } from '../GlobalSelectors.js'
import Ui from './Ui.js'
export default class Validator {
  constructor () {
    Validator.ui = this.ui = new Ui()
  }

  /**
   * Validación del cuerpo del formulario de registro
   * @param {Event} e evento Submit
   * @param {function} callback Llamada de vuelta a una función que se ejecutará si la validación resulta.
   */
  static validateSignin (e, callback) {
    Validator.ui = new Ui()
    Validator.data = formToJSON(e)
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
      zipcode,
      questionOne,
      answerOne,
      questionTwo,
      answerTwo
    } = Validator.data
    console.log(Validator.data)

    // validamos que no estén vacíos los requeridos
    if (
      !(
        birthday &&
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
        username &&
        questionOne &&
        answerOne &&
        questionTwo &&
        answerTwo
      )
    ) {
      this.ui.printAlert('error', 'Los campos marcados son obligatorios.')
      for (const key in Validator.data) {
        if (Object.hasOwnProperty.call(Validator.data, key)) {
          const element = Validator.data[key]
          if (!element) {
            if (key === 'reference') {
              continue
            }
            this.ui.alertInput('error', selecter(`#${key}`))
          }
        }
      }
      return false
    }

    // Validamos Username
    const maxUsernameLength = 12
    if (Validator._validateField(username, maxUsernameLength)) {
      return this.ui.alertInput('error', e.querySelector('#username'))
    }

    // Validamos Nombres y apellidos
    const maxNameLength = 26
    const refName = Validator._returnTheReference(name)
    if (Validator._havMaxLength(name, maxNameLength)) {
      this.ui.printAlert(
        'error',
        `Máximo ${maxNameLength} carácteres en el campo ${refName}`
      )
      this.ui.alertInput('error', e.querySelector('#name'))
      return false
    }

    const maxLastnameLength = 26
    const refLastname = Validator._returnTheReference(lastname)
    if (Validator._havMaxLength(lastname, maxLastnameLength)) {
      this.ui.printAlert(
        'error',
        `Máximo ${maxLastnameLength} carácteres en el campo ${refLastname}`
      )
      this.ui.alertInput('error', e.querySelector('#lastname'))
      return false
    }

    // revisar que no hayan espacios en algunos fields
    if (
      Validator._havSpace(username) ||
      Validator._havSpace(numberHouse) ||
      Validator._havSpace(phone) ||
      Validator._havSpace(zipcode)
    ) {
      this.ui.printAlert(
        'error',
        'no puede haber espacios en el campo usuario, contraseña, código postal, teléfono '
      )
      return false
    }

    // Validamos que la contraseña tenga más de 8 carácteres, minúsculas, mayúsculas y símbolos.
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passRegex.test(password)) {
      this.ui.printAlert('error', 'Ingrese una contraseña válida')
      this.ui.alertInput('error', e.querySelector('#password'))
      return false
    }

    // Validamos que la fecha de nacimiento sea válida (no sea mayor al día de hoy)
    if (new Date(birthday) > today) {
      this.ui.printAlert('error', 'Fecha de nacimiento inválida.')
      this.ui.alertInput('error', e.querySelector('#birthday'))
      return false
    }

    // Validamos el correo electrónico
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(email)) {
      this.ui.printAlert('error', 'Correo electrónico inválido')
      this.ui.alertInput('error', e.querySelector('#email'))
      return false
    }

    // Validamos el teléfono celular
    const phoneRegex = /^\x2b(\d{0,3})\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/
    if (!phoneRegex.test(phone)) {
      this.ui.printAlert('error', 'Número de teléfono erróneo')
      this.ui.alertInput('error', e.querySelector('#phone'))
      return false
    }
    const dniRegex = /^[VvEeJjGg]-\d{0,3}.\d{0,3}.\d{0,3}-?\d{0,1}/
    if (!dniRegex.test(dni)) {
      this.ui.printAlert('error', 'Número de Cédula erróneo')
      this.ui.alertInput('error', e.querySelector('#dni'))
      return false
    }

    // Validamos el campo de referencia (este puede estar vacío)
    const maxReferenceLength = 120
    const refReference = Validator._returnTheReference(reference)
    if (Validator._havMaxLength(reference, maxReferenceLength)) {
      this.ui.printAlert(
        'error',
        `Máximo ${maxReferenceLength} carácteres en el campo ${refReference}`
      )
      this.ui.alertInput('error', e.querySelector('#reference'))
      return false
    }

    // Validamos las respuestas de seguridad (no pueden estar vacíos o contener cosas raras)
    const maxAnswerLength = 24
    const aOneRef = Validator._returnTheReference(answerOne)
    if (Validator._havMaxLength(answerOne, maxAnswerLength)) {
      this.ui.printAlert('error', `Máximo ${maxAnswerLength} carácteres en el campo ${aOneRef}`)
      this.ui.alertInput('error', e.querySelector('#answerOne'))
      return false
    }

    const aTwoRef = Validator._returnTheReference(answerTwo)
    if (Validator._havMaxLength(answerTwo, maxAnswerLength)) {
      this.ui.printAlert('error', `Máximo ${maxAnswerLength} carácteres en el campo ${aTwoRef}`)
      this.ui.alertInput('error', e.querySelector('#answerTwo'))
      return false
    }

    if (questionOne === questionTwo) {
      this.ui.printAlert('error', 'Seleccione dos preguntas de seguridad diferentes')
      this.ui.alertInput('error', selecter('#questionOne'))
      this.ui.alertInput('error', selecter('#questionTwo'))
      return false
    }
    // Si todo pasa entonces:
    // enviamos la petición we :v
    // llamamos a la función que imprimirá la siguiente vista
    // na solo mandamos un true :v
    return true
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
    if (string.length > maxLength) {
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
  static _validateField (reference, maxLength, data) {
    const field = Validator._returnTheReference(reference, data)
    if (Validator._havMaxLength(reference, maxLength)) {
      this.ui.printAlert('error', `Máximo ${maxLength} carácteres en el campo ${field}`)
      return true
    }
    if (Validator._havSymbols(reference)) {
      this.ui.printAlert('error', `No son admitidos los símbolos en el campo ${field}`)
      return true
    }
    return false
  }

  /**
   * Retorna el nombre de la propiedad que se esté pasando
   * @param {string} prop
   * @returns {string}
   */
  static _returnTheReference (prop, data = this.data) {
    const tObj = Object.entries(data)
      .filter(e => e.includes(prop))
      .flat()
    const name = tObj.shift()
    return name
  }

  validateUser (username, e, data) {
    const maxUsernameLength = 12
    // Validamos Username
    if (!username) {
      this.ui.alertInput('error', e)
      this.ui.printAlert('error', 'Ingrese un usuario válido')
      return true
    } else if (Validator._validateField(username, maxUsernameLength, data)) {
      this.ui.alertInput('error', e)
      return true
    } else {
      this.ui.alertInput('success', e)
      return false
    }
  }

  validatePassword (password, e) {
    // Validamos que la contraseña tenga más de 8 carácteres, minúsculas, mayúsculas y símbolos.
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passRegex.test(password)) {
      this.ui.printAlert('error', 'Ingrese una contraseña válida')
      this.ui.alertInput('error', e)
      return true
    } else {
      this.ui.alertInput('success', e)
      return false
    }
  }
}
