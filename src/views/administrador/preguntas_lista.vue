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
        :filterKeys="['pregunta', 'estado']"
        :clasehead="'bg-info-100'"
      >
        <template #default="{ item, index, currentPage, itemsPerPage }">
            <tr :id="'tr_pregunta_'+item.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="f-14 f-w-600 text-gray mb-0 mt-2">{{ item.pregunta }}</td>
            <td>
              <span :class="['badge', item.estado === 'Activo' ? 'bg-success' : 'bg-danger']">
                {{ item.estado }}
              </span>
            </td>
            <td>
              <!-- Lupa redirige a la ruta beneficios/preguntasfrecuentes -->
                 <a :href="`/beneficios/preguntasfrecuentes`" class="btn btn-light-primary btn-sm me-1" target="_blank" rel="noopener">
                    <i class="ti ti-search"></i>
                  </a>
              <button class="btn btn-light-warning btn-sm me-1" @click="openEditModal(item)">
                <i class="ti ti-pencil f-20"></i>
              </button>
              <button class="btn btn-light-danger btn-sm" @click="eliminarFilaPregunta(item.id)">
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
            <!-- El campo orden ya no se muestra ni se edita -->
            <div class="mb-3">
              <label class="form-label">Pregunta</label>
              <input type="text" class="form-control" v-model="nuevaPregunta.pregunta" />
              <ErrorMessage :error="errors.pregunta" />
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <QuillEditor content-type="html" v-model:content="nuevaPregunta.descripcion" toolbar="minimal" />
              <ErrorMessage :error="errors.descripcion" />
            </div>
            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select class="form-control" v-model="nuevaPregunta.estado">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <ErrorMessage :error="errors.estado" />
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
            <!-- Añade campo oculto para orden (no editable, pero requerido por backend) -->
            <input type="hidden" v-model.number="preguntaEdit.orden" />
            <div class="mb-3">
              <label class="form-label">Pregunta</label>
              <input type="text" class="form-control" v-model="preguntaEdit.pregunta" />
              <ErrorMessage :error="errors.pregunta" />
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <QuillEditor content-type="html" v-model:content="preguntaEdit.descripcion" toolbar="minimal" />
              <ErrorMessage :error="errors.descripcion" />
            </div>
            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select class="form-control" v-model="preguntaEdit.estado">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <ErrorMessage :error="errors.estado" />
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
      pregunta,
      errors,
      Crear_Pregunta,
      Actualizar_Pregunta,
      eliminarFilaPregunta,
      Listar_Preguntas,
      resetFormulario,
      Obtener_Pregunta,
    } = usePreguntas();

    const preguntaEdit = ref<any>({});

    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'Pregunta', width: '60%', key: 'pregunta' },
      { text: 'Estado', width: '15%', key: 'estado' },
      { text: 'Acciones', width: '20%', key: 'acciones' },
    ]);

    const cargarPreguntas = async () => {
      await Listar_Preguntas();
    };

    const openAddModal = () => {
      resetFormulario();
      nuevaPregunta.value.orden = listaPreguntas.value.length + 1;
      nuevaPregunta.value.estado = 'Activo';
      const modal = new Modal(document.getElementById('addPreguntaModal')!);
      modal.show();
    };

    const openEditModal = (item: any) => {
      preguntaEdit.value = { ...item };
      const modal = new Modal(document.getElementById('editPreguntaModal')!);
      modal.show();
    };

    // Redirige a la ruta beneficios/preguntasfrecuentes
    const irAPreguntasFrecuentes = () => {
      router.push({ path: '/beneficios/preguntasfrecuentes' });
    };

    const registrarPregunta = async () => {
      pregunta.value = { ...nuevaPregunta.value };
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
      pregunta.value = { ...preguntaEdit.value };
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
      eliminarFilaPregunta,
      irAPreguntasFrecuentes,
    };
  },
});
</script>