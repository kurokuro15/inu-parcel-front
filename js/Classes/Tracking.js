import { localStorage, fetch } from '../GlobalSelectors.js'
import Config from '../Config.js'
export default class Tracking {
  constructor () {
    this.token = localStorage.getItem('token')
  }

  /**
   * Obtiene la información de todos los envíos realizados en la plataforma...
   * @param {function} callback
   * @returns {Promise | function} response
   */
  getAllTracking (callback) {
    // capturamos una vez más el token por si no está capturado al iniciar la clase...
    this.token = localStorage.getItem('token')
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json',
      token: this.token
    })

    return this._fetch({ method: 'GET', header }, '', callback)
  }

  /**
   *  Obtiene la información de un envío al pasarle el número de tracking
   * @param {string} tracking
   * @param {function} callback
   * @returns {callback}
   */
  getTracking (tracking = '', callback) {
    if (!tracking) {
      return this.getAllTracking(callback)
    }
    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json',
      token: this.token
    })
    return this._fetch({ method: 'GET', header }, { tracking }, response => {
      if (response) {
        console.log(response)
        return callback(response)
      } else return false
    })
  }

  /**
   * Basic Fetch promise
   * @param {object} request
   * @param {object} params
   * @param {function} callback
   * @returns
   */
  async _fetch ({ method, header, body = null }, params = null, callback) {
    // preparamos la uri
    const url = new URL(Config.apiUrl + 'parcel')
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }
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
