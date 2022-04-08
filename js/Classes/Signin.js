import config from '../Config.js'
export default class Sign {
  constructor () {
    this.inputProps = config.inputProps
		this.sexOp = [
      { title: 'Femenino', value: '1' },
      { title: 'Masculino', value: '2' },
      { title: 'Otro', value: '3' }
    ]
  }

  signinSection () {
    const {
      user,
      newPass,
      name,
      lastname,
      sex,
      birthday,
      email,
      phone,
      country,
      state,
      municipality,
      parish,
      zipcode,
      numberHouse,
      street,
      reference
    } = this.inputsProps

    // Se crea el sub-titulo
    this._subtitleCreate('Registro')
 
    // Sección Usuario y contraseña
    const userCol = this._createFormField(user)
    const passCol = this._createFormField(newPass)

    // Componente de User
    const userComponent = [userCol, passCol]

    // Sección Datos personales
    const personalLabel = this._createCol(12, 'mt-3')
    personalLabel.appendChild(this._createFormLabel('Datos Personales'))

    // Fields
    const nameCol = this._createFormField(name)
    const lastnameCol = this._createFormField(lastname)
    const sexCol = this._createFormField(sex, sexOp)
    const birthdayCol = this._createFormField(birthday)

    // Componente de Datos Personales
    const personalComponent = [personalLabel, nameCol, lastnameCol, sexCol, birthdayCol]

    // Sección Contácto
    const contactLabel = this._createCol(12, 'mt-3')
    contactLabel.appendChild(this._createFormLabel('Datos de contacto'))

    // Fields
    const emailCol = this._createFormField(email)
    const phoneCol = this._createFormField(phone)

    // Componente de Contacto
    const contactComponent = [contactLabel, emailCol, phoneCol]

    // Sección Dirección
    const addressLabel = this._createCol(12, 'mt-3')
    addressLabel.appendChild(this._createFormLabel('Dirección'))

    // Fields
    const countryCol = this._createFormField(country)
    const stateCol = this._createFormField(state)
    const municipalityCol = this._createFormField(municipality)
    const parishCol = this._createFormField(parish)
    const zipCol = this._createFormField(zipcode)
    const numberCol = this._createFormField(numberHouse)
    const streetCol = this._createFormField(street)
    const referenceCol = this._createFormField(reference)

    // Componente de dirección
    const addressComponents = [
      addressLabel,
      countryCol,
      stateCol,
      municipalityCol,
      parishCol,
      zipCol,
      numberCol,
      streetCol,
      referenceCol
    ]

    // Botones :D
    const btnDiv = createElement('div')
    btnDiv.classList.add('row', 'p-3', 'mt-4', 'justify-content-between')
    const backBtn = this._createBtn({
      classList: ['btn', 'btn-primary'],
      size: '4',
      text: 'Atrás',
      type: 'reset'
    })
    btnDiv.appendChild(backBtn)
    const signinBtn = this._createBtn({
      classList: ['btn', 'btn-success'],
      size: '4',
      text: 'Registrarme',
      type: 'submit'
    })
    btnDiv.appendChild(signinBtn)

    // Se crea un arreglo con las clases extras de este form y el form en cuestión
    const formComponents = [
      ...userComponent,
      ...personalComponent,
      ...contactComponent,
      ...addressComponents,
      btnDiv
    ]
    const formClasses = ['mx-5', 'p-2']
    const form = this._formCreate(formClasses, ...formComponents)
    form.addEventListener('submit', Validator.signinForm)
    // Se mete el form al container principal, aunque creo debo meterlo en el main ...
    this.mainElement.appendChild(form)
  }
}
