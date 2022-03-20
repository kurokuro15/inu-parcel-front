import Ui from './Ui.js'

export class App {
  constructor () {
    this.ui = new Ui()
  }

  init () {
    this.ui.header()
    this.ui.main()
    console.log('iniciando app...')
  }
}
