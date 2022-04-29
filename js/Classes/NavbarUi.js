import Ui from './Ui.js'
import { containerNavbar, createElement } from '../GlobalSelectors.js'
import config from '../Config.js'
export default class NavbarUi extends Ui {
  /**
   * Crea el Div.main
   */
  main () {
    // Esto verifica que no exista ya un formulario.
    if (!document.querySelector('nav.navbar')) {
      this.navbar()
    }
  }

  /**
 * Método de creación de la navbar. Genera todo lo necesario para una barra de navegación post inicio de sesión.
 */
  navbar () {
    this.logo = config.assets.logo
    // Creamos el logo
    const brand = this._createNavBarBrand(this.logo, 50, '/')
    // Creamos los items de la lista desordenada de la izquierda
    const cot = this._createItem('Cotizador', 'javascript:app.toParcel();', 'mx-3')
    const trak = this._createItem('Tracking', 'javascript:app.toTracking();', 'mx-3')
    const leftUl = this._createItemList('me-auto', cot, trak)
    // Creamos los items y la segunda lista desordenada, de la derecha
    const logout = createElement('span')
    logout.classList = 'material-icons-outlined'
    logout.textContent = 'logout'
    const account = createElement('span')
    account.classList = 'material-icons-outlined'
    account.textContent = 'manage_accounts'
    const out = this._createItem(logout, 'javascript:app.logout();')
    const acc = this._createItem(account, 'javascript:app.tosignIn();')
    const rightUl = this._createItemList([], acc, out)
    // Creamos un contenedor para limitar los elementos dentro de este
    const div = createElement('div')
    div.classList.add('container-md')
    div.appendChild(brand)
    div.appendChild(leftUl)
    div.appendChild(rightUl)
    // Creamos el elemento nav con las clases chulas y le hacemos div de hijo
    const nav = createElement('nav')
    nav.classList.add('navbar', 'navbar-expand', 'navbar-light', 'bg-violet')
    nav.appendChild(div)
    // hacemos nav hijo del contenedor estático y listo :D
    containerNavbar.appendChild(nav)
  }
}
