// Sistema de autenticación
class Auth {
    constructor() {
      this.isAuthenticated = false;
      this.userRole = null;
    }
  
    login(username, password) {
      // Aquí iría la lógica de autenticación con el backend
      return new Promise((resolve, reject) => {
        // Simulación de autenticación
        if (username === 'conductor' && password === 'password') {
          this.isAuthenticated = true;
          this.userRole = 'conductor';
          resolve({ success: true, role: 'conductor' });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      });
    }
  
    logout() {
      this.isAuthenticated = false;
      this.userRole = null;
      // Limpiar datos de sesión
      localStorage.removeItem('sessionData');
    }
  
    isAdmin() {
      return this.userRole === 'conductor';
    }
  
    checkAuth() {
      return this.isAuthenticated;
    }
  }
  
  const auth = new Auth(); 