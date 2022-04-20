import { App } from './Classes/App.js'
const app = new App()
globalThis.app = app
// async function allState () {
//   const response = await fetch('https://apimocha.com/kurokuro15/states')
//   return response.map(element => element.estado)
// }

// async function allMunicipios (state = 0) {
//   const response = await fetch('https://apimocha.com/kurokuro15/states')
//   return response[state].municipios.map(mun => mun.municipio)
// }

// async function allParish (parish = 0) {
//   const response = await fetch('https://apimocha.com/kurokuro15/states')
//   return response[0].municipios[parish].parroquias
// }

// (async function () {
//   console.log(await allState())
//   console.log(await allMunicipios(0))
//   console.log(await allParish(0))
// })()
