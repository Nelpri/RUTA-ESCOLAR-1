// Controlador principal de la aplicación unificada
class AppController {
    constructor() {
        this.currentMode = 'user';
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando aplicación unificada...');
        
        this.currentUser = auth.getCurrentUser();
        
        if (this.currentUser) {
            this.currentMode = 'admin';
            await this.showAdminPanel();
        } else {
            this.currentMode = 'user';
            this.showUserPanel();
        }

        this.setupGlobalEvents();
    }

    showUserPanel() {
        console.log('👤 Mostrando panel de usuario');
        document.getElementById('mainTitle').textContent = '🚌 Ruta Escolar Segura';
        this.setupUserNavigation();
        this.loadUserContent();
    }

    async showAdminPanel() {
        console.log('👨‍💼 Mostrando panel administrativo');
        
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }

        const roleInfo = roleManager.getRoleInfo(this.currentUser.role);
        document.getElementById('mainTitle').textContent = `🚌 Panel de ${roleInfo?.name || 'Administración'}`;
        
        this.setupAdminNavigation();
        await this.loadAdminContent();
    }

    setupUserNavigation() {
        const nav = document.getElementById('mainNav');
        nav.innerHTML = `
            <a href="#" id="adminPanelBtn" class="btn">
                <i class="fas fa-cog"></i> Panel Administrativo
            </a>
        `;

        document.getElementById('adminPanelBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginModal();
        });
    }

    setupAdminNavigation() {
        const nav = document.getElementById('mainNav');
        const navButtons = templateManager.getNavigationButtons(this.currentUser.role);
        nav.innerHTML = navButtons;

        const userPanelBtn = document.getElementById('userPanelBtn');
        const logoutBtn = document.getElementById('btnLogout');

        if (userPanelBtn) {
            userPanelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUserPanel();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';
        }
    }

    loadUserContent() {
        const content = document.getElementById('dynamicContent');
        content.innerHTML = templateManager.render('userPanel');
        this.initUserFeatures();
    }

    async loadAdminContent() {
        const content = document.getElementById('dynamicContent');
        const adminHTML = this.getAdminContentHTML();
        
        console.log('🔍 Renderizando contenido administrativo...');
        console.log('📄 HTML generado:', adminHTML.substring(0, 200) + '...');
        
        content.innerHTML = adminHTML;
        
        console.log('✅ Contenido renderizado, verificando elementos...');
        console.log('🔍 studentTableBody encontrado:', !!document.getElementById('studentTableBody'));
        console.log('🔍 Elementos tbody:', document.querySelectorAll('tbody').length);
        
        await this.initAdminFeatures();
    }


    getAdminContentHTML() {
        return `
            <section class="admin-dashboard">
                <h2>Panel de Gestión</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Total Estudiantes Inscritos</h3>
                        <p id="totalStudents">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Pagos Pendientes de Verificación</h3>
                        <p id="pendingPayments">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Pagos Verificados</h3>
                        <p id="verifiedPayments">0</p>
                    </div>
                </div>
            </section>

            <section class="student-list">
                <h2>Gestión de Estudiantes Inscritos</h2>
                <div class="admin-actions">
                    <button id="refreshStudents" class="btn">
                        <i class="fas fa-sync-alt"></i> Actualizar Lista
                    </button>
                    <button id="exportData" class="btn">
                        <i class="fas fa-download"></i> Exportar Datos
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha Inscripción</th>
                            <th>Estudiante</th>
                            <th>Acudiente</th>
                            <th>Tipo de Ruta</th>
                            <th>Valor</th>
                            <th>Estado de Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="studentTableBody">
                        <!-- Los estudiantes se cargarán dinámicamente -->
                    </tbody>
                </table>
            </section>

            <section class="attendance-control">
                <h2>Control de Asistencia</h2>
                <div class="attendance-date">
                    <label for="attendanceDate">Fecha:</label>
                    <input type="date" id="attendanceDate">
                </div>
                <div class="attendance-list" id="attendanceList">
                    <!-- La lista de asistencia se cargará dinámicamente -->
                </div>
            </section>
        `;
    }

    initUserFeatures() {
        if (typeof initUserScript === 'function') {
            initUserScript();
        }
    }

    async initAdminFeatures() {
        if (typeof initAdminScript === 'function') {
            await initAdminScript();
        }
    }

    setupGlobalEvents() {
        window.addEventListener('loginSuccess', (event) => {
            console.log('🎉 Evento loginSuccess recibido:', event.detail);
            this.currentUser = event.detail.user;
            this.currentMode = 'admin';
            console.log('🔄 Cambiando a modo admin...');
            this.showAdminPanel();
        });

        window.addEventListener('logout', () => {
            this.currentUser = null;
            this.currentMode = 'user';
            this.showUserPanel();
        });
    }

    logout() {
        auth.logout();
        window.dispatchEvent(new CustomEvent('logout'));
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});