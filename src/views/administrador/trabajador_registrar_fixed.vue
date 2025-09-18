<template>
  <!-- [ breadcrumb ] start -->
  <Breadcrumb :links="breadcrumbRoutes" />
  <!-- [ breadcrumb ] end -->
  <div class="row">
    <!-- [ registrar_trabajador ] start -->
    <div class="col-md-2">
      <div class="chat-avtar d-inline-flex mx-auto">
        <img class="img-radius img-fluid img-thumbnail"
             v-if="trabajador.fotoPerfil"
             :src="trabajador.fotoPerfil" style="width:200px; height: 200px"
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
            <input type="text" v-model="trabajador.dni" @change="onDniChange" class="form-control" placeholder="Ingresa su DNI">
            <ErrorMessage :error="errors.dni" />
          </div>
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input type="text" v-model="trabajador.nombre"  class="form-control" placeholder="Ingresa su Nombre">
            <ErrorMessage :error="errors.nombre" />
          </div>
          <div class="mb-2">
            <label class="form-label">Apellido Paterno</label>
            <input type="text" v-model="trabajador.apePaterno"  class="form-control" placeholder="Ingresa sus Apellidos">
            <ErrorMessage :error="errors.apePaterno" />
          </div>
          <div class="mb-2">
            <label class="form-label">Apellido Materno</label>
            <input type="text" v-model="trabajador.apeMaterno"  class="form-control" placeholder="Ingresa sus Apellidos">
            <ErrorMessage :error="errors.apeMaterno" />
          </div>
          <div class="mb-2">
          <label class="form-label">Genero</label>
          <select v-model="trabajador.genero" class="form-select">
            <option value="" disabled>Selecciona uno</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <ErrorMessage :error="errors.genero" />
        </div>

          <div class="mb-2">
            <label class="form-label">Oficina</label>
            <select v-model="trabajador.oficinaId" class="form-select">
              <option>Elegir</option>
              <option v-for="oficina in listaOficinas"  :key="oficina.id"
                     :value="oficina.id">{{oficina.nombre}}</option>
            </select>
            <ErrorMessage :error="errors.oficinaId" />
          </div>

        <div class="mb-2">
          <label class="form-label">Cargo</label>
          <select v-model="trabajador.cargo" class="form-select">
            <option value="" disabled>Selecciona un cargo</option>
            <option v-for="cargo in cargo" :key="cargo" :value="cargo">{{ cargo }}</option>
          </select>
          <ErrorMessage :error="errors.cargo" />
        </div>

        <div class="mb-2">
            <label class="form-label">Fecha Nacimiento</label>
            <input class="form-control" v-model="trabajador.fechaNacimiento" type="date">
            <ErrorMessage :error="errors.fechaNacimiento" />
          </div>

          <div class="mb-2">
            <label class="form-label">Fecha de Contratación</label>
            <input class="form-control" v-model="trabajador.fechaIngreso" type="date" >
            <ErrorMessage :error="errors.fechaIngreso" />
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
            <label class="form-label">Celular</label>
            <input type="text" v-model="trabajador.celular" class="form-control" placeholder="Ingresa tu celular">
            <ErrorMessage :error="errors.celular" />
          </div>
     
          <div class="mb-2">
            <label class="form-label">Correo</label>
            <input type="email" v-model="trabajador.email" class="form-control" placeholder="Ingresa tu email">
            <ErrorMessage :error="errors.email" />
          </div>
          <div class="mb-2">
            <label class="form-label">Fotografía perfil</label>
            <div class="file-input-wrapper w-100">
              <input type="file" @change="onFileSelected_FotoPerfil" class="file-input">
              <div class="custom-file-label">
                  <img class="img-fluid wid-150 m-auto img-thumbnail "
                  v-if="trabajador.fotoPerfil" :src="trabajador.fotoPerfil" />
                  <div  v-if="trabajador.fotoPerfil" Class="f-12 f-w-600">Fotografía Cargada</div>
                  <h5 class="pt-3 text-dark">Seleccione un archivo</h5>
              </div>
            <ErrorMessage :error="errors.fotoPerfil" />
          </div>
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
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Breadcrumb, ErrorMessage } from '../../components/_components';
import { cargo, Alerta } from '../../utils/_utils';
import { useTrabajador, Sunat, useOficina } from '../../composables/_composables';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface Link {
  path: string;
  name: string;
}

export default defineComponent({
  components: {
    Breadcrumb, ErrorMessage
  },
  setup() {
    const breadcrumbRoutes = ref<Link[]>([
      { path: '/office/trabajador', name: 'Trabajador' },
      { path: '', name: 'Registrar Trabajador' },
    ]);
    
    const router = useRouter();
    
    // Estados
    const isUploading = ref(false);
    const file_img = ref<File | null>(null);
    
    // Composables
    const { nuevoTrabajador: trabajador, errors, Crear_Trabajador, registrar_FotoPerfil } = useTrabajador();
    const { listaOficinas, cargarOficinas } = useOficina();
    const { Validar_DNI } = Sunat();
    
    onMounted(async () => {
      cargarOficinas();
    });

    // API RENIEC
    const onDniChange = async () => {
      try {
        NProgress.start(); 
        if (trabajador.value.dni.length == 8) {
          const respuesta = await Validar_DNI(trabajador.value.dni);
          if(respuesta){
            trabajador.value.nombre = respuesta.nombres;
            trabajador.value.apePaterno = respuesta.apellidoPaterno;
            trabajador.value.apeMaterno = respuesta.apellidoMaterno;
          }
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del trabajador.');
      } finally {
        NProgress.done(); 
      }
    };

    // Manejo de archivos
    const onFileSelected_FotoPerfil = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        file_img.value = target.files[0];
        // Crear una URL temporal para mostrar la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            trabajador.value.fotoPerfil = e.target.result as string;
          }
        };
        reader.readAsDataURL(target.files[0]);
      }
    };
    
    // Guardar trabajador
    const guardarTrabajador = async () => {
      try {
        isUploading.value = true;
        
        // Primero subir la foto si existe
        if (file_img.value) {
          await registrar_FotoPerfil();
        }
        
        // Crear el trabajador
        const success = await Crear_Trabajador();
        if (success) {
          Alerta.Sucessfull('Éxito', 'Trabajador registrado correctamente');
          router.push('/office/trabajador');
        }
      } catch (error) {
        Alerta.Error('Error', 'Error al registrar el trabajador');
      } finally {
        isUploading.value = false;
      }
    };
    
    const cancelar = () => {
      router.push('/office/trabajador');
    };

    return {
      isUploading,
      listaOficinas,
      trabajador,
      Crear_Trabajador,
      cancelar,
      onDniChange,
      breadcrumbRoutes,
      registrar_FotoPerfil,
      errors,
      cargo,
      onFileSelected_FotoPerfil,
      guardarTrabajador
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
