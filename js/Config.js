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
    { name: 'A', x: 150, y: 300 },
    { name: 'B', x: 300, y: 120 },
    { name: 'C', x: 100, y: 80 },
    { name: 'D', x: 20, y: 90 },
    { name: 'E', x: 1500, y: 370 },
    { name: 'F', x: 200, y: 800 },
    { name: 'G', x: 120, y: 1500 },
    { name: 'H', x: 1340, y: 1350 },
    { name: 'I', x: 1270, y: 1790 },
    { name: 'J', x: 777, y: 433 },
    { name: 'K', x: 333, y: 666 }
  ]
}
