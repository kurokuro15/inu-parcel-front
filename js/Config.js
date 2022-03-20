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
  dimensions: { L: ['length', 'largo'], W: ['width', 'ancho'], H: ['high', 'alto'] }
}
