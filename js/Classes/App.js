import Ui from './Ui.js'
import ParcelUi from './ParcelUi.js'
import SignInUi from './SignInUi.js'
import NavbarUi from './NavbarUi.js'
export class App {
  constructor () {
    this.ui = new Ui()
    this.navbar = new NavbarUi()
    this.parcelUi = new ParcelUi()
    this.signInUi = new SignInUi()
  }

  init () {
    // acá puedo indicar si está la sesión iniciada o en caso contrario no se ha registrado/iniciado sesión.
    this.navbar.navbar()
    this.toParcel()
    console.log('iniciando app...')
  }

  toParcel () {
    this.parcelUi.main()
  }

  tosignIn () {
    this.signInUi.main()
  }
}
