<template>
  <nav
    id="sidebarMenu"
    class="navbar navbar-expand-md navbar-vertical shadow-lg navbar-dark pt-0"
  >
    <div class="container-fluid">
      <div class="navbar-brand pt-3 pb-2 mx-0 sticky-top">
        <div class="d-flex justify-content-between">
          <router-link to="/" class="mx-4 mx-md-auto">
            <img
              src="../assets/img/gtr_academy-300x115.png"
              alt="GTR Academy"
            />
          </router-link>
          <button
            class="navbar-toggler collapsed align-self-center mx-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-menu"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <hr class="mx-4 text-light" />
      </div>
      <div id="main-menu" class="navbar-collapse collapse" ref="menuDiv">
        <ul class="navbar-nav flex-fill">
          <li
            v-for="menuItem in menu"
            :key="menuItem"
            :class="
              'text-nowrap nav-item position-relative border-' + menuItem.Color
            "
            @click="hideMenu()"
          >
            <router-link :to="menuItem.Route">
              <a href="#" class="nav-link stretched-link text-light">
                <i :class="menuItem.Icon + ' text-' + menuItem.Color"></i>
                <span class="nav-link-text"> {{ menuItem.Label }}</span>
              </a></router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

export default defineComponent({
  name: "dashboard-sidebar",
  inject: {
    //menus: { from: "menus-definition" }
  },
  data() {
    return {
      menu: Array<string>()
    };
  },
  computed: {
    ...mapState("sys", ["UserMenu"]),
    ...mapGetters("auth", ["getUserPermissions"]),
    ...mapGetters("auth", ["getUserRole"])
  },
  methods: {
    hideMenu() {
      (this.$refs.menuDiv as HTMLDivElement).classList.remove("show");
    }
  },
  mounted() {
    this.menu = this.UserMenu.filter((item: any) =>
      this.getUserPermissions.includes(item.Key)
    );
  }
});
</script>
<style lang="scss" scoped>
.navbar-vertical {
  z-index: 500;
  background-color: $dark;
  background-image: linear-gradient(
    to bottom right,
    #344675,
    #263148,
    #263148,
    #344675,
    #344675,
    #e14eca
  );
  overflow-y: auto;
  div.navbar-brand {
    width: 100%;
    img {
      max-width: 180px;
      background-color: inherit;
    }
  }
  > [class*="container"] {
    flex-direction: column;
    padding-left: 0;
    padding-right: 0;
  }
  .navbar-collapse {
    z-index: 9999;
    position: fixed;
    top: 65px;
    right: 0px;
    bottom: 0px;
    width: 350px;
    overflow-y: auto;
    align-items: stretch;
    padding: 1rem 2.5rem 5rem 5rem;
    margin-bottom: -5.5rem;
    > ul {
      background-image: linear-gradient(
        to bottom right,
        #344675,
        #263148,
        #263148,
        #344675,
        #344675,
        #e14eca
      );
      padding-bottom: 2rem;
      box-shadow: -0.5rem 0.5rem 2rem rgba(0, 0, 0, 0.45);
    }
  }
}
#main-menu {
  .navbar-nav {
    margin-right: -1.5rem;
    margin-left: -1.5rem;
    padding-right: 0rem;
    padding-left: 1.5rem;
    .nav-item {
      margin-left: -1.5rem;
      padding-right: 1.5rem;
      padding-left: 1.5rem;
      border-left: 5px solid;
      border-color: transparent;
      .nav-link {
        line-height: 2rem;
        font-weight: 500;
        font-size: 1rem;
        > i {
          min-width: 2.25rem;
          font-size: 1.4rem;
          display: inline-block;
          position: relative;
          vertical-align: top;
        }
        > i.fa {
          vertical-align: text-bottom;
        }
        > i::before {
          line-height: unset;
        }
        > .nav-link-text {
          vertical-align: top;
        }
      }
    }
  }
  .navbar-nav {
    .nav-item:hover {
      //background-color: $gray-200;
      border-color: unset;
      .nav-link:hover {
        font-weight: 700;
        > i.bi,
        > i > svg {
          font-size: 1.65rem;
        }
      }
    }
  }
}
@include media-breakpoint-up(md) {
  .navbar-vertical.navbar-expand-md {
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 250px;
    div.navbar-brand {
      text-align: center;
      img {
        max-width: 180px;
        background-color: inherit;
      }
    }
    > [class*="container"] {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-align: stretch;
      -ms-flex-align: stretch;
      align-items: stretch;
      padding-left: 0;
      padding-right: 0;
    }
    .navbar-collapse {
      position: unset;
      top: unset;
      right: unset;
      bottom: unset;
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      padding: 0;
      > ul {
        background-image: unset;
        box-shadow: unset;
      }
    }
    .navbar-nav {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
    }
  }
  #main-menu {
    .navbar-nav {
      margin-right: 0em;

      .nav-item {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
}

.navbar-modal-active {
  z-index: 0 !important;
}
</style>
