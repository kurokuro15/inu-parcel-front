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
    { id: 1, name: 'A', x: 150, y: 300 },
    { id: 2, name: 'B', x: 300, y: 120 },
    { id: 3, name: 'C', x: 100, y: 80 },
    { id: 4, name: 'D', x: 20, y: 90 },
    { id: 5, name: 'E', x: 1500, y: 370 },
    { id: 6, name: 'F', x: 200, y: 800 },
    { id: 7, name: 'G', x: 120, y: 1500 },
    { id: 8, name: 'H', x: 1340, y: 1350 },
    { id: 9, name: 'I', x: 1270, y: 1790 },
    { id: 10, name: 'J', x: 777, y: 433 },
    { id: 11, name: 'K', x: 333, y: 666 }
  ]
}
