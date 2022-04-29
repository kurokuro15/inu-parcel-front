
const Config = {
  // esta path refiere al archivo JSON donde estará ubicados los estados, municipios y parroquias de venezuela.
  path: '/venezuela.json',
  // esta apiUrl busca la url absoluta de la api.
  apiUrl: 'http://localhost/api-rest/',
  URL: 'https://apimocha.com/kurokuro15/states',
  assets: {
    logo: './assets/logo.png'
  },
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
  },
  inputsProps: {
    user: {
      label: 'Usuario',
      id: 'username',
      name: 'username',
      autocomplete: 'username',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'juanGenerico2000',
      size: 6
    },
    newPass: {
      label: 'Contraseña',
      id: 'password',
      name: 'password',
      autocomplete: 'new-password',
      classList: ['form-control'],
      type: 'password',
      placeholder: 'Contraseña123!.',
      size: 6
    },
    pass: {
      label: 'Contraseña',
      id: 'password',
      name: 'password',
      autocomplete: 'current-password',
      classList: ['form-control'],
      type: 'password',
      placeholder: 'Contraseña123!.',
      size: 2
    },
    name: {
      label: 'Nombre(s)',
      id: 'name',
      name: 'name',
      autocomplete: 'given-name',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'Juan José',
      size: 6
    },
    lastname: {
      label: 'Apellido(s)',
      id: 'lastname',
      name: 'lastname',
      autocomplete: 'family-name',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'Melgano Sutano',
      size: 6
    },
    sex: {
      label: 'Género',
      id: 'sex',
      name: 'sex',
      classList: ['form-select'],
      autocomplete: 'sex',
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 4
    },
    birthday: {
      label: 'Fecha de Nacimiento',
      id: 'birthday',
      name: 'birthday',
      classList: ['form-control'],
      type: 'date',
      autocomplete: 'bday',
      size: 5
    },
    dni: {
      label: 'CI/RIF',
      id: 'dni',
      name: 'dni',
      classList: ['form-control'],
      type: 'text',
      autocomplete: 'dni',
      placeholder: 'V-12.345.678',
      size: 3
    },
    email: {
      label: 'Correo Electrónico',
      id: 'email',
      name: 'email',
      classList: ['form-control'],
      type: 'email',
      autocomplete: 'email',
      placeholder: 'correo@example.com',
      size: 6
    },
    phone: {
      label: 'Teléfono Móvil',
      id: 'phone',
      name: 'phone',
      classList: ['form-control'],
      type: 'tel',
      autocomplete: 'tel',
      placeholder: '+58(412)-123-4567',
      size: 6
    },
    country: {
      label: 'País',
      id: 'country',
      name: 'country',
      classList: ['form-select'],
      autocomplete: 'country',
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 4
    },
    state: {
      label: 'Estado',
      id: 'state',
      name: 'state',
      classList: ['form-select'],
      autocomplete: 'state',
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 4
    },
    municipality: {
      label: 'Municipio',
      id: 'municipality',
      name: 'municipality',
      classList: ['form-select'],
      autocomplete: 'municipality',
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 4
    },
    parish: {
      label: 'Parroquia',
      id: 'parish',
      name: 'parish',
      classList: ['form-select'],
      autocomplete: 'parish',
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 4
    },
    zipcode: {
      label: 'Postal',
      id: 'zipcode',
      name: 'zipcode',
      classList: ['form-control'],
      type: 'text',
      autocomplete: 'postal-code',
      placeholder: '1001',
      size: 3
    },
    numberHouse: {
      label: 'Número Apto/Casa/Oficina',
      id: 'numberHouse',
      name: 'numberHouse',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'Local B-4',
      size: 5
    },
    street: {
      label: 'Avenida(s) y/o calle(s)',
      id: 'street',
      name: 'street',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'Av. Existe con Calle Falsa',
      autocomplete: 'street-address',
      size: 6
    },
    reference: {
      label: 'Referencia',
      id: 'reference',
      name: 'reference',
      classList: ['form-control'],
      type: 'text',
      placeholder: 'Al lado del Mc. Pollo',
      autocomplete: 'address-line2',
      size: 6
    },
    iquestionOne: {
      label: 'Primera pregunta',
      id: 'questionOne',
      name: 'questionOne',
      classList: ['form-select'],
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 6
    },
    ianswerOne: {
      label: 'Respuesta',
      id: 'answerOne',
      name: 'answerOne',
      classList: ['form-control'],
      type: 'text',
      size: 6
    },
    iquestionTwo: {
      label: 'Segunda pregunta',
      id: 'questionTwo',
      name: 'questionTwo',
      classList: ['form-select'],
      defaultOption: 'Selecciona...',
      type: 'select',
      size: 6
    },
    ianswerTwo: {
      label: 'Respuesta',
      id: 'answerTwo',
      name: 'answerTwo',
      classList: ['form-control'],
      type: 'text',
      size: 6
    }
  }
}
export default Config
