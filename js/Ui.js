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
    const { productsType } = this.config

    // Creamos el título de la vista.
    const h2 = createElement('h2')
    h2.textContent = '¿Qué Envías?'
    h2.classList.add('sub-title')
    main.appendChild(h2)

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

    const dimensionInput = `
    <div class="col-md-8">
      <div class="input-group input-group-lg">
        <span class="input-group-text">Dimensión</span>
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
    const weight = `
    <div class="col-md-4">
      <div class="input-group input-group-lg">
        <span class="input-group-text">Peso</span>
        <input id="weight" class="form-control" type="text" placeholder="0.00" />
        <span class="input-group-text">Kgrs</span>
      </div>
    </div>
    `
    form.innerHTML = `${select}${valueInput}${dimensionInput}${weight}`

    main.appendChild(form)
    form.addEventListener('change', e => {
      e.preventDefault()
      console.log('está cambiando algo dentro del form')
      console.log(e.target.value)
    })
  }

  /**
   * Crea la vista de ¿desde donde envías? pidiendo la dirección emisora del paquete
   */
  fromWhere (main) {}

  /**
   * Crea la vista de ¿hacia donde envías? pidiendo la dirección receptora del paquete
   */
  toWhere (main) {}

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
    while (parent.firstChild()) {
      parent.removeChild(parent.firstChild())
    }
  }

  /**
   * función que permite retroceder a la vista anterior
   */
  toBack (present, previous) {}
}
