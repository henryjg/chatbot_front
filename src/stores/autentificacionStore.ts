import  {Trabajador} from "../interfaces/trabajador.interface"
import { defineStore } from 'pinia';

export const usarAuthStore = defineStore('auth', {
  state: () => ({
    trabajador: JSON.parse(localStorage.getItem('trabajador') as string) || null,
    token_id: localStorage.getItem('token_id') || null,
  }),
  actions: {
    establecerUsuario(trabajador: Trabajador) {
      this.trabajador = trabajador;
      this.token_id = trabajador.id.toString();
      localStorage.setItem('token_id', trabajador.id.toString());
      localStorage.setItem('trabajador', JSON.stringify(trabajador));
    },
    cerrarSesion() {
      this.trabajador = null;
      this.token_id = null;
      localStorage.removeItem('token_id');
      localStorage.removeItem('trabajador');
    }
  }
});
