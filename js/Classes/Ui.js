import Config from '../Config.js'
import { container, createElement, selecter } from '../GlobalSelectors.js'
export default class Ui {
  /**
   * Clase base de interfaces, contiene diversos métodos para crear componentes gráficos
   */
  constructor () {
    this.config = Config
  }

  /**
   * Crea la cabecera de la app. antes del div.main, dentro del container principal
   */
  _header (title = '') {
    this._clearHtml(container)
    const headerText = createElement('h1')
    headerText.textContent = title
    headerText.classList.add('title', 'text-center', 'my-2', 'text-uppercase')

    const header = createElement('header')
    header.appendChild(headerText)
    const hr = createElement('hr')

    container.appendChild(header)
    container.appendChild(hr)
  }

  /**
   * Crea una alerta dentro del contenedor principal, antes del Div.mains
   */
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
    container.insertBefore(divMessange, selecter('main'))

    // Quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMessange.remove()
    }, 3000)
  }

  /**
   * Cambia por 3 segundos el borde de un input o elemento que se pase como argumento
   */
  alertInput (type, element) {
    // Si es de tipo error agrega una clase
    if (type === 'error') {
      element.classList.add('border', 'border-danger')
    } else if (type === 'success') {
      element.classList.add('border', 'border-success')
    }

    // Quitar el alert despues de 3 segundos
    setTimeout(() => {
      element.classList.remove('border', 'border-danger', 'border-success')
    }, 3000)
  }

  /**
   * Crea el Div.main
   */
  main () {
    this._header('Texto del título')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('my-3', 'text-center')
    container.appendChild(this.mainElement)

    // Esto verifica que no exista ya un formulario.
    if (!document.querySelector('form')) {
      console.log('este main no está sobreescrito, revise.')
    }
  }

  /**
   * Limpia la vista para no crear elementos html innecesarios
   */
  _clearHtml (parent) {
    while (parent.firstChild !== parent.lastChild) {
      parent.removeChild(parent.lastChild)
    }
    if (parent.type !== 'select-one' && parent.firstChild) {
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
   * @param {object} inputsProps Is an object with necesary data for create an input element
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

  /**
   * Create an HTMLInputElemnt with object of data pass
   * @param {object} inputsProps Object with props of the select element
   * @param {HTMLOptionsCollection} options Collection of HTMLOptionElement from put in select
   * @returns {HTMLSelectElement} HTMLSelectElement that have all options that give from args.
   */
  _createFormSelector (
    { id, name = '', autocomplete = '', classList = ['form-select'], defaultOption },
    options
  ) {
    // Creamos la opción por defecto deshabilitada
    const disabledOption = createElement('option')
    disabledOption.disabled = true
    disabledOption.selected = true
    disabledOption.value = false
    disabledOption.textContent = defaultOption

    // Creamos el select y le damos las props que se pasan
    const select = createElement('select')
    select.id = id
    select.name = name
    select.autocomplete = autocomplete
    select.classList = classList
    // Hacemos la opción deshabilitada primer hijo del select.
    select.appendChild(disabledOption)
    this._createOptionElements(select, options)

    return select
  }

  _createOptionElements (select, options) {
    // Iteramos sobre el array del argumento 'options', creamos y hacemos hijo de select a c/u
    this._clearHtml(select)
    options.forEach((option, i) => {
      const html = createElement('option')
      html.value = i + 1
      html.textContent = option
      select.appendChild(html)
    })
  }

  /**
   * Create a group of HTMLElement that contains col>inputGroup>span input
   * @param {*} data json object with inputsProps
   * @returns {HTMLDivElement} a div.col-md
   */
  _createFormField (data, options = [], callback = null) {
    const { label, size } = data

    // Vemos si es tipo select, para entonces crear un select y no un input xD
    let input
    if (data.type === 'select') {
      input = this._createFormSelector(data, options)
    } else {
      input = this._createFormInput(data)
    }

    if (callback) {
      input.addEventListener('change', e => {
        callback(e)
      })
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
    const { text, type, classList, size, href } = props
    let btn
    if (type === 'submit') {
      btn = createElement('button')
    } else {
      btn = createElement('a')
      btn.href = href
    }
    btn.textContent = text
    btn.type = type
    btn.classList.add(...classList)
    const col = this._createCol(size)
    col.appendChild(btn)
    return col
  }

  _createItem (text, url = '#', classes = []) {
    const li = createElement('li')
    li.classList.add('nav-item')
    if (classes.length > 0) {
      li.classList.add(classes)
    }

    const a = createElement('a')
    a.classList.add('h6', 'nav-link')
    a.href = url
    if (typeof text === 'string') {
      a.textContent = text
    } else if (text.tagName === 'SPAN') {
      a.appendChild(text)
    }

    li.appendChild(a)
    return li
  }

  _createItemList (classes = [], ...items) {
    const ul = createElement('ul')
    ul.classList.add('navbar-nav', 'mb-2')
    if (classes.length > 0) {
      ul.classList.add(classes)
    }

    items.forEach(item => {
      ul.appendChild(item)
    })
    return ul
  }

  _createNavBarBrand (src, width, url = '#') {
    const img = createElement('img')
    img.src = src
    img.alt = 'logo'
    img.width = width
    const a = createElement('a')
    a.classList.add('navbar-brand')
    a.href = url
    a.appendChild(img)
    return a
  }
}
