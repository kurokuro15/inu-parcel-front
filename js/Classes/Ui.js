import { container, createElement, parcelData, selecter, parcelObj, validationWhatSend, reset } from '../GlobalSelectors.js'
import config from '../Config.js'
import Parcel from './Parcel.js'
export default class Ui {
  constructor () {
    this.config = config
  }

  /**
   * Crea la cabecera de la app.
   */
  header () {
    const headerText = createElement('h1')
    headerText.textContent = 'Cotizador de envíos'
    headerText.classList.add('title', 'text-center', 'my-2', 'text-uppercase')

    const header = createElement('header')
    header.appendChild(headerText)
    const hr = createElement('hr')

    container.appendChild(header)
    container.appendChild(hr)
  }

  printAlert (type, messange) {
    // XD ya el time y la cabeza no me dan para refactorizar estas cosas :v Por ahora
    if (selecter('div.alert')) {
      selecter('div.alert').remove()
    }

    // Crea el div
    const divMessange = document.createElement('div')
    divMessange.classList.add('text-center', 'alert', 'd-block', 'col-12')

    // Si es de tipo error agrega una clase
    if (type === 'error') {
      divMessange.classList.add('alert-danger')
    } else {
      divMessange.classList.add('alert-success')
    }

    // Messange de error
    divMessange.textContent = messange

    // Insertar en el DOM
    container.insertBefore(divMessange, document.querySelector('main'))

    // Quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMessange.remove()
    }, 3000)
  }

  /**
   * Crea el cuerpo de la app y presenta el primer paso: ¿Qué envías?
   */
  main () {
    this.mainElement = createElement('main')
    this.mainElement.classList.add('my-3', 'text-center')
    container.appendChild(this.mainElement)

    // Esto verifica que no exista ya el formulario.
    if (!document.querySelector('form.whatsend')) {
      this.whatSend()
    }
  }

  /**
   * Crea la vista de ¿Qué envías? pidiendo el tipo, el valor, dimensiones y peso del producto
   */
  whatSend () {
    // Limpiamos por si las moscas
    this.clearHtml(this.mainElement)

    const { productsType } = this.config

    // Creamos el título de la vista.
    this._subtitleCreate(this.mainElement, '¿Qué envías?')

    // Creamos el formulario que contendrá la vista.
    const form = createElement('form')
    form.classList = 'row align-items-center justify-content-center g-3 m-2 pb-3'

    // Preparamos las opciones de encomiendas
    const options = productsType
      .map(productType => {
        const { type } = productType
        return `<option value="${type}">${type}</option>`
      })
      .join('')
    // Como es 'mucho texto' creamos un string con el contenido HTML del select
    const select = `
    <div class="col-md-6">
      <div class="input-group input-group-lg">
      <span class="input-group-text">Tipo</span>
      <select name="type" id='type' class="form-select">
      <option selected disabled>Tipo de encomienda</option>
      ${options}
      </select>
      </div>
    </div>
    `

    // Un poco de lo mismo but, con el input que tendrá el valor de la encomienda
    const valueInput = `
    <div class="col-md-6">
      <div class="input-group input-group-lg">
        <span class="input-group-text">Valor</span>
        <input id="value" class="form-control text-end" type="text" placeholder="0.00"/>
        <span class="input-group-text">U$D</span>
      </div>
    </div>
    `
    // Se define los tres inputs de las dimensiones, alto por ancho por alto
    const dimensionInput = `
    <div class="col-md-8">
      <div class="input-group input-group-lg">
        <span class="input-group-text">Dimensión (LxWxH)</span>
        <input
          id="length"
          class="form-control text-center"
          type="text"
          placeholder="0.00"
        />
        <input
          id="width"
          class="form-control text-center"
          type="text"
          placeholder="0.00"
        />
        <input
          id="high"
          class="form-control text-center"
          type="text"
          placeholder="0.00"
        />
        <span class="input-group-text">CM</span>
      </div>
    </div>
    `
    // Más de lo mismo, con el input de peso
    const weight = `
    <div class="col-md-4">
      <div class="input-group input-group-lg">
        <span class="input-group-text">Peso</span>
        <input id="weight" class="form-control" type="text" placeholder="0.00" />
        <span class="input-group-text">Kgrs</span>
      </div>
    </div>
    `
    const button = `
    <button class="btn btn-primary col-2 " type ="submit">siguiente</button>
    `
    // Introducimos todo el texto como html al formulario y el formulario al marco principal
    form.innerHTML = `${select}${valueInput}${dimensionInput}${weight}${button}`
    this.mainElement.appendChild(form)

    // Acá le metemos esa función, que ahorita reemplazaré por la de validación.. O la añado global? :v
    // acá falta la validación. Se me ocurre validar el objeto en lugar de los inputs
    selecter('#type').addEventListener('change', parcelData)
    selecter('#value').addEventListener('change', parcelData)

    selecter('#length').addEventListener('change', parcelData)
    selecter('#width').addEventListener('change', parcelData)
    selecter('#high').addEventListener('change', parcelData)
    selecter('#weight').addEventListener('change', parcelData)
    form.addEventListener('submit', e => {
      const messange = validationWhatSend(e)
      if (messange) {
        if (messange === 'success') {
          return this.whereSend()
        }
        this.printAlert('error', messange)
      }
    })
  }

  /**
   * Crea la vista de ¿desde donde envías? pidiendo la dirección emisora del paquete
   */
  whereSend () {
    this.clearHtml(this.mainElement)

    // Creamos el título de la vista.
    this._subtitleCreate(this.mainElement, '¿A donde envías?')

    // Creamos el formulario que contendrá la vista.
    const form = createElement('form')
    form.classList = 'row align-items-center g-3 m-2 pb-3 justify-content-center'
    // Traemos el selector de direcciones y lo metemos en el form...
    form.innerHTML = `
    <div class="col-auto ">
      <div class="input-group input-group-lg">
      <span class="input-group-text">Destinatario</span>
      </div>
    </div>
    `
    // Generamos el select de direcciones para 'from'
    const address = this._addressSelector()
    address.id = 'receivingAddress'
    address.addEventListener('change', e => { parcelData(e); this.fromWhere(this.mainElement) })
    // Un poco chapuza puede ser. Pero para no estar escribiendo tanto... :'u
    form.firstElementChild.firstElementChild.appendChild(address)
    this.mainElement.appendChild(form)
  }

  /**
   * Crea la vista de ¿hacia donde envías? pidiendo la dirección receptora del paquete
   */
  fromWhere () {
    this.clearHtml(this.mainElement)

    // Creamos el título de la vista.
    this._subtitleCreate(this.mainElement, '¿Desde donde envías?')

    // Creamos el formulario que contendrá la vista.
    const form = createElement('form')
    form.classList = 'row align-items-center g-3 m-2 pb-3 justify-content-center'
    // Traemos el selector de direcciones y lo metemos en el form...
    form.innerHTML = `
    <div class="col-auto ">
      <div class="input-group input-group-lg">
      <span class="input-group-text">Remitente</span>
      </div>
    </div>
    `
    // Generamos el select de direcciones para 'to'
    const address = this._addressSelector()
    address.id = 'senderAddress'
    address.addEventListener('change', (e) => { parcelData(e); this.shippingDetail(this.mainElement) })
    // Un poco chapuza puede ser. Pero para no estar escribiendo tanto... :'u
    form.firstElementChild.firstElementChild.appendChild(address)
    this.mainElement.appendChild(form)
  }

  /**
   * Crea la vista de Tarifa de envío mostrando la tarifa y preguntando si quiere seguro
   *  La tarifa incluye: Precio del envío, tiempo estimado, distancia recorrida
   *  Se permite la opción de no asegurar
   */
  shippingDetail () {
    this.clearHtml(this.mainElement)
    // Traemos la clase Parcel y hacemos una instancia.
    const parcel = new Parcel(parcelObj)

    // llamamos al método que nos devuelve los cálculos :D
    const presupuesto = parcel.getParcel()

    const { raw, tax, amount, origin, destiny, distance, time, distanceUnit, timeUnit } = presupuesto

    const article = createElement('article')
    article.classList.add('row', 'justify-content-center')
    article.innerHTML = `
    <div class="col-md-6">
      <div class="card">
        <h2 class="card-header border-success">Tarifa propuesta</h2>
          <table class="table table-borderless table-sm m-0 p-0">
            <tbody>
              <tr>
                <th>Precio neto:</th>
                <td>${raw}U$D</td>
              </tr>
              <tr>
                <th>IVA:</th>
                <td>${tax}U$D</td>
              </tr>
              <tr>
                <th>Total:</th>
                <td class="fw-bold">${amount}U$D</td>
              </tr>
            </tbody>
          </table>
          <div class='border-top'>
            <section class="card-group justify-content-around pt-2">
              <p>${origin}</p>
              <div>
                <span class="material-icons">double_arrow</span>
                <span class="material-icons-outlined">local_shipping</span>
                <span class="material-icons">double_arrow</span>
              </div>
              <p>${destiny}</p>
            </section>
            <section class="card-group justify-content-center">
              <p>${distance} ${distanceUnit}</p>
            </section>
            <section class="card-group justify-content-center">
            <span class="material-icons-outlined">watch_later</span>
            <p>${time} ${timeUnit}</p>
            </section>
            <button class="btn btn-primary m-2">Nueva encomienda</button>
          </div>
      </div>
    </div>
    `
    this.mainElement.appendChild(article)
    selecter('button.btn').addEventListener('click', (e) => { reset(), this.whatSend() })
  }

  /**
   * Limpia la vista para no crear elementos html innecesarios
   */
  clearHtml (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  /**
   * función que permite retroceder a la vista anterior
   */
  toBack (present, previous) {}

  // Es privada pero por cosas de StandardJS no utilicé el #.
  // Este método crea un subtitulo pasándole el texto y el contenedor del subtitulo
  _subtitleCreate (main, text) {
    const h2 = createElement('h2')
    h2.textContent = text
    h2.classList.add('sub-title')
    main.appendChild(h2)
  }

  // Es privada pero por cosas de StandardJS no utilicé el #.
  // Este método crea un selector de direcciones iterables
  _addressSelector () {
    const { addresses } = this.config

    const select = createElement('select')
    select.classList.add('form-select')
    const options = addresses.map((address) => {
      const { id, name } = address
      return `<option value='${id}'>${name}</option>`
    }).join('')

    select.innerHTML = `
    <div class="col-md-6">
      <div class="input-group input-group-lg">
      <span class="input-group-text">Tipo</span>
      <select id='type' class="form-select">
      <option selected disabled>Selecciona una dirección...</option>
      ${options}
      </select>
      </div>
    </div>
    `
    return select
  }
}
