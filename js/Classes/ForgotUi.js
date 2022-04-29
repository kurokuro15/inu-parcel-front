import Ui from './Ui.js'
import Forgot from './Forgot.js'
import { container, createElement, selecter } from '../GlobalSelectors.js'
import app from '../main.js'
export default class ForgotUi extends Ui {
  main () {
    this._header('Reestablecer la contraseña')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('login')
    this.mainElement.innerHTML = `
    <form class="forgot-user d-flex container justify-content-center flex-column text-center">
    <div class="row justify-content-center">
    <div class="d-flex col-md-5 col-sm-7 m-1 justify-content-center">
   <label class="text-center align-self-center form-label" for="username">Usuario o Correo electrónico</label>
    </div>
  </div>
    <div class="row justify-content-center">
    <div class="d-flex col-md-5 col-sm-7 m-1">
      <input class='form-control' type="text" name="username" id="username" placeholder="usuario/correo" autocomplete="username">
      <button class="btn btn-primary text-center mx-1 px-2" type="submit"><span class="material-icons-outlined">arrow_circle_right</span></button>
  </div>
</div>
</form>`
    // y sí, me dió pereza hacer esto y lo hice así, como solo escucharé el evento submit de este form... puedo hacerlo 'estático'
    // Pero si, tendría que hacer una refactorización del código para añadir validación dinámica y mensajes wapos :'v
    // (no quiero pensar en eso en este instante... Que mi yo del futuro se encargue... Gambare Reynaldo)
    // Esto verifica que no exista ya un formulario.
    if (!selecter('main.login')) {
      container.appendChild(this.mainElement)
      selecter('form.forgot-user').addEventListener('submit', e => {
        this.forgot = new Forgot(e)
        this.forgot.forgotpass('forgot-user', (questions) => this.questions(questions))
      })
    }
  }

  questions ({ questionOne, questionTwo }) {
    this.mainElement.innerHTML = `
    <form class="forgot-question d-flex container justify-content-center flex-column text-center">
      <div class="row justify-content-center">
        <div class="d-flex col-md-5 col-sm-7 m-1 justify-content-center">
          <label class="text-center align-self-center form-label" for="answerOne">${questionOne}</label>
        </div>
        <div class="d-flex col-md-5 col-sm-7 m-1">
          <input class='form-control' type="text" name="answerOne" id="answerOne" placeholder="respuesta" autocomplete="answerOne">
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="d-flex col-md-5 col-sm-7 m-1 justify-content-center">
          <label class="text-center align-self-center form-label" for="answerTwo">${questionTwo}</label>
        </div>
        <div class="d-flex col-md-5 col-sm-7 m-1">
          <input class='form-control' type="text" name="answerTwo" id="answerTwo" placeholder="respuesta" autocomplete="answerTwo">
        </div>
      </div>
      <div class="row justify-content-end">
        <div class="d-flex col-md-2 col-sm-3 m-1">
          <button class="btn btn-primary text-center mx-1 px-2" type="submit"><span class="material-icons-outlined">arrow_circle_right</span></button>
        </div>
      </div>
    </form>`

    if (!selecter('form.forgot-password')) {
      selecter('form.forgot-question').addEventListener('submit', e => {
        this.forgot.updateStateForm(e)
        this.forgot.forgotpass('forgot-question', () => this.reset())
      })
    }
  }

  reset () {
    this.mainElement.innerHTML = `
    <form class="forgot-password d-flex container justify-content-center flex-column text-center">
      <div class="row justify-content-center">
        <div class="d-flex col-md-5 col-sm-7 m-1 justify-content-center">
          <label class="text-center align-self-center form-label" for="password">Nueva contraseña</label>
        </div>
        <div class="d-flex col-md-5 col-sm-7 m-1">
          <input class='form-control' type="password" name="password" id="password" placeholder="· · · · · ·" autocomplete="new-password">
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="d-flex col-md-5 col-sm-7 m-1 justify-content-center">
          <label class="text-center align-self-center form-label" for="repeatPassword">Repita la contraseña</label>
        </div>
        <div class="d-flex col-md-5 col-sm-7 m-1">
          <input class='form-control' type="password" name="repeatPassword" id="repeatPassword" placeholder="· · · · · ·">
        </div>
      </div>
      <div class="row justify-content-end">
        <div class="d-flex col-md-2 col-sm-3 m-1">
          <button class="btn btn-primary text-center mx-1 px-2" type="submit"><span class="material-icons-outlined">arrow_circle_right</span></button>
        </div>
      </div>
    </form>`
    if (selecter('form.forgot-password')) {
      selecter('form.forgot-password').addEventListener('submit', e => {
        this.forgot.updateStateForm(e)
        this.forgot.forgotpass('forgot-password', () => {
          this.printAlert('success', 'Cambio de contraseña realizado con éxito')
          setTimeout(() => {
            app.logon()
          }, 3100)
        })
      })
    }
  }
}
