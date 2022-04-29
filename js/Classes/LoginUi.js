import Ui from './Ui.js'
import {
  container,
  createElement,
  selecter
} from '../GlobalSelectors.js'
import Login from './Login.js'

export default class LoginUi extends Ui {
  main () {
    this._header('Iniciar sesión')
    this.mainElement = createElement('main')
    this.mainElement.classList.add('login')
    this.mainElement.innerHTML = `
    <form class="login d-flex container justify-content-center flex-column text-center">
    <div class="row justify-content-center">
      <div class="d-flex col-md-3 col-sm-3 m-1">
        <label class="align-self-center form-label" for="username">Usuario</label>
      </div>
      <div class="d-flex col-md-5 col-sm-7 m-1">
        <input class='form-control' type="text" name="username" id="username" placeholder="usuario" autocomplete="username">
      </div>
    </div>
    <div class="row justify-content-center my-1">
      <div class="d-flex col-md-3  col-sm-3 m-1">
        <label class="align-self-center form-label" for="password">Contraseña</label>
      </div>
      <div class="d-flex col-md-5 col-sm-7 m-1">
        <input class='form-control' type="password" name="password" id="password" autocomplete="current-password" placeholder="· · · · · · · ·">
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="d-flex col-lg-5 col-md-5 col-sm-7 flex-column justify-content-center m-1">
        <a class="align-self-start pb-1" href="javascript:app.tosignIn()">Registrarme</a>
        <a class="align-self-start" href="javascript:app.toforgotPass()">Olvidé la contraseña</a>
      </div>
      <div class="d-flex col-md-3 col-sm-3 justify-content-end m-1">
      <button class="btn btn-primary text-center" type="submit"><span class="material-icons-outlined">arrow_circle_right</span></button>
      </div>
    </div>
  </form>`
    // y sí, me dió pereza hacer esto y lo hice así, como solo escucharé el evento submit de este form... puedo hacerlo 'estático'
    // Pero si, tendría que hacer una refactorización del código para añadir validación dinámica y mensajes wapos :'v
    // (no quiero pensar en eso en este instante... Que mi yo del futuro se encargue... Gambare Reynaldo)

    // Esto verifica que no exista ya un formulario.
    if (!selecter('main.login')) {
      container.appendChild(this.mainElement)
      selecter('form.login').addEventListener('submit', e => {
        const login = new Login(e)
        login.login()
      })
    }
  }
}
