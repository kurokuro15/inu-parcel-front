import Ui from './Ui.js'
import { container, createElement } from '../GlobalSelectors.js'
import conection from './Conection.js'
import SignIn from './Signin.js'
export default class SignInUi extends Ui {
  /**
   * Crea el Div.main
   */
  main () {
    this._header('Registro de Usuario')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('my-3', 'text-center')
    container.appendChild(this.mainElement)

    // Esto verifica que no exista un formulario 'sign-in'.
    if (!document.querySelector('form.sign-in')) {
      this.signinSection()
    }
  }

  /**
   *Crea el formulario de registro de usuario
   */
  async signinSection () {
    const {
      user,
      newPass,
      name,
      lastname,
      sex,
      birthday,
      dni,
      email,
      phone,
      country,
      state,
      municipality,
      parish,
      zipcode,
      numberHouse,
      street,
      reference,
      iquestionOne,
      ianswerOne,
      iquestionTwo,
      ianswerTwo
    } = this.config.inputsProps

    const sexOp = ['Femenino', 'Masculino', 'Otro']

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
    const dniCol = this._createFormField(dni)
    // Componente de Datos Personales
    const personalComponent = [
      personalLabel,
      nameCol,
      lastnameCol,
      dniCol,
      sexCol,
      birthdayCol
    ]

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
    // Acá hacemos cosas asíncronas para presentar de forma dinámica los estados, municipios
    // y parroquias...
    const parishCol = this._createFormField(parish)

    const municipalityCol = this._createFormField(municipality, [], async e => {
      const array = await conection.getParishes(e.target.value)
      const selector = parishCol.querySelector('select')
      this._createOptionElements(selector, array)
    })

    const stateCol = this._createFormField(
      state,
      await conection.getStates(),
      async e => {
        // Almacenamos el select de municipio y definimos la primera opción como seleccionada.
        const selector = municipalityCol.querySelector('select')
        selector.firstElementChild.selected = true
        // Almacenamos el select de parroquia y definimos la primera opción como seleccionada.
        const parish = parishCol.querySelector('select')
        parish.firstElementChild.selected = true
        this._clearHtml(selector)
        this._clearHtml(parish)
        const array = await conection.getMunicipalities(e.target.value)
        this._createOptionElements(selector, array)
      }
    )

    const countryCol = this._createFormField(country, ['Venezuela'])
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

    // Sección de Preguntas de Seguridad :D
    const questionLabel = this._createCol(12, 'mt-3')
    questionLabel.appendChild(this._createFormLabel('Preguntas de Seguridad'))

    // Fields
    // Fetch de las preguntas existentes string
    const questionOp = [
      'Nombre de tú mamá',
      'Lugar de nacimiento de tu perrito',
      'De que color es el caballo blanco de Simón Bolivar'
    ]
    // Select de pregunta 1
    const questionOne = this._createFormField(iquestionOne, questionOp)
    // Input de pregunta 1
    const answerOne = this._createFormField(ianswerOne)
    // Select de pregunta 2
    const questionTwo = this._createFormField(iquestionTwo, questionOp)
    // Input de pregunta 2
    const answerTwo = this._createFormField(ianswerTwo)

    const securityComponents = [
      questionLabel,
      questionOne,
      answerOne,
      questionTwo,
      answerTwo
    ]
    // Botones :D
    const btnDiv = createElement('div')
    btnDiv.classList.add('row', 'p-3', 'mt-4', 'justify-content-between')
    const backBtn = this._createBtn({
      classList: ['btn', 'btn-primary'],
      size: '4',
      text: 'Atrás',
      type: 'reset',
      href: 'javascript:app.toLogin();'
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
      ...securityComponents,
      btnDiv
    ]
    const formClasses = ['sign-in', 'mx-5', 'p-2']
    const form = this._formCreate(formClasses, ...formComponents)
    form.addEventListener('submit', e => {
      const signin = new SignIn(e)
      signin.signin()
      // Validator.validateSignin(e, () => {
      //   this.whatSend()
      // })
    })
    // Se mete el form al container principal, aunque creo debo meterlo en el main ...
    this.mainElement.appendChild(form)
  }
}
