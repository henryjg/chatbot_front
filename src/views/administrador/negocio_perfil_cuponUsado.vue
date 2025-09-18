<template>
  <CardLayout :title="'Cupones Usados'" :clase="'text-blue-900'" :clasehead="'bg-green-900 border-0 '" class="pt-1">
    <template #buttons>
          <div class="d-flex columns justify-content-end">
            <button type="button" @click="ExportarExcelUsados" class="btn btn-success float-end">
              <i class="fa fa-file-excel"></i> Excel
            </button>
          </div>
        </template>
    <template #default>
        <!-- {{listaCupones}} -->
      <Divloading v-if="isloading"/>
      <div v-else>
        <DataTable
          :headers="headers"
          :items="cuponesUsados"
          :filterKeys="['nombreBeneficiario', 'estado','fecha_uso', 'observacion_Negocio', 'observacion_Cliente','detalle']"
          :clasehead="'bg-info-100'"
        >
          <template #default="{ item, index, currentPage, itemsPerPage }">
            <tr>
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-truncate">{{ item.negocioNombreComercial }}</td>
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
                <!-- <td class="text-truncate">{{ FormatFecha.convertirFecha_sola(item.fecha_inicio) }}</td> -->
                   <td  class="px-2 mx-0 text-center text-wrap">
                    <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_sola(item.fecha_uso) }}</p>
                    <p class="m-b-0 text-gray-600 text-sm">{{ FormatFecha.convertirFecha_horasola(item.fecha_uso) }}</p>
                  </td>
                <!-- <td class="text-truncate">{{ getEstado(item) }}</td> -->
                <!-- <td class="text-truncate">{{ FormatFecha.fecha_dd_mm_yyyy(item.fecha_uso) }}</td> -->
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
                <td class="text-truncate">
                  <i class="fas fa-eye text-primary" @click="mostrarDetalles(item)" data-bs-toggle="modal" data-bs-target="#detallesModal"></i>
                </td>
              </tr>
          </template>
        </DataTable>
      </div>
    </template>
  </CardLayout>
 <!-- Modal de Bootstrap -->
 <div class="modal fade" id="detallesModal" tabindex="-1" aria-labelledby="detallesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detallesModalLabel">Detalles del Cupón</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <div class="card border-0 product-card">
                <div class="card-img-top p-0">
                 <div class="d-flex flex-column align-items-center">
                  <img v-if="cuponSeleccionado && cuponSeleccionado.negocioLogoUrl" class="img-fluid rounded-circle" :src="cuponSeleccionado.negocioLogoUrl" />
                  <img v-else class="img-fluid rounded-circle" src="../../assets/img_card_default.avif" />
                </div>
                 <div class="px-2 bg-white text-center text-blue f-20 f-w-800 mt-3">
                  {{ cuponSeleccionado?.negocioNombreComercial }}
                </div>
                <div class="w-100 d-flex justify-content-center pt-4">
                <span v-if="cuponSeleccionado && cuponSeleccionado.tipoUsuario==='Cliente'" class="badge bg-red-300 top-0 py-1 mb-3">
                    {{ cuponSeleccionado.ofertaTipoDescuento === 'Porcentual' ? cuponSeleccionado.ofertaValorDescuentoCliente + '%' : cuponSeleccionado.ofertaValorDescuentoCliente }}
                  </span>
                  <span v-if="cuponSeleccionado && cuponSeleccionado.tipoUsuario==='Trabajador'" class="badge bg-red-300 top-0 py-1 mb-3">
                    {{ cuponSeleccionado.ofertaTipoDescuento === 'Porcentual' ? cuponSeleccionado.ofertaValorDescuentoTrabajador + '%' : cuponSeleccionado.ofertaValorDescuentoTrabajador }}
                  </span>
                </div>
                <hr class="border_lineaspunteadas">
                <div class="p-2 bg-white text-center text-blue f-16">
                  En beneficio de:
                  
                </div>
                <div class="px-2 bg-white text-center text-blue f-20 f-w-800">
                  {{ cuponSeleccionado?.nombreBeneficiario }}
                </div>
                <div class="px-2 bg-white text-center text-blue f-16">
                  En:
                </div>
                <div class="p-2 bg-white text-center text-blue f-20 f-w-800">
                  {{ cuponSeleccionado?.ofertaNombre }}
                </div>
                <div class="px-2 bg-white text-center text-gray-500 f-16">
                  (Válido hasta el {{ FormatFecha.fecha_dd_mm_yyyy(cuponSeleccionado?.fechaFin || '') }})
                </div>
                <div class="px-2 bg-white text-center text-success f-16">
                  <i class="fa fa-check-circle"></i> Cupón Activo
                </div>
                <div class="p-2 bg-white text-center text-red-400 f-48 f-w-800">
                  <img v-if="qrCode" :src="qrCode" alt="Código QR" />
                </div>
                <div class="p-2 bg-white text-center text-blue f-13 f-w-800">
                  Código Cupón: {{ cuponSeleccionado?.qrCode }}
                </div>
              </div>
            </div>
            </div>
      <!-- detalles -->
      <div class="col-md-8">
              <div v-if="cuponSeleccionado">
                <h5 class="text-primary font-weight-bold">Detalles del cupón</h5>
                <div class="card rounded-1 shadow-sm">
                  <div class="card-body p-3">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Negocio:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ cuponSeleccionado.negocioNombreComercial }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Oferta:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ cuponSeleccionado.ofertaNombre }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Beneficiario:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">
                              <template v-if="cuponSeleccionado.esfamiliar === 'SI'">
                                {{ cuponSeleccionado.nombreBeneficiario }} (Familiar de {{ cuponSeleccionado.nombreUsuario }})
                              </template>
                              <template v-else>
                                {{ cuponSeleccionado.nombreBeneficiario }}
                              </template>
                            </p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Solicitado:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ FormatFecha.fecha_dd_mm_yyyy(cuponSeleccionado.fecha_inicio) }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Utilizado:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ FormatFecha.fecha_dd_mm_yyyy(cuponSeleccionado.fecha_uso) }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Observación Negocio:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ cuponSeleccionado.observacionNegocio || 'Sin comentarios' }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Observación Cliente:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
                            <p class="mb-0 text-muted">{{ cuponSeleccionado.observacionCliente || 'Sin comentarios' }}</p>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item px-0 py-2">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 w-25 mx-3">
                            <h6 class="mb-0"><i class="ph-duotone ph-circle text-info f-12"></i> Descuento:</h6>
                          </div>
                          <div class="flex-shrink-1 w-75">
               
                            <p class="mb-0 text-muted" v-if="cuponSeleccionado.tipoUsuario==='Cliente'">
                               {{ cuponSeleccionado.tipoDescuento === 'Porcentual' ? cuponSeleccionado.valordsctoCliente + '%' : cuponSeleccionado.valordsctoCliente }}</p>
                            <p class="mb-0 text-muted" v-if="cuponSeleccionado.tipoUsuario==='Trabajador'">
                              {{ cuponSeleccionado.tipoDescuento === 'Porcentual' ? cuponSeleccionado.valordsctoTrabajador + '%' : cuponSeleccionado.valordsctoTrabajador }}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DataTable } from '../../components/_components';
import { CardLayout } from '../../components/_components';
import { ref, onMounted, defineComponent, computed, watch } from 'vue';
import { useCupones } from '../../composables/useCupones';
import { Divloading } from '../../components/_components';
import { FormatFecha } from '../../utils/FormatFecha';
import { useAuthStore } from '../../stores/authStore';
import { Cupones } from '../../interfaces/cupon.interface';
import QRCode from "qrcode";
import { URL_DOMINIO } from "../../config";

export default defineComponent({
  components: {
    CardLayout,
    DataTable,
    Divloading
  },
  setup() {
    const { listaCupones, ExportarExcelUsados, cargarListaCupones_idNegocioUtilizado } = useCupones();
    const cuponSeleccionado = ref<Cupones | null>(null);
    const Usuario = computed(() => authStore.usuarioLogueado);
    const qrCode = ref("");

    const authStore = useAuthStore();
    const isloading = ref(true);

    const logoBase64 = ref<string | null>(null);

    watch(
      () => cuponSeleccionado.value?.negocioLogoUrl,
      async (newLogoUrl) => {
        // console.log("URL nueva de logo:", newLogoUrl);
        if (newLogoUrl) {
          try {
            logoBase64.value = await convertImageToBase64(newLogoUrl);
            // console.log("Imagen convertida a Base64:", logoBase64.value);
          } catch (error) {
            console.error("Error al convertir la imagen a Base64:", error);
          }
        } else {
          // console.log("No se encontró la URL de la imagen.");
        }
      },
      { immediate: true } // Se ejecuta inmediatamente si la propiedad ya tiene un valor
    );

    // Función para generar el QR
    const generateQRCode = async () => {
      const textocodigo = URL_DOMINIO + "verified/" + cuponSeleccionado.value?.id.toString();
      try {
        const url = await QRCode.toDataURL(textocodigo, {
          width: 200, // Define el tamaño del código QR
          margin: 1,
          errorCorrectionLevel: "Q",
        });
        qrCode.value = url;
        // console.log(qrCode.value); // Agregar log para verificar
      } catch (err) {
        console.error(err);
      }
    };

    const convertImageToBase64 = (imgSrc: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL("image/png"); // O "image/jpeg" si es necesario
            resolve(base64);
          } else {
            reject("No se pudo obtener el contexto del canvas.");
          }
        };

        img.onerror = (err) => reject("Error al cargar la imagen: " + err);
      });
    };




    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'Negocio', width: '15%', key: 'negocioNombreComercial' },
      { text: 'Oferta', width: '15%', key: 'ofertaNombre' },
      { text: 'Beneficiario', width: '15%', key: 'nombreBeneficiario' },
      { text: 'Tipo', width: '10%', key: 'tipoUsuario' },
      { text: 'Dscto', width: '10%', key: '' },
      { text: 'Solicitado el', width: '15%', key: 'fecha_uso' },
      // { text: 'Estado', width: '10%', key: 'estado' },
      { text: 'Utilizado', width: '15%', key: 'fecha_uso' },
      { text: 'ON', width: '3%', key: 'observacion_Negocio' },
      { text: 'OC', width: '3%', key: 'observacion_Cliente' },
      { text: 'Ver', width: '3%', key: 'detalle' },
    ]);

    const cuponesUsados = ref<Cupones[]>([]);

    const cargarCuponesUsados = async () => {
        isloading.value = true;
      const idNegocio = Number(authStore.usuarioLogueado?.id); 
      if (idNegocio) {
        await cargarListaCupones_idNegocioUtilizado(idNegocio);
        cuponesUsados.value = listaCupones.value;
      }
      isloading.value = false;
    };

    const mostrarDetalles = async (cupon: Cupones) => {
      cuponSeleccionado.value = cupon;
      await generateQRCode();
    };

    const getEstado = (cupon: Cupones) => {
      const fechaFin = new Date(cupon.fecha_fin);
      const fechaActual = new Date();
      if (fechaFin < fechaActual && !cupon.fecha_uso && !cupon.fecha_inicio) {
        return 'Vencido';
      }
      return cupon.estado;
    };

    onMounted(async () => {
      await cargarCuponesUsados();
    });


    

    return {
      headers,
      cuponesUsados,
      isloading,
      FormatFecha,
      listaCupones,
      cuponSeleccionado,
      mostrarDetalles,
      Usuario, 
      qrCode,
      generateQRCode,
      convertImageToBase64,
      logoBase64,
      getEstado,
      ExportarExcelUsados
    };
  },
});
</script>
<style>
.border_lineaspunteadas{
  border-style: dotted;
  border-top: 2px sienna dashed;  
  width: 50%;
  margin: auto;
  margin-top: 10px;
}
</style>