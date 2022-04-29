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

  /**
   * Método de progresión del registro, valida el formulario, realiza la petición
   * y posteriormente retorna a iniciar sesión si todo está OK.
   * Caso contrario irá mostrando errores informativos.
   */
  signin () {
    // Validamos el formulario
    if (Validator.validateSignin(this.form)) {
      // hacemos el fetch pasando como parámetro el JSON del Formulario
      this._fetchSign(formToJSON(this.form))
        .then(result => {
          // si hay respuesta nos vamos a iniciar sesión
          if (result) {
            app.logon()
          }
        })
        .catch(err => {
          // si algún error ocurre mostramos el error en pantalla y consola
          this.ui.printAlert('error', err)
          console.log(err)
        })
    }
  }

  /**
   * Método asíncrono para la creación del usuario. Toma los datos del formulario validado y devuelve una respuesta con el id del usuario creado.
   * @param {object} dataForm
   * @returns {boolean}
   */
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
