import Ui from './Ui.js'
import ParcelUi from './ParcelUi.js'
import SignInUi from './SignInUi.js'
import NavbarUi from './NavbarUi.js'
import LoginUi from './LoginUi.js'
import ForgetUi from './ForgetUi.js'
import { localStorage, selecter } from '../GlobalSelectors.js'
export class App {
  constructor () {
    this.ui = new Ui()
    this.navbar = new NavbarUi()
    this.parcelUi = new ParcelUi()
    this.signInUi = new SignInUi()
    this.loginUi = new LoginUi()
    this.forgetUi = new ForgetUi()
    // Iniciamos la app
    this.logon()
    console.log('iniciando app...')
  }

  toParcel () {
    this.navbar.main()
    this.parcelUi.main()
  }

  tosignIn () {
    this.navbar.main()
    this.signInUi.main()
  }

  toLogin () {
    this.loginUi.main()
  }

  toforgetPass () {
    this.forgetUi.main()
  }

  logon () {
    const token = localStorage.getItem('token')
    console.log(token)
    if (token) {
      this.toParcel()
    } else {
      this.toLogin()
    }
  }

  logout () {
    selecter('nav').remove()
    localStorage.removeItem('token')
    this.toLogin()
  }
}
