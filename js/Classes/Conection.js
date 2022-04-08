import config from '../Config.js'
import { fetch } from '../GlobalSelectors.js'
const { path: URL } = config

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
    this.state = state
    const response = await fetch(this.url)
    return response[state].municipios.map(mun => mun.municipio)
  }

  async getParishes (parish = 0) {
    const response = await fetch(this.url)
    return response[this.state].municipios[parish].parroquias
  }
}

const conection = new Conection(URL)
export default conection
