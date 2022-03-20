<template>
  <main>
    <div class="d-flex flex-column">
      <div
        class="top-text text-light p-3 pe-5 d-flex justify-content-end align-items-center"
      >
        <img
          src="../assets/img/gtr_academy_logo-100x120.png"
          class="img-fluid d-md-none"
        />
        <h1 class="fs-5 text-end ms-5">
          <span class="fw-bold me-1 ms-5">¡Llegó tu momento!</span
          ><small class="d-none">
            Que tan dispuesto estás a ir por tus sueños
          </small>
        </h1>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <div class="social-navbar d-flex flex-column">
              <div class="top-logo pt-2 ps-3 d-none d-md-block mb-2">
                <img
                  src="../assets/img/gtr_academy_logo-100x120.png"
                  class=""
                />
              </div>
              <div class="social-links">
                <ul
                  class="list-unstyled d-flex flex-md-column justify-content-end justify-content-md-start ms-4 fs-5"
                >
                  <li class=" ms-3 mb-1">
                    <a
                      href="https://www.instagram.com/gtracademy.oficial/"
                      class="link-light"
                      target="_blank"
                      ><i class="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li class=" ms-3 mb-1">
                    <a
                      href="https://www.facebook.com/generaturiquezaclub"
                      class="link-light"
                      target="_blank"
                      ><i class="fab fa-facebook"></i
                    ></a>
                  </li>
                  <li class=" ms-3 mb-1">
                    <a
                      href="https://www.youtube.com/channel/UCZOM8O0GcCLUQvx5YmuPsTQ"
                      class="link-light"
                      target="_blank"
                      ><i class="fab fa-youtube"></i
                    ></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="d-flex flex-fill align-items-center">
              <div class="container pt-5 mt-5">
                <!-- <slide-y-up-transition mode="out-in" origin="center top"> -->
                <router-view></router-view>
                <!-- </slide-y-up-transition> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  background-image: url("../assets/img/login_bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.top-text {
  background-color: rgba($dark, 0.5);
  background-image: linear-gradient(
    to top right,
    #344675aa,
    #263148aa,
    #263148aa,
    #344675aa,
    #e14ecaaa
  );
}
@supports (backdrop-filter: blur(0.25rem)) {
  .top-text {
    background-color: rgba($dark, 0.5); //hsl(0 0 0 /0.5);
    backdrop-filter: blur(0.25rem);
  }
}
</style>
