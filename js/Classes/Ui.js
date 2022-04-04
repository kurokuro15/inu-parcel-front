import config from '../Config.js'
import Validator from './Validation.js'
import {
  container,
  createElement,
  insertDataObj, dataObjParcel, resetDataObj, selecter, validationDataObj
} from '../GlobalSelectors.js'
import Parcel from './Parcel.js'
export default class Ui {
  constructor () {
    this.config = config
  }

  /**
   * Crea la cabecera de la app.
   */
  header (title = 'Cotizador de envíos') {
    const headerText = createElement('h1')
    headerText.textContent = title
    headerText.classList.add('title', 'text-center', 'my-2', 'text-uppercase')

    const header = createElement('header')
    header.appendChild(headerText)
    const hr = createElement('hr')

    container.appendChild(header)
    container.appendChild(hr)
  }

  static printAlert (type, messange) {
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
    this.signinSection()
    // Esto verifica que no exista ya el formulario.
    if (!document.querySelector('form')) {
      this.whatSend()
    }
  }

  /**
   * Crea la vista de ¿Qué envías? pidiendo el tipo, el valor, dimensiones y peso del producto
   */
  whatSend () {
    // Limpiamos por si las moscas
    this._clearHtml(this.mainElement)

    const { productsType } = this.config

    // Creamos el título de la vista.
    this._subtitleCreate('¿Qué envías?')

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

    // Botoncito
    const button = `
    <button class="btn btn-primary col-md-2" type ="submit">siguiente</button>
    `

    // Introducimos todo el texto como html al formulario y el formulario al marco principal
    form.innerHTML = `${select}${valueInput}${dimensionInput}${weight}${button}`
    this.mainElement.appendChild(form)

    // Añadimos parcelData como escucha del evento change a cada input para ir almacenando y
    // al hacer submit validar la información
    selecter('#type').addEventListener('change', insertDataObj)
    selecter('#value').addEventListener('change', insertDataObj)
    selecter('#length').addEventListener('change', insertDataObj)
    selecter('#width').addEventListener('change', insertDataObj)
    selecter('#high').addEventListener('change', insertDataObj)
    selecter('#weight').addEventListener('change', insertDataObj)
    form.addEventListener('submit', e => {
      const messange = validationDataObj(e)
      if (messange) {
        if (messange === 'success') {
          return this.whereSend()
        }
        Ui.printAlert('error', messange)
      }
    })
  }

  /**
   * Crea la vista de ¿desde donde envías? pidiendo la dirección emisora del paquete
   */
  whereSend () {
    this._clearHtml(this.mainElement)

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
    address.addEventListener('change', e => {
      insertDataObj(e)
      this.fromWhere(this.mainElement)
    })

    // Un poco chapuza puede ser. Pero para no estar escribiendo tanto... :'u
    form.firstElementChild.firstElementChild.appendChild(address)
    this.mainElement.appendChild(form)
  }

  /**
   * Crea la vista de ¿hacia donde envías? pidiendo la dirección receptora del paquete
   */
  fromWhere () {
    this._clearHtml(this.mainElement)

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
    address.addEventListener('change', e => {
      insertDataObj(e)
      this.shippingDetail(this.mainElement)
    })

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
    this._clearHtml(this.mainElement)
    // Traemos la clase Parcel y hacemos una instancia.
    const parcel = new Parcel(dataObjParcel)

    // llamamos al método que nos devuelve los cálculos :D
    const presupuesto = parcel.getParcel()

    const { raw, tax, amount, origin, destiny, distance, time, distanceUnit, timeUnit } =
      presupuesto

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

    selecter('button.btn').addEventListener('click', () => {
      resetDataObj()
      this.whatSend()
    })
  }

  signinSection () {
    const {
      user,
      pass,
      name,
      lastname,
      sex,
      birthday,
      email,
      phone,
      country,
      state,
      municipality,
      parish,
      zipcode,
      numberHouse,
      street,
      reference
    } = this.config.inputsProps

    const sexOp = [
      { title: 'Femenino', value: '1' },
      { title: 'Masculino', value: '2' },
      { title: 'Otro', value: '3' }
    ]

    // Se crea el sub-titulo
    this._subtitleCreate('Registro')

    // Sección Usuario y contraseña
    const userCol = this._createFormField(user)
    const passCol = this._createFormField(pass)

    // Componente de User
    const userComponent = [userCol, passCol]

    // Sección Datos personales
    const personalLabel = this._createCol(12, 'mt-3')
    personalLabel.appendChild(this._createFormLabel('Datos Personales'))

    // Fields
    const nameCol = this._createFormField(name)
    const lastnameCol = this._createFormField(lastname)
    const sexCol = this._createFormField(sex, sexOp)
    const birthdayCol = this._createFormField(birthday)

    // Componente de Datos Personales
    const personalComponent = [personalLabel, nameCol, lastnameCol, sexCol, birthdayCol]

    // Sección Contácto
    const contactLabel = this._createCol(12, 'mt-3')
    contactLabel.appendChild(this._createFormLabel('Datos de contacto'))

    // Fields
    const emailCol = this._createFormField(email)
    const phoneCol = this._createFormField(phone)

    // Componente de Contacto
    const contactComponent = [contactLabel, emailCol, phoneCol]

    // Sección Dirección
    const addressLabel = this._createCol(12, 'mt-3')
    addressLabel.appendChild(this._createFormLabel('Dirección'))

    // Fields
    const countryCol = this._createFormField(country)
    const stateCol = this._createFormField(state)
    const municipalityCol = this._createFormField(municipality)
    const parishCol = this._createFormField(parish)
    const zipCol = this._createFormField(zipcode)
    const numberCol = this._createFormField(numberHouse)
    const streetCol = this._createFormField(street)
    const referenceCol = this._createFormField(reference)

    // Componente de dirección
    const addressComponents = [
      addressLabel,
      countryCol,
      stateCol,
      municipalityCol,
      parishCol,
      zipCol,
      numberCol,
      streetCol,
      referenceCol
    ]

    // Botones :D
    const btnDiv = createElement('div')
    btnDiv.classList.add('row', 'p-3', 'mt-4', 'justify-content-between')
    const backBtn = this._createBtn({
      classList: ['btn', 'btn-primary'],
      size: '4',
      text: 'Atrás',
      type: 'reset'
    })
    btnDiv.appendChild(backBtn)
    const signinBtn = this._createBtn({
      classList: ['btn', 'btn-success'],
      size: '4',
      text: 'Registrarme',
      type: 'submit'
    })
    btnDiv.appendChild(signinBtn)

    // Se crea un arreglo con las clases extras de este form y el form en cuestión
    const formComponents = [
      ...userComponent,
      ...personalComponent,
      ...contactComponent,
      ...addressComponents,
      btnDiv
    ]
    const formClasses = ['mx-5', 'p-2']
    const form = this._formCreate(formClasses, ...formComponents)
    form.addEventListener('submit', Validator.signinForm)
    // Se mete el form al container principal, aunque creo debo meterlo en el main ...
    this.mainElement.appendChild(form)
  }

  /**
   * Limpia la vista para no crear elementos html innecesarios
   */
  _clearHtml (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  /**
   * función que permite retroceder a la vista anterior
   */
  toBack () {}

  // Es privada pero por cosas de StandardJS no utilicé el #.
  // Este método crea un subtitulo pasándole el texto y el contenedor del subtitulo
  _subtitleCreate (text) {
    const h2 = createElement('h2')
    h2.textContent = text
    h2.classList.add('sub-title')
    this.mainElement.appendChild(h2)
  }

  // Es privada pero por cosas de StandardJS no utilicé el #.
  // Este método crea un selector de direcciones iterables
  _addressSelector () {
    const { addresses } = this.config

    const select = createElement('select')
    select.classList.add('form-select')
    const options = addresses
      .map(address => {
        const { id, name } = address
        return `<option value='${id}'>${name}</option>`
      })
      .join('')

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

  /**
   * Create a form with classes and childrens that give from params
   * @param {string[]} classes An array that give all add class.
   * @param  {...HTMLElement} childrens *args of children, HTMLElements
   * @returns {HTMLFormElement} a form<HTMLElement>.
   */
  _formCreate (classes = [], ...childrens) {
    const form = createElement('form')
    form.classList.add(
      'row',
      'align-items-center',
      'justify-content-center',
      'g-3',
      ...classes
    )
    childrens.forEach(children => (children ? form.appendChild(children) : null))
    return form
  }

  /**
   * Create Div with col-md class
   * @param {number} size number of columns to take
   * @param {string[]} classes string/s or array of strings of classes to add
   * @returns {HTMLDivElement} a Div.col-md-size
   */
  _createCol (size = 0, classes) {
    const div = createElement('div')
    div.classList.add(`col-md-${size}`)
    if (classes) div.classList.add(classes)
    return div
  }

  /**
   * Create Div with input-group and input-group-lg classes
   * @param  {...HTMLElement} elements
   * @returns {HTMLDivElement} a Div.input-group.input-group-lg
   */
  _createInputGroup (...elements) {
    const div = createElement('div')
    div.classList.add('input-group', 'input-group-lg')
    elements.forEach(element => div.appendChild(element))
    return div
  }

  /**
   * Create span element from identify inputs
   * @param {string} text A string
   * @returns {HTMLSpanElement} a span.input-group-text
   */
  _createSpanGroup (text) {
    const span = createElement('span')
    span.classList.add('input-group-text')
    span.textContent = text
    return span
  }

  /**
   * Create an HTMLInputElemnt with object of data pass
   * @param {*} inputsProps Is an object with necesary data for create an input element
   * @returns {HTMLInputElement} with features that passed param
   */
  _createFormInput ({
    id,
    name = '',
    autocomplete = '',
    classList = ['form-control'],
    type = 'text',
    placeholder = ''
  }) {
    const input = createElement('input')
    input.id = id
    input.name = name
    input.autocomplete = autocomplete
    input.classList.add(classList)
    input.type = type
    input.placeholder = placeholder
    return input
  }

  _createFormSelector (
    { id, name = '', autocomplete = '', classList = ['form-select'], defaultOption },
    options
  ) {
    // Creamos la opción por defecto deshabilitada
    const disabledOption = createElement('option')
    disabledOption.disabled = true
    disabledOption.selected = true
    disabledOption.textContent = defaultOption

    // Creamos el select y le damos las props que se pasan
    const select = createElement('select')
    select.id = id
    select.name = name
    select.autocomplete = autocomplete
    select.classList = classList

    // Hacemos la opción deshabilitada primer hijo del select.
    select.appendChild(disabledOption)

    // Iteramos sobre el array del argumento 'options', creamos y hacemos hijo de select a c/u
    options.forEach(option => {
      const html = createElement('option')
      html.value = option.value
      html.textContent = option.title
      select.appendChild(html)
    })
    return select
  }

  /**
   * Create a group of HTMLElement that contains col>inputGroup>span input
   * @param {*} data json object with inputsProps
   * @returns {HTMLDivElement} a div.col-md
   */
  _createFormField (data, options = []) {
    const { label, size } = data

    // Vemos si es tipo select, para entonces crear un select y no un input xD
    let input
    if (data.type === 'select') {
      input = this._createFormSelector(data, options)
    } else {
      input = this._createFormInput(data)
    }

    // Creamos el span, la columna y el group correspondientes
    const span = this._createSpanGroup(label)
    const group = this._createInputGroup(span, input)
    const col = this._createCol(size)
    col.appendChild(group)
    return col
  }

  /**
   * Create a Form Label without for attribute
   * @param {*} text the textContent that label have
   * @returns {HTMLLabelElement}
   */
  _createFormLabel (text) {
    const label = createElement('label')
    label.classList.add('h3', 'form-label')
    label.textContent = text
    return label
  }

  /**
  *
  * @param {*} props
  * @returns
  */
  _createBtn (props) {
    const { text, type, classList, size } = props
    const btn = createElement('button')
    btn.textContent = text
    btn.type = type
    btn.classList.add(...classList)
    const col = this._createCol(size)
    col.appendChild(btn)
    return col
  }
}
