export interface Publicidad {
    id: number;
    urlFoto: string;
    nombreProyecto: string;
    ubicacionProyecto: string;
    cuotas: string;
    area: string;
    estado: string;
    link: string;
}

export const initializePublicidad = (): Publicidad => {
    return {
        id: 0,
        urlFoto: '',
        nombreProyecto: '',
        ubicacionProyecto: '',
        cuotas: '',
        area: '',
        estado: '',
        link: '',
    };
};

export interface PublicidadErrors {
    id: string;
    urlFoto: string;
    nombreProyecto: string;
    ubicacionProyecto: string;
    cuotas: string;
    area: string;
    estado: string;
    link: string;
}

export const initializePublicidadErrors = (): PublicidadErrors => {
    return {
        id: '',
        urlFoto: '',
        nombreProyecto: '',
        ubicacionProyecto: '',
        cuotas: '',
        area: '',
        estado: '',
        link: '',
    };
} 

// export interface PublicidadCreate {
//     urlFoto: string;
//     ubicacion: string;
//     estado: string;
//     link: string;

// }

// export const initializePublicidadCreate = (): PublicidadCreate => {
//     return {
//         urlFoto: '',
//         ubicacion: '',
//         estado: '',
//         link: '',

//     };
// };

  