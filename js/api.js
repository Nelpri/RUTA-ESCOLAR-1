// API para comunicación con el servidor
class API {
    constructor() {
        this.baseURL = window.location.origin;
        this.isAvailable = false;
        this.checkServerAvailability();
    }

    async checkServerAvailability() {
        try {
            const response = await fetch(`${this.baseURL}/api/sync`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.isAvailable = response.ok;
            console.log('🌐 Servidor disponible:', this.isAvailable);
        } catch (error) {
            this.isAvailable = false;
            console.log('💾 Servidor no disponible, usando localStorage:', error.message);
        }
    }

    isServerAvailable() {
        return this.isAvailable;
    }

    // Operaciones CRUD para registros
    async createRegistration(registrationData) {
        if (!this.isAvailable) {
            throw new Error('Servidor no disponible');
        }

        try {
            const token = auth.getAuthToken();
            const response = await fetch(`${this.baseURL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    operation: 'create',
                    data: registrationData
                })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creando registro:', error);
            throw error;
        }
    }

    async getRegistrations() {
        if (!this.isAvailable) {
            throw new Error('Servidor no disponible');
        }

        try {
            const token = auth.getAuthToken();
            const response = await fetch(`${this.baseURL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    operation: 'read'
                })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error obteniendo registros:', error);
            throw error;
        }
    }

    async updateRegistration(id, updateData) {
        if (!this.isAvailable) {
            throw new Error('Servidor no disponible');
        }

        try {
            const token = auth.getAuthToken();
            const response = await fetch(`${this.baseURL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    operation: 'update',
                    id: id,
                    data: updateData
                })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error actualizando registro:', error);
            throw error;
        }
    }

    async deleteRegistration(id) {
        if (!this.isAvailable) {
            throw new Error('Servidor no disponible');
        }

        try {
            const token = auth.getAuthToken();
            const response = await fetch(`${this.baseURL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    operation: 'delete',
                    id: id
                })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error eliminando registro:', error);
            throw error;
        }
    }

    // Sincronización
    async sync() {
        if (!this.isAvailable) {
            throw new Error('Servidor no disponible');
        }

        try {
            const response = await fetch(`${this.baseURL}/api/sync`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error sincronizando:', error);
            throw error;
        }
    }
}

// Crear instancia global
const api = new API();