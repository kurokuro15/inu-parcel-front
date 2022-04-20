import Config from '../Config.js'
import { fetch } from '../GlobalSelectors.js'
const { path: URL } = Config
// ME DOY CUENTA QUE ESTE CONECTION SOLO VALE PARA LEER EL JSON :D
class Conection {
  constructor (url) {
    this.url = url
    this.states = this.getStates()
    this.municipality = ''
    this.parish = ''
  }

  async getStates () {
    const response = await fetch(this.url)
    return response.map(element => element.estado)
  }

  async getMunicipalities (state = 0) {
    this.state = state - 1
    const response = await fetch(this.url)
    return response[this.state].municipios.map(mun => mun.municipio)
  }

  async getParishes (parish = 0) {
    const response = await fetch(this.url)
    return response[this.state].municipios[parish - 1].parroquias
  }
}

const conection = new Conection(URL)
export default conection
