import Ui from './Ui.js'
import {
  container,
  createElement,
  insertDataObj,
  dataObjParcel,
  resetDataObj,
  selecter,
  validationDataObj
} from '../GlobalSelectors.js'
import Parcel from './Parcel.js'
export default class ParcelUi extends Ui {
  /**
   * Crea el cuerpo de la app y presenta el primer paso: ¿Qué envías?
   */
  main () {
    this._header('Cotizador de envíos')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('my-3', 'text-center')
    container.appendChild(this.mainElement)
    // Esto verifica que no exista un formulario 'what-send'.
    if (!document.querySelector('form.what-send')) {
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
    form.classList =
      'what-send row align-items-center justify-content-center g-3 m-2 pb-3'

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
        this.printAlert('error', messange)
      }
    })
  }

  /**
   * Crea la vista de ¿desde donde envías? pidiendo la dirección emisora del paquete
   */
  whereSend () {
    this._clearHtml(this.mainElement)

    // Creamos el título de la vista.
    this._subtitleCreate('¿A donde envías?')

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
    this._subtitleCreate('¿Desde donde envías?')

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
   *
   * Crea la vista de Tarifa de envío mostrando la tarifa y preguntando si quiere seguro
   *  La tarifa incluye: Precio del envío, tiempo estimado, distancia recorrida
   *  Se permite la opción de no asegurar
   */
  shippingDetail () {
    this._clearHtml(this.mainElement)
    // Traemos la clase Parcel y hacemos una instancia.
    const parcel = new Parcel(dataObjParcel)

    // llamamos al método que nos devuelve los cálculos :D
    const detail = parcel.getParcel()

    const { raw, tax, amount, origin, destiny, distance, time, distanceUnit, timeUnit } =
      detail

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
    // una vez impreso todo se hace el post. No funciona no sé por qué...
    parcel.postParcel((response) => {
      if (response) {
        this.printAlert('success', response.msg)
      }
    })
    selecter('button.btn').addEventListener('click', () => {
      resetDataObj()
      this.whatSend()
    })
  }
}
