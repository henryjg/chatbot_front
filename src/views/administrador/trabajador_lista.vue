<template>

  <!-- {{ ListaTrabajadores }} -->
  <CardLayout :title="'Trabajadores'" :clase="'text-info'" :clasehead="'bg-primary border-0'" class="pt-1">
    <template #buttons>
      <div class="d-flex columns justify-content-end ">
        <router-link to="/office/registrartrabajador" class="pc-link">
          <button type="button" class="btn btn-primary float-end py-1">
            <i class="fas fa-user-plus"></i> Agregar
          </button>
        </router-link>
        <button @click="" class="btn btn-blue b-dark btn-sm mx-1">
          <i class="ti ti-refresh"></i>
        </button>
        <button @click="resetear" class="btn btn-secondary btn-sm mx-1">
          <i class="fa fa-broom"></i>
        </button>
      </div>
    </template>
    <template #default>
      <DataTable
            :headers="headers"
            :items="ListaTrabajadores"
            :filterKeys="['foto', 'nombre', 'genero', 'fechaNacimiento', 'dni', 'celular', 'estado']"
            :clasehead="'bg-info-100'"
          >
      <template #default="{ item, index, currentPage, itemsPerPage }">
          <tr :id="'tr_trabajador_'+ (index+1)">
             <td class="text-sm">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <!-- <td class="px-0 text-sm">
              <div class="d-inline-block align-middle ">
                <div v-if="item.fotoPerfil" class="circular-div wid-60 hei-60">
                  <ImgLazy :src="item.fotoPerfil" aspectRatio="1 / 1" class="rounded-3"></ImgLazy>
                </div>
                <img v-else class="img-radius align-top m-r-15" style="width:100%" alt="User image"
                    src="/src/assets/images/avatar.png">
              </div>
            </td> -->
            <td class="text-wrap f-w-600 text-sm">
              {{ item.nombre }} {{ item.apellidos }}
            </td>
            <td class="text-center text-sm">
              <i :class="item.genero === 'Masculino' ? 'fas fa-male text-primary' : 'fas fa-female text-pink-600'" style="font-size: 1.5em;"></i>
            </td>
            <!-- <td class="text-wrap text-sm">{{  FormatFecha.fecha_dd_mm_yyyy(item.fechaNacimiento) }}</td> -->
            <td class="text-wrap text-sm">{{ item.dni }}</td>
            <!-- <td class="text-wrap text-sm">{{ getOficinaNombre(item.oficinaId) }}</td> -->
            <td class="text-wrap text-sm">
              {{ item.celular }}
              <a :href="`https://wa.me/+51${item.celular}`" target="_blank" rel="noopener" class="ms-2">
                <i class="fab fa-whatsapp text-success" style="font-size: 1.5em;"></i>
              </a>
            </td>
            <td class="text-wrap text-sm">
              <div class="form-check form-switch custom-switch-v1 mb-1">
                <!-- <input type="checkbox"  
                       class="form-check-input input-success" 
                       :id="`customswitch-${item.id}`" 
                       :checked="item.estado" 
                       :disabled="loadingStates[item.id]"
                       @change="cambiarEstado(item, ($event.target as HTMLInputElement)?.checked)" /> -->
                  <div v-if="loadingStates[item.id]" class="d-flex align-items-center me-2 position-absolute">
                    <span class="spinner-border spinner-border-sm text-info me-2 " role="status" aria-hidden="true"></span>
                  </div>
              </div>
            </td>
            <!-- <td class="text-wrap text-sm">{{ item.nroingresos }}</td> -->
            <!-- <td class="text-wrap text-sm">{{  FormatFecha.fecha_dd_mm_yyyy(item.lastconexion) }}</td>
            <td class="text-wrap text-sm">{{ item.nrocupones }}</td> -->
            <td class="text-sm">
              <router-link :to="{ name: 'editarTrabajador', params: { id: item.id } }" class="avtar avtar-xs btn btn-primary">
                <i class="ti ti-edit f-20"></i>
              </router-link>
              <button 
                type="button"
                @click="eliminarTrabajador(item.id)"
                class="avtar avtar-xs btn btn-danger"
                :disabled="item.nrocupones > 0"
                :title="item.nrocupones > 0 ? 'No se puede eliminar: tiene cupones asociados.' : 'Eliminar trabajador'"
              >
                <i class="ti ti-trash f-20"></i>
              </button>
              <!-- <router-link :to="{ name: 'TrabajadorDetalle', params: { id: item.id } }" class="avtar avtar-xs btn btn-info">
                <i class="ti ti-eye f-20"></i>
              </router-link> -->
            </td>
          </tr>
        </template>
      </DataTable>
    </template>
  </CardLayout>

  <!-- Modal Detalle Trabajador -->
  <!-- <modal-detalle-trabajador :trabajador="trabajadorSeleccionado" /> -->
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
// import { DOC_URL } from '../../config';
import { CardLayout, DataTable, ImgLazy } from '../../components/_components';
import { useTrabajador } from '../../composables/_composables';
import { FormatFecha } from '../../utils/_utils';
import type { Trabajador } from '../../interfaces/_interface';

export default {
  components: {
    CardLayout,
    DataTable,
    ImgLazy
  },
  setup() {
    // Composable y estados
  const { ListaTrabajadores,  isLoading_Trabajador, Listar_Trabajadores } = useTrabajador();
    // const { cargarOficinas, listaOficinas } = useOficina();
    const loadingStates = ref<{ [key: number]: boolean }>({});

    // Estados para paginación y búsqueda
    const ListaTrabajadoresPaginated = ref<any[]>([]);
    const paginacionInfo = ref<any>(null);
    const paginaActual = ref(1);
    const registrosPorPagina = ref(25);
    const busqueda = ref('');

    // Headers para DataTablePaginated
    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      // { text: '', width: '3%', key: 'foto' },
      { text: 'Nombres', width: '40%', key: 'nombre' },
      { text: 'Sexo', width: '20%', key: 'genero' },
      // { text: 'Cumpleaños', width: '10%', key: 'fechaNacimiento' },
      { text: 'DNI', width: '20%', key: 'dni' },
      { text: 'Celular', width: '20%', key: 'celular' },
      // { text: 'Estado', width: '7%', key: 'estado' },
      { text: 'Acciones', width: '10%', key: 'acciones' },
    ]);
    // Función resetear para limpiar búsqueda y recargar paginación
    const resetear = () => {
      busqueda.value = '';
      paginaActual.value = 1;
      // cargarTrabajadoresPaginados();
    };

    // Obtener nombre de oficina
    // const getOficinaNombre = (oficinaId: string) => {
    //   const oficina = listaOficinas.value.find((of: any) => String(of.id) === String(oficinaId));
    //   return oficina ? oficina.nombre : 'Ninguna';
    // };

    // Cargar trabajadores paginados
    // const cargarTrabajadoresPaginados = async () => {
    //   await Listar_Trabajadores_Paginados(
    //     paginaActual.value,
    //     registrosPorPagina.value,
    //     busqueda.value
    //   ).then((response: any) => {
    //     ListaTrabajadoresPaginated.value = response?.data?.data || [];
    //     const pag = response?.data?.pagination;
    //     paginacionInfo.value = {
    //       pagina_actual: pag.currentPage,
    //       registros_por_pagina: pag.pageSize,
    //       total_registros: pag.totalItems,
    //       total_paginas: pag.totalPages,
    //       pagina_anterior: pag.hasPreviousPage ? pag.currentPage - 1 : null,
    //       pagina_siguiente: pag.hasNextPage ? pag.currentPage + 1 : null,
    //       paginas_visibles: [],
    //       desde: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[0]) : 0,
    //       hasta: pag.itemsRange ? parseInt(pag.itemsRange.split('-')[1]) : 0
    //     };
    //   });
    // };

    // Nueva función para cambiar estado y refrescar la lista paginada
    // const cambiarEstado = async (trabajador: Trabajador, nuevoEstado: boolean) => {
    //   await cambiarEstadoOriginal(trabajador, nuevoEstado);
    //   await cargarTrabajadoresPaginados();
    // };

    // Eventos de paginación y búsqueda
    // const handleSearch = (args: { term: string; field: string }) => {
    //   busqueda.value = args.term;
    //   paginaActual.value = 1;
    //   cargarTrabajadoresPaginados();
    // };
    // const handlePageChange = (page: number) => {
    //   paginaActual.value = page;
    //   cargarTrabajadoresPaginados();
    // };
    // const handlePerPageChange = (perPage: number) => {
    //   registrosPorPagina.value = perPage;
    //   paginaActual.value = 1;
    //   cargarTrabajadoresPaginados();
    // };
    // const handleClearSearch = () => {
    //   busqueda.value = '';
    //   paginaActual.value = 1;
    //   cargarTrabajadoresPaginados();
    // };

    // Computed para cards resumen
    const totalTrabajadoresActivos = computed(() =>
      ListaTrabajadores.value.filter(t =>
        [true, 'Activo', 1].includes(t.estado)
      ).length
    );
    const totalTrabajadoresInactivos = computed(() =>
      ListaTrabajadores.value.filter(t =>
        [false, 'Inactivo', 0].includes(t.estado)
      ).length
    );

    // Función placeholder para eliminar trabajador
    const eliminarTrabajador = (id: number) => {
      console.log('Función eliminar trabajador no implementada para ID:', id);
      // TODO: Implementar funcionalidad de eliminación
    };


    // Inicializar
    onMounted(async () => {
      await Listar_Trabajadores();
      // await cargarOficinas();
      // await cargarTrabajadoresPaginados();
    });

    return {
      ListaTrabajadoresPaginated,
      paginacionInfo,
      paginaActual,
      registrosPorPagina,
      busqueda,
      headers,
      // getOficinaNombre,
      // cargarTrabajadoresPaginados,
      // handleSearch,
      // handlePageChange,
      // handlePerPageChange,
      // handleClearSearch,
      // ExportarExcelTrabajador,
      // Eliminar_Trabajador_Fila,
      // actualizarEstadoTrabajador,
      // cambiarEstado,
      loadingStates,
      isLoading_Trabajador,
      FormatFecha,
      // listaOficinas,
      // cargarOficinas,
      totalTrabajadoresActivos,
      totalTrabajadoresInactivos,
      resetear,
      ListaTrabajadores,
      eliminarTrabajador
    };
  }
};
</script>

<style lang="scss" scoped>
/* Estilos opcionales para el input de búsqueda y paginación */
</style>
