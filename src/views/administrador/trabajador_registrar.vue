<template>
  <!-- [ breadcrumb ] start -->
  <Breadcrumb :links="breadcrumbRoutes" />
  <!-- [ breadcrumb ] end -->
  <div class="row">
    <!-- [ registrar_trabajador ] start -->
    <div class="col-md-2">
      <div class="chat-avtar d-inline-flex mx-auto">
        <img class="img-radius img-fluid img-thumbnail"
             v-if="nuevoTrabajador.fotoPerfil"
             :src="nuevoTrabajador.fotoPerfil" style="width:200px; height: 200px"
             alt="Foto de perfil">
        <img class="rounded-circle img-fluid img-thumbnail"
             v-else
             src="../../assets/images/avatar.png">
        <i class="chat-badge bg-success me-2 mb-2"></i>
      </div>
      
    </div>
    <div class="col-md-5">
      <div class="card">
        <div class="card-header f-20 text-primary">
          <i class="fas fa-chevron-right m-r-10"></i> Datos Personales
        </div>
        <div class="card-body">
          <div class="mb-2">
            <label class="form-label">DNI</label>
            <input type="text" v-model="nuevoTrabajador.dni" @input="onDniInput" maxlength="8" @change="onDniChange" class="form-control" placeholder="Ingresa su DNI">
            <ErrorMessage :error="errors.dni" />
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <label class="form-label">Nombre</label>
              <input type="text" v-model="nuevoTrabajador.nombre" class="form-control" placeholder="Ingresa su Nombre">
              <ErrorMessage :error="errors.nombre" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Apellido Paterno</label>
              <input type="text" v-model="nuevoTrabajador.apePaterno" class="form-control" placeholder="Ingresa Apellido Paterno">
              <ErrorMessage :error="errors.apePaterno" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Apellido Materno</label>
              <input type="text" v-model="nuevoTrabajador.apeMaterno" class="form-control" placeholder="Ingresa Apellido Materno">
              <ErrorMessage :error="errors.apeMaterno" />
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label">Género</label>
            <div class="d-flex mb-1">
              <input id="generoMasculino" v-model="nuevoTrabajador.genero" type="radio" class="btn-check" value="M">
              <label class="btn btn-outline-secondary b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="generoMasculino">Masculino</label>
              <input id="generoFemenino" v-model="nuevoTrabajador.genero" type="radio" class="btn-check" value="F">
              <label class="btn btn-outline-secondary b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="generoFemenino">Femenino</label>
            </div>
            <ErrorMessage :error="errors.genero" />
          </div>
      <!-- --------------------------------------------------------------------------- -->
          <!-- <div class="mb-2">
            <label class="form-label">Función:</label>
            <select v-model="trabajador.area_id" class="form-select">
              <option value="Jefe">Jefe</option>
              <option value="Asistente Administrativo(a)">Asistente Administrativo</option>
              <option value="Secretaria(o)">Secretaria(o)</option>
            </select>
            <ErrorMessage :error="errors.cargo" />
          </div> -->
          <!-- --------------------------------------------------------------------------- -->

          <div class="row mb-2">
            <div class="col-md-6">
              <label class="form-label">Cargo</label>
              <select v-model="nuevoTrabajador.cargo" class="form-select">
                <option value="" disabled>Selecciona un cargo</option>
                <option v-for="cargoItem in cargo" :key="cargoItem" :value="cargoItem">{{ cargoItem }}</option>
              </select>
              <ErrorMessage :error="errors.cargo" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Oficina</label>
              <select v-model="nuevoTrabajador.oficinaId" class="form-select">
                <option>Elegir</option>
                <option v-for="oficina in listaOficinas"  :key="oficina.id" :value="oficina.id">{{oficina.nombre}}</option>
              </select>
              <ErrorMessage :error="errors.oficinaId" />
            </div>
          </div>
          <!-- ------------------------------------------------- -->
<!-- 
          <div class="mb-2">
            <label class="form-label">Tipo Usuario:</label>
            <select v-model="trabajador.rol_id" class="form-select">
              <option value="1">Administrador</option>
              <option value="2">Mesa de Partes</option>
              <option value="3">Trámite Documentario</option>
              <option value="4">Licecias</option>
            </select>
            <ErrorMessage :error="errors.cargo" />
          </div> -->
        <!-- ----------------------------------------------------- -->

          <div class="row mb-2">
            <div class="col-md-6">
              <label class="form-label">Fecha Nacimiento</label>
              <input class="form-control" v-model="nuevoTrabajador.fechaNacimiento" type="date">
              <ErrorMessage :error="errors.fechaNacimiento" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha de Contratación</label>
              <input class="form-control" v-model="nuevoTrabajador.fechaIngreso" type="date" >
              <ErrorMessage :error="errors.fechaIngreso" />
            </div>
          </div>
              <div class="row mb-2">
            <div class="col-md-6">
              <label class="form-label">Celular</label>
              <input type="text" v-model="nuevoTrabajador.celular" @input="onCelularInput" class="form-control" placeholder="Ingresa tu celular">
              <ErrorMessage :error="errors.celular" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Correo</label>
              <input type="email" v-model="nuevoTrabajador.email" class="form-control" placeholder="Ingresa tu email">
              <ErrorMessage :error="errors.email" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-5">
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
              :archivoTemporal="{ id: 0, nombrefile: '', url: nuevoTrabajador.fotoPerfil || '', documento_id: '', fecharegistro: '' }"
              :resetTrigger="resetTrigger"
              @archivoSubido="(archivo) => { nuevoTrabajador.fotoPerfil = archivo.url }"
            /> -->
            <FileUploader 
                  titulo="Fotografia perfil"
                  elementoLoader="loaderFotoPerfil"
                  tipoArchivo="fotografia"
                  :archivoTemporal="archivoTrabajador.ArchivoTemporal.value"
                  :resetTrigger="resetTrigger"
                  @archivoSubido="(archivo:Adjunto) => nuevoTrabajador.fotoPerfil = archivo.url"
                  @uploadingStatus="archivoTrabajador.isUploading.value = $event"
                />
            <ErrorMessage :error="errors.fotoPerfil" />
          </div>
          <button :disable="isUploading" @click="guardarTrabajador" class="btn btn-primary mb-0">Guardar Trabajador</button>
          <button @click="cancelar" class="btn btn-danger mx-2 mb-0">Cancelar</button>

        </div>
      </div>
    </div>
    <!-- [ registrar_trabajador ] end -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Breadcrumb, ErrorMessage } from '../../components/_components';
import FileUploader from '../../components/FileUploader_miniatura.vue';
import { cargo, Alerta } from '../../utils/_utils';
import { useTrabajador, Sunat, useOficina, useSubirArchivo } from '../../composables/_composables';
import { Adjunto } from '../../interfaces/_interface';
import NProgress from 'nprogress'; // Importa nprogress
import 'nprogress/nprogress.css'; // Importa el estilo de nprogress

interface Link {
  path: string;
  name: string;
}
export default defineComponent({
  components: {
    Breadcrumb, ErrorMessage, FileUploader
  },
  setup() {
    const breadcrumbRoutes = ref<Link[]>([
      
      { path: '/office/trabajador', name: 'Trabajador' },
      { path: '', name: 'Registrar Trabajador' },
    ]);
    const route = useRoute();
    const router = useRouter();
    const isUploading = ref(false); // Deshabilitar el botón
    const { nuevoTrabajador, errors, Crear_Trabajador, isLoading_Trabajador } = useTrabajador();
    const { listaOficinas, cargarOficinas } = useOficina();

    // Manejo de archivos (fotografía de perfil)
    const archivoTrabajador = useSubirArchivo("loadingfile", "fotografia");
    
    const { Validar_DNI, PersonaData } = Sunat();
      onMounted(async () => {
      cargarOficinas();
    });

        // API RENIEC
    // ----------------------------------------------------------
    const onDniChange = async () => {
      try {
        NProgress.start(); 
        if (nuevoTrabajador.value.dni.length == 8) {
          const respuesta = await Validar_DNI(nuevoTrabajador.value.dni);
          if(respuesta){
            nuevoTrabajador.value.nombre = respuesta.nombres;
            nuevoTrabajador.value.apePaterno = respuesta.apellidoPaterno;
            nuevoTrabajador.value.apeMaterno = respuesta.apellidoMaterno;
          }
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del trabajador.');
      } finally {
        NProgress.done(); 
      }
    }; 
    const cancelar = () => {
      router.push('/office/trabajador');
    };   

    const onFileSelected_FotoPerfil = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          nuevoTrabajador.value.fotoPerfil = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const guardarTrabajador = async () => {
      try {
        isUploading.value = true;
        NProgress.start();

        const dataToSend = {
          ...nuevoTrabajador.value,
          fechaNacimiento: nuevoTrabajador.value.fechaNacimiento
            ? new Date(nuevoTrabajador.value.fechaNacimiento).toISOString()
            : '',
          fechaIngreso: nuevoTrabajador.value.fechaIngreso
            ? new Date(nuevoTrabajador.value.fechaIngreso).toISOString()
            : ''
        };
        // Primero crear el trabajador
        const resultado = await Crear_Trabajador(dataToSend);
        if (resultado && resultado.success) {
          Alerta.Sucessfull('Éxito', 'Trabajador registrado correctamente');
          router.push('/office/trabajador');
        } else {
          Alerta.Advertencia('Advertencia', resultado?.message || 'No se pudo guardar el trabajador.');
        }
      } catch (error: any) {
        console.error('Error al guardar trabajador:', error);
        Alerta.Advertencia('Advertencia', error?.message || 'No se pudo guardar el trabajador.');
      } finally {
        isUploading.value = false;
        NProgress.done();
      }
    };

    // Reset trigger para fileuploader
    const resetTrigger = ref(0);

    // Validación de solo números y longitud
    const onDniInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      if (value.length > 8) value = value.slice(0, 8);
      nuevoTrabajador.value.dni = value;
    };

    const onCelularInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, '');
      nuevoTrabajador.value.celular = value;
    };

    return {
      isUploading,
      listaOficinas,
      nuevoTrabajador,
      Crear_Trabajador,
      cancelar,
      onDniChange,
      onDniInput,
      onCelularInput,
      breadcrumbRoutes,
      // registrar_FotoPerfil,
      errors,
      cargo,
      guardarTrabajador,
      resetTrigger,
      archivoTrabajador
    };
  },
});
</script>


<style lang="scss" scoped>
.text-amarillo {
  color: rgb(217, 144, 4) !important;
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