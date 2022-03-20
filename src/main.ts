import { App as vueApp, createApp } from "vue";
import App from "./App.vue";
import router /* , { offlineRouter } */ from "./router";
import { store } from "./store";
import { auth } from "./firebase";

import "@popperjs/core";
import "bootstrap";
import "./assets/styles/flags.scss";
import "./assets/styles/custom-bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../node_modules/@fortawesome/fontawesome-free/css/solid.css";
import "../node_modules/@fortawesome/fontawesome-free/css/regular.css";
import "../node_modules/@fortawesome/fontawesome-free/css/brands.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css";
import "../node_modules/cropperjs/dist/cropper.min.css";
let app: vueApp<Element>;
auth.onAuthStateChanged((/*user*/) => {
  if (!app) {
    app = createApp(App);
    app
      .use(store)
      .use(router)
      //.use(offlineRouter)
      .mount("#app");
  }
  // if (user) {
  //   store.dispatch("auth/doGetUserProfile", user);
  // }
});
