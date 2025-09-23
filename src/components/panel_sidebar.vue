<template>
  <nav class="pc-sidebar">
    <div class="navbar-wrapper">
       <div class="m-header d-flex justify-content-center align-items-center">
        <router-link to="/beneficios/loggin_admin" class="b-brand text-primary">
          <img src="../assets/logochatbot.png" alt="logo image" class="logo-lg wid-100" />
        </router-link>
      </div>
      <simplebar data-simplebar class="navbar-content pc-trigger">
        <ul  class="pc-navbar">
            <!-- Estructura para elementos tipo 'titulo' -->
            <template v-for="item in filteredMenuItems" :key="item.text">
              <template v-if="item.tipe == 'titulo'">
                <li class="pc-item pc-caption">
                  <label class="text-primary">{{ item.text }}</label>
                </li>
              </template>

              <!-- Estructura para elementos tipo 'link' -->
              <template v-else-if="item.tipe === 'link'">
                <li class="pc-item pc-hasmenu">
                  <router-link :to="item.route" class="pc-link">
                    <span class="pc-micon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="pc-mtext">{{ item.text }}</span>
                  </router-link>
                </li>
              </template>
            </template>
        </ul>
      </simplebar>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { menuItems, MenuItem } from '../utils/lista_menulateral';  // Importa la lista de menús y el tipo MenuItem
import { usarAuthStore } from '../stores/authStore';
import simplebar from 'simplebar-vue';

export default defineComponent({
  components: {
    simplebar
  },
  setup() {
    const route = useRoute();

  const authStore = usarAuthStore();
  const usuario = computed(() => authStore.trabajador);

    const highlightActiveLink = () => {
      const elem = document.querySelectorAll<HTMLAnchorElement>('.pc-sidebar .pc-navbar a');
      const pageUrl = window.location.href.split(/[?#]/)[0];

      elem.forEach((link) => {
        const parent = link.parentElement;
        if (link.href === pageUrl && link.getAttribute('href') !== '') {
          parent?.classList.add('active');
          let grandParent = parent?.parentElement?.parentElement;
          if (grandParent) {
            grandParent.classList.add('pc-trigger');
            grandParent.classList.add('active');
            grandParent.querySelector('ul')?.style.setProperty('display', 'block');
          }
          let greatGrandParent = grandParent?.parentElement?.parentElement;
          if (greatGrandParent) {
            greatGrandParent.classList.add('pc-trigger');
            greatGrandParent.querySelector('ul')?.style.setProperty('display', 'block');
          }
        } else {
          parent?.classList.remove('active');
          let grandParent = parent?.parentElement?.parentElement;
          if (grandParent) {
            grandParent.classList.remove('pc-trigger');
            grandParent.classList.remove('active');
            grandParent.querySelector('ul')?.style.removeProperty('display');
          }
          let greatGrandParent = grandParent?.parentElement?.parentElement;
          if (greatGrandParent) {
            greatGrandParent.classList.remove('pc-trigger');
            greatGrandParent.querySelector('ul')?.style.removeProperty('display');
          }
        }
      });
    };

    onMounted(() => {
      highlightActiveLink();
    });

    watch(route, () => {
      highlightActiveLink();
    });



    onMounted(() => {
      highlightActiveLink();
    });

    watch(route, () => {
      highlightActiveLink();
    });

    // Función para filtrar los ítems del menú según el `role_id`
    const filteredMenuItems = computed(() => {
      const filterByRole = (items: MenuItem[]): MenuItem[] => {
        const userRoleName = usuario.value?.rol || null;
        console.log('usuario.value:', usuario.value);
        console.log('userRoleName:', userRoleName);
        const filtered = items.filter((item: MenuItem) => {
          if (item.role_ids) {
            return userRoleName !== null && item.role_ids.includes(userRoleName);
          }
          return true; // Si no hay `role_ids`, mostrar para todos los roles
        });
        console.log('filteredMenuItems:', filtered);
        return filtered;
      };
      return filterByRole(menuItems);
    });

    return {
      filteredMenuItems,
    };
  },
});
</script>

<style scoped>
/* Añade tus estilos personalizados aquí si es necesario */
</style>
