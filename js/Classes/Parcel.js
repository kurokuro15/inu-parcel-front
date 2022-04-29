import Config from '../Config.js'
import { fetch, localStorage } from '../GlobalSelectors.js'
export default class Parcel {
  constructor ({
    value,
    length,
    width,
    high,
    weight,
    type,
    senderAddress,
    receivingAddress
  }) {
    this.value = value
    this.dimensions = { length, width, high }
    this.weight = weight
    this.type = type
    this.config = Config

    // Tengo acá un problema. Debo parsear el ID de las direcciones.. Creo que Con Number se resuelve :V.
    ;[this.senderAddress] = this.config.addresses.filter(
      ad => ad.id === Number(senderAddress)
    )
    ;[this.receivingAddress] = this.config.addresses.filter(
      ad => ad.id === Number(receivingAddress)
    )
    this.distance = 0
    this.token = localStorage.getItem('token')
  }

  /**
 * Calcularemos el intervalo o distancia entre la dirección de envío y de recepción
 * @return {object}
 */
  calInterval () {
    const { length: L } = this.config.units
    const TO_KILOMETERS = 1000
    let distanceUnit = ''
    let distance = 0
    if (!this.senderAddress && !this.receivingAddress) {
      return { error: 'No hay dirección asignada.' }
    }
    const { name: senderName, x: senderX, y: senderY } = this.senderAddress
    const { name: receivingName, x: receivingX, y: receivingY } = this.receivingAddress

    // Función de distancia entre 2 puntos
    this.distance = Math.sqrt(
      (receivingX - senderX) ** 2 + (receivingY - senderY) ** 2
    ).toFixed(2)

    if (this.distance >= 1000) {
      distance = (this.distance / TO_KILOMETERS).toFixed(2)
      distanceUnit = distance === 1 ? L.singular[2] : L.plural[2]
    } else {
      distanceUnit = distance === 1 ? L.singular[1] : L.plural[1]
    }
    return { senderName, receivingName, distance, distanceUnit }
  }

  /**
   * Calcularemos la tarifa por kilómetro que tendrá el paquete.
   * @returns {object}
   */
  calRate () {
    const { minRate, costPkilo } = this.config.transportFees
    const { weight } = this.calGage()
    const rate = weight * costPkilo
    return rate > minRate ? rate : minRate
  }

  /**
  * Calcularemos que es más relevante, sí el peso o las dimensiones.
  *
 * @returns {object}
 */
  calGage () {
    const { singular, plural } = this.config.units.weight
    const { length, width, high } = this.dimensions
    // esta constante es un millón, debido a la división individual de centímetros/100 para cada unidad. 100 * 100 * 100 = un millón
    const TO_METERS = 1000000
    const volumen = (length * width * high) / TO_METERS
    const volumetricWeight = volumen * this.config.transportFees.conversionFactor

    const weightUnit =
      this.weight === 1 && volumetricWeight === 1 ? singular[1] : plural[1]

    return {
      volumen: volumen,
      weight: volumetricWeight > this.weight ? volumetricWeight : this.weight,
      weightUnit
    }
  }

  /**
   *Calculamos el tiempo que tardará en llegar el paquete del origen al destino
   * @returns {object}
   */
  calTime () {
    // Tengo un buggisto acá que arreglar :'u
    const { time: T } = this.config.units
    const TO_MINUTES = 60
    // Para calcular el tiempo se toma la distancia y se divide por la constante de velocidad. (para efectos prácticos y no fumarnos un porro del tamaño de la torre ifel)
    const kilometers = this.distance / 1000
    let time = (kilometers / this.config.speedConst).toFixed(2)
    let timeUnit = ''
    if (time >= 1) {
      timeUnit = time === 1 ? T.singular[1] : T.plural[1]
    } else {
      time = (time * TO_MINUTES).toFixed(0)
      timeUnit = time === 1 ? T.singular[0] : T.plural[0]
    }

    return { time, timeUnit }
  }

  /**
   * Calculamos los impuestos
   * @param {number} net monto neto del envío.
   * @returns {object}
   */
  calTax (net) {
    const subtotal = net + this.config.transportFees.manipulationCost
    const tax = (subtotal * this.config.transportFees.taxtConst) / 100
    const total = tax + subtotal
    return { tax, raw: subtotal, amount: total }
  }

  /**
   * Método de depuración, devuelve la cotización 'cruda'
   * @returns {string}
   */
  showParcel () {
    return `Encomienda de tipo: ${this.type}
Dimensiones: ${JSON.stringify(this.dimensions)}
Peso:${this.weight}
Dirección de Emisión:${JSON.stringify(this.senderAddress)}
Dirección de recepción:${JSON.stringify(this.receivingAddress)}`
  }

  /**
   * Devoleremos los montos y la información para 'imprimir' de la cotización
   * @returns {object}
   */
  getParcel () {
    const { raw, tax, amount } = this.calTax(this.calRate())
    const { senderName, receivingName, distance, distanceUnit } = this.calInterval()
    const { time, timeUnit } = this.calTime()
    const { volumen, weight, weightUnit } = this.calGage()
    const rate = this.calRate()
    this.parcel = {
      amount,
      destiny: receivingName,
      distance,
      distanceUnit,
      origin: senderName,
      rate,
      raw,
      tax,
      time,
      timeUnit,
      volumen,
      weight,
      weightUnit
    }
    return this.parcel
  }

  /**
 * Metodo de inserción de encomienda en la REST API
 * @param {function} callback
 * @returns {boolean}
 */
  postParcel (callback) {
    const { weight, amount, volumen } = this.parcel
    const { x: senderX, y: senderY } = this.senderAddress
    const { x: receivingX, y: receivingY } = this.receivingAddress
    const destination = {
      longitude: receivingX,
      latitude: receivingY
    }
    const origin = {
      longitude: senderX,
      latitude: senderY
    }

    // eslint-disable-next-line no-undef
    const header = new Headers({
      'Content-Type': 'application/json',
      token: this.token
    })

    const body = {
      type: this.type,
      destination,
      origin,
      volumen,
      weight,
      value: this.value,
      amount,
      user: 'kurokuro15'
    }

    return this._fetch({ method: 'POST', header, body }, response => {
      if (response.id) {
        callback(response)
      } else return false
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
    const url = Config.apiUrl + 'parcel'

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
