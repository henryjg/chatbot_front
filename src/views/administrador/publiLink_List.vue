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
              v-if="logoUrl"
              :src="logoUrl"
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
            <div class="text-muted small mb-2">Esta es la imagen del logotipo de la publicidad.</div>
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
              v-if="portadaUrl"
              :src="portadaUrl"
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
            <div class="text-muted small mb-2">Esta es la imagen de portada principal de la publicidad.</div>
            <button class="btn btn-outline-primary btn-sm" @click="openPortadaModal">
              <i class="fa fa-upload"></i> Cambiar Portada
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin bloques de subida -->
    <Divloading v-if="isloading"/>
    <!-- <Transition>
      <div class="row g-1" v-if="!isloading">
        <div class="col-3" v-for="(item, index) in listaPublicidad" :key="item.id" >
            <div class="text-center">
                <button @click="openEditModal(item.id)" class="btn btn-light-warning btn-sm me-1">
                  <i class="ti ti-pencil"></i>
                </button>                    <button @click="Eliminar_publicidad(item.id)" class="btn btn-light-danger btn-sm">
                  <i class="ti ti-trash"></i>
                </button>
            </div>
            <CardPublicidad :item="item"></CardPublicidad>
        </div>
      </div>
    </Transition> -->
  </div>
 <!-- MODAL - Logo -->
  <!-- <div class="modal fade" id="modal_logo" tabindex="-1" aria-labelledby="modal_logoLabel"
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
                titulo="Logo de la Publicidad"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoTemporalLogo"
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
  </div> -->

  <!-- MODAL - Portada -->
  <!-- <div class="modal fade" id="modal_portada" tabindex="-1" aria-labelledby="modal_portadaLabel"
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
                titulo="Imágen de Portada"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoTemporalPortada"
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
  </div> -->
  </template>

<script lang="ts">
// ...existing code...
import { FileUploader } from '../../components/_components';
import { ref, onMounted, defineComponent } from 'vue';
import { Modal } from 'bootstrap';

// Centralized imports
import { CardLayout, DataTable, Divloading, ImgLazy } from '../../components/_components';
// import { usePublicidad } from '../../composables/_composables';

// Modal imports (these are specific modal components)
// import modal_add_publicidad from '../../views/Modals/modal_add_publicidad.vue';
// import modal_editar_publicidad from '../../views/Modals/modal_edit_publicidad.vue';

export default defineComponent({
  components: {
    CardLayout,
    DataTable,
    // modal_add_publicidad,
    // modal_editar_publicidad,
    Divloading,
    ImgLazy,
    // CardPublicidad,
    FileUploader
  },  setup() {
    // const { listaPublicidad, Listar_Publicidad, Eliminar_publicidad } = usePublicidad();
    const selectedPublicidadId = ref<number | null>(null);
    const isloading = ref(false);
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

    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'IMAGEN', width: '30%', key: 'urlFoto' },
      { text: 'NOMBRE', width: '10%', key: 'nombre' },
      { text: 'UBICACIÓN', width: '10%', key: 'ubicacion' },
      { text: 'CUOTAS', width: '10%', key: 'cuotas' },
      { text: 'AREA', width: '10%', key: 'area' },
      { text: 'ESTADO', width: '10%', key: 'estado' },
      { text: 'ACCIONES', width: '10%', key: 'acciones' },
      { text: '', width: '5%', key: 'acciones' },
    ]);    const resetear = () => {
      // Listar_Publicidad();
    };

    const cargar_link = async () => {
      isloading.value = true;
      // await Listar_Publicidad();
      isloading.value = false; 
    };
    onMounted(async () => {
      await cargar_link();
      // console.log("Datos cargados:", listaPublicidad.value);
    });

    // Estado y handlers para logo y portada
    const logoUrl = ref('');
    const portadaUrl = ref('');
    const isUploading = ref(false);
    const resetTrigger = ref(0);
    const archivoTemporalLogo = ref({ url: '' });
    const archivoTemporalPortada = ref({ url: '' });

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
      archivoTemporalLogo.value = archivo;
      logoUrl.value = archivo.url;
    };
    const onPortadaUploaded = (archivo: any) => {
      archivoTemporalPortada.value = archivo;
      portadaUrl.value = archivo.url;
    };
    const guardarLogo = () => {
      resetTrigger.value++;
      const modalElement = document.getElementById('modal_logo');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        modal.hide();
      }
    };
    const guardarPortada = () => {
      resetTrigger.value++;
      const modalElement = document.getElementById('modal_portada');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        modal.hide();
      }
    };

    return {
      headers,
      // listaPublicidad,
      isloading,
      openAddModal,
      openEditModal,
      resetear,
      // Listar_Publicidad,
      // Eliminar_publicidad,
      selectedPublicidadId,
      // Logo y portada
      logoUrl,
      portadaUrl,
      isUploading,
      resetTrigger,
      archivoTemporalLogo,
      archivoTemporalPortada,
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
