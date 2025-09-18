<template>
  <form id="editFamiliarForm" method="post" action="#" onsubmit="return false;" class="pt-1">
    <div class="row">
      <div class="col-md-2">
        <div class="sticky-top mt-0 pt-0" style="top:74px">
          <Breadcrumb :links="breadcrumbRoutes" />
          <img src="../../assets/images/avatar.png" class="w-100">
          <div class="container text-center">
            <button @click="cancelar" class="btn btn-danger mt-2 mb-1 w-100">
              <i class="ti ti-arrow-left"></i> Volver
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-10">
        <div class="card">
          <div class="card-header f-20 text-primary">
            <i class="fas fa-chevron-right m-r-10"></i> Editar Familiar
          </div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-md-4">
                <label class="form-label">DNI</label>
                <input type="text" v-model="familiar.dni" class="form-control" placeholder="Ingresa el DNI">
                <!-- <ErrorMessage :error="errors.dni" /> -->
              </div>
              <div class="col-md-4">
                <label class="form-label">Nombre</label>
                <input type="text" v-model="familiar.nombre" class="form-control" placeholder="Ingresa el nombre">
                <!-- <ErrorMessage :error="errors.nombre" /> -->
              </div>
              <div class="col-md-4">
                <label class="form-label">Apellido Paterno</label>
                <input type="text" v-model="familiar.apePaterno" class="form-control" placeholder="Ingresa el apellido paterno">
                <!-- <ErrorMessage :error="errors.apePaterno" /> -->
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4">
                <label class="form-label">Apellido Materno</label>
                <input type="text" v-model="familiar.apeMaterno" class="form-control" placeholder="Ingresa el apellido materno">
                <!-- <ErrorMessage :error="errors.apeMaterno" /> -->
              </div>
              <div class="col-md-4">
                <label class="form-label">Correo</label>
                <input type="email" v-model="familiar.correo" class="form-control" placeholder="Ingresa el correo">
                <!-- <ErrorMessage :error="errors.correo" /> -->
              </div>
              <div class="col-md-4">
                <label class="form-label">Teléfono</label>
                <input type="text" v-model="familiar.telefono" class="form-control" placeholder="Ingresa el teléfono">
                <!-- <ErrorMessage :error="errors.telefono" /> -->
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4">
                <label class="form-label">Género</label>
                <select v-model="familiar.genero" class="form-select">
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                <!-- <ErrorMessage :error="errors.genero" /> -->
              </div>
            </div>
            <button @click.prevent="guardarCambios" class="btn btn-primary">Guardar Cambios</button>
            <button @click="cancelar" class="btn btn-danger mx-2">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Breadcrumb, ErrorMessage } from '../../components/_components';
import { useFamiliars } from '../../composables/_composables';

export default defineComponent({
  components: { Breadcrumb, ErrorMessage },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { familiar, Obtener_Familiar, Actualizar_Familiar } = useFamiliars();
    const idFamiliar = Number(route.params.id);

       const isUploading = ref(false);

    const breadcrumbRoutes = ref([
      { path: '/office/familiar', name: 'Familiar' },
      { path: '', name: 'Editar Familiar' },
    ]);

    const cancelar = () => {
      router.push('/office/familiar');
    };

    const guardarCambios = async () => {
   isUploading.value = true;
      try {
        // Prepara el payload solo con los campos requeridos
       
        await Actualizar_Familiar(idFamiliar);
        router.push('/office/familiar');
      } catch (error) {
        // Manejo de error
      } finally {
        isUploading.value = false;
      }
    };


    onMounted(async () => {
      await Obtener_Familiar(idFamiliar);
    });

    return {
      breadcrumbRoutes,
      familiar,
      // errors,
      guardarCambios,
      cancelar,
      Actualizar_Familiar
    };
  },
});
</script>

<style lang="scss" scoped>
/* Estilos opcionales */
</style>