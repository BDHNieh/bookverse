import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/index.css";

// Core
import { library } from "@fortawesome/fontawesome-svg-core";

// Solid icons
import {
  faUser,
  faLock,
  faBook,
  faPhone,
  faLocationDot,
  faCompass,
  faBookOpen,
  faHandHolding,
  faBuilding,
  faRightFromBracket,
  faRightToBracket,
  faEnvelope,
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
  faHouse,
  faClock,
  faChevronDown,
  faLink,
  faGripVertical,
  faBars,
  faStar,
  faEye,
  faXmark,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import { faFacebook, faYoutube, faGoogle, faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";

// Vue component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

// Add vào library
library.add(
  faUser,
  faLock,
  faBook,
  faPhone,
  faLocationDot,
  faCompass,
  faBookOpen,
  faHandHolding,
  faBuilding,
  faRightFromBracket,
  faEnvelope,
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
  faFacebook,
  faYoutube,
  faGoogle,
  faHouse,
  faClock,
  faChevronDown,
  faRightToBracket,
  faLink,
  faBars,
  faGripVertical,
  faStar,
  farStar,
  faEye,
  faXmark,
  faGithub,
  faXTwitter,
  faPen,
  faTrash,
);

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
