<template>
    <li class="dropdown pc-h-item header-user-profile">
      <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
        aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false">
        <img :src="Usuario?.fotoPerfil ? HOST_URL+Usuario.fotoPerfil : '/src/assets/images/avatar.png'" alt="user-image" class="user-avtar hei-40" />
      </a>
      <div class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
        <div class="dropdown-header d-flex align-items-center justify-content-between">
          <h5 class="m-0">Perfil de Usuario</h5>
          <span class="badge bg-primary">{{Usuario?.rol}}</span>
        </div>
        <div class="dropdown-body">
          <div class="profile-notification-scroll position-relative" style="max-height: calc(100vh - 225px)">
            <ul class="list-group list-group-flush w-100">
              <!-- <li class="list-group-item">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <img alt="user-image" 
                        :src="Usuario?.fotoPerfil ? HOST_URL+Usuario.fotoPerfil : '/src/assets/images/avatar.png'"
                        class="wid-50 hei-50 rounded-circle" />
                  </div>
                  <div class="flex-grow-1 mx-3">
                    <h6 class="mb-0">{{Usuario?.nombre}} {{Usuario?.apellidos}}</h6>
                    <a class="link-primary" :href="'mailto:'+Usuario?.correo">{{Usuario?.correo}}</a>
                  </div>
                  
                </div>
              </li> -->
              <li class="list-group-item">
                <a href="#" class="dropdown-item" @click="openChangePasswordModal">
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-key"></i>
                    <span>Cambiar Contraseña</span>
                  </span>
                </a>
                <!-- <a href="#" class="dropdown-item" @click="openModal (trabajador)">
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-user-circle"></i>
                    <span>Editar datos personales</span>
                  </span>
                </a> -->
           
              </li>
              <li class="list-group-item">
                <!-- <a v-if="Usuario?.rol=== 'Administrador'" href="#" class="dropdown-item">
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-gear-six"></i>
                    <span>Settings</span>
                  </span>
                </a> -->
             
                <a  href="#" class="dropdown-item" @click="logout">
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-power text-warning"></i>
                    <span>Cerrar Sesión</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </li>

    <!-- Modal para cambiar contraseña -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="changePasswordModalLabel">Cambiar Contraseña</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Contraseña Actual</label>
              <div class="input-group">
                <input :type="showCurrentPassword ? 'text' : 'password'" class="form-control" id="currentPassword" v-model="currentPassword">
                <button class="btn btn-outline-secondary" type="button" @click="toggleShowCurrentPassword">
                  <i :class="showCurrentPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">Nueva Contraseña</label>
              <div class="input-group">
                <input :type="showNewPassword ? 'text' : 'password'" class="form-control" id="newPassword" v-model="newPassword">
                <button class="btn btn-outline-secondary" type="button" @click="toggleShowNewPassword">
                  <i :class="showNewPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar Nueva Contraseña</label>
              <div class="input-group">
                <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="confirmPassword">
                <button class="btn btn-outline-secondary" type="button" @click="toggleShowConfirmPassword">
                  <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="changePassword">Cambiar Contraseña</button>
          </div>
        </div>
      </div>
    </div>
   
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import type { Trabajador } from '../interfaces/trabajador.interface';
import { HOST_URL } from '../config';
import { usarAutenticacion } from "../composables/AuthValidate";
import { usarAuthStore } from '../stores/autentificacionStore';
import { Modal } from 'bootstrap';
import Notif from "../utils/notificaciones";
import Alerta from "../utils/alertas";
import { cambiarContrasena } from '../services/autentificacion.service';
import { useTrabajador } from '../composables/useTrabajador';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const authStore = usarAuthStore();
    const { logout } = usarAutenticacion();

    const { trabajador, nuevoTrabajador } = useTrabajador();
    const modalInstance = ref<Modal | null>(null); // Fix for Modal type
    const route = useRoute();

    const isEditing = ref(false);
    
    const Usuario = ref<Trabajador | null>(null);
    Usuario.value = authStore.trabajador;

    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    const toggleShowCurrentPassword = () => {
      showCurrentPassword.value = !showCurrentPassword.value;
    };

    const toggleShowNewPassword = () => {
      showNewPassword.value = !showNewPassword.value;
    };

    const toggleShowConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const openChangePasswordModal = () => {
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      const modalElement = document.getElementById('changePasswordModal');
      if (modalElement) {
        document.body.appendChild(modalElement);
        const modal = new Modal(modalElement);
        modal.show();
      }
    };

    const closeChangePasswordModal = () => {
      const modalElement = document.getElementById('changePasswordModal');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };

    const changePassword = async () => {
      if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
        Notif.Error('Todos los campos son obligatorios');
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        Notif.Error('Las contraseñas no coinciden');
        return;
      }

      try {
        const response = await cambiarContrasena(Usuario.value?.id ?? 0, newPassword.value); // Fix for undefined id
        if (response.success) {
          Alerta.Sucessfull("Completado", "Contraseña cambiada satisfactoriamente");
          closeChangePasswordModal();
        } else {
          Notif.Error(response.message);
        }
      } catch (error) {
        Notif.Error('Error al cambiar la contraseña');
      }
    };

    // ---------------------------------------------------------------------------
    const openModal = (trabajador: Trabajador) => {
      isEditing.value = true;
      Object.assign(nuevoTrabajador.value, trabajador);
      const modalElement = document.getElementById('modalEditarTrabajador');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const closeModal = () => {
      const modalElement = document.getElementById("modalEditarTrabajador");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };

    // const onFileChange = (event: Event) => { // Fix for implicit 'any' type
    //   const target = event.target as HTMLInputElement;
    //   if (target.files && target.files[0]) {
    //     trabajador.value.fotoPerfil = target.files[0];
    //   }
    // };

    onMounted(() => {
      const modalElement = document.getElementById('modalEditarTrabajador');
      if (modalElement) {
        document.body.appendChild(modalElement); // Mueve el modal al body
        modalInstance.value = new Modal(modalElement); // Fix for Modal type
      }
    });

    return {
      // actualizarTrabajador,
      // cargarTrabajador,
      openModal,
      closeModal,
      // onFileChange,
      Usuario,
      logout,
      authStore,
      currentPassword,
      newPassword,
      confirmPassword,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      toggleShowCurrentPassword,
      toggleShowNewPassword,
      toggleShowConfirmPassword,
      openChangePasswordModal,
      closeChangePasswordModal,
      changePassword,
      HOST_URL,
      trabajador,
      modalInstance
    };
  }
};
</script>

<style lang="scss" scoped>


</style>