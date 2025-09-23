// src/composables/usarAutenticacion.ts
import { computed, ref,  watch } from 'vue';
import { useRouter } from 'vue-router';
import { usarAuthStore } from '../stores/autentificacionStore';
import { iniciarSesion } from '../services/autentificacion.service';
import Alerta from '../utils/alertas';


export function usarAutenticacion() {
  const authStore = usarAuthStore();
  // const usuario = ref(authStore.trabajador);
  const Usuario = computed(() => authStore.trabajador);
  const UsuarioRol = computed(() => authStore.trabajador?.rol || '');
  const router = useRouter();  // Asegúrate de llamar a useRouter aquí

  const login = async ( username: string, contrasena: string ) => {
    try {
      const response = await iniciarSesion(username, contrasena);
      if (response.success) {
        const userRole = response.data.rol;
        if (userRole === 'Trabajador') {
          Alerta.Error('Acceso denegado', 'No tienes permisos para iniciar sesión.');
          return;
        }
        // Guarda el usuario logueado
        authStore.establecerUsuario(response.data);
        Alerta.Sucessfull('Bienvenido', response.message);
        router.push({ name: 'office_admin' }); // Redirigir al dashboard después de iniciar sesión
      } else {
        Alerta.Error('Error', response.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      Alerta.Error('Error', 'Error al iniciar sesión');
    }
  };

  

  const logout = () => {
    authStore.cerrarSesion();
    router.push({ name: 'Login_admin' }); // Redirigir a la página de login
  };

  // Observa los cambios en el trabajador para redirigir si no está autenticado
  watch(
    () => authStore.trabajador,
    (nuevoTrabajador) => {
      if (!nuevoTrabajador) {
        router.push({ name: 'Login_admin' });
      }
    }
  );


  return { login , logout, Usuario, UsuarioRol };
}
