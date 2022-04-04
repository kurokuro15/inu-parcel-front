import Ui from './Ui.js'
export class App {
  constructor () {
    this.ui = new Ui()
  }

  init () {
    // acá puedo indicar si está la sesión iniciada o en caso contrario no se ha registrado/iniciado sesión.
    this.ui.header()
    this.ui.main()
    console.log('iniciando app...')
  }
}
