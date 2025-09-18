<template>
  <!-- [ Header Topbar ] start -->
  <header class="pc-header">
    <div class="header-wrapper">
      <!-- [Mobile Media Block] start -->
      <div class="me-auto pc-mob-drp">
        <ul class="list-unstyled">
          <!-- ======= Menu collapse Icon ===== -->
          <li class="pc-h-item pc-sidebar-collapse">
            <a href="#" class="pc-head-link ms-0" id="sidebar-hide">
              <i class="ti ti-menu-2"></i>
            </a>
          </li>
          <li class="pc-h-item pc-sidebar-popup">
            <a href="#" class="pc-head-link ms-0" id="mobile-collapse">
              <i class="ti ti-menu-2"></i>
            </a>
          </li>
          
        </ul>
      </div>
      <!-- [Mobile Media Block end] -->
      <div class="ms-auto">
        <ul class="list-unstyled">
          <li class="pc-h-item">
            <a class="pc-head-link " href="#" @click.prevent="openFullscreen" role="button">
              <i class="fas fa-tv "></i>
            </a>
          </li>
          <li class="pc-h-item">
          
            <a href="#" class="pc-head-link " @click="toggleTheme">
                <i v-if="!isModeDark" class="ph-duotone ph-sun-dim text-warning"></i>
                <i v-else class="ph-duotone ph-moon text-info"></i>
              </a>
          </li>

          <!-- <li class="dropdown pc-h-item">
            <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
              aria-haspopup="false" aria-expanded="false">
              <i class="ph-duotone ph-sun-dim"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end pc-h-dropdown">
              <a href="#!" class="dropdown-item" @click="() => layoutChange('dark')">
                <i class="ph-duotone ph-moon"></i>
                <span>Dark</span>
              </a>
              <a href="#!" class="dropdown-item" @click="() => layoutChange('light')">
                <i class="ph-duotone ph-sun-dim"></i>
                <span>Light</span>
              </a>
          
            </div>
          </li> -->
          
          <!-- **************************** -->
          <boxPerfil/>
          <!-- **************************** -->
        </ul>
      </div>
    </div>
  </header>
  <!-- [ Header ] end -->
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import boxPerfil from "../components/dash_CampoPerfil.vue";
import { Dropdown } from 'bootstrap';



export default defineComponent({
  components: {
    boxPerfil
  },
  setup() {
    const isModeDark = ref(false);
    const toggleTheme = () => {
      const layout = isModeDark.value ? 'light' : 'dark';
      document.getElementsByTagName('body')[0].setAttribute('data-pc-theme', layout);
      isModeDark.value = !isModeDark.value;
    };

    const initializeSidebarToggle = () => {
      const sidebarHide = document.querySelector('#sidebar-hide');
      const mobileCollapse = document.querySelector('#mobile-collapse');

      if (sidebarHide) {
        sidebarHide.addEventListener('click', () => {
          const sidebar = document.querySelector('.pc-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('pc-sidebar-hide');
          }
        });
      }

      if (mobileCollapse) {
        mobileCollapse.addEventListener('click', () => {
          const tempSidebar = document.querySelector('.pc-sidebar');
          if (tempSidebar) {
            if (tempSidebar.classList.contains('mob-sidebar-active')) {
              rm_menu();
            } else {
              tempSidebar.classList.add('mob-sidebar-active');
              tempSidebar.insertAdjacentHTML('beforeend', '<div class="pc-menu-overlay"></div>');
              document.querySelector('.pc-menu-overlay')?.addEventListener('click', () => {
                rm_menu();
              });
            }
          }
        });
      }

      // if (document.querySelector('.navbar-content')) {
      //   new SimpleBar(document.querySelector('.navbar-content') as HTMLElement);
      // }
    };

    const rm_menu = () => {
      const tempList = document.querySelector('.pc-sidebar');
      if (tempList) {
        tempList.classList.remove('mob-sidebar-active');
      }
      if (document.querySelector('.topbar')) {
        document.querySelector('.topbar')?.classList.remove('mob-sidebar-active');
      }

      document.querySelector('.pc-sidebar .pc-menu-overlay')?.remove();
      document.querySelector('.topbar .pc-menu-overlay')?.remove();
    };

    const openFullscreen = () => {
      const elem = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari y Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // Internet Explorer/Edge
        elem.msRequestFullscreen();
      }
    };

    const closeFullscreen = () => {
      const doc = document as Document & {
        mozCancelFullScreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { // Firefox
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { // Chrome, Safari y Opera
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { // Internet Explorer/Edge
        doc.msExitFullscreen();
      }
    };

    const initializeDropdowns = () => {
      const dropdownElement = document.getElementById('dropdownMenuButton') as HTMLElement;
      if (dropdownElement) {
        new Dropdown(dropdownElement);
      }
    };

    onMounted(() => {
      const currentTheme = document.getElementsByTagName('body')[0].getAttribute('data-pc-theme');
        isModeDark.value = currentTheme === 'dark';

      initializeSidebarToggle();
      initializeDropdowns();
    });

    return {
      toggleTheme,
      rm_menu,
      openFullscreen,
      closeFullscreen,
      isModeDark
    };
  },
});
</script>

<style lang="scss" scoped>


</style>
