import { formToJSON, fetch, selecter } from '../GlobalSelectors.js'
import Validator from './Validation.js'
import Config from '../Config.js'
import Ui from './Ui.js'

export default class Forgot {
  constructor (event) {
    // prevenimos el evento por defecto y leemos el formulario creando un Json del mismo
    this.updateStateForm(event)
    this.ui = new Ui()
    this.validator = new Validator()
    this.count = 0
  }

  /**
   * Método inicial para comenzar el proceso de reset password
   * @param {this} step
   */
  async forgotPass (handle, step) {
    // first step. Primero tomamos el usuario o correo y devolvemos las preguntas asociadas para que respondan
    if (handle === 'forgot-user') {
      if (this._handleForgotUser()) {
        const questions = await this._fetchForgotuser()
        if (questions) {
          return step(questions)
        }
      }
    }
    if (handle === 'forgot-question') {
      if (this._handleForgotQuestion()) {
        const token = await this._fetchForgotQuestion()
        if (token) {
          this.token = token
          return step()
        }
      }
    }

    if (handle === 'forgot-password') {
      if (this._handleForgotPassword()) {
        const affected = await this._fetchForgotPassword()
        if (affected) {
          return step()
        }
      }
    }
  }

  /**
   * Método para manejar el primer formulario
   * @returns {Boolean}
   */
  _handleForgotUser () {
    const { username } = this.data

    if (this._validateMail(username)) {
      // console.log('es un email')
      this.email = username
      return true
    } else if (this._validateUser(username, this.form.username, this.data)) {
      // console.log('es un usuario')
      this.user = username
      return true
    }
    return false
  }

  /**
   * Método para manejar el segundo formulario
   * @returns {Bollean}
   */
  _handleForgotQuestion () {
    const { answerOne, answerTwo } = this.data
    if (this._validateAnswers({ answerOne, answerTwo })) {
      this.answerOne = answerOne
      this.answerTwo = answerTwo
      return true
    }
    return false
  }

  /**
   * Método para manejar el tercer formulario
   * @returns {Boolean}
   */
  _handleForgotPassword () {
    const { password, repeatPassword } = this.data
    if (this._validatePassword(password) || this._validatePassword(repeatPassword)) {
      if (password === repeatPassword) {
        this.password = password
        return true
      }
      this.ui.printAlert('error', 'Las contraseñas deben coincidir')
      return false
    }
    return false
  }

  /**
   * Método para validar el correo electrónico en cuestión
   * @param {string} email
   * @returns {Boolean}
   */
  _validateMail (email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
    if (emailRegex.test(email)) {
      // this.ui.printAlert('error', 'Correo electrónico inválido')
      this.ui.alertInput('success', selecter('#username'))
      return true
    }
    return false
  }

  /**
   * Método para validar el usuario en cuestión
   * @param {string} username
   * @param {Event} e
   * @param {FormData} data
   * @returns {Boolean}
   */
  _validateUser (username, e, data) {
    const maxUsernameLength = 64
    // Validamos Username
    if (!username) {
      this.ui.alertInput('error', e)
      // this.ui.printAlert('error', 'Ingrese un usuario válido')
      return false
    } else if (Validator._validateField(username, maxUsernameLength, data)) {
      this.ui.alertInput('error', e)
      return false
    } else {
      this.ui.alertInput('success', e)
      return true
    }
  }

  /**
   * Método para validar las respuestas
   * @param {object} answers
   * @returns {Boolean}
   */
  _validateAnswers ({ answerOne, answerTwo }) {
    console.log(answerOne, answerTwo)
    const maxAnswerLength = 24
    const aOneRef = Validator._returnTheReference(answerOne, this.data)
    if (Validator._havMaxLength(answerOne, maxAnswerLength)) {
      this.ui.printAlert(
        'error',
        `Máximo ${maxAnswerLength} carácteres en el campo ${aOneRef}`
      )
      this.ui.alertInput('error', selecter('#answerOne'))
      return false
    }

    const aTwoRef = Validator._returnTheReference(answerTwo, this.data)
    if (Validator._havMaxLength(answerTwo, maxAnswerLength)) {
      this.ui.printAlert(
        'error',
        `Máximo ${maxAnswerLength} carácteres en el campo ${aTwoRef}`
      )
      this.ui.alertInput('error', selecter('#answerTwo'))
      return false
    }
    this.ui.alertInput('success', selecter('#answerOne'))
    this.ui.alertInput('success', selecter('#answerTwo'))
    return true
  }

  /**
   * Método para validar la contraseña
   * @param {string} password
   * @returns {Boolean}
   */
  _validatePassword (password) {
    // Validamos que la contraseña tenga más de 8 carácteres, minúsculas, mayúsculas y símbolos.
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (!passRegex.test(password)) {
      this.ui.printAlert('error', 'Ingrese una contraseña válida')
      this.ui.alertInput('error', selecter('#password'))
      this.ui.alertInput('error', selecter('#repeatPassword'))
      return false
    }
    this.ui.alertInput('success', selecter('#password'))
    this.ui.alertInput('success', selecter('#repeatPassword'))
    return true
  }

  /**
   * Método para actualizar la referencia de formulario conforme vamos avanzando por el forgot password
   * @param {Event} event
   */
  updateStateForm (event) {
    event.preventDefault()
    this.form = event.target
    this.data = formToJSON(this.form)
  }

  /**
   * Método para realizar la peticion de las preguntas de seguridad del usuario
   * @returns {boolean | object}
   */
  async _fetchForgotuser () {
    // Preparamos la primera petición, GET
    // Cabecera
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json',
      email: this.email || '',
      user: this.user || ''
    })

    return this._fetch({ method: 'GET', header: header }, response => {
      if (response.questionOne) {
        // Validamos que existan las preguntas
        const { questionOne, questionTwo } = response

        // retornamos la response si existen las questions...
        if (questionOne && questionTwo) {
          return { questionOne, questionTwo }
        } else return false
        // Nos vamos a la próxima interface ...
      }
    })
  }

  /**
   * Método para realizar las respuestas de seguridad y devolver token del servidor
   * @returns {boolean | string}
   */
  async _fetchForgotQuestion () {
    // Preparamos la segunda petición, POST
    // Cabecera
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json'
    })

    // Cuerpo
    const body = {
      email: this.email || '',
      user: this.user || '',
      answerOne: this.answerOne,
      answerTwo: this.answerTwo
    }
    return this._fetch({ method: 'POST', header, body }, response => {
      if (response.token) {
        return response.token
      } else return false
      // Nos vamos a la próxima interface ...
    })
  }

  /**
   * Método para realizar la petición de cambio de contraseña al servidor
   * @returns {boolean | number}
   */
  async _fetchForgotPassword () {
    // Preparamos la primera petición, PUT
    // Cabecera
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json',
      token: this.token
    })
    // preparamos el cuerpo con la contraseña
    const body = {
      password: this.password
    }
    return this._fetch({ method: 'PUT', header, body }, response => {
      if (response.affected_row) {
        return response.affected_row
      } else return false
      // Nos vamos a la próxima interface ...
    })
  }

  /**
   * Método genérico de fecthing
   * @param {object} params
   * @param {Function} callback
   * @returns {boolean | callback}
   */
  async _fetch ({ method, header, body = null }, callback) {
    // preparamos la uri
    const url = Config.apiUrl + 'auth'

    // Contenido de la petición
    const init = {
      method: method,
      headers: header,
      mode: 'cors',
      cache: 'default',
      body: body ? JSON.stringify(body) : null
    }

    // Petición o Request
    // no está saliendo del aire, o sí? como podría hacer que 'no salga del aire' ? XD
    // eslint-disable-next-line no-undef
    const request = new Request(url, init)
    // hacemos el fecth
    const response = await fetch(request)
    if (response.error_id) {
      // enviar un printAlert para indicar el error con el mensaje
      const msg = response.error_msg
      this.ui.printAlert('error', msg)
      return false
    } else {
      return callback(response)
    }
  }
}
