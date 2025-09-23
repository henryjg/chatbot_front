<template>
  <CardLayout :title="'Servicios'" :clase="'text-primary'"  :clasehead="'bg-light'" class="pt-1">
    <!-- Botones de la parte superior derecha -->
    <template #buttons>
          <div class="d-flex columns justify-content-end ">
           
            <label class="form-label px-2 text-white align-content-center" >Estado:</label>
            <router-link :to="{ name: 'Pagina_crear' }" class="btn btn-success btn-sm float-end">
                <i class="fa fa-link"></i>
                Agregar
              </router-link>
            <button @click="cargar_listaServicios" class="btn btn-blue b-dark btn-sm mx-1">
              <i class="ti ti-refresh"></i>
            </button>
            <button @click="resetear" class="btn btn-secondary btn-sm mx-1">
              <i class="fa fa-broom"></i>
            </button>
          </div>
    </template>

    <!-- Contenido principal de la tarjeta -->
    <template #default>
      <DataTable
            :headers="headers"
            :items="listaServicios"
            :filterKeys="['servicio', 'beneficios', 'precio', 'facilidades', 'categoria']"
            :clasehead="'bg-info-100'"
          >
            <template #default="{ item, index, currentPage, itemsPerPage }">
                 <tr :id="'tr_noticia_'+ (index+1)">
                <td class="text-sm">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-wrap f-14 f-w-600 text-gray mb-0 mt-2 text-sm">
                    {{item.nombre}}
                </td>
                <td class="text-wrap text-sentence">{{ item.categoria_nombre }}</td>
                <!-- <td class="text-wrap text-sentence">{{ item.estado }}</td> -->
                <td class="fw-bold text-center text-sm">
                    {{ item.beneficios }}
                </td>
                <td class="fw-bold text-center text-sm">
                    {{ item.precio }}
                </td>
                <td class="fw-bold text-center text-sm">
                    {{ item.facilidades }}
                </td>
                <td class="text-wrap text-sm">
                  <a :href="`/beneficios/novedades/${item.id}`" class="btn btn-light-primary btn-sm me-1" target="_blank" rel="noopener">
                    <i class="ti ti-search"></i>
                  </a>
                  <router-link :to="{ name: 'Pagina_editar', params: { id: item.id } }" class="btn btn-light-warning btn-sm me-1">
                    <i class="ti ti-pencil f-20"></i>
                  </router-link>
                  <a href="#" @click.prevent="eliminarServicio(item.id)" class="btn btn-light-danger btn-sm">
                    <i class="ti ti-trash f-20"></i>
                  </a>
                </td>
              </tr>
            </template>
          </DataTable>
    </template>
  </CardLayout>
</template>

<script lang="ts">
import { DataTable, CardLayout } from '../../components/_components';  
import { ref, onMounted, defineComponent, computed, watch } from 'vue';
import { FormatFecha } from '../../utils/_utils';
import { useNoticias } from '../../composables/_composables';

export default defineComponent({
  components: {
    CardLayout,
    DataTable,
  },
  setup() {
  const { listaServicios, cargar_listaServicios, nuevoServicio, errors, eliminarServicio } = useNoticias();

    const headers = ref([
      { text: '#', width: '3%', key: '' }, 
      { text: 'Servicio', width: '30%', key: 'servicio' },
      { text: 'Categoría', width: '20%', key: 'categoria_nombre' },
      { text: 'Beneficios', width: '20%', key: 'beneficios' },
      { text: 'Precio', width: '5%', key: 'precio' },
      { text: 'Facilidades', width: '10%', key: 'facilidades' },
      { text: 'Acciones', width: '15%', key: 'acciones'}
    ]);

       const resetear = () => {
      cargar_listaServicios();
    };

    // watch(listaServicios, (nuevaLista) => {
    //   // console.log('listaServicios actualizada:', nuevaLista);
    // });

    onMounted(async () => {
      await cargar_listaServicios();
      // console.log('listaServicios después de cargar:', listaServicios.value);
    });

    return {
      headers,
      resetear,  
      FormatFecha,
      cargar_listaServicios,
      eliminarServicio,
      nuevoServicio,
      listaServicios
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
</style>