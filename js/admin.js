// Sistema de administración para ruta escolar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin.js cargado - Iniciando diagnóstico');
    
    const loginModal = document.getElementById('loginModal');
    const adminContent = document.getElementById('adminContent');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    console.log('Elementos encontrados:', {
        loginModal: !!loginModal,
        adminContent: !!adminContent,
        loginForm: !!loginForm,
        loginError: !!loginError
    });

    // Verificar que auth esté disponible
    if (typeof auth === 'undefined') {
        console.error('❌ El objeto auth no está disponible. Verifica que auth.js se cargue antes que admin.js');
        return;
    } else {
        console.log('✅ Objeto auth disponible');
    }

    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario de login enviado');
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            console.log('Credenciales ingresadas:', { username, password: '***' });
            
            if (auth.login(username, password)) {
                console.log('✅ Credenciales correctas - Iniciando sesión');
                loginModal.style.display = 'none';
                adminContent.style.display = 'block';
                
                // Inicializar panel de administración
                await initAdminPanel();
                console.log('✅ Login completado exitosamente');
            } else {
                console.log('❌ Credenciales incorrectas');
                if (loginError) {
                    loginError.textContent = 'Usuario o contraseña incorrectos';
                    loginError.style.display = 'block';
                }
            }
        });
    }

    // Manejar logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            auth.logout();
            loginModal.style.display = 'block';
            adminContent.style.display = 'none';
        });
    }

    // Inicializar panel de administración
    async function initAdminPanel() {
        console.log('Inicializando panel de administración');
        await initDashboard();
        await loadStudents();
        setupButtons();
        setupSync();
    }

    // Inicializar dashboard
    async function initDashboard() {
        console.log('Inicializando dashboard');
        await updateStats();
    }

    // Configurar botones
    function setupButtons() {
        const refreshBtn = document.getElementById('refreshStudents');
        const exportBtn = document.getElementById('exportData');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                console.log('🔄 Actualizando lista de estudiantes');
                await loadStudents();
                await updateStats();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                console.log('📊 Exportando datos');
                await exportStudentData();
            });
        }
    }

    // Actualizar estadísticas
    async function updateStats() {
        try {
            const registrations = await getRegistrations();
            console.log('Estadísticas actualizadas:', {
                totalStudents: registrations.length,
                pendingPayments: registrations.filter(r => r.status === 'pending').length,
                verifiedPayments: registrations.filter(r => r.status === 'paid').length
            });

            const totalStudentsEl = document.getElementById('totalStudents');
            const pendingPaymentsEl = document.getElementById('pendingPayments');
            const verifiedPaymentsEl = document.getElementById('verifiedPayments');

            if (totalStudentsEl) totalStudentsEl.textContent = registrations.length;
            if (pendingPaymentsEl) pendingPaymentsEl.textContent = registrations.filter(r => r.status === 'pending').length;
            if (verifiedPaymentsEl) verifiedPaymentsEl.textContent = registrations.filter(r => r.status === 'paid').length;
        } catch (error) {
            console.error('Error al actualizar estadísticas:', error);
        }
    }

    // Cargar estudiantes
    async function loadStudents() {
        try {
            const registrations = await getRegistrations();
            console.log('Cargando estudiantes, total encontrados:', registrations.length);
            
            const tbody = document.getElementById('studentTableBody');
            if (!tbody) {
                console.error('No se encontró el elemento studentTableBody');
                return;
            }

            tbody.innerHTML = '';

            registrations.forEach(registration => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(registration.date).toLocaleDateString('es-ES')}</td>
                    <td>${registration.studentName}</td>
                    <td>${registration.parentName}</td>
                    <td>${getRouteTypeName(registration.routeType)}</td>
                    <td>$${registration.amount.toLocaleString()}</td>
                    <td><span class="status ${registration.status}">${registration.status === 'pending' ? 'Pendiente' : 'Pagado'}</span></td>
                    <td>
                        <button class="btn-action" onclick="togglePaymentStatus(${registration.id})">
                            ${registration.status === 'pending' ? 'Verificar Pago' : 'Marcar Pendiente'}
                        </button>
                        <button class="btn-delete" onclick="deleteStudent(${registration.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    }

    // Obtener registros
    async function getRegistrations() {
        try {
            if (api.isServerAvailable()) {
                console.log('🌐 Usando API del servidor');
                return await api.getRegistrations();
            } else {
                console.log('💾 Usando localStorage como fallback');
                const data = localStorage.getItem('registrations');
                return data ? JSON.parse(data) : [];
            }
        } catch (error) {
            console.error('Error al obtener registros:', error);
            return [];
        }
    }

    // Cambiar estado de pago
    async function togglePaymentStatus(id) {
        try {
            const registrations = await getRegistrations();
            const registration = registrations.find(r => r.id == id);
            
            if (!registration) {
                console.error('Registro no encontrado:', id);
                return;
            }

            const newStatus = registration.status === 'pending' ? 'paid' : 'pending';
            
            if (api.isServerAvailable()) {
                await api.updateRegistration(id, { status: newStatus });
            } else {
                registration.status = newStatus;
                localStorage.setItem('registrations', JSON.stringify(registrations));
            }

            console.log(`Estado de pago cambiado a: ${newStatus}`);
            await loadStudents();
            await updateStats();
        } catch (error) {
            console.error('Error al cambiar estado de pago:', error);
        }
    }

    // Eliminar estudiante
    async function deleteStudent(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            return;
        }

        try {
            if (api.isServerAvailable()) {
                await api.deleteRegistration(id);
            } else {
                const registrations = await getRegistrations();
                const filtered = registrations.filter(r => r.id != id);
                localStorage.setItem('registrations', JSON.stringify(filtered));
            }

            console.log('Estudiante eliminado:', id);
            await loadStudents();
            await updateStats();
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
        }
    }

    // Exportar datos
    async function exportStudentData() {
        try {
            const registrations = await getRegistrations();
            
            if (registrations.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            const csvContent = generateCSV(registrations);
            downloadCSV(csvContent, 'estudiantes_inscritos.csv');
        } catch (error) {
            console.error('Error al exportar datos:', error);
        }
    }

    // Generar CSV
    function generateCSV(data) {
        const headers = ['Fecha', 'Estudiante', 'Acudiente', 'Email', 'Teléfono', 'Ruta', 'Valor', 'Mes', 'Estado'];
        const rows = data.map(reg => [
            new Date(reg.date).toLocaleDateString('es-ES'),
            reg.studentName,
            reg.parentName,
            reg.email,
            reg.phone,
            getRouteTypeName(reg.routeType),
            reg.amount,
            reg.paymentMonth,
            reg.status === 'pending' ? 'Pendiente' : 'Pagado'
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    // Descargar CSV
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Obtener nombre de tipo de ruta
    function getRouteTypeName(routeType) {
        const types = {
            'media168': 'Media Ruta - $168,000',
            'media180': 'Media Ruta - $180,000',
            'completa': 'Ruta Completa - $284,000'
        };
        return types[routeType] || routeType;
    }

    // Configurar sincronización
    function setupSync() {
        if (api.isServerAvailable()) {
            // Sincronización con servidor cada 5 segundos
            setInterval(async () => {
                await loadStudents();
                await updateStats();
            }, 5000);
        } else {
            // Sincronización con localStorage
            setInterval(async () => {
                await loadStudents();
                await updateStats();
            }, 2000);
        }
    }

    // Funciones globales para uso en HTML
    window.togglePaymentStatus = togglePaymentStatus;
    window.deleteStudent = deleteStudent;
});