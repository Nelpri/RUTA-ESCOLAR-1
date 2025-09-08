// API para comunicación con el servidor
class RutaEscolarAPI {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.isServerMode = window.location.protocol === 'http:';
    }

    // Verificar si estamos en modo servidor
    isServerAvailable() {
        return this.isServerMode;
    }

    // Crear nuevo registro
    async createRegistration(registrationData) {
        if (!this.isServerAvailable()) {
            throw new Error('Servidor no disponible. Usa el servidor local.');
        }

        try {
            const response = await fetch(`${this.baseURL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'create',
                    data: registrationData
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al crear registro');
            }

            return result.data;
        } catch (error) {
            console.error('Error en createRegistration:', error);
            throw error;
        }
    }

    // Leer todos los registros
    async getRegistrations() {
        if (!this.isServerAvailable()) {
            throw new Error('Servidor no disponible. Usa el servidor local.');
        }

        try {
            const response = await fetch(`${this.baseURL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'read'
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al leer registros');
            }

            return result.data;
        } catch (error) {
            console.error('Error en getRegistrations:', error);
            throw error;
        }
    }

    // Actualizar registro
    async updateRegistration(id, updateData) {
        if (!this.isServerAvailable()) {
            throw new Error('Servidor no disponible. Usa el servidor local.');
        }

        try {
            const response = await fetch(`${this.baseURL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'update',
                    id: id,
                    data: updateData
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al actualizar registro');
            }

            return result;
        } catch (error) {
            console.error('Error en updateRegistration:', error);
            throw error;
        }
    }

    // Eliminar registro
    async deleteRegistration(id) {
        if (!this.isServerAvailable()) {
            throw new Error('Servidor no disponible. Usa el servidor local.');
        }

        try {
            const response = await fetch(`${this.baseURL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'delete',
                    id: id
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al eliminar registro');
            }

            return result;
        } catch (error) {
            console.error('Error en deleteRegistration:', error);
            throw error;
        }
    }

    // Sincronizar datos
    async syncData() {
        if (!this.isServerAvailable()) {
            throw new Error('Servidor no disponible. Usa el servidor local.');
        }

        try {
            const response = await fetch(`${this.baseURL}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Error al sincronizar datos');
            }

            return result.data;
        } catch (error) {
            console.error('Error en syncData:', error);
            throw error;
        }
    }
}

// Crear instancia global
const api = new RutaEscolarAPI();
