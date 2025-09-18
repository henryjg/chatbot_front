<template>
  <div class="row pt-1 pb-3 border-top">
    <div class="col-lg-12">
      <div class="container">
        <div class="row">
          <div class="d-flex justify-content-between">
            <span class="f-14 f-w-500 mt-1 bg-success text-white px-3 text-gray-300 py-1 rounded-top-2">1. Datos del Negocios:</span>
          </div>
          <div class="col-12 p-4 b-success rounded-2 shadow-sm">
            <!-- ---------------------------- -->
            <div class="row">
              <div class="col-3">
                <div class="mb-2">
                  <label class="form-label text-primary">RUC</label>
                  <input type="text" v-model="negocio.ruc" @change="onRucChange" class="form-control" placeholder="RUC 11 dígitos">
                  <ErrorMessage :error="errors.ruc" />
                </div>
              </div>
              <div class="col-5">
                <div class="mb-2">
                  <label class="form-label text-primary">Razón Social</label>
                  <input type="text" v-model="negocio.razonSocial" class="form-control">
                  <ErrorMessage :error="errors.razonSocial" />
                </div>
              </div>
              <div class="col-4">
                <div class="mb-2">
                  <label class="form-label text-primary">Nombre Comercial</label>
                  <input type="text" v-model="negocio.nombreComercial" class="form-control">
                  <ErrorMessage :error="errors.nombreComercial" />
                </div>
              </div>
            </div>
            <!-- ------- -->
            <div class="row">
              <div class="col-3 mb-2">
                <label class="form-label text-primary">DNI Representante</label>
                <input type="text" v-model="negocio.dniRepresentante" @change="validarDNI" class="form-control" placeholder="Ingresa 8 dígitos DNI">
                <ErrorMessage :error="errors.dniRepresentante" />
              </div>
              <div class="col-5 mb-2">
                <label class="form-label text-primary">Nombre del Representante</label>
                <input type="text" v-model="negocio.nombreRep" class="form-control" placeholder="Ingresa el Nombre">
                <ErrorMessage :error="errors.nombreRep" />
              </div>
              <div class="col-4 mb-2">
                <label class="form-label text-primary">Celular</label>
                <input type="text" v-model="negocio.celular" class="form-control">
                <ErrorMessage :error="errors.celular" />
              </div>
            </div>
            <!-- ------- -->
            <div class="row">
              <div class="col-5 mb-2">
                <label class="form-label text-primary">Correo</label>
                <input type="email" v-model="negocio.correo" class="form-control">
                <ErrorMessage :error="errors.correo" />
              </div>
            </div>
            <!-- ------- -->
          </div>
        </div>
        <!-- ---------------------------- -->
        <hr class="mb-4 my-1 b-gray">
        <!-- ---------------------------- -->
        <div class="row">
          <div class="col-12">
            <div class="alert alert-danger">
              <i class="fa fa-exclamation-triangle"></i>
              Debe ingresar todos los campos obligatorios:
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <button @click="registrarNegocio" class="btn btn-lg btn-success mt-3 m-auto mx-3">
              <i class="ph-duotone ph-plus-circle p-r-5"></i>Registrar Negocio
            </button>
            <router-link :to="{ name: 'ListarNegocios'}" class="mx-1">
              <button class="btn btn-lg btn-danger mt-3 m-auto">
                <i class="fas fa-times p-r-5"></i>Cancelar
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import NProgress from 'nprogress';
import { Breadcrumb, ErrorMessage } from '../../components/_components';
import { Sunat, useCategorias, useValidaNegocio, useNegocios } from '../../composables/_composables';
import { Alerta, FormatFecha } from '../../utils/_utils';
import { CrearNegocio, initializeCrearNegocio } from '../../interfaces/negocio.interface';

interface Link {
  path: string;
  name: string;
}

export default defineComponent({
  components: {
    Breadcrumb,
    ErrorMessage
  },
  setup() {
    const { Listar_Categorias, listaCategorias } = useCategorias();
    const { registrarNegocio} = useNegocios();
    const { validarFormulario, errors } = useValidaNegocio();
    const router = useRouter();
    const { Validar_RUC, Validar_DNI, EmpresaData, PersonaData } = Sunat();
    const breadcrumbRoutes = ref<Link[]>([
      { path: '/office/negocios_lista', name: 'Negocios' },
      { path: '/office/CrearNegocio', name: 'Registro de Negocios' },
    ]);

    const negocio = ref<CrearNegocio>(initializeCrearNegocio());    
    
    onMounted(async () => {
      Listar_Categorias();
    });    
    
    
    const validarDNI = async () => {
      const Respuesta = await Validar_DNI(negocio.value.dniRepresentante);
      if (Respuesta) {
        PersonaData.value = Respuesta;
        negocio.value.nombreRep = `${PersonaData.value.nombres} ${PersonaData.value.apellidoPaterno} ${PersonaData.value.apellidoMaterno}`;
      }
    };    
    
    const onRucChange = async () => {
      try {
        NProgress.start();
        if (negocio.value.ruc.length === 11) {
          const Respuesta = await Validar_RUC(negocio.value.ruc);
          if (Respuesta) {
            EmpresaData.value = Respuesta;
            negocio.value.razonSocial = EmpresaData.value.razonSocial;
          }
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del negocio.');
      } finally {
        NProgress.done();
      }
    };


    return {
      negocio,
      errors,
      registrarNegocio,
      validarDNI,
      onRucChange,
      breadcrumbRoutes,
      FormatFecha,
      listaCategorias
    };
  }
});
</script>