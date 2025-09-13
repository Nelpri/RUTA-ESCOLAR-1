// Sistema de autenticación mejorado
class Auth {
    constructor() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.currentUser = null;
      this.init();
    }

    init() {
      // Verificar si hay un token válido al cargar
      this.checkStoredAuth();
    }

    async login(username, password) {
      try {
        // Verificar credenciales contra el servidor
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          throw new Error('Error de autenticación');
        }

        const data = await response.json();
        
        if (data.success) {
          // Guardar token
          jwtManager.storeToken(data.token);
          
          // Actualizar estado local
          this.isAuthenticated = true;
          this.userRole = data.user.role;
          this.currentUser = data.user;
          
          return { success: true, user: data.user };
        } else {
          throw new Error(data.message || 'Credenciales inválidas');
        }
      } catch (error) {
        // Fallback a autenticación local si el servidor no está disponible
        console.warn('Servidor no disponible, usando autenticación local:', error.message);
        return this.localLogin(username, password);
      }
    }

    localLogin(username, password) {
      return new Promise((resolve, reject) => {
        // Credenciales locales (solo para desarrollo)
        const validCredentials = {
          'conductor': { password: 'password', role: 'conductor', name: 'Conductor' },
          'admin': { password: 'admin123', role: 'admin', name: 'Administrador' }
        };

        if (validCredentials[username] && validCredentials[username].password === password) {
          const user = validCredentials[username];
          
          // Generar token local
          const token = jwtManager.generateToken({
            username,
            role: user.role,
            name: user.name
          });
          
          // Guardar token
          jwtManager.storeToken(token);
          
          // Actualizar estado
          this.isAuthenticated = true;
          this.userRole = user.role;
          this.currentUser = { username, ...user };
          
          resolve({ success: true, user: this.currentUser });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      });
    }

    logout() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.currentUser = null;
      
      // Limpiar token
      jwtManager.clearToken();
      
      // Limpiar otros datos de sesión
      localStorage.removeItem('sessionData');
    }

    checkStoredAuth() {
      if (jwtManager.isAuthenticated()) {
        const user = jwtManager.getCurrentUser();
        if (user) {
          this.isAuthenticated = true;
          this.userRole = user.role;
          this.currentUser = user;
        }
      }
    }

    isAdmin() {
      return this.userRole === 'conductor' || this.userRole === 'admin';
    }

    checkAuth() {
      // Verificar token almacenado
      this.checkStoredAuth();
      return this.isAuthenticated;
    }

    getCurrentUser() {
      return this.currentUser;
    }

    getAuthToken() {
      return jwtManager.getStoredToken();
    }
  }
  
  const auth = new Auth(); 