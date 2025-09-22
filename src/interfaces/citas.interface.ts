export interface Cita {
    id: number;
    fecha: string;
    dni: string;
    nombre: string;
    celular: string;
    procedencia: string;
    descripcion: string;
    precio: number;
    estado: string;
    consultorio: string;
    preciogeneral: number;
    preciofinal: number;
    hora_inicio: string;
    hora_fin: string;
    horario_id: number;
}

export const initializeCita = (): Cita => {
    return {
        id: 0,
        fecha: '',
        dni: '',
        nombre: '',
        celular: '',
        procedencia: '',
        descripcion: '',
        precio: 0,
        estado: '',
        consultorio: '',
        preciogeneral: 0,
        preciofinal: 0,
        hora_inicio: '',
        hora_fin: '',
        horario_id: 0,
    };
};

export interface CitaErrors {
        id: string;
        fecha: string;
        dni: string;
        nombre: string;
        celular: string;
        procedencia: string;
        descripcion: string;
        precio: string;
        estado: string;
        consultorio: string;
        preciogeneral: string;
        preciofinal: string;
        hora_inicio: string;
        hora_fin: string;
        horario_id: string;
}

export const initializeCitaErrors = (): CitaErrors => {
    return {
        id: '',
        fecha: '',
        dni: '',
        nombre: '',
        celular: '',
        procedencia: '',
        descripcion: '',
        precio: '',
        estado: '',
        consultorio: '',
        preciogeneral: '',
        preciofinal: '',
        hora_inicio: '',
        hora_fin: '',
        horario_id: '',
    };
};
