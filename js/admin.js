// Sistema de administración para ruta escolar

// Función para inicializar el panel de administración
async function initAdminPanel() {
    console.log('Inicializando panel de administración');
    
    // Verificar el estado del DOM antes de esperar
    console.log('🔍 Estado del DOM antes de esperar:');
    console.log('  - dynamicContent existe:', !!document.getElementById('dynamicContent'));
    console.log('  - Contenido de dynamicContent:', document.getElementById('dynamicContent')?.innerHTML?.substring(0, 100) + '...');
    console.log('  - studentTableBody existe:', !!document.getElementById('studentTableBody'));
    console.log('  - Elementos tbody:', document.querySelectorAll('tbody').length);
    
    // Esperar a que el contenido del panel esté disponible
    try {
        await waitForElement('studentTableBody');
    } catch (error) {
        console.error('❌ Error esperando studentTableBody:', error);
        console.log('🔍 Contenido actual del DOM:', document.body.innerHTML.substring(0, 500) + '...');
        return;
    }
    
    // Configurar la interfaz basada en el rol
    setupRoleBasedUI();
    
    // Cargar datos de estudiantes
    await loadStudents();
    
    // Configurar eventos
    setupEventListeners();
    
    // Sincronizar datos al inicio
    await syncDataOnStartup();
}

// Función auxiliar para esperar a que un elemento esté disponible
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = timeout / 100; // Intentar cada 100ms
        
        const checkElement = () => {
            attempts++;
            const element = document.getElementById(selector);
            
            if (element) {
                console.log(`✅ Elemento ${selector} encontrado después de ${attempts * 100}ms`);
                resolve(element);
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.error(`❌ Elemento ${selector} no encontrado después de ${timeout}ms`);
                console.log('Elementos tbody disponibles:', document.querySelectorAll('tbody'));
                reject(new Error(`Elemento ${selector} no encontrado después de ${timeout}ms`));
                return;
            }
            
            setTimeout(checkElement, 100);
        };
        
        checkElement();
    });
}

// Función de inicialización para el panel administrativo
async function initAdminScript() {
    console.log('👨‍💼 Inicializando script administrativo...');
    console.log('🔍 Llamando a initAdminPanel...');
    await initAdminPanel();
    console.log('✅ initAdminPanel completado');
}

// Configurar interfaz basada en el rol del usuario
function setupRoleBasedUI() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const uiConfig = roleManager.getUIConfig(currentUser.role);
    const navigationMenu = roleManager.getNavigationMenu(currentUser.role);

    console.log(`👤 Configurando interfaz para rol: ${currentUser.role}`);
    console.log('🎛️ Configuración UI:', uiConfig);

    // Actualizar título del panel
    const panelTitle = document.querySelector('h1');
    if (panelTitle) {
        panelTitle.innerHTML = `🚌 Panel de ${roleManager.getRoleInfo(currentUser.role)?.name || 'Administración'}`;
    }

    // Mostrar/ocultar elementos basados en permisos
    setupPermissionBasedElements(uiConfig);

    // Configurar navegación
    setupNavigation(navigationMenu);

    // Aplicar tema basado en rol
    applyRoleTheme(currentUser.role);
}

// Configurar elementos basados en permisos
function setupPermissionBasedElements(config) {
    // Botón de exportación
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.style.display = config.canModifyPayments ? 'inline-block' : 'none';
    }

    // Ocultar elementos de gestión de usuarios si no tiene permisos
    if (!config.showUserManagement) {
        const userElements = document.querySelectorAll('[data-permission="manage_users"]');
        userElements.forEach(el => el.style.display = 'none');
    }

    // Ocultar configuración del sistema si no tiene permisos
    if (!config.showSystemSettings) {
        const settingsElements = document.querySelectorAll('[data-permission="system_settings"]');
        settingsElements.forEach(el => el.style.display = 'none');
    }
}

// Configurar navegación
function setupNavigation(menu) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Limpiar navegación existente
    const existingLinks = nav.querySelectorAll('a:not([href="index ruta1.html"])');
    existingLinks.forEach(link => link.remove());

    // Agregar enlaces de navegación
    menu.forEach(item => {
        if (item.id !== 'dashboard') { // Dashboard ya está en el título
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'btn';
            link.innerHTML = `<i class="${item.icon}"></i> ${item.label}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(item.id);
            });
            nav.appendChild(link);
        }
    });
}

// Manejar navegación
function handleNavigation(section) {
    console.log(`🧭 Navegando a: ${section}`);
    
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none');

    // Mostrar sección seleccionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Ejecutar acciones específicas de la sección
    switch(section) {
        case 'students':
            loadStudents();
            break;
        case 'payments':
            loadStudents(); // Los pagos están en la tabla de estudiantes
            break;
        case 'attendance':
            loadAttendance();
            break;
        case 'export':
            exportStudentData();
            break;
    }
}

// Aplicar tema basado en rol
function applyRoleTheme(role) {
    document.body.className = `role-${role}`;
    
    // Agregar estilos específicos del rol
    const style = document.createElement('style');
    style.textContent = `
        .role-admin { --primary-color: #1a73e8; }
        .role-conductor { --primary-color: #34a853; }
        .role-supervisor { --primary-color: #fbbc04; }
    `;
    document.head.appendChild(style);
}

// Sincronización automática al iniciar
async function syncDataOnStartup() {
    console.log('🔄 Iniciando sincronización automática...');
    
    try {
        if (api.isServerAvailable()) {
            // Sincronizar datos del servidor
            const serverData = await api.sync();
            const localData = JSON.parse(localStorage.getItem('registrations') || '[]');
            
            console.log('📊 Datos del servidor:', serverData.length);
            console.log('💾 Datos locales:', localData.length);
            
            // Si hay datos en el servidor, usarlos como fuente de verdad
            if (serverData.length > 0) {
                localStorage.setItem('registrations', JSON.stringify(serverData));
                console.log('✅ Datos sincronizados desde el servidor');
                showNotification('Datos sincronizados desde el servidor', 'success');
            } else if (localData.length > 0) {
                // Si no hay datos en el servidor pero sí locales, subirlos
                console.log('📤 Subiendo datos locales al servidor...');
                for (const registration of localData) {
                    try {
                        await api.createRegistration(registration);
                    } catch (error) {
                        console.warn('Error subiendo registro:', error);
                    }
                }
                console.log('✅ Datos locales subidos al servidor');
                showNotification('Datos locales sincronizados con el servidor', 'success');
            }
        } else {
            console.log('💾 Servidor no disponible, usando datos locales');
        }
    } catch (error) {
        console.error('❌ Error en sincronización automática:', error);
        showNotification('Error en sincronización automática', 'error');
    }
}

// Configurar botones
function setupButtons() {
    // Botón de actualización
    const refreshBtn = document.getElementById('refreshStudents');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            await loadStudents();
            await updateStats();
            showNotification('Lista actualizada', 'success');
        });
    }

    // Botón de exportación
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportStudentData);
    }
}

// Configurar event listeners
function setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Configurar botones
    setupButtons();
    
    // Configurar sincronización
    setupSync();
    
    console.log('✅ Event listeners configurados');
}

// Funciones del dashboard
async function initDashboard() {
    await updateStats();
}

async function updateStats() {
    const registrations = await getRegistrations();
    const totalStudents = registrations.length;
    const pendingPayments = registrations.filter(r => r.status === 'pending').length;
    const verifiedPayments = registrations.filter(r => r.status === 'paid').length;

    // Actualizar estadísticas
    const totalElement = document.getElementById('totalStudents');
    const pendingElement = document.getElementById('pendingPayments');
    const verifiedElement = document.getElementById('verifiedPayments');

    if (totalElement) totalElement.textContent = totalStudents;
    if (pendingElement) pendingElement.textContent = pendingPayments;
    if (verifiedElement) verifiedElement.textContent = verifiedPayments;

    console.log('Estadísticas actualizadas:', { totalStudents, pendingPayments, verifiedPayments });
}

async function loadStudents() {
    const registrations = await getRegistrations();
    
    // Intentar encontrar el elemento con múltiples intentos
    let tbody = null;
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo
    
    while (!tbody && attempts < maxAttempts) {
        tbody = document.getElementById('studentTableBody');
        if (!tbody) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }
    
    if (!tbody) {
        console.error('❌ No se encontró el elemento studentTableBody después de múltiples intentos');
        console.log('Elementos tbody disponibles:', document.querySelectorAll('tbody'));
        console.log('Contenido de dynamicContent:', document.getElementById('dynamicContent')?.innerHTML);
        return;
    }
    
    console.log('✅ Elemento studentTableBody encontrado, cargando estudiantes...');

    tbody.innerHTML = '';

    if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No hay estudiantes registrados</td></tr>';
        return;
    }

    registrations.forEach((registration, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(registration.date).toLocaleDateString()}</td>
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

    console.log(`Cargados ${registrations.length} estudiantes`);
}

async function getRegistrations() {
    try {
        if (api.isServerAvailable()) {
            // Usar API del servidor
            console.log('🌐 Admin - Usando API del servidor');
            const registrations = await api.getRegistrations();
            console.log('✅ Admin - Datos obtenidos del servidor:', registrations);
            return registrations;
        } else {
            // Usar localStorage como fallback
            console.log('💾 Admin - Usando localStorage como fallback');
            const data = localStorage.getItem('registrations');
            console.log('🔍 Admin - Datos raw de registrations:', data);
            
            if (!data || data === 'null' || data === '[]') {
                console.log('⚠️ Admin - No hay datos en registrations, retornando array vacío');
                return [];
            }
            
            const parsed = JSON.parse(data);
            console.log('✅ Admin - Datos parseados:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('❌ Admin - Error al obtener registros:', error);
        return [];
    }
}

function getRouteTypeName(routeType) {
    const routes = {
        'media168': 'Media Ruta - $168,000',
        'media180': 'Media Ruta - $180,000',
        'completa': 'Ruta Completa - $284,000'
    };
    return routes[routeType] || routeType;
}

// Funciones de gestión
async function togglePaymentStatus(id) {
    try {
        const registrations = await getRegistrations();
        const registration = registrations.find(r => r.id === id);
        
        if (registration) {
            const newStatus = registration.status === 'pending' ? 'paid' : 'pending';
            
            if (api.isServerAvailable()) {
                await api.updateRegistration(id, { status: newStatus });
            } else {
                registration.status = newStatus;
                localStorage.setItem('registrations', JSON.stringify(registrations));
            }
            
            await loadStudents();
            await updateStats();
            showNotification('Estado de pago actualizado', 'success');
        }
    } catch (error) {
        console.error('Error al actualizar estado de pago:', error);
        showNotification('Error al actualizar estado de pago', 'error');
    }
}

async function deleteStudent(id) {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
        try {
            if (api.isServerAvailable()) {
                await api.deleteRegistration(id);
            } else {
                const registrations = await getRegistrations();
                const filteredRegistrations = registrations.filter(r => r.id !== id);
                localStorage.setItem('registrations', JSON.stringify(filteredRegistrations));
            }
            
            await loadStudents();
            await updateStats();
            showNotification('Estudiante eliminado', 'success');
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            showNotification('Error al eliminar estudiante', 'error');
        }
    }
}

async function exportStudentData() {
    const registrations = await getRegistrations();
    if (registrations.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const csvContent = generateCSV(registrations);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateCSV(data) {
    const headers = ['Fecha', 'Estudiante', 'Acudiente', 'Email', 'Teléfono', 'Ruta', 'Valor', 'Mes', 'Estado'];
    const rows = data.map(reg => [
        new Date(reg.date).toLocaleDateString(),
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

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Configurar sincronización
function setupSync() {
    if (api.isServerAvailable()) {
        // En modo servidor, verificar cambios cada 3 segundos
        setInterval(async () => {
            try {
                await loadStudents();
                await updateStats();
            } catch (error) {
                console.error('Error en sincronización:', error);
            }
        }, 3000);
    } else {
        // En modo localStorage, usar eventos
        window.addEventListener('storage', (e) => {
            if (e.key === 'registrations') {
                loadStudents();
                updateStats();
            }
        });

        window.addEventListener('registrationUpdated', (e) => {
            loadStudents();
            updateStats();
        });

        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('registration-updates');
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'registrationAdded') {
                    loadStudents();
                    updateStats();
                }
            });
        }
    }
}

// Función de diagnóstico global
window.diagnosticarSistema = function() {
    console.log('=== DIAGNÓSTICO COMPLETO DEL SISTEMA ===');
    
    // Verificar localStorage
    console.log('🔍 LocalStorage disponible:', typeof(Storage) !== "undefined");
    console.log('🔍 Todas las claves:', Object.keys(localStorage));
    
    // Verificar cada clave
    Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`🔍 Clave "${key}":`, value);
    });
    
    // Verificar específicamente registrations
    const registrationsData = localStorage.getItem('registrations');
    console.log('🔍 Datos de registrations:', registrationsData);
    
    if (registrationsData && registrationsData !== 'null') {
        try {
            const parsed = JSON.parse(registrationsData);
            console.log('✅ Registros parseados:', parsed);
            console.log('✅ Número de registros:', parsed.length);
        } catch (error) {
            console.error('❌ Error al parsear registrations:', error);
        }
    } else {
        console.log('⚠️ No hay datos en registrations');
    }
    
    console.log('=== FIN DEL DIAGNÓSTICO ===');
};

// Función para sincronizar datos manualmente
window.sincronizarDatos = function() {
    console.log('=== SINCRONIZACIÓN MANUAL ===');
    
    // Crear datos de prueba basados en lo que viste en el panel de usuario
    const datosPrueba = [
        {
            "studentName": "pluto",
            "parentName": "nn", 
            "email": "n@hotmail.com",
            "phone": "3212453556",
            "routeType": "completa",
            "paymentMonth": "Septiembre",
            "receiptNumber": 251237,
            "amount": 284000,
            "date": "2025-09-08T01:05:09.802Z",
            "status": "pending",
            "id": 1757293509802
        },
        {
            "studentName": "pluto",
            "parentName": "nn",
            "email": "n@hotmail.com", 
            "phone": "3212453556",
            "routeType": "media168",
            "paymentMonth": "Septiembre",
            "receiptNumber": 250832,
            "amount": 168000,
            "date": "2025-09-12T21:12:33.280070",
            "status": "pending",
            "id": 1757293509803
        }
    ];
    
    localStorage.setItem('registrations', JSON.stringify(datosPrueba));
    console.log('✅ Datos de prueba creados');
    
    // Recargar la tabla
    loadStudents();
    updateStats();
    
    console.log('=== SINCRONIZACIÓN COMPLETADA ===');
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin.js cargado - Iniciando diagnóstico');
    
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    console.log('Elementos encontrados:', {
        loginModal: !!loginModal,
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
            
            console.log('Credenciales ingresadas:', { username, password });

            // Verificación directa y simple
            if (username === 'conductor' && password === 'password') {
                console.log('✅ Credenciales correctas - Iniciando sesión');
                
                // Actualizar el objeto auth correctamente
                auth.isAuthenticated = true;
                auth.userRole = 'conductor';
                auth.currentUser = { username: 'conductor', role: 'conductor', name: 'Conductor' };
                
                // Guardar en localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'conductor');
                
                // Ocultar modal
                loginModal.style.display = 'none';
                
                // Notificar a app.js que el usuario se autenticó
                window.dispatchEvent(new CustomEvent('loginSuccess', {
                    detail: { user: auth.currentUser }
                }));
                
                // Limpiar formulario
                loginForm.reset();
                loginError.style.display = 'none';
                
                console.log('✅ Login completado exitosamente');
                
            } else {
                console.log('❌ Credenciales incorrectas');
                loginError.textContent = 'Credenciales incorrectas. Usuario: conductor, Contraseña: password';
                loginError.style.display = 'block';
            }
        });
    } else {
        console.error('❌ No se encontró el formulario de login');
    }

    // Verificar si ya está autenticado
    if (auth.checkAuth()) {
        loginModal.style.display = 'none';
        // El contenido se maneja dinámicamente en app.js
        initAdminPanel();
    }
});