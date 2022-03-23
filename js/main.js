import { App } from './Classes/App.js'
import Parcel from './Classes/Parcel.js'

const app = new App()
app.init()

const prop = { value: 100, dimensions: { length: 2, width: 3, high: 5 }, weight: 0.1, type: 'paquete', senderAddress: 1, receivingAddress: 2 }
const parcel = new Parcel(prop)
console.log(parcel.getParcel())
