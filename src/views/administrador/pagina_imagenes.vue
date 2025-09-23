<template>
  <div class="row">
    <!-- Bloques de subida de logo y portada -->
    <div class="row mb-4">
      <!-- LOGO -->
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-header bg-light py-2">
            <span class="fw-bold"><i class="fa fa-image me-2"></i>Logo</span>
          </div>
          <div class="card-body text-center">
            <img
              v-if="EstaEmpresa.logo"
              :src="EstaEmpresa.logo"
              class="img-fluid rounded-3 mb-2"
              style="max-height: 120px;"
              alt="Logo"
            />
            <img
              v-else
              src="../../assets/images/logo_default.png"
              class="img-fluid rounded-3 mb-2"
              style="max-height: 120px;"
              alt="Logo"
            />
            <div class="text-muted small mb-2">Esta es la imagen del logotipo de la empresa.</div>
            <button class="btn btn-outline-primary btn-sm" @click="openLogoModal">
              <i class="fa fa-upload"></i> Cambiar Logo
            </button>
          </div>
        </div>
      </div>
      <!-- PORTADA -->
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-header bg-light py-2">
            <span class="fw-bold"><i class="fa fa-image me-2"></i>Imagen de Portada</span>
          </div>
          <div class="card-body text-center">
            <img
              v-if="EstaEmpresa.portada"
              :src="EstaEmpresa.portada"
              class="img-fluid rounded-3 mb-2"
              style="max-height: 120px;"
              alt="Portada"
            />
            <img
              v-else
              src="../../assets/images/empresa_default.png"
              class="img-fluid rounded-3 mb-2"
              style="max-height: 120px;"
              alt="Portada"
            />
            <div class="text-muted small mb-2">Esta es la imagen de portada principal de la empresa.</div>
            <button class="btn btn-outline-primary btn-sm" @click="openPortadaModal">
              <i class="fa fa-upload"></i> Cambiar Portada
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin bloques de subida -->
    <Divloading v-if="isloading"/>
  </div>
 <!-- MODAL - Logo -->
  <div class="modal fade" id="modal_logo" tabindex="-1" aria-labelledby="modal_logoLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg">
          <h5 class="modal-title py-0" id="modal_logoLabel">
            <i class="fa fa-plus p-r-15"></i>Agregar Fotografía de Logotipo
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isUploading"></button>
        </div>
        <div class="modal-body py-1">
          <div class="mb-3">
            <FileUploader 
                titulo="Logo de la Empresa"
                elementoLoader="loadingfile_logo"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoLogo.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="onLogoUploaded"
                @uploadingStatus="isUploading = $event"
              />
          </div>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary"
             @click="guardarLogo" :disabled="isUploading">
             <span v-if="isUploading">Subiendo...</span>
            <span v-else>Guardar</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isUploading">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL - Portada -->
  <div class="modal fade" id="modal_portada" tabindex="-1" aria-labelledby="modal_portadaLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg">
          <h5 class="modal-title py-0" id="modal_portadaLabel">
            <i class="fa fa-plus p-r-15"></i>Subir Imágen de Portada
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isUploading"></button>
        </div>
        <div class="modal-body py-1">
          <div class="mb-3">
            <FileUploader 
                titulo="Imagen de Portada"
                elementoLoader="loadingfile_portada"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoPortada.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="onPortadaUploaded"
                @uploadingStatus="isUploading = $event"
              />
          </div>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary"
             @click="guardarPortada" :disabled="isUploading">
             <span v-if="isUploading">Subiendo...</span>
            <span v-else>Guardar</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isUploading">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
  </template>

<script lang="ts">
// ...existing code...
import { FileUploader } from '../../components/_components';
import { ref, onMounted, defineComponent } from 'vue';
import { Modal } from 'bootstrap';
import { Adjunto } from '../../interfaces/archivo.interface';
import { useSubirArchivo } from "../../composables/useSubirArchivo";
import { usePagina } from '../../composables/usePagina';
// Centralized imports
import { CardLayout, DataTable, Divloading, ImgLazy } from '../../components/_components';

export default defineComponent({
  components: {
    CardLayout,
    DataTable,
    Divloading,
    ImgLazy,
    FileUploader
  },  setup() {

    const selectedPublicidadId = ref<number | null>(null);
    const isloading = ref(false);
    
    // Agregar el composable usePagina
    const { EstaEmpresa, Listar_Pagina, updateCampo } = usePagina();

    const archivoPortada = useSubirArchivo(
        "loadingfile_portada",
        "fotografia",
      );

    const archivoLogo = useSubirArchivo(
        "loadingfile_logo",
        "fotografia",
      );

      
    // Manejo de modales
    const openAddModal = () => {
      const modalElement = document.getElementById('add_PublicidadModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
      }
    };

    const openEditModal = (id: number) => {
      selectedPublicidadId.value = id;
      const modalElement = document.getElementById('edit_PublicidadModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
      }
    };

    const cargar_link = async () => {
      isloading.value = true;
      // await Listar_Publicidad();
      isloading.value = false; 
    };
    onMounted(async () => {
      await cargar_link();
      await Listar_Pagina(); // Cargar datos de la empresa
    });

    // Estado y handlers para logo y portada
    const isUploading = ref(false);
    const resetTrigger = ref(0);

    const openLogoModal = () => {
      const modalElement = document.getElementById('modal_logo');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    };
    const openPortadaModal = () => {
      const modalElement = document.getElementById('modal_portada');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    };
    const onLogoUploaded = (archivo: any) => {
      // Actualizar el ArchivoTemporal del composable
      archivoLogo.ArchivoTemporal.value = archivo;
    };
    const onPortadaUploaded = (archivo: any) => {
      // Actualizar el ArchivoTemporal del composable
      archivoPortada.ArchivoTemporal.value = archivo;
    };
    
    const guardarLogo = async () => {
      if (archivoLogo.ArchivoTemporal.value && archivoLogo.ArchivoTemporal.value.url) {
        try {
          await updateCampo('logo', archivoLogo.ArchivoTemporal.value.url);
          // Actualizar el estado local
          EstaEmpresa.value.logo = archivoLogo.ArchivoTemporal.value.url;
          // Resetear el formulario
          archivoLogo.reset_formUpload();
          resetTrigger.value++;
          const modalElement = document.getElementById('modal_logo');
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
            modal.hide();
          }
        } catch (error) {
          console.error('Error al guardar logo:', error);
        }
      }
    };
    
    const guardarPortada = async () => {
      if (archivoPortada.ArchivoTemporal.value && archivoPortada.ArchivoTemporal.value.url) {
        try {
          await updateCampo('portada', archivoPortada.ArchivoTemporal.value.url);
          // Actualizar el estado local
          EstaEmpresa.value.portada = archivoPortada.ArchivoTemporal.value.url;
          // Resetear el formulario
          archivoPortada.reset_formUpload();
          resetTrigger.value++;
          const modalElement = document.getElementById('modal_portada');
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
            modal.hide();
          }
        } catch (error) {
          console.error('Error al guardar portada:', error);
        }
      }
    };

    return {
      isloading,
      openAddModal,
      openEditModal,
      // resetear,
      selectedPublicidadId,
      // Logo y portada
      EstaEmpresa,
      isUploading,
      resetTrigger,
      archivoLogo,
      archivoPortada,
      openLogoModal,
      openPortadaModal,
      onLogoUploaded,
      onPortadaUploaded,
      guardarLogo,
      guardarPortada
    };
  },
});
</script>

<style scoped>
.text-sentence {
  text-transform: lowercase;
}

.text-sentence::first-letter {
  text-transform: uppercase;
}

.image-container_slider {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background-color: #ffffff;
  background: url("../../assets/images/default_slider.png");
  background-size: cover;
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  object-fit: cover;
}
</style>
