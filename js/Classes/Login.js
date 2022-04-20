import { formToJSON, fetch, localStorage } from '../GlobalSelectors.js'
import Validator from './Validation.js'
import Config from '../Config.js'
import Ui from './Ui.js'
import app from '../main.js'
export default class Login {
  constructor (event) {
    // prevenimos el evento por defecto y leemos el formulario creando un Json del mismo
    event.preventDefault()
    this.form = event.target
    this.ui = new Ui()
  }

  login () {
    if (this._validateForm()) {
      this._fetchAuth(this.data).then(res => {
        if (res) {
          app.logon()
        }
      })
    }
  }

  _validateForm () {
    const validator = new Validator()
    this.data = formToJSON(this.form)
    const { username, password } = this.data

    if (validator.validateUser(username, this.form.username, this.data)) {
      return false
    }
    if (validator.validatePassword(password, this.form.password)) {
      return false
    }
    return true
  }

  async _fetchAuth (dataForm) {
    // preparamos la uri
    const url = Config.apiUrl + 'auth'

    // Preparamos  la petición POST
    // Cabecera
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json'
    })
    // Cuerpo
    const { username: user, password } = dataForm
    const body = { user, password }

    // Contenido de la petición
    const init = {
      method: 'POST',
      headers: header,
      body: JSON.stringify(body),
      mode: 'cors',
      cache: 'default'
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
    }

    if (response.token) {
      // ¿Validamos su existencia? y lo almacenamos?
      const { token } = response
      // almacenamos el token...
      localStorage.setItem('token', token)
      // y nos vamos de acá para que se encargue el cargador de interface
      return true
      // Nos vamos a la próxima interface ...
    }
    return false
  }
}
