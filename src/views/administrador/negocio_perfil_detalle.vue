<template>
  <form id="jobForm" method="post" action="#" onsubmit="return false;">
    <div class="row">
      <!-- [ registrar_inmueble ] start -->
      <div class="col-md-2">
        <div class="sticky-top mt-0 pt-0 " style="top:74px">
          <Breadcrumb :links="breadcrumbRoutes" />
          <div  class="image-container card p-2 text-center " >            
            <img v-if="negocio.logoUrl!==''" :src="negocio.logoUrl" class="card-img w-100">
            <img v-else src="../../assets/images/logo_default.png" class="w-100">
          </div>
<!-- 
          <div @click="Openmodal_add_portada_negocio" class="image-container card p-2 text-center " >
            <img v-if="negocio.imgPrincipalUrl!==''" :src="negocio.imgPrincipalUrl" class="card-img">
            <img v-else src="../../assets/images/empresa_default.png" class="w-100">
          </div> -->
        </div>
      </div>
      <!-- --------------------------- -->
      <div class="col-md-10">
        <div class="d-flex mt-3">
          <div class="p-2 flex-shrink-1">
            
          </div>
        </div>
            <div class="d-flex align-items-center  pb-1">
              <div class="flex-grow-1 w-25 mx-3">
                  <div class="d-flex">
                    <h4 class="flex-grow-1">{{ negocio.razonSocial }}</h4> 
                    <div v-if="negocio.estado==='Inactivo'" class="flex-grow-2 mb-0 py-1 m-r-10 alert alert-danger">
                      <i  class="fa fa-circle text-danger p-r-5 "></i>Inactivo</div>
                    <div v-if="negocio.estado==='Activo'" class="flex-grow-2 mb-0 py-1 m-r-10 alert alert-success">
                      <i  class="fa fa-circle text-success p-r-5 "></i>Activo</div>
                    <button @click="editNegocio" class="btn btn-secondary btn-xs">
                      <i class="ph-duotone ph-pencil-line"></i> Editar
                    </button>
                  </div>
                  
                  <p class="pt-2">{{ negocio.descripcion }}</p>
                  <!-- ----------- -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> RUC:</label>
                        <input disabled type="text" class="form-control" v-model="negocio.ruc"/>
                      </div>   
                    </div>
                    <div class="col-md-8">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Razón Social:</label>
                        <input disabled type="text" class="form-control"  v-model="negocio.razonSocial"/>
                      </div>   
                    </div>
                  </div>
                   
                  <!-- ----------- -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> DNI Representante:</label>
                        <input disabled type="text" class="form-control" v-model="negocio.dniRepresentante"/>
                      </div>   
                    </div>
                    <div class="col-md-8">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Representante:</label>
                        <input disabled type="text" class="form-control"  v-model="negocio.nombreRep"/>
                      </div>   
                    </div>
                  </div>
                  <!-- ----------- -->
                   <!-- ----------- -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Categoria:</label>
                        <input disabled type="text" class="form-control" v-model="negocio.categoriaNombre"/>
                      </div>   
                    </div>
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Celular:</label>
                        <input disabled type="text" class="form-control" v-model="negocio.celular"/>
                      </div>   
                    </div>
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Correo:</label>
                        <input disabled type="text" class="form-control"  v-model="negocio.correo"/>
                      </div>   
                    </div>
                  </div>
                  <!-- ----------- -->
                   <!-- ----------- -->
                  <div class="row">
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Web:</label>
                        <input disabled type="text" class="form-control" v-model="negocio.sitioWeb"/>
                      </div>   
                    </div>
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Facebook:</label>
                        <input disabled type="text" class="form-control"  v-model="negocio.facebook"/>
                      </div>   
                    </div>
                    <div class="col-md-4">
                      <div class="pb-1">
                        <label class="form-label mb-0"> Instagram:</label>
                        <input disabled type="text" class="form-control"  v-model="negocio.instagram"/>
                      </div>   
                    </div>
                  </div>
                  <!-- ----------- -->
                </div>
              </div>

              <div class="d-flex gap-2 mt-1" style="margin-left: 10px;">
                <span class="f-14 f-w-500 mt-3 px-3 text-white bg-secondary py-2 rounded-2">
                  <i class="ti ti-camera p-r-5"></i>Fotografías</span>
              </div>
              <div class="card mt-2">
                <div class="card-body">
                  <div class="row">
                    <div v-for="foto in fotos" :key="foto.id" class="col-md-4 mb-3">
                      <img :src="foto.url" class="img-fluid rounded-4" alt="Fotografía" />
                    </div>
                  </div>
                  <FormFotos :negocioId="negocio.id" @update-fotos="updateFotos" />
                </div>
              </div>
              <ModalEditNegocio :negocio="negocio" @updated="cargarDatosNegocio" />
      </div>   
      <!-- Fin row-------------------------------------- -->   
    </div>
  </form>



  <!-- MODAL -------------------------------------------------------- -->
   
  <!-- Modal para agregar Oficina -->
  <div class="modal fade" id="modal_add_logo_negocio" tabindex="-1" aria-labelledby="modal_add_logo_negocioLabel"
       aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title py-0" id="modal_add_logo_negocioLabel">
            <i class="fa fa-plus p-r-15"></i>Agregar Fotografía de Logotipo
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-1">
          <div class="mb-3">
            <FileUploader 
                titulo="Logo de la Empresa"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoFotografia.ArchivoTemporal.value"
                @archivoSubido="(archivo: Adjunto) => foto_logo = archivo.url"
                :resetTrigger="resetTrigger"
                @uploadingStatus="isUploading = $event"
              />
          </div>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="Registrar_logo">Guardar</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  
  <!-- MODAL -------------------------------------------------------- -->
   
  <!-- Modal para agregar Oficina -->
  <div class="modal fade" id="modal_add_portada_negocio" tabindex="-1" aria-labelledby="modal_add_portada_negocioLabel"
       aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title py-0" id="modal_add_portada_negocioLabel">
            <i class="fa fa-plus p-r-15"></i>Subir Imágen de Portada
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-1">
          <div class="mb-3">

            <FileUploader 
                titulo="Imágen de Portada"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoFotografia.ArchivoTemporal.value"
                @archivoSubido="(archivo: Adjunto) => foto_imgprincipal = archivo.url"
                :resetTrigger="resetTrigger"
                @uploadingStatus="isUploading = $event"
              />
          </div>
        </div>
        <div class="modal-footer py-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary" @click="Registrar_Imagen_portada">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'bootstrap'; // Importa Modal de Bootstrap
import { GoogleMap, Marker } from 'vue3-google-map';
import NProgress from 'nprogress'; // Importa nprogress
import 'nprogress/nprogress.css'; // Importa el estilo de nprogress
import { Breadcrumb, CardOferta, ErrorMessage, FormFotos, ListOferta, ListConvenios, FileUploader } from '../../components/_components';
import { useSubirArchivo, useNegocios } from '../../composables/_composables';
import { Notif, NumberFormat } from '../../utils/_utils';
import { Negocio } from '../../interfaces/negocio.interface';
import { Adjunto } from '../../interfaces/archivo.interface';
import { useAuthStore } from '../../stores/authStore';
import ModalEditNegocio from '../../views/Modals/modal_editar_negocio.vue';

interface Link {
  path: string;
  name: string;
}


export default defineComponent({  components: {
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
    const route = useRoute();
    const router = useRouter();

    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const idnegocio = Usuario.value!.id;
    const { negocio, Obtener_Negocio, Actualizar_Negocio, imagenes } = useNegocios();

    const fotos = ref<{ id: number, url: string }[]>([]);
    const isUploading = ref(false);
    
    const archivoFotografia = useSubirArchivo("loading_logo", "fotografia");    const foto_logo = ref("");
    const foto_imgprincipal = ref("");
    const resetTrigger = ref(0);
    
    const cargarDatosNegocio = async () => {
      try {
        if (!idnegocio || isNaN(Number(idnegocio)) || idnegocio===0) {
          console.error('ID del negocio no es válido:', idnegocio);
          throw new Error('ID del negocio no válido.');
        }
        await Obtener_Negocio(idnegocio);
        // if (negocio.value && Array.isArray(negocio.value.fotos)) {
        //   fotos.value = negocio.value.fotos;
        // } else {
        //   fotos.value = [];
        // }
        // console.log(negocio.value);
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
    };

    const updateFotos = (newFotos: { id: number, url: string }[]) => {
      fotos.value = newFotos;
    };
    const subirCambios = async () => {
      try {
        const response = await Actualizar_Negocio(negocio.value.id, negocio.value);
        if (response) {
          Notif.Success('Cambios subidos exitosamente.');
          cargarDatosNegocio();
        } else {
          Notif.Error('Error al subir los cambios.');
        }
      } catch (error) {
        console.error('Error al subir los cambios:', error);
        Notif.Error('No se pudo subir los cambios.');
      }
    };

    // Función para registrar logo
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

    // Función para registrar imagen de portada
    const Registrar_Imagen_portada = async () => {
      if (!foto_imgprincipal.value) {
        Notif.Advertencia('Debe seleccionar una imagen primero');
        return;
      }
      
      try {
        const resultado = await imagenes.actualizarPortada(negocio.value.id, foto_imgprincipal.value);
        if (resultado) {
          Notif.Success('Imagen de portada actualizada correctamente');
          await cargarDatosNegocio();
          resetTrigger.value++;
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
      resetTrigger,
      isUploading,
      closeModal_logo,
      closeModal_portada
    };
  },
});
</script>

<style lang="scss" scoped>

</style>