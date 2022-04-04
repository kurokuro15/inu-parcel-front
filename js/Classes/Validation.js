import { formToJSON } from '../GlobalSelectors.js'
import Ui from './Ui.js'
export default class Validator {
  /**
   * Validación del cuerpo del formulario de registro
   * @param {Event} e evento Submit
   */
  static signinForm (e) {
    e.preventDefault()
    this.data = formToJSON(e.target)
    const today = new Date()
    const {
      birthday,
      email,
      lastname,
      name,
      numberHouse,
      password,
      phone,
      reference,
      street,
      username,
      zipcode,
      sex,
      country,
      state,
      municipality,
      parish
    } = this.data
    console.log(this.data)
    // validamos que no estén vacíos los requeridos
    if (
      !(
        email &&
        name &&
        lastname &&
        numberHouse &&
        password &&
        phone &&
        birthday &&
        username &&
        street &&
        sex &&
        country &&
        state &&
        municipality &&
        parish
      )
    ) {
      console.log('está vacío')
      return Ui.printAlert('error', 'Los campos son obligatorios.')
    }
    // revisar que no hayan espacios en algunos fields
    if (
      this._havSpace(username) ||
      this._havSpace(numberHouse) ||
      this._havSpace(phone) ||
      this._havSpace(zipcode)
    ) {
      return Ui.printAlert(
        'error',
        'no puede haber espacios en el campo usuario, contraseña, código postal, teléfono '
      )
    }
    // Validamos que la contraseña tenga más de 8 carácteres, minúsculas, mayúsculas y símbolos.
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passRegex.test(password)) {
      return Ui.printAlert('error', 'Ingrese una contraseña válida')
    }

    // Validamos que la fecha de nacimiento sea válida (no sea mayor al día de hoy)
    if (new Date(birthday) > today) {
      return Ui.printAlert('error', 'Fecha de nacimiento inválida.')
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(email)) {
      return Ui.printAlert('error', 'Correo electrónico inválido')
    }
    const phoneRegex = /^\x2b\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/
    if (!phoneRegex.test(phone)) {
      return Ui.printAlert('error', 'Número de teléfono erróneo')
    }
  }

  _havSpace (string) {
    if (string.include(' ')) {
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

  _havMaxLength (string, maxLength) {
    if (string.length >= maxLength) {
      return true
    }
    return false
  }

  _havSymbols (string) {
    const regex = /\W+/
    return regex.test(string)
  }

  _validateReferenceField (reference) {
    const field = this._returnTheReference(reference)
    const maxLength = 120
    if (this._havMaxLength(reference, maxLength)) {
      return Ui.printAlert('error', `Máximo ${maxLength} carácteres en el campo ${field}`)
    }
    if (this._havSymbols(reference)) {
      return Ui.printAlert('error', `No son admitidos los símbolos en el campo ${field}`)
    }
  }

  _returnTheReference (prop) {
    const name = Object.entries(this.data).filter(e => e.includes(prop)).flat().shift()
    return name
  }
}
