import axios from 'axios';
import { API_URL } from '../config';

const ServidorArchivosService = {
    subir_archivo_servidor: async (formData: FormData, tipoArchivo: "archivopdf" | "fotografia") => {
        switch (tipoArchivo) {
            case "archivopdf":
                formData.append("op", "subir_archivo");
                formData.append("archivopdf", formData.get("archivopdf") || "");
                break;
            case "fotografia":
                formData.append("op", "Subir_fotografia");
                formData.append("archivo_foto", formData.get("archivo_foto") || "");
                break;
            default:
                throw new Error("Tipo de archivo no válido.");
        }

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default ServidorArchivosService;