// Importa le librerie necessarie
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHome, faUsers, faShare, faUser, faCog, faSignInAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

// Aggiungi le icone alla libreria
library.add(faHome, faUsers, faShare, faUser, faCog, faSignInAlt, faArrowLeft, faArrowRight, faFacebook);

// Esporta FontAwesomeIcon per registrarlo come componente globale
export default FontAwesomeIcon;



