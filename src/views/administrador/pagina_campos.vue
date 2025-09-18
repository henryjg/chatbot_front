<template>
  <div class="row pt-1">
    <div class="col-md-12">
      <!-- Tabs horizontales unificados -->
      <div class="card-body py-0 px-2">
        <ul class="nav nav-tabs profile-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'politicas' }" id="tab-politicas" href="#" role="tab" :aria-selected="activeTab === 'politicas'" @click.prevent="activeTab = 'politicas'">
              <i class="ti ti-user me-2"></i>Políticas
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'terminos' }" id="tab-terminos" href="#" role="tab" :aria-selected="activeTab === 'terminos'" @click.prevent="activeTab = 'terminos'">
              <i class="ti ti-file-text me-2"></i>Términos
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'redessociales' }" id="tab-redes" href="#" role="tab" :aria-selected="activeTab === 'redessociales'" @click.prevent="activeTab = 'redessociales'">
              <i class="ti ti-id me-2"></i>Redes Sociales
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'sliders' }" id="tab-sliders" href="#" role="tab" :aria-selected="activeTab === 'sliders'" @click.prevent="activeTab = 'sliders'">
              <i class="fas fa-image me-2"></i>Sliders
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'categorias' }" id="tab-categorias" href="#" role="tab" :aria-selected="activeTab === 'categorias'" @click.prevent="activeTab = 'categorias'">
              <i class="ti ti-list me-2"></i>Categorías
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'publicidad' }" id="tab-publicidad" href="#" role="tab" :aria-selected="activeTab === 'publicidad'" @click.prevent="activeTab = 'publicidad'">
              <i class="fas fa-home me-2"></i>Imagenes
            </a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'preguntas' }" id="tab-preguntas" href="#" role="tab" :aria-selected="activeTab === 'preguntas'" @click.prevent="activeTab = 'preguntas'">
              <i class="fas fa-question me-2"></i>Preguntas Frecuentes
            </a>
          </li> -->
        </ul>
      </div>
      <!-- Contenido de cada tab -->
      <div class="tab-content card" id="myTabContent">
        <div v-if="activeTab === 'politicas'" class="tab-pane fade show active pt-4 ps-4" id="politicas" role="tabpanel">
          <p class="px-2 f-16 f-w-500 text-info mb-3">Editar contenido.</p>
          <hr class="b-gray my-2"> 
          <div class="mb-2">
            <div class="row p-4">
              <div class="col-md-11">
                <div class="d-flex">
                  <div v-html="EstaEmpresa.politicasprivacidad" class="alert alert-secondary text-justify b-gray w-100 mb-0"></div>
                  <button class="btn btn-sm btn-secondary hei-35 mx-1" type="button" 
                          data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                          @click="load_htmlcontent('politicasprivacidad', EstaEmpresa.politicasprivacidad)">
                    <i class="ph-duotone ph-pencil-simple-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'terminos'" class="tab-pane fade show active pt-4 ps-4" id="terminos" role="tabpanel">
          <div class="mb-2">
            <p class="px-2 f-16 f-w-500 text-info mb-3">Editar contenido.</p>
            <hr class="b-gray my-2"> 
            <div class="row p-4">                    
              <div class="col-md-11">
                <div class="d-flex ">
                  <div v-html="EstaEmpresa.terminosycondiciones" class="alert alert-secondary text-justify b-gray w-100 mb-0"></div>
                  <button class="btn btn-sm btn-secondary hei-35 mx-1" type="button" 
                          data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                          @click="load_htmlcontent('terminosycondiciones', EstaEmpresa.terminosycondiciones)">
                    <i class="ph-duotone ph-pencil-simple-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'redessociales'" class="tab-pane fade show active pt-4 ps-4" id="redessociales" role="tabpanel">
          <!-- Facebook -->
          <div class="mb-3">
            <div class="row align-items-center mb-3">
              <label class="col-md-3 align-content-top pt-2">Facebook</label>
              <div class="col-md-9">
                <div class="input-group">
                  <input type="text" v-model="EstaEmpresa.linkfacebook" class="form-control" />
                  <button class="btn btn-light b-gray" @click="upd_facebook(EstaEmpresa.id, EstaEmpresa.linkfacebook)">
                    <i class="fa fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Instagram -->
            <div class="row align-items-center mb-3">
              <label class="col-md-3 align-content-top pt-2">Instagram</label>
              <div class="col-md-9">
                <div class="input-group">
                  <input type="text" v-model="EstaEmpresa.linkinstagram" class="form-control" />
                  <button class="btn btn-light b-gray" @click="upd_instagram(EstaEmpresa.id, EstaEmpresa.linkinstagram)">
                    <i class="fa fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Teléfono de Contacto -->
            <div class="row align-items-center mb-3">
              <label class="col-md-3 align-content-top pt-2">Teléfono de Contacto</label>
              <div class="col-md-9">
                <div class="input-group">
                  <input type="text" v-model="EstaEmpresa.telefonocontacto" class="form-control" />
                  <button class="btn btn-light b-gray" @click="upd_telefono(EstaEmpresa.id, EstaEmpresa.telefonocontacto)">
                    <i class="fa fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Celular de Contacto -->
            <div class="row align-items-center">
              <label class="col-md-3 align-content-top pt-2">Celular de Contacto</label>
              <div class="col-md-9">
                <div class="input-group">
                  <input type="text" v-model="EstaEmpresa.celularcontacto" class="form-control" />
                  <button class="btn btn-light b-gray" @click="upd_celular(EstaEmpresa.id, EstaEmpresa.celularcontacto)">
                    <i class="fa fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'sliders'" class="tab-pane fade show active" id="sliders" role="tabpanel">
          <slider_lista />
        </div>
        <div v-if="activeTab === 'categorias'" class="tab-pane fade show active" id="categorias" role="tabpanel">
          <categoria_lista />
        </div>
        <div v-if="activeTab === 'publicidad'" class="tab-pane fade show active" id="publicidad" role="tabpanel">
          <publicidad_lista />
        </div>
        <!-- <div v-if="activeTab === 'preguntas'" class="tab-pane fade show active" id="preguntas" role="tabpanel">
          <preguntas_lista />
        </div> -->
      </div>
    </div>
  </div>

  <!-- Right Offcanvas start -->
  <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header pb-0 ">
      <div class="container d-flex">
        <h5 id="offcanvasRightLabel">Editar Registro</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
    </div>
    <div class="offcanvas-body ">
      <div class="container ">
        <div>
          <QuillEditor content-type="html" v-model:content="editorContent" :modules="modules" toolbar="minimal" theme="snow" />
        </div>
      </div>
      <div class="text-end mt-2">
        <div class="container">
          <button class="btn btn-success mx-1" @click="guardarEditorContent()" data-bs-dismiss="offcanvas"> Guardar </button>
          <button class="btn btn-danger  mx-1" data-bs-dismiss="offcanvas"> Cancelar </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Right Offcanvas end -->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import slider_lista from './slider_lista.vue';
// import categoria_lista from './categoria_lista.vue';
// import preguntas_lista from './preguntas_lista.vue';
import publicidad_lista from './publiLink_List.vue';;
import { Modal } from 'bootstrap';
import NProgress from 'nprogress';
import { QuillEditor, Delta } from '@vueup/vue-quill'
import { ErrorMessage } from '../../components/_components';
import { usePagina } from '../../composables/_composables';
import { Notif } from '../../utils/_utils';
import { Pagina } from '../../interfaces/_interface';
import BlotFormatter from 'quill-blot-formatter'

export default defineComponent({
  components: {
    slider_lista,
    // categoria_lista,
    // preguntas_lista,
    ErrorMessage,
    QuillEditor,
    publicidad_lista
  },
  setup() {
    const activeTab = ref('politicas');
    const isUploading = ref(false);
    const editorContent = ref('');
    const campoedit = ref('');
    const { Listar_Pagina, Obtener_Pagina, Crear_Pagina, Actualizar_Pagina, Eliminar_Pagina, EstaEmpresa, errors, 
            actualizarPoliticas, actualizarTerminos, actualizarFacebook, actualizarInstagram, actualizarTelefono, actualizarCelular } = usePagina();
    const load_htmlcontent = (campo: string, valor: string) => {
      editorContent.value = valor;
      campoedit.value = campo;
    };
    const modules = {
      name: 'blotFormatter',
      module: BlotFormatter,
      options: {}
    };    const guardarEditorContent = async () => {
      try {
        switch (campoedit.value) {
          case 'politicasprivacidad':
            await actualizarPoliticas(EstaEmpresa.value.id, editorContent.value);
            break;
          case 'terminosycondiciones':
            await actualizarTerminos(EstaEmpresa.value.id, editorContent.value);
            break;
        }
      } catch (error) {
        console.error('Error al guardar contenido:', error);
      }
    };    const upd_facebook = async (id: number, facebook: string) => {
      try {
        await actualizarFacebook(id, facebook);
      } catch (error) {
        console.error('Error al actualizar Facebook:', error);
      }
    };    const upd_instagram = async (id: number, instagram: string) => {
      try {
        await actualizarInstagram(id, instagram);
      } catch (error) {
        console.error('Error al actualizar Instagram:', error);
      }
    };    const upd_telefono = async (id: number, telefono: string) => {
      try {
        await actualizarTelefono(id, telefono);
      } catch (error) {
        console.error('Error al actualizar teléfono:', error);
      }
    };    const upd_celular = async (id: number, celular: string) => {
      try {
        await actualizarCelular(id, celular);
      } catch (error) {
        console.error('Error al actualizar celular:', error);
      }
    };
    onMounted(async () => {
      await Listar_Pagina();
    });
    return {
      activeTab,
      isUploading,
      editorContent,
      campoedit,
      EstaEmpresa,
      load_htmlcontent,
      guardarEditorContent,
      upd_facebook,
      upd_instagram,
      upd_telefono,
      upd_celular,
      modules
    };
  }
});
</script>

<style scoped>
.image-container {
  width: 100%;
  height: auto;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.image-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.input-group button {
  visibility: hidden;
}

.input-group input:focus + button, textarea:focus + button{
  visibility: visible;
}

.input-group button:hover {
  visibility: visible;
}

.input-group button:active {
  visibility: visible;
}

.image-container{
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* This maintains the 4:3 aspect ratio */
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.image-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover; /* This ensures the image covers the container */
  transform: translate(-50%, -50%);
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.custom-file-label {
  display: inline-block;
  width: 100%;
  padding: 10px 15px;
  background-color: #d7edf7;
  color: #353535;
  border: 2px;
  border-radius: 4px;
  border-style:dashed;
  border-color: #aed0e0;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-label:hover {
  background-color: #0056b3;
}


</style>
