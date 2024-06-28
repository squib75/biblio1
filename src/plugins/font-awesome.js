// Importa le librerie necessarie
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHome, faUsers, faShare, faUser, faCog, faSignInAlt, faSignOutAlt, faEnvelope, faEye, faEyeSlash, faTachometerAlt} from '@fortawesome/free-solid-svg-icons';

// Aggiungi le icone alla libreria
library.add(faHome, faUsers, faShare, faUser, faCog, faSignInAlt, faSignOutAlt, faEnvelope, faEye, faEyeSlash, faTachometerAlt);

// Esporta FontAwesomeIcon per registrarlo come componente globale
export default FontAwesomeIcon;



