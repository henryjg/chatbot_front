<template>
  <CardLayout :title="'Preguntas Frecuentes'" :clase="'text-primary'" :clasehead="'bg-light'" class="pt-1">
    <template #buttons>
      <div class="d-flex columns justify-content-end">
        <button @click="openAddModal" class="btn btn-success btn-sm">
          <i class="fa fa-plus"></i> Agregar
        </button>
        <button @click="cargarPreguntas" class="btn btn-blue b-dark btn-sm mx-1">
          <i class="ti ti-refresh"></i>
        </button>
      </div>
    </template>
    <template #default>
      <DataTable
        :headers="headers"
        :items="listaPreguntas"
        :filterKeys="['descripcion', 'respuesta', 'info_adicional']"
        :clasehead="'bg-info-100'"
      >
        <template #default="{ item, index, currentPage, itemsPerPage }">
            <tr :id="'tr_pregunta_'+item.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="f-14 f-w-600 text-gray mb-0 mt-2">{{ item.descripcion }}</td>
            <td class="text-wrap text-sm" v-html="item.respuesta"></td>
            <td>
              <!-- Lupa redirige a la ruta beneficios/preguntasfrecuentes -->
                 <a :href="`/beneficios/preguntasfrecuentes`" class="btn btn-light-primary btn-sm me-1" target="_blank" rel="noopener">
                    <i class="ti ti-search"></i>
                  </a>
              <button class="btn btn-light-warning btn-sm me-1" @click="openEditModal(item)">
                <i class="ti ti-pencil f-20"></i>
              </button>
              <button class="btn btn-light-danger btn-sm" @click="Eliminar_Pregunta(item.id)">
                <i class="ti ti-trash f-20"></i>
              </button>
            </td>
          </tr>
        </template>
      </DataTable>
    </template>
  </CardLayout>

  <!-- Modal Agregar -->
  <div class="modal fade" id="addPreguntaModal" tabindex="-1" aria-labelledby="addPreguntaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nueva Pregunta
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-1">
          <form @submit.prevent="registrarPregunta">
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" rows="3" v-model="nuevaPregunta.descripcion" placeholder="Ingrese la descripción de la pregunta"></textarea>
              <ErrorMessage :error="errors.descripcion" />
            </div>
            <div class="mb-3">
              <label class="form-label">Respuesta</label>
              <QuillEditor content-type="html" v-model:content="nuevaPregunta.respuesta" toolbar="minimal" />
              <ErrorMessage :error="errors.respuesta" />
            </div>
            <div class="mb-3">
              <label class="form-label">Información Adicional</label>
              <textarea class="form-control" rows="2" v-model="nuevaPregunta.info_adicional" placeholder="Información adicional (opcional)"></textarea>
              <ErrorMessage :error="errors.info_adicional" />
            </div>
            <div class="modal-footer py-0">
              <button type="submit" class="btn btn-primary">Crear</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Editar -->
  <div class="modal fade" id="editPreguntaModal" tabindex="-1" aria-labelledby="editPreguntaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-edit p-r-15"></i> Editar Pregunta
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-1">
          <form @submit.prevent="actualizarPregunta">
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" rows="3" v-model="preguntaEdit.descripcion" placeholder="Ingrese la descripción de la pregunta"></textarea>
              <ErrorMessage :error="errors.descripcion" />
            </div>
            <div class="mb-3">
              <label class="form-label">Respuesta</label>
              <QuillEditor content-type="html" v-model:content="preguntaEdit.respuesta" toolbar="minimal" />
              <ErrorMessage :error="errors.respuesta" />
            </div>
            <div class="mb-3">
              <label class="form-label">Información Adicional</label>
              <textarea class="form-control" rows="2" v-model="preguntaEdit.info_adicional" placeholder="Información adicional (opcional)"></textarea>
              <ErrorMessage :error="errors.info_adicional" />
            </div>
            <div class="modal-footer py-0">
              <button type="submit" class="btn btn-primary">Actualizar</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script lang="ts">  
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { CardLayout, DataTable, ErrorMessage } from '../../components/_components';
import { usePreguntas } from '../../composables/usePreguntas';
import { QuillEditor } from '@vueup/vue-quill';

export default defineComponent({
  components: {
    CardLayout,
    DataTable,
    ErrorMessage,
    QuillEditor,
  },
  setup() {
    const router = useRouter();
    const {
      listaPreguntas,
      nuevaPregunta,
      editandoPregunta,
      errors,
      Crear_Pregunta,
      Actualizar_Pregunta,
      Eliminar_Pregunta,
      Listar_Preguntas,
      resetFormulario,
      Obtener_Pregunta,
    } = usePreguntas();

    const preguntaEdit = ref<any>({});

    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'Descripción', width: '40%', key: 'descripcion' },
      { text: 'Respuesta', width: '35%', key: 'respuesta' },
      { text: 'Acciones', width: '20%', key: 'acciones' },
    ]);

    const cargarPreguntas = async () => {
      await Listar_Preguntas();
    };

    const openAddModal = () => {
      resetFormulario();
      const modal = new Modal(document.getElementById('addPreguntaModal')!);
      modal.show();
    };

    const openEditModal = (item: any) => {
      preguntaEdit.value = { ...item };
      editandoPregunta.value = { ...item };
      const modal = new Modal(document.getElementById('editPreguntaModal')!);
      modal.show();
    };

    // Redirige a la ruta beneficios/preguntasfrecuentes
    const irAPreguntasFrecuentes = () => {
      router.push({ path: '/beneficios/preguntasfrecuentes' });
    };

    const registrarPregunta = async () => {
      const creado = await Crear_Pregunta();
      if (creado) {
        await cargarPreguntas();
        const modal = Modal.getInstance(document.getElementById('addPreguntaModal')!);
        modal?.hide();
      }
    };

    const actualizarPregunta = async () => {
      // Asegura que el ID esté presente antes de actualizar
      if (!preguntaEdit.value.id) return;
      editandoPregunta.value = { ...preguntaEdit.value };
      const actualizado = await Actualizar_Pregunta();
      if (actualizado) {
        await cargarPreguntas();
        const modal = Modal.getInstance(document.getElementById('editPreguntaModal')!);
        modal?.hide();
      }
    };

    // const eliminarPregunta = async (id: number) => {
    //   await Eliminar_Pregunta(id);
    //   await cargarPreguntas();
    // };

    onMounted(() => {
      cargarPreguntas();
    });

    return {
      headers,
      listaPreguntas,
      nuevaPregunta,
      preguntaEdit,
      errors,
      cargarPreguntas,
      openAddModal,
      openEditModal,
      registrarPregunta,
      actualizarPregunta,
      Eliminar_Pregunta,
      irAPreguntasFrecuentes,
    };
  },
});
</script>