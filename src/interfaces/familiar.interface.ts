export interface Familiar {
    id: number;
    dni: string;
    nombre: string;
    apePaterno: string;
    apeMaterno: string;
    telefono: string;
    correo: string;
    fechaRegistro?: string;
    clienteId: number;
    trabajadorId: number;
    clienteNombre: string;
    trabajadorNombre: string;
    genero:string;
    nroCupones: number;
    nroCuponesUtilizados: number;
    nroCuponesNoUtilizados: number;
    gradoAfinidad: string;
}

export const initializeFamiliar = (): Familiar => {
    return {
        id: 0,
        dni: '',
        nombre: '',
        apePaterno: '',
        apeMaterno: '',
        telefono: '',
        correo: '',
        fechaRegistro: '',
        clienteId: 0,
        trabajadorId: 0,
        clienteNombre: '',
        trabajadorNombre: '',
        genero:'',
        nroCupones: 0,
        nroCuponesUtilizados: 0,
        nroCuponesNoUtilizados: 0,
        gradoAfinidad: ''
    };
};

// export interface FamiliarErrors {
//     id: string;
//     dni: string;
//     nombre: string;
//     apePaterno: string;
//     apeMaterno: string;
//     telefono: string;
//     correo: string;
//     genero:string;
// }

// export const initializeFamiliarErrors = (): FamiliarErrors => {
//     return {
//         id: '',
//         dni: '',
//         nombre: '',
//         apePaterno: '',
//         apeMaterno: '',
//         telefono: '',
//         correo: '',
//         genero:'',
//     };
// }

export interface FamiliarAsignado {
    idFamiliar: string;
    nombreBeneficiario: string;
}


export const initializeFamiliarAsignado = (): FamiliarAsignado => {
    return {
        idFamiliar: '',
        nombreBeneficiario: ''
    };
};