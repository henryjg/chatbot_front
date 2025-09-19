<template>
  <!-- [ breadcrumb ] start -->
  <Breadcrumb :links="breadcrumbRoutes" />
  <!-- [ breadcrumb ] end -->
  <div class="row">
    <!-- [ editar_trabajador ] start -->
    <div class="col-md-2 text-center">
      <div class="chat-avtar d-inline-flex mx-auto ">
        <div v-if="trabajador.fotoPerfil"  class="circular-div">
          <img :src="trabajador.fotoPerfil" alt="Imagen">
        </div>
        <img class="rounded-circle img-fluid img-thumbnail"
             v-else
             src="../../assets/images/avatar.png">
        <i class="chat-badge bg-success me-4 mb-1"></i>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="card">
        <div class="card-header f-20 text-primary">
          <i class="fas fa-chevron-right m-r-10"></i> Datos Personales
        </div>
        <div class="card-body">
          <!-- DNI -->
          <div class="mb-2">
            <label class="form-label">DNI</label>
            <input type="text" v-model="trabajador.dni" @change="onDniChange" class="form-control" placeholder="Ingresa su DNI">
            <ErrorMessage :error="errors.dni" />
          </div>
          <!-- Nombre, Apellido Paterno, Apellido Materno en la misma fila -->
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="form-label">Nombre</label>
              <input type="text" v-model="trabajador.nombre" class="form-control" placeholder="Ingresa su Nombre">
              <ErrorMessage :error="errors.nombre" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Apellido Paterno</label>
              <input type="text" v-model="trabajador.apePaterno" class="form-control" placeholder="Ingresa Apellido Paterno">
              <ErrorMessage :error="errors.apePaterno" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Apellido Materno</label>
              <input type="text" v-model="trabajador.apeMaterno" class="form-control" placeholder="Ingresa Apellido Materno">
              <ErrorMessage :error="errors.apeMaterno" />
            </div>
          </div>
          <!-- Género con botones -->
          <div class="mb-2">
            <label class="form-label">Género</label>
            <div class="d-flex mb-1">
              <input id="generoMasculino" v-model="trabajador.genero" type="radio" class="btn-check" value="Masculino">
              <label class="btn btn-outline-secondary b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="generoMasculino">Masculino</label>
              <input id="generoFemenino" v-model="trabajador.genero" type="radio" class="btn-check" value="Femenino">
              <label class="btn btn-outline-secondary b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="generoFemenino">Femenino</label>
            </div>
            <ErrorMessage :error="errors.genero" />
          </div>
          <!-- Cargo y Oficina en la misma fila -->
          <div class="row mb-2">
            <div class="col-md-6">
              <label class="form-label">Cargo</label>
              <select v-model="trabajador.cargo" class="form-select">
                <option value="" disabled>Selecciona un cargo</option>
                <option v-for="cargoItem in cargo" :key="cargoItem" :value="cargoItem">{{ cargoItem }}</option>
              </select>
              <ErrorMessage :error="errors.cargo" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Oficina</label>
              <select v-model="trabajador.oficinaId" class="form-select">
                <option disabled>Elegir</option>
                <!-- <option v-for="oficina in listaOficinas"  :key="oficina.id" :value="oficina.id">{{oficina.nombre}}</option> -->
              </select>
              <ErrorMessage :error="errors.oficinaId" />
            </div>
          </div>
          <!-- Fecha de nacimiento, Celular y Correo en la misma fila -->
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="form-label">Fecha Nacimiento</label>
              <input class="form-control" v-model="fechaNacimiento" type="date">
              <ErrorMessage :error="errors.fechaNacimiento" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Celular</label>
              <input type="text" v-model="trabajador.celular" class="form-control" placeholder="Ingresa tu celular">
              <ErrorMessage :error="errors.celular" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Correo</label>
              <input type="email" v-model="trabajador.email" class="form-control" placeholder="Ingresa tu email">
              <ErrorMessage :error="errors.email" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card">
        <div class="card-header f-20 text-primary">
          <i class="fas fa-chevron-right m-r-10"></i> Datos de Contacto
        </div>
        <div class="card-body">
          <div class="mb-2">
            <!-- <FileUploader_miniatura
              titulo="Fotografía perfil"
              elementoLoader="loaderFotoPerfil"
              tipoArchivo="fotografia"
              :archivoTemporal="trabajador.fotoPerfil && trabajador.fotoPerfil !== '' ? { id: 0, nombrefile: 'Foto de perfil', url: trabajador.fotoPerfil, documento_id: '', fecharegistro: '' } : { id: 0, nombrefile: '', url: '', documento_id: '', fecharegistro: '' }"
              :resetTrigger="resetTrigger"
              @archivoSubido="(archivo) => { trabajador.fotoPerfil = archivo.url }"
            /> -->
             <FileUploader 
                  titulo="Fotografia perfil"
                  elementoLoader="loaderFotoPerfil"
                  tipoArchivo="fotografia"
                  :archivoTemporal="archivoTrabajador.ArchivoTemporal.value"
                  :resetTrigger="resetTrigger"
                  @archivoSubido="(archivo:Adjunto) => trabajador.fotoPerfil = archivo.url"
                  @uploadingStatus="archivoTrabajador.isUploading.value = $event"
                />
            <ErrorMessage :error="errors.fotoPerfil" />
          </div>
          <button :disabled="isUploading" @click="" class="btn btn-primary mb-0">Guardar Cambios</button>
          <button @click="cancelar" class="btn btn-danger mx-2 mb-0">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Centralized imports
import { Breadcrumb, ErrorMessage } from '../../components/_components';
import FileUploader from '../../components/FileUploader_miniatura.vue';
import { useTrabajador, Sunat, useSubirArchivo } from '../../composables/_composables';
import { Notif, cargo } from '../../utils/_utils';
import { Adjunto } from '../../interfaces/_interface';


export default defineComponent({
  props: {
    id: {
      type: [String, Number],
      required: false
    }
  },
  components: { Breadcrumb, ErrorMessage, FileUploader },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isUploading = ref(false);
    const file_img = ref<File | null>(null);

    const { trabajador, Obtener_Trabajador_edit, errors, isLoading_Trabajador } = useTrabajador();
    // const { listaOficinas, cargarOficinas } = useOficina();

    const { Validar_DNI, personaData } = Sunat();
    const idTrabajador = Number(route.params.id);
    const cancelar = () => {
    router.push('/office/trabajador');
  };

    const breadcrumbRoutes = ref([
      { path: '/office/trabajador', name: 'Trabajador' },
      { path: '', name: 'Editar Trabajador' },
    ]);

       const archivoTrabajador = useSubirArchivo("loadingfile", "fotografia");

    // Formatea fecha ISO a yyyy-MM-dd para el input
    const formatDateForInput = (isoDate: string) => {
      if (!isoDate) return '';
      return isoDate.split('T')[0];
    };

    // Convierte fecha yyyy-MM-dd a ISO para enviar al backend
    const toIsoDate = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toISOString();
    };

    // Sobrescribe el getter/setter de las fechas para el input
    const fechaNacimiento = ref('');
    const fechaIngreso = ref('');

    onMounted(async () => {
      await Obtener_Trabajador_edit(idTrabajador);
      // cargarOficinas();
      // Formatea fechas para el input
      fechaNacimiento.value = formatDateForInput(trabajador.value.fechaNacimiento);
      fechaIngreso.value = formatDateForInput(trabajador.value.fechaIngreso);
    });

    // Actualiza el trabajador con fechas en formato ISO
    // const guardarCambios = async () => {
    //   isUploading.value = true;
    //   try {
    //     // Prepara el payload solo con los campos requeridos
    //     const dataToSend = {
    //       ...trabajador.value,
    //       fechaNacimiento: toIsoDate(fechaNacimiento.value),
    //       fechaIngreso: toIsoDate(fechaIngreso.value),
    //     };
    //     await Actualizar_Trabajador(idTrabajador, dataToSend);
    //     router.push('/office/trabajador');
    //   } catch (error) {
    //     // Manejo de error
    //   } finally {
    //     isUploading.value = false;
    //   }
    // };

 // ----------------------------------------------------------

    const onDniChange = async () => {
      try {        if (trabajador.value.dni.length === 8) {
          const Respuesta = await Validar_DNI(trabajador.value.dni);
          if(Respuesta){
            personaData.value = Respuesta;
            trabajador.value.nombre = personaData.value.nombres;
            trabajador.value.apePaterno = personaData.value.apellidoPaterno;
            trabajador.value.apeMaterno = personaData.value.apellidoMaterno;
        }
      }
      } catch (error) {
        Notif.Error('No se pudo obtener los datos del trabajador.');      }
    };

    // ---------------------------------------
    // Reset trigger para fileuploader
    const resetTrigger = ref(0);

    return { 
      // actualizarFotoTrabajador,
      // listaOficinas, 
      trabajador,
      errors, 
      // Actualizar_Trabajador, 
      cancelar, 
      breadcrumbRoutes, 
      isUploading, 
      onDniChange, 
      cargo,
      idTrabajador,
      fechaNacimiento,
      fechaIngreso,
      // guardarCambios,
      resetTrigger,
      archivoTrabajador
    };
  },
});
</script>

<style lang="scss" scoped>


</style>