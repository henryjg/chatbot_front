<template>
  
  <div class="row">
    <!-- [ registrar_inmueble ] start -->
    
    <div class="col-md-12">
      <div class="d-flex" style="z-index: 2; margin-left: 10px;"> 
          <span class="f-14 f-w-500 mt-3 px-3 text-white bg-secondary py-2 rounded-2">
            <i class="ti ti-file p-r-5"></i> Mis Convenios:</span>
        </div>        
        <div class="card" style="margin-top:-4px; " >
          <div class="card-body">
            <ListConvenios v-if="negocio.id" :negocioId="negocio.id" @update-fotos="updateFotos" @updated="cargarDatosNegocio" />
          </div>
        </div>
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
  ListOferta,
  FileUploader,
  GoogleMap,
  Marker
} from '../../components/_components';
import ModalEditNegocio from '../../views/Modals/modal_editar_negocio.vue';

interface Link {
  path: string;
  name: string;
}


export default defineComponent({
  components: {
    Breadcrumb,
    GoogleMap,
    Marker,
    ErrorMessage,
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
    const route = useRoute();
    const router = useRouter();

    const { negocio, Obtener_Negocio, Actualizar_Negocio, imagenes } = useNegocios();
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const idnegocio = Usuario.value!.id;    const fotos = ref<{ id: number, url: string }[]>([]);
    
    const archivoFotografia = useSubirArchivo("loading_logo", "fotografia");
    
    const foto_logo = ref("");
    const foto_imgprincipal = ref("");
    
    const cargarDatosNegocio = async () => {
      try {
        if (!idnegocio || isNaN(Number(idnegocio)) || idnegocio===0) {
          console.error('ID del negocio no es válido:', idnegocio);
        }
        await Obtener_Negocio(idnegocio);  
      } catch (error) {
        console.error('Error al cargar datos del negocio:', error);
        Notif.Error('Error al cargar el negocio.');
      }
    };

    onMounted(async () => {
      await cargarDatosNegocio();
    });


    const cancelar = () => {
      router.push('/office/negocios_lista');
    };

    const editNegocio = () => {
      const modalElement = document.getElementById('edit_NegocioModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement, {
          backdrop: 'static', // Ensure the modal backdrop is static
          keyboard: false, // Disable closing the modal with the keyboard
        });
        modalInstance.show();
      }
    };    const updateFotos = (newFotos: { id: number, url: string }[]) => {
      fotos.value = newFotos;
    };

    // --------------------------------------------------
    const subirCambios = async () => {
      try {
        const resultado = await Actualizar_Negocio(negocio.value.id, negocio.value);
        if (resultado) {
          Notif.Success('Cambios subidos exitosamente.');
          await cargarDatosNegocio();
        }
      } catch (error) {
        console.error('Error al subir los cambios:', error);
        Notif.Error('No se pudo subir los cambios.');
      }
    };

    //-----------------------------------------------------

    const Registrar_logo = async () => {
      if (!foto_logo.value) {
        Notif.Advertencia('Debe seleccionar una imagen primero');
        return;
      }
      
      try {
        const resultado = await imagenes.actualizarLogo(negocio.value.id, foto_logo.value);
        if (resultado) {
          Notif.Success('Logotipo actualizado correctamente');
          await cargarDatosNegocio();
          closeModal_logo();
        }
      } catch (error) {
        console.error('Error al subir los cambios:', error);
        Notif.Error('No se pudo subir los cambios.');
      }    };

    // --------------------------------------------------
    
    const Registrar_Imagen_portada = async () => {
      try {
        const response = await imagenes.actualizarPortada(negocio.value.id, foto_imgprincipal.value);
        if (response.success) {
          Notif.Success('Imágen Guardada Satisfactoriamente.');
          cargarDatosNegocio();
        } else {
          Notif.Error('Error al subir los cambios.');
        }
      } catch (error) {
        console.error('Error al subir los cambios:', error);
        Notif.Error('No se pudo subir los cambios.');
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
    };    
    
    return {
      Registrar_logo,
      breadcrumbRoutes,
      cancelar,
      NumberFormat,
      cargarDatosNegocio,
      negocio,
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
      idnegocio,
      closeModal_logo,
      closeModal_portada
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