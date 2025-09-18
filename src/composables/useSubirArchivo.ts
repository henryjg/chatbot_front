// Composable useSubirArchivo.ts
import { ref } from "vue";
import { Adjunto, initialize_Adjunto } from "../interfaces/_interface";
import NProgress from "nprogress";
import Notif from "../utils/notificaciones";
import { HOST_URL } from "../config";
import { ServidorArchivosService } from "../services/_services";
import ProgressBar from "../utils/progress_bar";

export function useSubirArchivo(elementoLoader: string, tipoArchivo: "archivopdf" | "fotografia") {
  const ArchivoTemporal = ref<Adjunto>(initialize_Adjunto());
  const isUploading = ref(false);
  const fileDocumento = ref<File | null>(null);

  // SELECCIONAR
  const onFileSelected = (event: Event) => {
    const selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
    if (selectedFile) {
      fileDocumento.value = selectedFile;
    }
  };

  // ARRASTRAR Y SOLTAR
  const handleDropFile = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      fileDocumento.value = event.dataTransfer.files[0];
    }
  };

  // CONFIGURAR FORMDATA
  const prepararFormData = (): FormData => {
    const formData = new FormData();
    if (!fileDocumento.value) throw new Error("Debe seleccionar un archivo.");

    switch (tipoArchivo) {
      case "archivopdf":
        formData.append("op", "subir_archivo");
        formData.append("archivopdf", fileDocumento.value);
        break;
      case "fotografia":
        formData.append("op", "Subir_fotografia");
        formData.append("archivo_foto", fileDocumento.value);
        break;
      default:
        throw new Error("Tipo de archivo no válido.");
    }
    return formData;
  };

  // SUBIR ARCHIVOS AL SERVIDOR
  const subirArchivo = async () => {
    if (!fileDocumento.value) {
      Notif.Error("Debe cargar un archivo.");
      return;
    }
    try {
      isUploading.value = true;
      ProgressBar.loadingDiv_star('#'+elementoLoader);

      const formData = prepararFormData();
      const respuestaJSON = await ServidorArchivosService.subir_archivo_servidor(formData, tipoArchivo);

      if (respuestaJSON.success) {

        ArchivoTemporal.value.id = 1;
        ArchivoTemporal.value.url = `${HOST_URL}${respuestaJSON.data}`;
        ArchivoTemporal.value.nombrefile = fileDocumento.value.name;
        return ArchivoTemporal;

      } else {
        Notif.Error(respuestaJSON.message || "Error al subir el archivo");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      Notif.Error(error instanceof Error ? error.message : "Ocurrió un error al subir el archivo");
    } finally {
      isUploading.value = false;
      ProgressBar.loadingDiv_end();
    }
  };
  const reset_formUpload = () =>{
    ArchivoTemporal.value = initialize_Adjunto();
    fileDocumento.value = null;
  }

  return {
    ArchivoTemporal,
    fileDocumento,
    isUploading,
    onFileSelected,
    handleDropFile,
    subirArchivo,
    reset_formUpload
  };
}
