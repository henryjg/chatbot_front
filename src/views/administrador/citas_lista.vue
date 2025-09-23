<template>

  <!-- Lista de citas -->
  <CardLayout :title="'Citas Médicas'" :clase="'text-info'" :clasehead="'bg-primary border-0'" class="pt-1">
    <template #buttons>
      <div class="d-flex columns justify-content-end mb-2">
        <button @click="crearCita" class="btn btn-success btn-sm mx-1">
          <i class="ti ti-plus"></i> Nueva Cita
        </button>
        <button @click="refreshCitas" class="btn btn-blue b-dark btn-sm mx-1">
          <i class="ti ti-refresh"></i>
      </button> 
            <button @click="" class="btn btn-secondary btn-sm mx-1">
          <i class="fa fa-broom"></i>
        </button>
      </div>
    </template>
    <template #default>
      <DataTable
        :headers="headers"
        :items="listaCitas"
        :filterKeys="['fecha', 'dni', 'nombre', 'celular', 'consultorio', 'estado']"
        :clasehead="'bg-info-100'"
        :loading="isLoading_Citas"
      >
        <template #default="{ item, index, currentPage, itemsPerPage }">
          <tr :id="'tr_cita_' + (index + 1)">
            <td class="text-sm">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="text-wrap text-sm">{{ FormatFecha.fecha_dd_mm_yyyy(item.fecha) }}</td>
            <td class="text-wrap text-sm">
              <span class="fw-bold">{{ formatearHora(item.hora_inicio || '' )}}</span>
              <!-- <span v-if="item.hora_fin"> - {{ item.hora_fin }}</span> -->
            </td>
            <td class="text-wrap text-sm">{{ item.dni || '' }}</td>
            <td class="text-wrap f-w-600 text-sm">{{ item.nombre || '' }}</td>
            <td class="text-wrap text-sm">
              {{ item.celular || '' }}
              <a v-if="item.celular" :href="`https://wa.me/+51${item.celular}`" target="_blank" rel="noopener" class="ms-2">
                <i class="fab fa-whatsapp text-success fs-5"></i>
              </a>
            </td>
            <td class="text-wrap text-sm">{{ item.consultorio || '' }}</td>
            <td class="text-wrap text-sm">
              <span class="badge" :class="getEstadoBadgeClass(item.estado)">
                {{ item.estado || 'Sin estado' }}
              </span>
            </td>
            <td class="text-wrap text-sm">
              <span v-if="Number(item.precio) > 0">S/ {{ Number(item.precio).toFixed(2) }}</span>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="text-sm">
              <div class="btn-group me-1" role="group">
                <button 
                  type="button"
                  @click="editarCita(item.id)"
                  class="avtar avtar-xs btn btn-primary"
                  title="Editar cita"
                >
                  <i class="ti ti-edit f-16"></i>
                </button>
                <button 
                  type="button"
                  @click="eliminarCita(item.id)"
                  class="avtar avtar-xs btn btn-danger"
                  title="Eliminar cita"
                >
                  <i class="ti ti-trash f-16"></i>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
    </template>
  </CardLayout>

  <!-- Modal para editar cita -->
  <div class="modal fade" id="modalEditarCita" tabindex="-1" aria-labelledby="modalEditarCitaLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="max-width: 800px;">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white border-bottom">
          <h5 class="modal-title" id="modalEditarCitaLabel">
            <i class="ti ti-edit me-2" v-if="modoEdicion"></i>
            <i class="ti ti-plus me-2" v-else></i>
            {{ modoEdicion ? 'Editar Cita Médica' : 'Nueva Cita Médica' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="modoEdicion ? actualizarCita() : crearNuevaCita()">
            <!-- DNI -->
            <div class="mb-3">
              <label for="editDni" class="form-label">
                DNI <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  id="editDni"
                  v-model="citaActual.dni"
                  class="form-control"
                  :class="{ 'is-invalid': errors.dni }"
                  placeholder="Ingrese el DNI"
                  maxlength="8"
                  @input="validarDNI"
                  @blur="onDniChange"
                >
                <button class="btn btn-outline-secondary" type="button" @click="onDniChange">
                  <i class="fas fa-search"></i>
                </button>
              </div>
              <div v-if="errors.dni" class="invalid-feedback">
                {{ errors.dni }}
              </div>
            </div>

            <!-- Nombres -->
            <div class="mb-3">
              <label for="editNombre" class="form-label">
                Nombres Completos <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                id="editNombre"
                v-model="citaActual.nombre"
                class="form-control"
                :class="{ 'is-invalid': errors.nombre }"
                placeholder="Nombres completos del paciente"
              >
              <div v-if="errors.nombre" class="invalid-feedback">
                {{ errors.nombre }}
              </div>
            </div>

            <!-- Celular -->
            <div class="mb-3">
              <label for="editCelular" class="form-label">
                Celular <span class="text-danger">*</span>
              </label>
              <input
                type="tel"
                id="editCelular"
                v-model="citaActual.celular"
                class="form-control"
                :class="{ 'is-invalid': errors.celular }"
                placeholder="Ejemplo: 987654321"
                maxlength="9"
                @input="validarCelular"
              >
              <div v-if="errors.celular" class="invalid-feedback">
                {{ errors.celular }}
              </div>
            </div>

            <!-- Consultorio -->
            <div class="mb-3">
              <label for="editConsultorio" class="form-label">
                Consultorio <span class="text-danger">*</span>
              </label>
              <select
                id="editConsultorio"
                v-model="citaActual.consultorio"
                class="form-select"
                :class="{ 'is-invalid': errors.consultorio }"
              >
                <option value="">Seleccione un consultorio</option>
                <option value="Consultorio 1">Consultorio 1</option>
                <option value="Consultorio 2">Consultorio 2</option>
                <option value="Consultorio 3">Consultorio 3</option>
                <option value="Emergencia">Emergencia</option>
              </select>
              <div v-if="errors.consultorio" class="invalid-feedback">
                {{ errors.consultorio }}
              </div>
            </div>

            <!-- Fecha -->
            <div class="mb-3">
              <label for="editFecha" class="form-label">
                Fecha de la Cita <span class="text-danger">*</span>
              </label>
              <input
                type="date"
                id="editFecha"
                v-model="fechaSeleccionada"
                class="form-control"
                :class="{ 'is-invalid': errors.fecha }"
                :min="fechaMinima"
                @change="cargarHorariosDisponibles"
              >
              <div v-if="errors.fecha" class="invalid-feedback">
                {{ errors.fecha }}
              </div>
            </div>

            <!-- Horarios disponibles -->
            <div v-if="fechaSeleccionada" class="mb-3">
              <label class="form-label">
                Horarios Disponibles <span class="text-danger">*</span>
              </label>
              <div v-if="isLoadingFecha" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando horarios...</span>
                </div>
              </div>
              <div v-else-if="horariosDisponibles.length === 0" class="alert alert-warning">
                No hay horarios disponibles para la fecha seleccionada.
              </div>
              <div v-else>
                <!-- Turno Mañana -->
                <div v-if="horariosMañana.length > 0" class="mb-3">
                  <h6 class="text-primary mb-2">
                    <i class="fas fa-sun me-1"></i>Turno Mañana (8:00 - 13:00)
                  </h6>
                  <div class="row g-1">
                    <div 
                      v-for="horario in horariosMañana" 
                      :key="horario.id" 
                      class="col-md-3 col-sm-4 col-6"
                    >
                      <div 
                        class="card border rounded-2 transition-all cursor-pointer"
                        :class="{
                          'bg-success-subtle border-success text-success': horario.disponible && horarioSeleccionado === horario.id,
                          'bg-danger-subtle border-danger text-danger': !horario.disponible,
                          'border-primary hover-shadow': horario.disponible && horarioSeleccionado !== horario.id
                        }"
                        @click="seleccionarHorario(horario)"
                      >
                        <div class="card-body text-center p-1 d-flex flex-column justify-content-center align-items-center">
                          <div class="fw-bold small lh-1"
                              :class="{
                                'text-success': horario.disponible && horarioSeleccionado === horario.id,
                                'text-danger': !horario.disponible,
                                'text-primary': horario.disponible && horarioSeleccionado !== horario.id
                              }">
                            {{ formatearHora(horario.hora_inicio) }} - {{ formatearHora(horario.hora_fin) }}
                          </div>
                          <small class="lh-1"
                            :class="{
                              'text-success': horario.disponible,
                              'text-danger': !horario.disponible
                            }">
                            {{ horario.disponible ? 'Libre' : 'Ocupado' }}
                          </small>
                          <div v-if="horarioSeleccionado === horario.id" class="mt-1">
                            <i class="fas fa-check-circle text-success"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Turno Tarde -->
                <div v-if="horariosTarde.length > 0">
                  <h6 class="text-warning mb-2">
                    <i class="fas fa-moon me-1"></i>Turno Tarde (16:00 - 19:00)
                  </h6>
                  <div class="row g-1">
                    <div 
                      v-for="horario in horariosTarde" 
                      :key="horario.id" 
                      class="col-md-3 col-sm-4 col-6"
                    >
                      <div 
                        class="card border rounded-2 transition-all cursor-pointer"
                        :class="{
                          'bg-success-subtle border-success text-success': horario.disponible && horarioSeleccionado === horario.id,
                          'bg-danger-subtle border-danger text-danger': !horario.disponible,
                          'border-primary hover-shadow': horario.disponible && horarioSeleccionado !== horario.id
                        }"
                        @click="seleccionarHorario(horario)"
                      >
                        <div class="card-body text-center p-1 d-flex flex-column justify-content-center align-items-center">
                          <div class="fw-bold small lh-1"
                              :class="{
                                'text-success': horario.disponible && horarioSeleccionado === horario.id,
                                'text-danger': !horario.disponible,
                                'text-primary': horario.disponible && horarioSeleccionado !== horario.id
                              }">
                            {{ formatearHora(horario.hora_inicio) }} - {{ formatearHora(horario.hora_fin) }}
                          </div>
                          <small class="lh-1"
                            :class="{
                              'text-success': horario.disponible,
                              'text-danger': !horario.disponible
                            }">
                            {{ horario.disponible ? 'Libre' : 'Ocupado' }}
                          </small>
                          <div v-if="horarioSeleccionado === horario.id" class="mt-1">
                            <i class="fas fa-check-circle text-success"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado -->
            <div class="mb-3">
              <label for="editEstado" class="form-label">Estado</label>
              <select
                id="editEstado"
                v-model="citaActual.estado"
                class="form-select"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <!-- Precio -->
            <div class="mb-3">
              <label for="editPrecio" class="form-label">Precio</label>
              <div class="input-group">
                <span class="input-group-text">S/</span>
                <input
                  type="number"
                  id="editPrecio"
                  v-model.number="citaActual.precio"
                  class="form-control"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              </div>
            </div>

            <!-- Descripción -->
            <div class="mb-3">
              <label for="editDescripcion" class="form-label">Descripción</label>
              <textarea
                id="editDescripcion"
                v-model="citaActual.descripcion"
                class="form-control"
                rows="3"
                placeholder="Descripción adicional de la cita..."
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer border-top">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="ti ti-x me-1"></i>Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="modoEdicion ? actualizarCita() : crearNuevaCita()"
            :disabled="!formularioValido || (modoEdicion ? isLoadingEdit : isLoadingCreate)"
          >
            <span v-if="modoEdicion ? isLoadingEdit : isLoadingCreate" class="spinner-border" style="width: 1rem; height: 1rem;" role="status"></span>
            <i v-else class="ti ti-check me-1"></i>
            {{ (modoEdicion ? isLoadingEdit : isLoadingCreate) ? 'Guardando...' : (modoEdicion ? 'Actualizar Cita' : 'Crear Cita') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para ver detalle de cita -->
  <!-- <modal-detalle-cita :cita="citaSeleccionada" /> -->
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { CardLayout, DataTable } from '../../components/_components';
import { useCitas, Sunat } from '../../composables/_composables';
import { FormatFecha, Alerta } from '../../utils/_utils';
import { useRouter } from 'vue-router';
import type { Cita } from '../../interfaces/_interface';
import NProgress from 'nprogress';

interface Horario {
    id: string; 
    hora_inicio: string;
    hora_fin: string;
    disponible: boolean;
    estado?: string;
}

export default {
  components: {
    CardLayout,
    DataTable
  },
  setup() {
    const router = useRouter();
    
    // Composable y estados
    const { 
      listaCitas, 
      isLoading_Citas, 
      Listar_Citas, 
      Eliminar_Cita,
      nuevaCita,
      editandoCita,
      errors,
      Obtener_Cita,
      Crear_Cita,
      Actualizar_Cita,
      isLoadingEdit,
      isLoadingCreate,
      isLoadingFecha,
      listarPorFecha,
      resetFormularioCrear,
      resetFormularioEditar
    } = useCitas();

    const { Validar_DNI } = Sunat();

    // Estados locales
    const citaSeleccionada = ref<Cita | null>(null);
    const modalEditarCita = ref<Modal | null>(null);
    const modoEdicion = ref(false); 
    
    // Estados para el modal de edición
    const fechaSeleccionada = ref('');
    const horarioSeleccionado = ref<string | null>(null);
    const horariosDisponibles = ref<Horario[]>([]);

    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '4%', key: 'index' },
      { text: 'Fecha', width: '10%', key: 'fecha' },
      { text: 'Horario', width: '8%', key: 'horario' },
      { text: 'DNI', width: '8%', key: 'dni' },
      { text: 'Paciente', width: '15%', key: 'nombre' },
      { text: 'Celular', width: '10%', key: 'celular' },
      { text: 'Consultorio', width: '10%', key: 'consultorio' },
      { text: 'Estado', width: '8%', key: 'estado' },
      { text: 'Precio', width: '8%', key: 'precio' },
      { text: 'Acciones', width: '8%', key: 'acciones' },
    ]);

    // Computed
    const fechaMinima = computed(() => {
      const hoy = new Date();
      return hoy.toISOString().split('T')[0];
    });

    const horarioDisponible = computed(() => {
      if (!horarioSeleccionado.value) return true;
      const horario = horariosDisponibles.value.find(h => h.id === horarioSeleccionado.value);
      return horario?.disponible || false;
    });

    // Computed para obtener la cita actual según el modo
    const citaActual = computed(() => {
      return modoEdicion.value ? editandoCita.value : nuevaCita.value;
    });

    const formularioValido = computed(() => {
      const cita = citaActual.value;
      return (
        cita.dni &&
        cita.nombre &&
        cita.celular &&
        cita.consultorio &&
        fechaSeleccionada.value &&
        !Object.values(errors.value).some(error => error !== '')
      );
    });

    // Computed para dividir horarios por turnos
    const horariosMañana = computed(() => {
      return horariosDisponibles.value.filter(horario => {
        const hora = parseInt(horario.hora_inicio.split(':')[0]);
        return hora >= 8 && hora < 14; // 8:00 a 13:59
      });
    });

    const horariosTarde = computed(() => {
      return horariosDisponibles.value.filter(horario => {
        const hora = parseInt(horario.hora_inicio.split(':')[0]);
        return hora >= 16 && hora < 20; // 16:00 a 19:59
      });
    });
   
    // Funciones para manejar estados
    const getEstadoBadgeClass = (estado: string) => {
      switch (estado.toLowerCase()) {
        case 'confirmada':
        case 'activa':
          return 'bg-success';
        case 'pendiente':
        case 'en espera':
          return 'bg-warning';
        case 'cancelada':
        case 'inactiva':
          return 'bg-danger';
        case 'completada':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    };

    // Función para formatear hora (quitar segundos)
    const formatearHora = (hora: string) => {
      if (!hora) return '';
      // Si la hora tiene formato HH:MM:SS, la convertimos a HH:MM
      const partes = hora.split(':');
      if (partes.length >= 2) {
        return `${partes[0]}:${partes[1]}`;
      }
      return hora;
    };

    // Validaciones
    const validarFormulario = () => {
      const cita = citaActual.value;
      
      // Validar DNI
      if (!cita.dni) {
        errors.value.dni = 'El DNI es requerido';
      } else if (!/^\d{8}$/.test(cita.dni)) {
        errors.value.dni = 'El DNI debe tener 8 dígitos';
      } else {
        errors.value.dni = '';
      }
      
      // Validar nombre
      if (!cita.nombre) {
        errors.value.nombre = 'El nombre es requerido';
      } else {
        errors.value.nombre = '';
      }
      
      // Validar celular
      if (!cita.celular) {
        errors.value.celular = 'El celular es requerido';
      } else if (!/^9\d{8}$/.test(cita.celular)) {
        errors.value.celular = 'El celular debe empezar con 9 y tener 9 dígitos';
      } else {
        errors.value.celular = '';
      }
      
      // Validar consultorio
      if (!cita.consultorio) {
        errors.value.consultorio = 'Debe seleccionar un consultorio';
      } else {
        errors.value.consultorio = '';
      }
      
      // Validar fecha
      if (!fechaSeleccionada.value) {
        errors.value.fecha = 'Debe seleccionar una fecha';
      } else {
        errors.value.fecha = '';
      }
    };

    const validarDNI = () => {
      const cita = citaActual.value;
      if (!cita.dni) {
        errors.value.dni = 'El DNI es requerido';
      } else if (!/^\d{8}$/.test(cita.dni)) {
        errors.value.dni = 'El DNI debe tener 8 dígitos';
      } else {
        errors.value.dni = '';
      }
    };

    const validarCelular = () => {
      const cita = citaActual.value;
      if (!cita.celular) {
        errors.value.celular = 'El celular es requerido';
      } else if (!/^9\d{8}$/.test(cita.celular)) {
        errors.value.celular = 'El celular debe empezar con 9 y tener 9 dígitos';
      } else {
        errors.value.celular = '';
      }
    };

    // API RENIEC
    const onDniChange = async () => {
      try {
        NProgress.start(); 
        const cita = citaActual.value;
        if (cita.dni && cita.dni.length == 8) {
          const respuesta = await Validar_DNI(cita.dni);
          if(respuesta){
            cita.nombre = respuesta.nombres + ' ' + respuesta.apellidoPaterno + ' ' + respuesta.apellidoMaterno;
          }
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del paciente.');
      } finally {
        NProgress.done(); 
      }
    };

    // Cargar horarios disponibles para la fecha seleccionada
    const cargarHorariosDisponibles = async () => {
      if (!fechaSeleccionada.value) return;
      
      try {
        const response = await listarPorFecha(fechaSeleccionada.value);
        horariosDisponibles.value = response.data || [];
        horarioSeleccionado.value = null;
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        horariosDisponibles.value = [];
        Alerta.Error('Error', 'No se pudieron cargar los horarios disponibles');
      }
    };

    // Seleccionar horario
    const seleccionarHorario = (horario: Horario) => {
      if (!horario.disponible) return;
      
      horarioSeleccionado.value = horario.id;
      editandoCita.value.hora_inicio = horario.hora_inicio;
      editandoCita.value.hora_fin = horario.hora_fin;
    };

    // Funciones de acciones
    const crearCita = () => {
      // Preparar modal para crear nueva cita
      modoEdicion.value = false;
      resetFormularioCrear();
      fechaSeleccionada.value = '';
      horarioSeleccionado.value = null;
      horariosDisponibles.value = [];
      
      // Mostrar el modal
      const modalElement = document.getElementById('modalEditarCita');
      if (modalElement) {
        modalEditarCita.value = new Modal(modalElement);
        modalEditarCita.value.show();
      }
    };

    const editarCita = async (id: number) => {
      try {
        // Preparar modal para edición
        modoEdicion.value = true;
        
        // Cargar los datos de la cita
        await Obtener_Cita(id);
        
        // Configurar la fecha seleccionada y el horario
        fechaSeleccionada.value = editandoCita.value.fecha;
        
        // Cargar horarios disponibles para esa fecha
        if (editandoCita.value.fecha) {
          await cargarHorariosDisponibles();
          // Establecer el horario actual como seleccionado (solo si existe)
          if (editandoCita.value.horario_id && editandoCita.value.horario_id > 0) {
            horarioSeleccionado.value = editandoCita.value.horario_id.toString();
          } else {
            horarioSeleccionado.value = null;
          }
        }
        
        // Mostrar el modal
        const modalElement = document.getElementById('modalEditarCita');
        if (modalElement) {
          modalEditarCita.value = new Modal(modalElement);
          modalEditarCita.value.show();
        }
      } catch (error) {
        console.error('Error al cargar cita:', error);
        Alerta.Error('Error', 'No se pudo cargar la información de la cita');
      }
    };

    const crearNuevaCita = async () => {
      try {
        // Validar formulario
        validarFormulario();
        
        // Verificar que no hay errores
        if (Object.values(errors.value).some(error => error !== '')) {
          return;
        }

        // Asignar fecha seleccionada y horario_id
        nuevaCita.value.fecha = fechaSeleccionada.value;
        if (horarioSeleccionado.value) {
          nuevaCita.value.horario_id = parseInt(horarioSeleccionado.value);
        }

        const exito = await Crear_Cita();
        if (exito) {
          modalEditarCita.value?.hide();
          Alerta.Sucessfull('¡Éxito!', 'Cita creada correctamente');
        }
      } catch (error) {
        console.error('Error al crear cita:', error);
        Alerta.Error('Error', 'No se pudo crear la cita');
      }
    };

    const actualizarCita = async () => {
      try {
        // Validar formulario
        validarDNI();
        validarCelular();
        
        if (!editandoCita.value.nombre) {
          errors.value.nombre = 'El nombre es requerido';
        } else {
          errors.value.nombre = '';
        }

        if (!editandoCita.value.consultorio) {
          errors.value.consultorio = 'Debe seleccionar un consultorio';
        } else {
          errors.value.consultorio = '';
        }

        if (!fechaSeleccionada.value) {
          errors.value.fecha = 'Debe seleccionar una fecha';
        } else {
          errors.value.fecha = '';
        }

        // Verificar que no hay errores
        if (Object.values(errors.value).some(error => error !== '')) {
          return;
        }

     

        // Asignar fecha seleccionada y horario_id
        editandoCita.value.fecha = fechaSeleccionada.value;
        if (horarioSeleccionado.value) {
          editandoCita.value.horario_id = parseInt(horarioSeleccionado.value);
        } else {
          editandoCita.value.horario_id = 0; // O mantener el valor original
        }

        const exito = await Actualizar_Cita();
        if (exito) {
          modalEditarCita.value?.hide();
          Alerta.Sucessfull('¡Éxito!', 'Cita actualizada correctamente');
        }
      } catch (error) {
        console.error('Error al actualizar cita:', error);
        Alerta.Error('Error', 'No se pudo actualizar la cita');
      }
    };

    const eliminarCita = async (id: number) => {
      try {
        await Eliminar_Cita(id);
      } catch (error) {
        console.error('Error al eliminar cita:', error);
      }
    };

    const refreshCitas = async () => {
      try {
        await Listar_Citas();
        Alerta.Sucessfull('Éxito', 'Lista de citas actualizada');
      } catch (error) {
        console.error('Error al actualizar citas:', error);
      }
    };


    // Inicializar
    onMounted(async () => {
      await Listar_Citas();
    });

    return {
      // Estados
      listaCitas,
      isLoading_Citas,
      citaSeleccionada,
      headers,
      editandoCita,
      nuevaCita,
      errors,
      fechaSeleccionada,
      horarioSeleccionado,
      horariosDisponibles,
      modoEdicion,
      
      // Computed
      fechaMinima,
      horarioDisponible,
      formularioValido,
      citaActual,
      horariosMañana,
      horariosTarde,
      
      // Estados de carga
      isLoadingEdit,
      isLoadingCreate,
      isLoadingFecha,
      
      // Funciones
      crearCita,
      editarCita,
      crearNuevaCita,
      actualizarCita,
      eliminarCita,
      refreshCitas,
      getEstadoBadgeClass,
      validarDNI,
      validarCelular,
      onDniChange,
      cargarHorariosDisponibles,
      seleccionarHorario,
      formatearHora,
      
      // Utilidades
      FormatFecha
    };
  }
};
</script>

<style scoped>
.transition-all {
  transition: all 0.2s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-shadow:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>