<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Registrar Nueva Cita</h4>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="guardarCita">
                            <!-- DNI -->
                            <div class="mb-3">
                                <label for="dni" class="form-label">DNI <span class="text-danger">*</span></label>
                                <input 
                                    v-model="nuevaCita.dni" 
                                    type="text" 
                                    id="dni" 
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.dni }"
                                    placeholder="Ingrese su DNI"
                                    maxlength="8"
                                    @input="validarDNI"
                                    @change="onDniChange"
                                />
                                <div v-if="errors.dni" class="invalid-feedback">
                                    {{ errors.dni }}
                                </div>
                            </div>

                            <!-- Nombres -->
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombres Completos <span class="text-danger">*</span></label>
                                <input 
                                    v-model="nuevaCita.nombre" 
                                    type="text" 
                                    id="nombre" 
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.nombre }"
                                    placeholder="Ingrese sus nombres completos"
                                />
                                <div v-if="errors.nombre" class="invalid-feedback">
                                    {{ errors.nombre }}
                                </div>
                            </div>

                            <!-- Celular -->
                            <div class="mb-3">
                                <label for="celular" class="form-label">Celular <span class="text-danger">*</span></label>
                                <input 
                                    v-model="nuevaCita.celular" 
                                    type="text" 
                                    id="celular" 
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.celular }"
                                    placeholder="Ingrese su número de celular"
                                    maxlength="9"
                                    @input="validarCelular"
                                />
                                <div v-if="errors.celular" class="invalid-feedback">
                                    {{ errors.celular }}
                                </div>
                            </div>

                            <!-- Consultorio -->
                            <div class="mb-3">
                                <label for="consultorio" class="form-label">Consultorio <span class="text-danger">*</span></label>
                                <select 
                                    v-model="nuevaCita.consultorio" 
                                    id="consultorio" 
                                    class="form-select"
                                    :class="{ 'is-invalid': errors.consultorio }"
                                >
                                    <option value="">Seleccione un consultorio</option>
                                    <option value="laboratorio">Laboratorio</option>
                                    <option value="consultorio">Consultorio</option>
                                    <option value="fisioterapia">Fisioterapia</option>
                                </select>
                                <div v-if="errors.consultorio" class="invalid-feedback">
                                    {{ errors.consultorio }}
                                </div>
                            </div>

                            <!-- Fecha -->
                            <div class="mb-3">
                                <label for="fecha" class="form-label">Fecha <span class="text-danger">*</span></label>
                                <input 
                                    v-model="fechaSeleccionada" 
                                    type="date" 
                                    id="fecha" 
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.fecha }"
                                    :min="fechaMinima"
                                    @change="cargarHorariosDisponibles"
                                />
                                <div v-if="errors.fecha" class="invalid-feedback">
                                    {{ errors.fecha }}
                                </div>
                            </div>

                            <!-- Horarios Disponibles -->
                            <div v-if="fechaSeleccionada" class="mb-3">
                                <label class="form-label">Horarios Disponibles</label>
                                <div v-if="isLoadingFecha" class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando horarios...</span>
                                    </div>
                                </div>
                                <div v-else-if="horariosDisponibles.length === 0" class="alert alert-warning">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    No hay horarios disponibles para esta fecha.
                                </div>
                                <div v-else class="row">
                                    <div 
                                        v-for="horario in horariosDisponibles" 
                                        :key="horario.id" 
                                        class="col-md-4 mb-2"
                                    >
                                        <div 
                                            class="card horario-card"
                                            :class="{ 
                                                'border-success bg-light-success': horario.disponible && horarioSeleccionado === horario.id,
                                                'border-danger bg-light-danger': !horario.disponible,
                                                'border-primary': horario.disponible && horarioSeleccionado !== horario.id
                                            }"
                                            @click="seleccionarHorario(horario)"
                                            :style="{ cursor: horario.disponible ? 'pointer' : 'not-allowed' }"
                                        >
                                            <div class="card-body p-2 text-center">
                                                <div class="fw-bold">{{ horario.hora_inicio }} - {{ horario.hora_fin }}</div>
                                                <div v-if="!horario.disponible" class="text-danger small">
                                                    <i class="fas fa-times-circle me-1"></i>
                                                    No disponible
                                                </div>
                                                <div v-else-if="horarioSeleccionado === horario.id" class="text-success small">
                                                    <i class="fas fa-check-circle me-1"></i>
                                                    Seleccionado
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="horarioSeleccionado && !horarioDisponible" class="alert alert-danger mt-2">
                                    <i class="fas fa-exclamation-circle me-2"></i>
                                    Ese horario no está disponible. Por favor, seleccione otro.
                                </div>
                            </div>

                            <!-- Descripción (opcional) -->
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción (Opcional)</label>
                                <textarea 
                                    v-model="nuevaCita.descripcion" 
                                    id="descripcion" 
                                    class="form-control"
                                    rows="3"
                                    placeholder="Describa brevemente el motivo de su cita"
                                ></textarea>
                            </div>

                            <!-- Botones -->
                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btn-secondary" @click="limpiarFormulario">
                                    <i class="fas fa-broom me-2"></i>
                                    Limpiar
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary"
                                    :disabled="isLoadingCreate || !formularioValido"
                                >
                                    <span v-if="isLoadingCreate" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="fas fa-save me-2"></i>
                                    {{ isLoadingCreate ? 'Guardando...' : 'Registrar Cita' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useCitas, Sunat } from '../../composables/_composables'
import { Alerta } from '../../utils/_utils'
import NProgress from 'nprogress'; // Importa nprogress
import 'nprogress/nprogress.css';

interface Horario {
    id: string; 
    hora_inicio: string;
    hora_fin: string;
    disponible: boolean;
    estado?: string;
}

export default defineComponent({
    setup() {
        // Composables
        const {
            nuevaCita,
            errors,
            Crear_Cita,
            listarPorFecha,
            isLoadingCreate,
            isLoadingFecha,
            resetFormularioCrear
        } = useCitas();

        const { Validar_DNI, PersonaData } = Sunat();

        // Estado local
        const fechaSeleccionada = ref('');
        const horarioSeleccionado = ref<string | null>(null); 
        const horariosDisponibles = ref<Horario[]>([]);

    // API RENIEC
    // ----------------------------------------------------------
    const onDniChange = async () => {
      try {
        NProgress.start(); 
        if (nuevaCita.value.dni.length == 8) {
          const respuesta = await Validar_DNI(nuevaCita.value.dni);
          if(respuesta){
            nuevaCita.value.nombre = respuesta.nombres + ' ' + respuesta.apellidoPaterno + ' ' + respuesta.apellidoMaterno;
          }
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del trabajador.');
      } finally {
        NProgress.done(); 
      }
    }; 

        // Fecha mínima (hoy)
        const fechaMinima = computed(() => {
            const hoy = new Date();
            return hoy.toISOString().split('T')[0];
        });

        // Verificar si el horario seleccionado está disponible
        const horarioDisponible = computed(() => {
            if (!horarioSeleccionado.value) return true;
            const horario = horariosDisponibles.value.find(h => h.id === horarioSeleccionado.value);
            return horario?.disponible || false;
        });

        // Validar si el formulario está completo
        const formularioValido = computed(() => {
            return (
                nuevaCita.value.dni &&
                nuevaCita.value.nombre &&
                nuevaCita.value.celular &&
                nuevaCita.value.consultorio &&
                fechaSeleccionada.value &&
                horarioSeleccionado.value &&
                horarioDisponible.value &&
                !Object.values(errors.value).some(error => error !== '')
            );
        });

        // Validaciones
        const validarDNI = () => {
            const dni = nuevaCita.value.dni;
            if (!dni) {
                errors.value.dni = 'El DNI es requerido';
            } else if (!/^\d{8}$/.test(dni)) {
                errors.value.dni = 'El DNI debe tener 8 dígitos';
            } else {
                errors.value.dni = '';
            }
        };

        const validarCelular = () => {
            const celular = nuevaCita.value.celular;
            if (!celular) {
                errors.value.celular = 'El celular es requerido';
            } else if (!/^9\d{8}$/.test(celular)) {
                errors.value.celular = 'El celular debe empezar con 9 y tener 9 dígitos';
            } else {
                errors.value.celular = '';
            }
        };

        const validarFormulario = () => {
            validarDNI();
            validarCelular();
            
            if (!nuevaCita.value.nombre) {
                errors.value.nombre = 'El nombre es requerido';
            } else {
                errors.value.nombre = '';
            }

            if (!nuevaCita.value.consultorio) {
                errors.value.consultorio = 'Debe seleccionar un consultorio';
            } else {
                errors.value.consultorio = '';
            }

            if (!fechaSeleccionada.value) {
                errors.value.fecha = 'Debe seleccionar una fecha';
            } else {
                errors.value.fecha = '';
            }

            return Object.values(errors.value).every(error => error === '');
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
            nuevaCita.value.hora_inicio = horario.hora_inicio;
            nuevaCita.value.hora_fin = horario.hora_fin;
        };

        // Guardar cita
        const guardarCita = async () => {
            if (!validarFormulario()) return;
            
            if (!horarioSeleccionado.value || !horarioDisponible.value) {
                Alerta.Error('Error', 'Debe seleccionar un horario disponible');
                return;
            }

            // Asignar fecha seleccionada y horario_id
            nuevaCita.value.fecha = fechaSeleccionada.value;
            nuevaCita.value.horario_id = parseInt(horarioSeleccionado.value);

            try {
                const exito = await Crear_Cita();
                if (exito) {
                    Alerta.Sucessfull('¡Éxito!', 'Cita registrada correctamente');
                    limpiarFormulario();
                }
            } catch (error) {
                console.error('Error al guardar cita:', error);
                Alerta.Error('Error', 'No se pudo registrar la cita');
            }
        };

        // Limpiar formulario
        const limpiarFormulario = () => {
            resetFormularioCrear();
            fechaSeleccionada.value = '';
            horarioSeleccionado.value = null;
            horariosDisponibles.value = [];
        };

        return {
            // Estado
            nuevaCita,
            errors,
            fechaSeleccionada,
            horarioSeleccionado,
            horariosDisponibles,
            
            // Computadas
            fechaMinima,
            horarioDisponible,
            formularioValido,
            
            // Estados de carga
            isLoadingCreate,
            isLoadingFecha,
            
            // Métodos
            validarDNI,
            validarCelular,
            cargarHorariosDisponibles,
            seleccionarHorario,
            guardarCita,
            limpiarFormulario,
            onDniChange
        }
    }
})
</script>

<style scoped>
.horario-card {
    transition: all 0.2s ease;
}

.horario-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.bg-light-success {
    background-color: #d1f2d1 !important;
}

.bg-light-danger {
    background-color: #f8d7da !important;
}

.text-danger {
    color: #dc3545 !important;
}

.text-success {
    color: #198754 !important;
}

.form-control.is-invalid,
.form-select.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    display: block;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}
</style>