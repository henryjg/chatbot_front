<template>
  
  <div class="row">
    <!-- [ registrar_inmueble ] start -->
    
    <div class="col-md-12">
            <div class="d-flex" style="z-index: 2; margin-left: 10px;"> 
              <span class="f-14 f-w-500 mt-3 px-3 text-white bg-secondary py-2 rounded-2">
                <i class="ti ti-box p-r-5"></i> Mis Ofertas:</span>
            </div>
            <div class="card" style="margin-top:-4px; " >
              <div class="card-body">
                <ListOferta :negocioId="negocio.id" @update-fotos="updateFotos" />
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
import { useRouter } from 'vue-router';
import { GoogleMap, Marker } from 'vue3-google-map';
import { Notif, NumberFormat } from '../../utils/_utils';
import { useNegocios } from '../../composables/_composables';
import { useAuthStore } from '../../stores/authStore';
import {
  Breadcrumb,
  CardOferta,
  ErrorMessage,
  FormFotos,
  ListOferta,
  ListConvenios,
  FileUploader
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
    ErrorMessage,
    CardOferta,
    FormFotos,
    ListConvenios,
    ListOferta,
    ModalEditNegocio,
    FileUploader
  },
  setup() {
    const breadcrumbRoutes = ref<Link[]>([
      { path: '', name: 'Negocio' },
      { path: '', name: 'Detalles' },
    ]);
    const router = useRouter();

    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const idnegocio = Usuario.value!.id;

    // Usar el composable de negocios
    const { 
      negocio, 
      Obtener_Negocio,
      imagenes,
      isLoading_negocio
    } = useNegocios();
    
    const fotos = ref<{ id: number, url: string }[]>([]);
    
    const foto_logo = ref("");
    const foto_imgprincipal = ref("");
    
    onMounted(async () => {
      await Obtener_Negocio(idnegocio);
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
    };

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
        }
      } catch (error) {
        Notif.handleApiErrorWithNotification(error);
      }
    };

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
    
    return {
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
      foto_logo,
      foto_imgprincipal,
      Registrar_Imagen_portada,
      idnegocio
    };
  },
});
</script>