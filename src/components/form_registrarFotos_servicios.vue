<template>
  <div class="row g-3">
    <div class="col-md-3">
      <div class="card shadow-sm">
        <div class="card-body py-2 px-1">
          <div class="mx-1 p-4 upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <img v-if="imageUrl" :src="imageUrl" alt="Image Preview" class="img-fluid border-2 rounded-2 p-1" />
            <div v-else class="upload-placeholder">
              <i class="ti ti-camera f-40"></i>
              <p>Arrastra aquí la  <span class="browse-link">imágen a subir</span></p>
            </div>
            <input type="file" @change="onFileChange" ref="fileInput" class="file-input" />
          </div>
        </div>
        <div class="card-footer px-2 py-0">
          <div v-if="file" class="uploaded-files">
            <p>{{ file.name }}</p>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" @click="registrarFoto" class="btn btn-secondary d-inline-flex">
            <i class="ph-duotone ph-upload m-r-10"></i> Subir</button>
        </div>
      </div>
    </div>
    <div class="col-md-9">
      <div class="row g-1">
        <!-- alerta de vacios -->
        <div v-if="ListaFotosServicio.length==0" class="alert alert-warning d-flex align-items-center" role="alert">
          <i class="ph-duotone ph-warning f-24 p-r-10"></i> No se han agregado fotografías (Tamaño rectangular)</div>

          <div v-for="(FotoServicio, index) in ListaFotosServicio" :key="FotoServicio.id"  class="col-md-3">
          <div class="card product-card shadow-sm mb-0 ">
            <div class="card-img-top p-1 position-relative"> 
              <button @click="delete_Foto(FotoServicio.id)"  type="button" 
                  class="btn btn-danger btn-sm bg-gray-800 border-0 px-1 py-0 bg-red-400  position-absolute" 
                  style="top: 10px; right: 10px; z-index: 10;">
                <i class=" feather icon-x"></i>
              </button>
              <div class="rounded-2 overflow-hidden align-items-center align-middle" style="height: 100px; cursor: pointer;">
                <img class="align-top img-fluid "  alt="User image" @click.prevent="showImage(HOST_URL + FotoServicio.url)"
                  :src="FotoServicio.url ? HOST_URL+FotoServicio.url : '/src/assets/images/avatar.png'">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    

    <!-- Modal -->
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
        
</template>
  
  <script lang="ts">

  import { ref, onMounted, PropType, watch } from 'vue';
  import Alerta from '../utils/alertas';
  import NProgress from 'nprogress'; // Importa nprogress  
  import { HOST_URL } from '../config';
  import { ServiciosService } from '../services/_services';
  import Notif from '../utils/notificaciones';
  import { Modal } from 'bootstrap';
  import { Servicios, Foto } from '../interfaces/_interface';


  export default {
  name: 'FotosServicio',
  props: {
    servicio: { 
      type: Object as PropType<Servicios>,
      required: true,
    },
  },
    setup(props) {
        const file = ref<File | null>(null);
        const imageUrl = ref<string | null>(null);
        const fileInput = ref<HTMLInputElement | null>(null);
        
        const currentImage = ref('');
        // -----------------

        const ListaFotosServicio = ref<Foto[]>([]);
        const FotoServicio = ref<Foto>({
              id: 0,
              url: '',
              servicioId: 0,
        });

        onMounted(async () => {
          Lista_Fotos_Servicio(props.servicio.id);
        });

        // ----------------------------------------------------------------------
        const Lista_Fotos_Servicio = async (id:Number) => {
        try {
          ListaFotosServicio.value = [];
          NProgress.start();  
          //-------------------------------------------------------        
          const RespuestaJSON = await ServiciosService.obtener_foto(Number(id));
          if(RespuestaJSON.success){
            ListaFotosServicio.value = RespuestaJSON.data;
          }else{
             ListaFotosServicio.value = [];
          }
        } catch (error) {
          Notif.Error('No se cargaron los datos');
        }finally {
          NProgress.done();
        }
        }
        watch(() => props.servicio.fotos, () => {
          Lista_Fotos_Servicio(props.servicio.id);
        }, { deep: true });


        // ----------------------------------------------------------------------
        const delete_Foto = async (id: number) => {
          const isConfirmado = await Alerta.Confirmacion(
            '¿Desea eliminar este Item?',
            'Esta acción no se puede deshacer.'
          );
          if (isConfirmado) {
              const RespuestaJSON = await ServiciosService.eliminar_foto(id);
              if(RespuestaJSON.success){
                // Eliminamos foto
                ListaFotosServicio.value = ListaFotosServicio.value.filter(item => item.id !== id);
                props.servicio.fotos=ListaFotosServicio.value;
                Notif.Success(RespuestaJSON.message);
              }else{
                Notif.Error(RespuestaJSON.message);
              }
          }
        };
        
        // -----------------------------------------------------------------------
        const triggerFileInput = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

        const onFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const fileType = target.files[0].type;
                const allowedTypes = ['image/jpeg','image/jpg', 'image/png', 'image/bmp', 'image/avif'];
                
                if (!allowedTypes.includes(fileType)) {
                    Notif.Error('Formato de archivo no permitido.\n Formatos permitidos:\n *.jpg - *.jpeg - *.png - *.bmp - *.avif.');
                    return;
                }

                file.value = target.files[0];
                imageUrl.value = URL.createObjectURL(file.value);
            }
        };

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer && event.dataTransfer.files.length > 0) {
                file.value = event.dataTransfer.files[0];
                imageUrl.value = URL.createObjectURL(file.value);
            }
        };

        const resetFileInput = () => {
            file.value = null;
            imageUrl.value = null;
            if (fileInput.value) {
                fileInput.value.value = '';
            }
        };
    
        const registrarFoto = async () => {
              if (!file.value) {
                   Notif.Error('Debe cargar una fotografía');
                  return;
              }
              const formData = new FormData();
              formData.append('file', file.value);
              formData.append('idservicio', props.servicio.id.toString()); // Reemplaza con el ID de servicio

              try {
                NProgress.start();
                //--------
                const RespuestaJSON = await ServiciosService.crear_foto(formData);
                if(RespuestaJSON.success){
                  Lista_Fotos_Servicio(props.servicio.id);
                  props.servicio.fotos=ListaFotosServicio.value;
                  Notif.Success(RespuestaJSON.message);
                  resetFileInput();

                }else{
                  Notif.Error(RespuestaJSON.message);
                }
              } catch (error) {
                console.error('Error uploading file:', error);
              }finally {
                  NProgress.done(); // Detiene la barra de progreso
              }
        };
        // ------------------------------------------------------------
        const showImage = (imageUrl: string) => {
          currentImage.value = imageUrl;
          const modalElement = document.getElementById('lightboxModal_foto');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        };
    
        return {
          HOST_URL,
          file,
          imageUrl,
          fileInput,
          onFileChange,
          registrarFoto,
          triggerFileInput,
          handleDrop,
          ListaFotosServicio,
          FotoServicio,
          delete_Foto,
          currentImage,
          showImage
         };
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .upload-area {
    border: 2px dashed #ddd;
    cursor: pointer;
  }
  
  .upload-area img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .upload-placeholder {
    text-align: center;
    color: #aaa;
  }
  
  .browse-link {
    color: #007bff;
    cursor: pointer;
  }
  
  .file-input {
    display: none;
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
  