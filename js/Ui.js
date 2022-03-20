import { container, createElement } from './GlobalSelectors.js'
import config from './Config.js'

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
    container.appendChild(header)
  }

  /**
   * Crea el cuerpo de la app y presenta el primer paso: ¿Qué envías?
   */
  main () {
    const main = createElement('main')
    main.classList.add('my-3', 'text-center')
    container.appendChild(main)
    if (!document.querySelector('form.whatsend')) {
      this.whatSend(main)
    }
  }

  /**
   * Crea la vista de ¿Qué envías? pidiendo el tipo, el valor, dimensiones y peso del producto
   */
  whatSend (main) {
    // Limpiamos por si las moscas
    this.clearHtml(main)

    const { productsType } = this.config

    // Creamos el título de la vista.
    this._subtitleCreate(main, '¿Qué envías?')

    // Creamos el formulario que contendrá la vista.
    const form = createElement('form')
    form.classList = 'row align-items-center g-3 m-2 pb-3'

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
      <select id='type' class="form-select">
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
          id="lenth"
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
        <span class="input-group-text">Mts</span>
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
    // Introducimos todo el texto como html al formulario y el formulario al marco principal
    form.innerHTML = `${select}${valueInput}${dimensionInput}${weight}`
    main.appendChild(form)

    // esto se supone será para darle cambio a la siguiente vista, una vez se valide al información :v
    form.addEventListener('change', e => {
      e.preventDefault()
      console.log('está cambiando algo dentro del form')
      console.log(e.target.value)
      this.fromWhere(main)
    })
  }

  /**
   * Crea la vista de ¿desde donde envías? pidiendo la dirección emisora del paquete
   */
  fromWhere (main) {
    this.clearHtml(main)

    // Creamos el título de la vista.
    this._subtitleCreate(main, '¿A donde envías?')

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
    address.id = 'from'
    // Un poco chapuza puede ser. Pero para no estar escribiendo tanto... :'u
    form.firstElementChild.firstElementChild.appendChild(address)
    main.appendChild(form)

    // Esto no más es para ir cambiando rápido entre vistas por ahora :v
    form.addEventListener('change', e => {
      e.preventDefault()
      console.log('está cambiando algo dentro del form')
      console.log(e.target.value)
      this.toWhere(main)
    })
  }

  /**
   * Crea la vista de ¿hacia donde envías? pidiendo la dirección receptora del paquete
   */
  toWhere (main) {
    this.clearHtml(main)

    // Creamos el título de la vista.
    this._subtitleCreate(main, '¿Desde donde envías?')

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
    address.id = 'to'
    // Un poco chapuza puede ser. Pero para no estar escribiendo tanto... :'u
    form.firstElementChild.firstElementChild.appendChild(address)
    main.appendChild(form)

    // Esto no más es para ir cambiando rápido entre vistas por ahora :v
    form.addEventListener('change', e => {
      e.preventDefault()
      console.log('está cambiando algo dentro del form')
      console.log(e.target.value)
      this.shippingDetail(main)
    })
  }

  /**
   * Crea la vista de Tarifa de envío mostrando la tarifa y preguntando si quiere seguro
   *  La tarifa incluye: Precio del envío, tiempo estimado, distancia recorrida
   *  Se permite la opción de no asegurar
   */
  shippingDetail (main) {}

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
