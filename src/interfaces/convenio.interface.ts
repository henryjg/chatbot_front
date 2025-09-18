export interface Convenio {
    id: number;
    tipo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    observacion: string;
    doc_url: string;
    adjunto1: string;
    adjunto2: string;
    negocioId: number;
    diasParaFin: number;
    estadoVigencia: string;
    }

    export const initializeConvenio = (): Convenio => {
      return {
        id: 0,
        tipo: '',
        descripcion: '',
        fechaInicio: '',    
        fechaFin: '',
        estado: 'Activo',
        observacion: '',
        doc_url: '',
        adjunto1: '',
        adjunto2: '',
        negocioId: 0,
        diasParaFin: 0,
        estadoVigencia: ''
      };
    };
    
    export interface ConvenioErrors {
        id: string;
        tipo: string;
        descripcion: string;
        fechaInicio: string;
        fechaFin: string;
        estado: string;
        observacion: string;
        doc_url: string;
        adjunto1: string;
        adjunto2: string;
        negocioId: string;
    }
    
    export const initializeConvenioErrors = (): ConvenioErrors => {
      return {
        id: '',
        tipo: '',
        descripcion: '',
        fechaInicio: '',    
        fechaFin: '',
        estado: '',
        observacion: '',
        doc_url: '',
        adjunto1: '',
        adjunto2: '',
        negocioId: '',
      };
    };