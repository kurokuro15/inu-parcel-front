import Ui from './Ui.js'
import { container, createElement, selecter, formToJSON } from '../GlobalSelectors.js'
import Tracking from './Tracking.js'

export default class TrackingUi extends Ui {
  /**
   * Clase de la interface Tracking. Genera todo lo requerido
   */
  constructor () {
    super()
    this.tracking = new Tracking()
  }

  /**
   * Crea el Div.main
   */
  main () {
    this._header('Encomiendas')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('my-3', 'text-center')
    container.appendChild(this.mainElement)

    // Esto verifica que no exista ya un formulario.
    if (!document.querySelector('form')) {
      this.trackingTable()
    }
  }

  /**
 * Genera la tabla para mostrar la información y posteriormente llama a getAllTracking y deja buscar por Tracking
 */
  trackingTable () {
    const table = `
    <div class="table-responsive">
      <table class="table caption-top table-sm table-bordered table-striped">
        <caption class="container">
          <form class="row g-3 p-2 justify-content-end">
            <div class="col-md-6">
              <div class="input-group input-group-lg">
                <input name="search" autocomplete="searck" class="form-control" type="text" placeholder="Tracking...">
                <button class='input-group-text'><span class="material-icons-outlined">search</span></button>
              </div>
            </div>
          </form>
        </caption>
        <thead>
          <tr>
            <th scope="col" ROWSPAN=2>Tracking</th>
            <th scope="col" ROWSPAN=2>Cliente</th>
            <th colspan='2'>Origen</th>
            <th colspan='2'>Destino</th>
            <th scope="col" ROWSPAN=2>Estado</th>
            <th scope="col" ROWSPAN=2>Flete</th>
          </tr>
          <tr>
          <th scope="col">latitud</th>
          <th scope="col">longitud</th>
          <th scope="col">latitud</th>
          <th scope="col">longitud</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
        </tfoot>
      </table>
    </div>
    `
    // inyectamos la tabla en el html
    this.mainElement.innerHTML = table
    // hacemos la petición get y rellenamos la tablita
    this.tracking.getAllTracking(res => {
      console.log(res)
      res.parcel.forEach(parcel => {
        this.setData(parcel)
      })
      this.pagination(res.meta)
    })

    // añadimos funcionalidad al search
    selecter('form').addEventListener('submit', e => {
      e.preventDefault()
      const form = formToJSON(e.target)
      console.log(form)
      this.tracking.getTracking(form.search, res => {
        this._clearHtml(selecter('tbody'))
        console.log(res)
        if (res.length > 1 && Array.isArray(res)) {
          res.forEach(parcel => {
            this.setData(parcel)
          })
          this.pagination(res.meta)
        } else { this.setData(res) }
      })
    })
  }

  /**
   * Método para mapear los datos de un "ParcelObject" e imprimirlos en la tabla ordenada.
   * @param {object} params { tracking, name, origin, destination, status, amount }
   */
  setData ({ tracking, name, origin, destination, status, amount }) {
    if (typeof origin === 'string') origin = JSON.parse(origin)
    if (typeof destination === 'string') destination = JSON.parse(destination)
    if (typeof status === 'string') status = JSON.parse(status)
    const tr = createElement('tr')
    tr.innerHTML = `<th scope='row'>${tracking}</th>
      <td>${name}</td>
      <td>${origin.latitude}</td>
      <td>${origin.longitude}</td>
      <td>${destination.latitude}</td>
      <td>${destination.longitude}</td>
      <td>${status.status}</td>
      <td>${amount}</td>`

    const tbody = selecter('tbody')
    tbody.appendChild(tr)
  }

  pagination ({ previous, next }) {
    const tr = createElement('tr')
    tr.innerHTML = `
      <td colspan='8'>
        ${previous ? `<a class="btn" href='${previous}'><span class="material-icons-outlined">arrow_back_ios</span></a>` : ''}
        ${next ? `<a class="btn" href='${next}'><span class="material-icons-outlined">arrow_forward_ios</span></a>` : ''}
      </td>
    `
    const tfoot = selecter('tfoot')
    tfoot.addEventListener('click', e => {
      e.preventDefault();
    })
    tfoot.appendChild(tr)
  }
}
