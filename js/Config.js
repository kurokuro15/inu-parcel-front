export default {
  productsType: [
    {
      type: 'Paquete',
      size: 'medium',
      minWeight: 501,
      maxWeight: 15000
    },
    { type: 'Sobre', size: 'small', minWeight: 0, maxWeight: 500 }
  ],
  dimensions: { L: ['length', 'largo'], W: ['width', 'ancho'], H: ['high', 'alto'] },
  addresses: [
    { id: 1, name: 'A', x: 1500, y: 3020 },
    { id: 2, name: 'B', x: 3030, y: 1520 },
    { id: 3, name: 'C', x: 1100, y: 830 },
    { id: 4, name: 'D', x: 209, y: 990 },
    { id: 5, name: 'E', x: 15000, y: 3780 },
    { id: 6, name: 'F', x: 2060, y: 800 },
    { id: 7, name: 'G', x: 950, y: 11500 },
    { id: 8, name: 'H', x: 1340, y: 12350 },
    { id: 9, name: 'I', x: 1270, y: 17890 },
    { id: 10, name: 'J', x: 7577, y: 4343 },
    { id: 11, name: 'K', x: 3313, y: 666 }
  ],
  transportFees: {
    costPkilo: 0.01,
    minRate: 6.5,
    conversionFactor: 200,
    // 16% de iva
    taxtConst: 16,
    manipulationCost: 2
  },
  speedConst: 45,
  units: {
    time: {
      singular: ['minuto', 'hora'],
      plural: ['minutos', 'horas']
    },
    length: {
      singular: ['centímetro', 'metro', 'kilómetro'],
      plural: ['centímetros', 'metros', 'kilómetros']
    },
    weight: {
      singular: ['gramo', 'kilogramo', 'tonelada'],
      plural: ['gramos', 'kilogramos', 'toneladas']
    }
  }

}
