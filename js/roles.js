// Sistema de gestión de roles y permisos
class RoleManager {
    constructor() {
        this.roles = {
            'admin': {
                name: 'Administrador',
                permissions: [
                    'view_dashboard',
                    'manage_students',
                    'verify_payments',
                    'export_data',
                    'manage_users',
                    'view_attendance',
                    'manage_routes',
                    'system_settings'
                ],
                description: 'Acceso completo al sistema'
            },
            'conductor': {
                name: 'Conductor',
                permissions: [
                    'view_dashboard',
                    'view_students',
                    'verify_payments',
                    'view_attendance',
                    'manage_own_route'
                ],
                description: 'Gestión de ruta asignada'
            },
            'supervisor': {
                name: 'Supervisor',
                permissions: [
                    'view_dashboard',
                    'view_students',
                    'verify_payments',
                    'export_data',
                    'view_attendance',
                    'manage_routes'
                ],
                description: 'Supervisión de operaciones'
            }
        };
    }

    // Verificar si el usuario tiene un permiso específico
    hasPermission(userRole, permission) {
        if (!this.roles[userRole]) {
            return false;
        }
        return this.roles[userRole].permissions.includes(permission);
    }

    // Obtener todos los permisos de un rol
    getRolePermissions(role) {
        return this.roles[role] ? this.roles[role].permissions : [];
    }

    // Obtener información del rol
    getRoleInfo(role) {
        return this.roles[role] || null;
    }

    // Obtener todos los roles disponibles
    getAllRoles() {
        return Object.keys(this.roles).map(role => ({
            key: role,
            ...this.roles[role]
        }));
    }

    // Verificar si el usuario puede realizar una acción
    canPerformAction(userRole, action) {
        const actionPermissions = {
            'view_admin_panel': ['admin', 'conductor', 'supervisor'],
            'manage_students': ['admin'],
            'verify_payments': ['admin', 'conductor', 'supervisor'],
            'export_data': ['admin', 'supervisor'],
            'manage_users': ['admin'],
            'view_attendance': ['admin', 'conductor', 'supervisor'],
            'manage_routes': ['admin', 'supervisor'],
            'system_settings': ['admin']
        };

        return actionPermissions[action] ? 
            actionPermissions[action].includes(userRole) : false;
    }

    // Obtener menú de navegación basado en el rol
    getNavigationMenu(userRole) {
        const baseMenu = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', permission: 'view_dashboard' },
            { id: 'students', label: 'Estudiantes', icon: 'fas fa-users', permission: 'view_students' },
            { id: 'payments', label: 'Pagos', icon: 'fas fa-credit-card', permission: 'verify_payments' },
            { id: 'attendance', label: 'Asistencia', icon: 'fas fa-calendar-check', permission: 'view_attendance' }
        ];

        const adminMenu = [
            { id: 'users', label: 'Usuarios', icon: 'fas fa-user-cog', permission: 'manage_users' },
            { id: 'routes', label: 'Rutas', icon: 'fas fa-route', permission: 'manage_routes' },
            { id: 'export', label: 'Exportar', icon: 'fas fa-download', permission: 'export_data' },
            { id: 'settings', label: 'Configuración', icon: 'fas fa-cog', permission: 'system_settings' }
        ];

        const supervisorMenu = [
            { id: 'routes', label: 'Rutas', icon: 'fas fa-route', permission: 'manage_routes' },
            { id: 'export', label: 'Exportar', icon: 'fas fa-download', permission: 'export_data' }
        ];

        let menu = baseMenu.filter(item => this.hasPermission(userRole, item.permission));

        if (userRole === 'admin') {
            menu = menu.concat(adminMenu);
        } else if (userRole === 'supervisor') {
            menu = menu.concat(supervisorMenu);
        }

        return menu;
    }

    // Obtener configuración de interfaz basada en el rol
    getUIConfig(userRole) {
        const configs = {
            'admin': {
                showUserManagement: true,
                showSystemSettings: true,
                showAllRoutes: true,
                canDeleteStudents: true,
                canModifyPayments: true,
                theme: 'admin'
            },
            'conductor': {
                showUserManagement: false,
                showSystemSettings: false,
                showAllRoutes: false,
                canDeleteStudents: false,
                canModifyPayments: true,
                theme: 'conductor'
            },
            'supervisor': {
                showUserManagement: false,
                showSystemSettings: false,
                showAllRoutes: true,
                canDeleteStudents: false,
                canModifyPayments: true,
                theme: 'supervisor'
            }
        };

        return configs[userRole] || configs['conductor'];
    }
}

// Crear instancia global
const roleManager = new RoleManager();

// Función helper para verificar permisos
function hasPermission(permission) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return false;
    return roleManager.hasPermission(currentUser.role, permission);
}

// Función helper para verificar acciones
function canPerformAction(action) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return false;
    return roleManager.canPerformAction(currentUser.role, action);
}
