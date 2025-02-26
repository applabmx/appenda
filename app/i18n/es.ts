import { Translations } from "./en"

const es: Translations = {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    back: "Volver",
  },
  welcomeScreen: {
    postscript:
      "psst — Esto probablemente no es cómo se va a ver tu app. (A menos que tu diseñador te haya enviado estas pantallas, y en ese caso, ¡lánzalas en producción!)",
    readyForLaunch: "Tu app, casi lista para su lanzamiento",
    exciting: "(¡ohh, esto es emocionante!)",
  },
  errorScreen: {
    title: "¡Algo salió mal!",
    friendlySubtitle:
      "Esta es la pantalla que verán tus usuarios en producción cuando haya un error. Vas a querer personalizar este mensaje (que está ubicado en `app/i18n/es.ts`) y probablemente también su diseño (`app/screens/ErrorScreen`). Si quieres eliminarlo completamente, revisa `app/app.tsx` y el componente <ErrorBoundary>.",
    reset: "REINICIA LA APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "Muy vacío... muy triste",
      content:
        "No se han encontrado datos por el momento. Intenta darle clic en el botón para refrescar o recargar la app.",
      button: "Intentemos de nuevo",
    },
  },
  dashBoardScreen:{
    home:"Inicio",
    map:"Mapa",
    notification:"Notificaciones",
    favorite:"Favoritos",
    profile: "Perfil",
    searchEvent:"Buscar evento",
  },
  homeScreen:{
     mxn: " mxn {{ifan}} ",
     hour:"hora",
     min:"min",
    checkOutThisLink:"¡Mira este enlace!",
    shareVia:"Compartido vía",
  },
  eventDetailScreen:{
    free:"Gratis",
    generalInformation:"Información general",
    location:"Ubicación",
    seeAvailableDates:"Ver fechas disponibles",
  },
  loginScreen:{
    welcome: "Bienvenido a \nAgenda Chilango",
    signInAndExporeNewEvents:"Iniciar sesión y explora nuevos eventos.",
    email: "Dirección de correo electrónico",
    password:"Contraseña",
    forgotYourPassword:"¿Olvidaste tu contraseña? ",
    getItHere:"Recupérala aquí",
    login:"Iniciar sesión",
    dontHaveAnAccount:"¿No tienes cuenta? ",
    register:"Regístrate",
    emailIsRequired:"¡Se requiere correo electrónico!",
    passwordIsRequired:"¡Se requiere contraseña!",
    invalidEmailAddress:"Dirección de correo electrónico no válida!"
  },
  registerScreen:{
    createMyAccountAndExporeEvents:"Crear mi cuenta y explorar eventos",
    register:"Registro",
    name:"Nombre",
    email: "Dirección de correo electrónico",
    lastName: "Apellido",
    phoneNumber:"Teléfono móvil",
    password: "Contraseña",
    confirmPassword:"Confirma tu contraseña",
    iAcceptThe:"Acepto los ",
    termsAndConditionAndPrivacyPolicy:"Términos de servicio y Política de privacidad.",
    creatMyAccount:"Crear mi cuenta",
    doYouAlreadyHaveAccount:"¿Ya tienes una cuenta? ",
    login:"Iniciar sesión ",
    andDontMissAnything:"y no te pierdas nada",
    emailIsRequired:"¡Se requiere correo electrónico!",
    passwordIsRequired:"¡Se requiere contraseña!",
    invalidEmailAddress:"Dirección de correo electrónico no válida!",
    naemIsRequired:"¡El nombre es obligatorio!",
    lastNameIsRequired: "¡Se requiere apellido!",
    phoneNumberIsRequired: "¡Se requiere número de teléfono!",
    confirmPasswordIsRequired:"Se requiere confirmar la contraseña!",
    pleaseAcceptTheTermsAndConditionAndPrivacyPolicy:"Por favor acepte los términos y condiciones y la política de privacidad.",
    phoneNumberIsNotValid:"El número de teléfono debe tener al menos 10 dígitos",
    passwordAndConfirmPasswordDidNotMatch: "Contraseña y Confirmar contraseña no coinciden",
    passwordMustBeSixDigits:"La contraseña debe incluir al menos 6 caracteres, una letra mayúscula, un carácter especial (ej: @) y un número.",
    password6Valiation:"La contraseña debe tener al menos 6 caracteres",
    passwordOneUpperCaseValidation:"La contraseña debe contener al menos una letra mayúscula",
    passwordContain1Number:"La contraseña debe contener al menos un número",
    passwordContainSpecialCharacter:"La contraseña debe contener al menos un carácter especial (por ejemplo, @)",    helpUsConfirmThatThisEmailIsYours:"Ayúdanos a confirmar que este correo es tuyo.",
    weHaveSentLinkToYourMail:"Hemos enviado un enlace a tu correo. Este enlace estará activo por 24 horas.",
    openMail:"Abrir correo",
    cancel:"Cancelar",
  },
  forgotPasswordScreen:{
    forgotPassword:"Recupera tu contraseña",
    emailAddress:"Dirección de correo electrónico",
    enterTheEmailWhichYouRegistered:"Ingresa el correo con el que te registraste.",
    weWilSendYouTheLinkToResetYourPassword:"Te enviaremos un enlace para restablecer tu contraseña.",
    invalidEmailPleaseVerify:"Correo electrónico no válido. Por favor, verifique.",
    itMayTakeFewMinutesForTheEmailToArive:"Puede tardar unos minutos en llegar el correo.",
    backToLogin:"Volver al inicio",
    resetPassword: "Restablecer contraseña",
    dontHaveAccount: "¿No tienes cuenta?",
    register: "Regístrate",
    emailIsRequired:"¡Se requiere correo electrónico!",
    invalidEmailAddress:"Dirección de correo electrónico no válida!"
  },
  ResetLinkSentConfirmationScreen:{
    checkYourMailToUpdateYourPassword: "Revisa tu correo electrónico para actualizar tu contraseña",
    weHaveSentAnEmailTo:"Hemos enviado un correo a ",
    withALinkToRecoverPassword:"con un link para la recuperación de tu contraseña.",
    linkExpiresIn15Minutes:"Por tu seguridad, este enlace expira en 15 minutos.",
    openMail:"Abrir correo",
    dontGetALinkCode:"¿No te llegó el código? ",
    clickHereToResendIt:"Haz clic aquí para reenviarlo.",
    backToLogin:"Volver al inicio",
  }

}

export default es
