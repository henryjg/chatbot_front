<template>
  
  <div class="row">
    <!-- [ registrar_inmueble ] start -->
    
    <div class="col-md-12">
            <div class="d-flex" style="z-index: 2; margin-left: 10px;"> 
              <span class="f-14 f-w-500 mt-3 px-3 text-white bg-secondary py-2 rounded-2">
                <i class="ti ti-box p-r-5"></i> Mis Sedes:</span>
            </div>
            <div class="card" style="margin-top:-4px; " >              <div class="card-body">
                <PanelSede :negocioId="negocio.id" @update-fotos="updateFotos" />
              </div>
            </div>
            <ModalEditNegocio :negocio="negocio" @updated="Obtener_Negocio(idnegocio)" />
    <!-- Fin row-------------------------------------- -->   
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { Modal } from 'bootstrap';
import { useRoute, useRouter } from 'vue-router';
import { Notif, NumberFormat } from '../../utils/_utils';
import { useNegocios, useSubirArchivo } from '../../composables/_composables';
import { useAuthStore } from '../../stores/authStore';
import {
  Breadcrumb,
  ErrorMessage,
  FormFotos,
  ListConvenios,
  PanelSede,
  FileUploader,
  GoogleMap,
  Marker
} from '../../components/_components';
import ModalEditNegocio from '../../views/Modals/modal_editar_negocio.vue';

export interface Link {
path: string;
name: string;
}


export default defineComponent({
components: {
  Breadcrumb,
  GoogleMap,
  Marker,
  // UbigeoSelect,
  ErrorMessage,
  FormFotos,
  ListConvenios,
  PanelSede,
  ModalEditNegocio,
  FileUploader
},setup() {
    const breadcrumbRoutes = ref<Link[]>([
      { path: '', name: 'Negocio' },
      { path: '', name: 'Detalles' },
    ]);
    const route = useRoute();
    const router = useRouter();

    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const idnegocio = Usuario.value!.id;    // Usar composables
    const { negocio, Obtener_Negocio, imagenes, isLoading_negocio } = useNegocios();
    
    const fotos = ref<{ id: number, url: string }[]>([]);
    const archivoFotografia = useSubirArchivo("loading_logo", "fotografia");
    const foto_logo = ref("");
    const foto_imgprincipal = ref("");    
    
    // Cargar datos usando composable
    onMounted(async () => {
      await Obtener_Negocio(idnegocio);
      // Note: fotos are now managed by PanelSede component
    });

    const cancelar = () => {
      router.push('/office/negocios_lista');
    };

    const editNegocio = () => {
      const modalElement = document.getElementById('edit_NegocioModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement, {
          backdrop: 'static',
          keyboard: false,
        });
        modalInstance.show();
      }
    };

    const updateFotos = (newFotos: { id: number, url: string }[]) => {
      fotos.value = newFotos;
    };    // Note: Negocio updates are now handled by ModalEditNegocio component
    const subirCambios = async () => {
      try {
        Notif.Success('Los cambios se actualizarán a través del modal de edición.');
        await Obtener_Negocio(idnegocio);
      } catch (error) {
        Notif.handleApiErrorWithNotification(error);
      }
    };

    // Usar composable para registro de logo
    const Registrar_logo = async () => {
      if (!foto_logo.value) {
        Notif.Advertencia('Debe seleccionar una imagen primero');
        return;
      }
      
      try {
        const resultado = await imagenes.actualizarLogo(negocio.value.id, foto_logo.value);
        if (resultado) {
          Notif.Success('Logotipo actualizado correctamente');
          await Obtener_Negocio(idnegocio);
          closeModal_logo();
        }
      } catch (error) {
        Notif.handleApiErrorWithNotification(error);
      }
    };

    // Usar composable para registro de portada
    const Registrar_Imagen_portada = async () => {
      if (!foto_imgprincipal.value) {
        Notif.Advertencia('Debe seleccionar una imagen primero');
        return;
      }
      
      try {
        const resultado = await imagenes.actualizarPortada(negocio.value.id, foto_imgprincipal.value);
        if (resultado) {
          Notif.Success('Imagen de portada actualizada correctamente');
          await Obtener_Negocio(idnegocio);
        }
      } catch (error) {
        Notif.handleApiErrorWithNotification(error);
      }
    };
  

  const Openmodal_add_logo_negocio = () => {
    const modalElement = document.getElementById('modal_add_logo_negocio');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  const Openmodal_add_portada_negocio = () => {
    const modalElement = document.getElementById('modal_add_portada_negocio');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  const closeModal_logo = () => {
    const modalElement = document.getElementById('add_logo_negocio');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  };

  const closeModal_portada = () => {
    const modalElement = document.getElementById('portada_negocio');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  };    return {
      Registrar_logo,
      breadcrumbRoutes,
      cancelar,
      NumberFormat,
      Obtener_Negocio,
      negocio,
      isLoading_negocio,
      fotos,
      editNegocio,
      updateFotos,
      subirCambios,
      foto_logo,
      foto_imgprincipal,
      archivoFotografia,
      Openmodal_add_logo_negocio,
      Openmodal_add_portada_negocio,
      Registrar_Imagen_portada,
      idnegocio
    };
},
});
</script>

<style lang="scss" scoped>
.text-amarillo {
color: rgb(217 144 4) !important;
}
/* Ocultar el logo de Google y otros textos */
.gmnoprint {
display: none !important;
}
</style>