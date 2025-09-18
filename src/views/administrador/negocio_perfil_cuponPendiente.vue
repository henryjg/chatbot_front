<template>
  <CardLayout :title="'Cupones Pendientes'" :clase="'text-blue-900'" :clasehead="'bg-green-900 border-0 '" class="pt-1">
    <template #default>
      <Divloading v-if="isloading"/>
      <div v-else>
        <DataTablePaginated
          :headers="headers"
          :items="listaCupones"
          :paginationInfo="paginacionInfo"
          :searchTerm="busqueda"
          :perPage="registrosPorPagina"
          :currentPage="paginaActual"
          :loading="cargando"
          :clasehead="'bg-info-100'"
          searchPlaceholder="Buscar cupones..."
          @search="handleSearch"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
          @clear-search="handleClearSearch"
        >
           <template #default="{ item, index }">
            <tr>
              <td>{{ (paginaActual - 1) * registrosPorPagina + index + 1 }}</td>
                <td class="text-truncate">{{ item.ofertaNombre }}</td>
                <td class="text-truncate">
                  {{ item.nombreBeneficiario || '-'  }}
                  <span v-if="item.esfamiliar==='SI'"
                    class="badge rounded-pill btn-light-warning py-1 px-2">Familiar</span>
                </td>
                <td class="text-truncate">{{ item.tipoUsuario }}</td>
              <td v-if="item.tipoUsuario==='Cliente'" class="text-danger text-truncate">
                  {{ item.tipoDescuento === 'Porcentual' ? item.valordsctoCliente + '%' : item.valordsctoCliente }}
                </td>
                <td v-if="item.tipoUsuario==='Trabajador'" class="text-danger text-truncate">
                  {{ item.tipoDescuento === 'Porcentual' ? item.valordsctoTrabajador + '%' : item.valordsctoTrabajador }}
                </td>
                 <td  class="px-2 mx-0 text-center text-wrap">
                  <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_sola(item.fecha_inicio) }}</p>
                  <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_horasola(item.fecha_inicio) }}</p>
                </td>
                <!-- <td class="text-truncate">{{ FormatFecha.fecha_dd_mm_yyyy(item.fecha_inicio) }}</td> -->
                <td class="text-truncate">{{ getEstado(item) }}</td>
                <!-- <td  class="px-2 mx-0 text-center text-wrap">
                  <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_sola(item.fecha_uso) }}</p>
                  <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_horasola(item.fecha_uso) }}</p>
                </td> -->
                <!-- <td class="text-truncate">{{ item.fecha_uso!=='0001-01-01T00:00:00' ? FormatFecha.fecha_dd_mm_yyyy(item.fecha_uso) : '-' }}</td> -->
                <td class="text-truncate">
                  <span v-if="item.observacionNegocio" class="text-warning">
                    <i class="fas fa-exclamation-circle"></i>
                  </span>
                </td>
                <td class="text-truncate">
                  <span v-if="item.observacionCliente" class="text-info">
                    <i class="fas fa-info-circle"></i>
                  </span>
                </td>
              <td>
                <button @click="abrirModal(item)" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCanjearCupon">Cerrar</button>
              </td>
            </tr>
          </template>
        </DataTablePaginated>
      </div>
    </template>
  </CardLayout>

  <!-- Modal Canjear Cupon -->
  <div class="modal fade" id="modalCanjearCupon" tabindex="-1" aria-labelledby="modalCanjearCuponLabel" 
            aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title" id="modalCanjearCuponLabel">Cerrar Cupón por USO</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cerrarModal"></button>
        </div>
        <div class="modal-body ">
          <div class="row">
              <div class="col-lg-4 ">
                  <Vue3Lottie :animationData="ticket" :height="150" :width="150" />
              </div>
              <div class="col-lg-8 ">
                  <p>Usuario(a): <strong>{{ cuponSeleccionado?.nombreBeneficiario || '-' }}</strong></p>
                  <p>Oferta:  <strong>{{ cuponSeleccionado?.ofertaNombre || '-' }}</strong>.</p>
                  <div class="mb-3">
                    <label for="observacionNegocio" class="form-label">
                       Observación</label>
                    <textarea id="observacionNegocio" class="form-control" rows="4" v-model="observacionNegocio"></textarea>
                  </div>
              </div>
          </div>
          
        </div>
        <div class="modal-footer py-1">
          <button type="button" class="btn btn-success btn-sm" @click="canjearCupon">
            <i class="fa fa-check p-r-5"></i> Confirmar Cierre</button>
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" @click="cerrarModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { DataTable } from '../../components/_components';
import { CardLayout, DataTablePaginated, Divloading } from '../../components/_components';
import { ref, onMounted, defineComponent } from 'vue';
import { useCupones } from '../../composables/useCupones';
import { useAuthStore } from '../../stores/authStore';
// import { Divloading } from '../../components/_components';
import { FormatFecha } from '../../utils/FormatFecha';
import { Cupones } from '../../interfaces/cupon.interface';
import { Modal } from 'bootstrap';
import { Vue3Lottie } from 'vue3-lottie';
import ticket from '../../assets/lotties/ticket_yellow_dark.json';
import { PaginacionInfo } from '../../interfaces/_interface';

export default defineComponent({
  components: {
    CardLayout,
    DataTablePaginated,
    Divloading,
    Vue3Lottie
  },
  setup() {
  const { listaCupones, cerrarCuponPorUso, cuponSeleccionado, cuponesPendientes, Listar_CuponesNegocio_Paginados_Pendientes } = useCupones();
    const authStore = useAuthStore();
    const isloading = ref(true);
    const observacionNegocio = ref('');

       // Filtro de fecha
    const filtroFecha = ref({
      fechaInicio: '',
      fechaFin: '',
      mes: '',
      semana: '',
      anio: ''
    });

      // Estados para paginación y búsqueda
       const paginacionInfo = ref<PaginacionInfo | null>(null);  
        const paginaActual = ref(1);
        const registrosPorPagina = ref(25);
        const busqueda = ref('');
        const cargando = ref(false);
        const totalCuponesP = ref(0);

    const headers = ref([
    { text: '#', width: '5%', key: 'index' },
      { text: 'Oferta', width: '15%', key: 'ofertaNombre' },
      { text: 'Beneficiario', width: '15%', key: 'nombreBeneficiario' },
      { text: 'Tipo', width: '10%', key: 'tipoUsuario' },
      { text: 'Dscto', width: '10%', key: '' },
      { text: 'Solicitado el', width: '15%', key: 'fecha_uso' },
      { text: 'Estado', width: '10%', key: 'estado' },
      // { text: 'Utilizado', width: '15%', key: 'fecha_uso' },
      { text: 'ON', width: '3%', key: 'observacion_Negocio' },
      { text: 'OC', width: '3%', key: 'observacion_Cliente' },
      { text: 'Ver', width: '3%', key: 'detalle' },

    ]);



    // Función para cargar cupones pendientes usando el endpoint paginado
    const cargarCuponesPendientes = async () => {
      cargando.value = true;
      isloading.value = true;
      const idNegocio = Number(authStore.usuarioLogueado?.id);
      await Listar_CuponesNegocio_Paginados_Pendientes(
        idNegocio,
        paginaActual.value,
        registrosPorPagina.value,
        busqueda.value
      ).then((response: any) => {
        listaCupones.value = response?.data?.data || [];
        const pag = response?.data?.pagination;
        paginacionInfo.value = {
          pagina_actual: pag.currentPage,
          registros_por_pagina: pag.pageSize,
          total_registros: pag.totalItems,
          total_paginas: pag.totalPages,
          pagina_anterior: pag.hasPreviousPage ? pag.currentPage - 1 : null,
          pagina_siguiente: pag.hasNextPage ? pag.currentPage + 1 : null,
          paginas_visibles: [],
          desde: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[0]) : 0,
          hasta: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[1]) : 0
        };
      }).finally(() => {
        cargando.value = false;
        isloading.value = false;
      });
    };

    const abrirModal = (cupon: Cupones) => {
      cuponSeleccionado.value = cupon;
      observacionNegocio.value = cupon.observacionNegocio || '';
      const modalElement = document.getElementById('modalCanjearCupon');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const getEstado = (cupon: Cupones) => {
      const fechaFin = new Date(cupon.fecha_fin);
      const fechaActual = new Date();
      if (fechaFin < fechaActual && !cupon.fecha_uso && !cupon.fecha_inicio) {
        return 'Vencido';
      }
      return cupon.estado;
    };
    const cerrarModal = () => {
      const modalElement = document.getElementById('modalCanjearCupon');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
    };

    const canjearCupon = async () => {
      if (cuponSeleccionado.value) {
        cuponSeleccionado.value.observacionNegocio = observacionNegocio.value;
        await cerrarCuponPorUso(cuponSeleccionado.value.id, observacionNegocio.value);
        // Solo cerrar el modal, la recarga ya se hace en cerrarCuponPorUso
        cerrarModal();
      }
    };

    onMounted(async () => {
      await cargarCuponesPendientes();
    });

    const buscarPorFecha = async () => {
      cargando.value = true;
      isloading.value = true;
      const idNegocio = Number(authStore.usuarioLogueado?.id);
      await Listar_CuponesNegocio_Paginados_Pendientes(
        idNegocio,
        paginaActual.value,
        registrosPorPagina.value,
        busqueda.value,
        undefined,
        undefined,
        undefined,
        filtroFecha.value.fechaInicio || undefined,
        filtroFecha.value.fechaFin || undefined,
        undefined,
        filtroFecha.value.mes ? Number(filtroFecha.value.mes) : undefined,
        filtroFecha.value.semana ? Number(filtroFecha.value.semana) : undefined,
        filtroFecha.value.anio ? Number(filtroFecha.value.anio) : undefined
      ).then((response: any) => {
        listaCupones.value = response?.data?.data || [];
        const pag = response?.data?.pagination;
        paginacionInfo.value = {
          pagina_actual: pag.currentPage,
          registros_por_pagina: pag.pageSize,
          total_registros: pag.totalItems,
          total_paginas: pag.totalPages,
          pagina_anterior: pag.hasPreviousPage ? pag.currentPage - 1 : null,
          pagina_siguiente: pag.hasNextPage ? pag.currentPage + 1 : null,
          paginas_visibles: [],
          desde: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[0]) : 0,
          hasta: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[1]) : 0
        };
      }).finally(() => {
        cargando.value = false;
        isloading.value = false;
      });
    };

      // Handlers para paginación y búsqueda
    const handleSearch = (args: { term: string; field: string }) => {
      busqueda.value = args.term;
      paginaActual.value = 1;
      cargarCuponesPendientes();
    };
    const handlePageChange = (page: number) => {
      paginaActual.value = page;
      cargarCuponesPendientes();
    };
    const handlePerPageChange = (perPage: number) => {
      registrosPorPagina.value = perPage;
      paginaActual.value = 1;
      cargarCuponesPendientes();
    };
    const handleClearSearch = () => {
      busqueda.value = '';
      paginaActual.value = 1;
      cargarCuponesPendientes();
    };

    return {
  headers,
  listaCupones,
      isloading,
  canjearCupon,
  cargarCuponesPendientes,
      FormatFecha,
      cuponSeleccionado,
      abrirModal,
      cerrarModal,
      observacionNegocio,
      getEstado,
      ticket,
  busqueda,
  paginacionInfo,
  registrosPorPagina,
  paginaActual,
  cargando,
  handleSearch,
  handlePageChange,
  handlePerPageChange,
  handleClearSearch,
  buscarPorFecha,
    };
  },
});
</script>
<style scoped>
.text-sentence {
  text-transform: lowercase; /* Capitaliza la primera letra de cada palabra */
}

.text-sentence::first-letter {
  text-transform: uppercase; /* Asegura que solo la primera letra de la oración esté en mayúscula */
}
.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Aspect ratio 4:3 */
  overflow: hidden;
  background-color: #ffffff; /* Background color while loading */
  background: url("@/assets/inmdefault.jpg");
  background-size: cover;
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 60%;
  object-fit: cover;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -25px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #c9c8c8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>