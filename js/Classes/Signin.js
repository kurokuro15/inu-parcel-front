import Ui from './Ui.js'
import Validator from './Validation.js'
import app from '../main.js'
import Config from '../Config.js'
import { fetch, formToJSON } from '../GlobalSelectors.js'
export default class SignIn {
  constructor (event) {
    // prevenimos el evento por defecto y leemos el formulario creando un Json del mismo
    event.preventDefault()
    this.form = event.target
    this.ui = new Ui()
  }

  signin () {
    if (this._validateForm()) {
      this._fetchSign(formToJSON(this.form))
        .then(result => {
          if (result) {
            app.logon()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    // hacemos el fetch
    // Si el fetch va todo nice, entonces lo redirigimos a iniciar sesión
    // con un lindo mensaje verde de 'cuenta creada'
    // app.toLogin()
  }

  _validateForm () {
    // si solo hago esto acá, porque luego la refactorizaré seguramente xD
    return Validator.validateSignin(this.form)
  }

  async _fetchSign (dataForm) {
    const url = Config.apiUrl + 'user'
    // Preparamos  la petición POST
    // Cabecera
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json'
    })
    const {
      name,
      lastname: lsname,
      dni,
      sex,
      birthday,
      country,
      state,
      municipality,
      parish,
      zipcode,
      numberHouse: numberhouse,
      street,
      reference,
      questionOne,
      answerOne,
      questionTwo,
      answerTwo,
      username: user,
      password,
      phone,
      email
    } = dataForm
    // Picamos el nombre y el apellido en dos si es posible xD
    const [firstname, secondname] = this._splitString(name)
    const [lastname, secondlastname] = this._splitString(lsname)

    // Preparo el body acá, si, mucho texto pero es porque algunas variables no son iguales xD
    const body = {
      firstname,
      secondname,
      lastname,
      secondlastname,
      dni,
      sex,
      birthday,
      country,
      state,
      municipality,
      parish,
      zipcode,
      numberhouse,
      street,
      reference,
      questionOne,
      answerOne,
      questionTwo,
      answerTwo,
      user,
      password,
      phone,
      email
    }
    console.log(body)

    // Contenido de la petición

    const init = {
      method: 'POST',
      headers: header,
      body: JSON.stringify(body),
      mode: 'cors',
      cache: 'default'
    }

    // Petición
    // eslint-disable-next-line no-undef
    const request = new Request(url, init)

    // Hacemos el rico fecth...
    const response = await fetch(request)

    if (response.error_id) {
      // enviar un printAlert para indicar el error con el mensaje
      const msg = response.error_msg
      this.ui.printAlert('error', msg)
      return false
    }

    if (response.id) {
      // enviar un printAlert para indicar con éxito la creación del usuario
      const msg = response.msg
      this.ui.printAlert('success', msg)
      return true
    }
  }

  /**
   * Verifica si el string que se pase tiene espacios, de ser así, lo pica y devuelve un arreglo de 2 elementos máximo.
   * @param {string} string la cadena de texto a cortar
   * @returns
   */
  _splitString (string = '') {
    if (string.includes(' ')) {
      const arr = string.split(' ', 2)
      return arr
    }
    return string
  }
}
