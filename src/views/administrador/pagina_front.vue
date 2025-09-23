
<template>
  <div class="d-flex flex-row align-items-start w-100 pt-2">
    <div class="card px-2" style="width: 48vw; min-width: 350px; max-width: 700px;">
      <div class="card-header py-1 mt-1 ">
        <h4 class="text-primary"><i class="fa fa-medkit"></i> {{ isEditing ? 'Editar Entrada' : 'Crear Entrada' }}</h4>
      </div>
      <form @submit.prevent="guardar">
        <div class="mb-2 d-flex align-items-center">
          <label for="categoria_id" class="form-label me-2">Categoría</label>
          <select v-model="nuevoServicio.categoria_id" id="categoria_id" class="form-select form-select-sm" style="width: 140px;">
            <option :value="0" disabled>Selecciona una categoría</option>
            <option v-for="cat in listaCategoriaNoti" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
          <button type="button" class="btn btn-outline-primary btn-sm ms-2" @click="abrirModalCategoria">
            + Añadir
          </button>
        </div>
    <!-- Modal para añadir categoría -->
    <div class="modal fade" id="modalCategoria" tabindex="-1" aria-labelledby="modalCategoriaLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCategoriaLabel">Añadir Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="nombreCategoria" class="form-label">Nombre</label>
              <input v-model="nombreCategoria" id="nombreCategoria" type="text" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="agregarCategoria">Agregar</button>
          </div>
        </div>
      </div>
    </div>
        <div class="mb-2">
          <label for="nombre" class="form-label">Nombre</label>
          <input v-model="nuevoServicio.nombre" id="nombre" type="text" class="form-control form-control-sm" />
        </div>
        <div class="mb-2">
          <label for="descripcion" class="form-label">Descripción</label>
          <QuillEditor
            content-type="html"
            v-model:content="nuevoServicio.descripcion"
            :modules="modules"
            toolbar="minimal"
            style="height:150px;"
          />
        </div>
        <div class="mb-2">
          <label for="beneficios" class="form-label">Beneficios</label>
             <QuillEditor
            content-type="html"
            v-model:content="nuevoServicio.beneficios"
            :modules="modules"
            toolbar="minimal"
            style="height:150px;"
          /> </div>
        <div class="mb-2">
          <label for="precio" class="form-label">Precio</label>
          <input v-model="nuevoServicio.precio" id="precio" type="text" class="form-control form-control-sm" />
        </div>
        <div class="mb-2">
          <label for="facilidades" class="form-label">Facilidades</label>
             <QuillEditor
            content-type="html"
            v-model:content="nuevoServicio.facilidades"
            :modules="modules"
            toolbar="minimal"
            style="height:150px;"
          />
         </div>
        <div class="mb-2">
          <label for="video1" class="form-label">Video 1</label>
          <input v-model="nuevoServicio.video1" id="video1" type="text" class="form-control form-control-sm" />
        </div>
        <div class="mb-2">
          <label for="video2" class="form-label">Video 2</label>
          <input v-model="nuevoServicio.video2" id="video2" type="text" class="form-control form-control-sm" />
        </div>
        <div class="mb-2">
          <label for="info_adicional" class="form-label">Info Adicional</label>
          <QuillEditor
            content-type="html"
            v-model:content="nuevoServicio.info_adicional"
            :modules="modules"
            toolbar="minimal"
            style="height:150px;"
          />
        </div>
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
      </form>
    </div>
    <div v-if="isEditing && nuevoServicio.id" class="ms-4 flex-grow-1" style="max-width: 52vw;">
      <form_registrarFotos_servicios :servicio="nuevoServicio" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useNoticias } from '../../composables/useNoticias';
import { useCategoriaNoticia } from '../../composables/useCategoria_noticia';
import { Modal } from 'bootstrap';
import Alerta from '../../utils/alertas';
import { QuillEditor } from '@vueup/vue-quill';
import BlotFormatter from 'quill-blot-formatter';

import form_registrarFotos_servicios from '../../components/form_registrarFotos_servicios.vue';

export default defineComponent({
  components: {
    QuillEditor,
    form_registrarFotos_servicios,
  },
  setup() {
  // Composables
  const route = useRoute();
  const router = useRouter();
    const { nuevoServicio, guardarServicio, servicio, cargarDatosServicio, actualizarServicio } = useNoticias();
    const {
      listaCategoriaNoti,
      Listar_CategoriasNoticias,
      Crear_CategoriasNoticias,
      categoriaNoti,
      resetFormulario: resetCategoriaFormulario
    } = useCategoriaNoticia();
    // Estado para el nombre de la nueva categoría
    const nombreCategoria = ref('');
    let modalCategoriaInstance: Modal | null = null;

    // Abrir modal
    const abrirModalCategoria = () => {
      nombreCategoria.value = '';
      resetCategoriaFormulario();
      if (!modalCategoriaInstance) {
        const modalEl = document.getElementById('modalCategoria');
        if (modalEl) {
          modalCategoriaInstance = new Modal(modalEl);
        }
      }
      modalCategoriaInstance?.show();
    };

    // Agregar categoría
    const agregarCategoria = async () => {
      if (!nombreCategoria.value.trim()) return;
      categoriaNoti.value.nombre = nombreCategoria.value.trim();
      const ok = await Crear_CategoriasNoticias();
      if (ok) {
        await Listar_CategoriasNoticias();
        modalCategoriaInstance?.hide();
        Alerta.Sucessfull('¡Éxito!', 'Categoría agregada correctamente');
      }
    };

    // Detectar modo edición
    const isEditing = !!route.params.id;

    // Si editar, cargar datos del servicio
    onMounted(async () => {
      await Listar_CategoriasNoticias();
      if (isEditing) {
        await cargarDatosServicio(Number(route.params.id));
        Object.assign(nuevoServicio.value, servicio.value);
      }
    });

    // Guardar o actualizar según el modo
    const guardar = async () => {
      if (!nuevoServicio.value.categoria_id || !nuevoServicio.value.nombre) {
        Alerta.Error('Campos requeridos', 'Debes completar la categoría y el nombre');
        return;
      }
      let ok = false;
      if (isEditing) {
        ok = await actualizarServicio();
      } else {
        ok = await guardarServicio();
      }
      if (ok) {
        Alerta.Sucessfull('¡Éxito!', isEditing ? 'Servicio actualizado correctamente' : 'Servicio guardado correctamente');
    
          router.push({ name: 'Pagina' });
  
      } else {
        Alerta.Error('Error', isEditing ? 'No se pudo actualizar el servicio' : 'No se pudo guardar el servicio');
      }
    };

     const modules = {
      name: 'blotFormatter',
      module: BlotFormatter,
      options: {},
    };

    return {
      // Para que el template acceda directamente a nuevoServicio como objeto
      nuevoServicio: nuevoServicio.value,
      listaCategoriaNoti,
      guardar,
      isEditing,
      modules,
      abrirModalCategoria,
      nombreCategoria,
      agregarCategoria,
    };
  }
});
</script>

<style scoped>
</style>