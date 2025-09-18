<template>
<div class="row">
  <div class="col-md-4">
    <div class="card">
      <div class="card-header py-1 ">
        <div class="row">
          <button type="button" @click="openModalFoto" class="btn btn-secondary m-auto">
            <i class="ph-duotone ph-upload m-r-5"></i> Subir Foto
          </button>
        </div>
      </div>
      <div class="card-body py-2 px-1">
        <!-- Puedes mostrar instrucciones aquí si lo deseas -->
      </div>
      <div class="card-footer px-2 py-0">
        <div id="loadingfile_fotonegocio" style="position: relative; height: 4px;"></div>
      </div>
    </div>
  </div>
  <div class="col-md-8">
    <div class="row">
      <!-- alerta de vacios -->
      <div v-if="ListaFotos.length==0" class="alert alert-secondary d-flex align-items-center" role="alert">
        <i class="ph-duotone ph-warning f-24 p-r-10"></i> No se han agregado fotografías (Tamaño rectangular)
      </div>
      <div v-for="(FotoActual, index) in ListaFotos" :key="FotoActual.id" class="col-md-4">
        <div class="card product-card">
          <div class="card-body m-0 p-1">
            <div class="card-img-top p-0">
              <div class="rounded-2 overflow-hidden m-auto align-items-center align-middle">
                <img class="align-top img-fluid" alt="User image" @click.prevent="showImage(FotoActual.url)"
                  :src="FotoActual.url ? FotoActual.url : '/src/assets/images/avatar.png'">
              </div>
            </div>
            <div class="d-flex align-content-end justify-content-center">
              <div class="flex-shrink-1 ms-2">
                <div class="d-grid">
                  <button @click="delete_Foto(FotoActual.id)" type="button"
                    class="avtar avtar-s btn-link-danger btn-prod-card btn-light-danger"><i class="feather icon-trash-2"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal para ver foto -->
<div class="modal fade modal-lightbox post-modal-lightbox" id="lightboxModal_foto" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered rounded-2">
    <div class="modal-content rounded-3">
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <div class="modal-body">
        <img :src="currentImage" alt="images" class="modal-image rounded-3 w-100 img-fluid">
      </div>
    </div>
  </div>
</div>

<!-- Modal para subir foto -->
<div class="modal fade" id="modal_subir_foto_negocio" tabindex="-1" aria-labelledby="modal_subir_foto_negocioLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header modal_head_bg">
        <h5 class="modal-title py-0" id="modal_subir_foto_negocioLabel">
          <i class="fa fa-plus p-r-15"></i>Subir Fotografía de Negocio
        </h5>
        <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isUploading"></button>
      </div>
      <div class="modal-body py-1">
        <FileUploader
          titulo="Fotografía de Negocio"
          elementoLoader="loadingfile_fotonegocio"
          tipoArchivo="fotografia"
          :archivoTemporal="archivoTemporalFoto"
          :resetTrigger="resetTriggerFoto"
          @archivoSubido="onFotoSubida"
          @uploadingStatus="isUploading = $event"
        />
      </div>
      <div class="modal-footer py-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isUploading">Cancelar</button>
        <button type="submit" class="btn btn-primary" @click="guardarFotoNegocio" :disabled="isUploading">
          <span v-if="isUploading">Subiendo...</span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </div>
  </div>
</div>
</template>
  <script lang="ts">
  import { defineComponent, ref, computed, watch, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  import NProgress from 'nprogress';
  import Alerta from '../utils/alertas';
  import Notif from '../utils/notificaciones';
  // import { DOC_URL } from '../config';
  import { Foto, Adjunto } from '../interfaces/_interface';
  import { useSubirArchivo } from '../composables/useSubirArchivo';
  import { useFotos } from '../composables/useFotos';
  import FileUploader from './FileUploader.vue';

    export default defineComponent({
      emits: ['updateFotos'],
    name: 'FormRegistrarFotos',
    props: {
      negocioId: {
        type: Number,
        required: true,
      },
    },
    components: {
      FileUploader
    },
    setup(props) {
      // Computed properties
      const idnegocio = computed(() => props.negocioId);
      // Reactive state
      const currentImage = ref('');
      const ListaFotos = ref<Foto[]>([]);
      const FotoActual = ref<Foto>({ id: 0, url: '' });
      const isUploading = ref(false);
      // FileUploader modal state
      const resetTriggerFoto = ref(0);
      // useSubirArchivo instance for modal
      const {
        ArchivoTemporal: archivoTemporalFoto,
        isUploading: isUploadingFoto,
        reset_formUpload,
      } = useSubirArchivo('loadingfile_fotonegocio', 'fotografia');
      const { cargarFotosNegocio, fotos, eliminarFoto, registrarFotoNegocio } = useFotos();

      // Listar fotos del negocio
      const Listar_Fotos = async () => {
        try {
          ListaFotos.value = [];
          if (!idnegocio.value || idnegocio.value <= 0) {
            console.warn('ID de negocio inválido para cargar fotos');
            return;
          }
          NProgress.start();
          await cargarFotosNegocio(idnegocio.value);
          ListaFotos.value = fotos.value || [];
        } catch (error) {
          ListaFotos.value = [];
        } finally {
          NProgress.done();
        }
      };

      watch(
        () => props.negocioId,
        async (newId, oldId) => {
          if (newId && newId !== oldId && newId > 0) {
            await Listar_Fotos();
          }
        },
        { immediate: true }
      );

      onMounted(async () => {
        try {
          if (props.negocioId && props.negocioId > 0) {
            await Listar_Fotos();
          }
        } catch (error) {
          console.error('Error en mounted hook:', error);
        }
      });

      // Abrir modal para subir foto
      const openModalFoto = () => {
        resetTriggerFoto.value++;
        reset_formUpload();
        const modalElement = document.getElementById('modal_subir_foto_negocio');
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        }
      };

      // Cuando se sube la foto con FileUploader
      const onFotoSubida = (archivo: Adjunto) => {
        archivoTemporalFoto.value = archivo;
      };

      // Guardar foto en el negocio
      const guardarFotoNegocio = async () => {
        if (!archivoTemporalFoto.value.url) {
          Notif.Error('Debe subir una fotografía');
          return;
        }
        if (!idnegocio.value || idnegocio.value <= 0) {
          Notif.Error('ID de negocio inválido');
          return;
        }
        isUploading.value = true;
        try {
          const resultado = await registrarFotoNegocio(archivoTemporalFoto.value.url, idnegocio.value);
          if (resultado) {
            await Listar_Fotos();
            Notif.Success('Foto registrada con éxito');
            // Cerrar modal
            const modalElement = document.getElementById('modal_subir_foto_negocio');
            if (modalElement) {
              const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
              if (modal) modal.hide();
            }
          } else {
            Notif.Error('Error al registrar la foto');
          }
        } catch (error) {
          Notif.Error('Error al agregar la foto al negocio');
        } finally {
          isUploading.value = false;
        }
      };

      // Ver imagen en modal
      const showImage = (imageUrl: string) => {
        currentImage.value = imageUrl;
        const modalElement = document.getElementById('lightboxModal_foto');
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        }
      };

      // Eliminar foto
      const delete_Foto = async (id: number) => {
        try {
          if (!id || id <= 0) {
            Notif.Error('ID de foto inválido');
            return;
          }
          const isConfirmado = await Alerta.Confirmacion(
            '¿Desea eliminar este Item?',
            'Esta acción no se puede deshacer.'
          );
          if (isConfirmado) {
            const resultado = await eliminarFoto(id);
            if (resultado) {
              await Listar_Fotos();
              Notif.Success('Foto eliminada con éxito');
            } else {
              Notif.Error('Error al eliminar la foto');
            }
          }
        } catch (error) {
          Notif.Error('Error al eliminar la foto');
        }
      };

      return {
        // DOC_URL,
        currentImage,
        ListaFotos,
        FotoActual,
        idnegocio,
        isUploading,
        archivoTemporalFoto,
        resetTriggerFoto,
        openModalFoto,
        onFotoSubida,
        guardarFotoNegocio,
        showImage,
        delete_Foto,
        Listar_Fotos
      };
    },
  });
  </script>
  
  <style scoped>
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  

  
  .register-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .register-button:hover {
    background-color: #0056b3;
  }
  
  .uploaded-files {
    margin-top: 20px;
  }
  
  .uploaded-files h3 {
    margin-bottom: 10px;
  }
  
  .uploaded-files ul {
    list-style-type: none;
    padding: 0;
  }
  
  .uploaded-files li {
    margin-bottom: 5px;
  }
  </style>
