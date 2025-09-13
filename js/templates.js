// Sistema de plantillas para evitar duplicación de código
class TemplateManager {
    constructor() {
        this.templates = {
            // Plantilla base del HTML
            baseHTML: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Servicio de transporte escolar confiable y seguro">
  <meta name="keywords" content="transporte escolar, ruta escolar, seguridad infantil">
  <title>{{title}}</title>
  <link rel="stylesheet" href="css/styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
  {{content}}
  {{scripts}}
</body>
</html>`,

            // Plantilla del modal de login
            loginModal: `
<div id="loginModal" class="modal" style="display: block;">
  <div class="modal-content">
    <h2><i class="fas fa-lock"></i> Acceso Administrativo</h2>
    <form id="loginForm">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" required placeholder="Ingrese su usuario">
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" required placeholder="Ingrese su contraseña">
      </div>
      <button type="submit" class="btn">
        <i class="fas fa-sign-in-alt"></i> Ingresar
      </button>
    </form>
    <p class="login-error" id="loginError" style="display: none; color: #e91e63; margin-top: 1rem;"></p>
  </div>
</div>`,

            // Plantilla del header
            header: `
<header role="banner">
  <div class="container">
    <h1>{{title}}</h1>
    <nav>
      {{navButtons}}
    </nav>
  </div>
</header>`,

            // Plantilla del footer
            footer: `
<footer role="contentinfo">
  <div class="container">
    <p>© Desarrollado por Nelson Prieto</p>
    <p>© 2025 Ruta Escolar - Todos los derechos reservados</p>
  </div>
</footer>`,

            // Plantilla del panel de usuario
            userPanel: `
<div class="user-panel">
  <div class="container">
    <div class="welcome-section">
      <h2>¡Bienvenido a Ruta Escolar Segura!</h2>
      <p>Inscripciones para el servicio de transporte escolar</p>
    </div>

    <!-- Aviso de términos y condiciones -->
    <div id="termsNotice" class="terms-notice">
      <div class="notice-content">
        <h3><i class="fas fa-info-circle"></i> Términos y Condiciones</h3>
        <p>Para continuar con la inscripción, debe leer y aceptar nuestros términos y condiciones.</p>
        <button id="readTermsBtn" class="btn btn-primary">
          <i class="fas fa-file-contract"></i> Leer Términos y Condiciones
        </button>
      </div>
    </div>

    <!-- Formulario de inscripción -->
    <form id="registrationForm" class="registration-form" style="display: none;">
      <h3><i class="fas fa-user-plus"></i> Formulario de Inscripción</h3>
      
      <div class="form-group">
        <label for="studentName">Nombre del Estudiante *</label>
        <input type="text" id="studentName" required placeholder="Nombre completo del estudiante">
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label for="parentName">Nombre del Padre/Madre *</label>
        <input type="text" id="parentName" required placeholder="Nombre completo del acudiente">
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico *</label>
        <input type="email" id="email" required placeholder="correo@ejemplo.com">
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label for="phone">Teléfono *</label>
        <input type="tel" id="phone" required placeholder="300 123 4567">
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label for="routeType">Tipo de Ruta *</label>
        <select id="routeType" required>
          <option value="">Seleccione una opción</option>
          <option value="media168">Media Ruta - $168,000</option>
          <option value="media180">Media Ruta - $180,000</option>
          <option value="completa">Ruta Completa - $284,000</option>
        </select>
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label for="paymentMonth">Mes de Pago *</label>
        <select id="paymentMonth" required>
          <option value="">Seleccione un mes</option>
          <option value="enero">Enero</option>
          <option value="febrero">Febrero</option>
          <option value="marzo">Marzo</option>
          <option value="abril">Abril</option>
          <option value="mayo">Mayo</option>
          <option value="junio">Junio</option>
          <option value="julio">Julio</option>
          <option value="agosto">Agosto</option>
          <option value="septiembre">Septiembre</option>
          <option value="octubre">Octubre</option>
          <option value="noviembre">Noviembre</option>
          <option value="diciembre">Diciembre</option>
        </select>
        <span class="error-message" style="display: none;"></span>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" id="terms" required>
          <span class="checkmark"></span>
          Acepto los <a href="#" id="termsLink">términos y condiciones</a> *
        </label>
        <span class="error-message" style="display: none;"></span>
      </div>

      <button type="submit" id="submitBtn" class="btn btn-primary" disabled>
        <i class="fas fa-spinner fa-spin" style="display: none;"></i>
        <span>Acepte los términos para continuar</span>
      </button>
    </form>

    <!-- Comprobante de pago -->
    <div id="paymentReceipt" class="payment-receipt" style="display: none;">
      <h3><i class="fas fa-receipt"></i> Comprobante de Pago</h3>
      <div class="receipt-content">
        <p><strong>Número:</strong> <span id="receiptNumber"></span></p>
        <p><strong>Estudiante:</strong> <span id="receiptStudentName"></span></p>
        <p><strong>Acudiente:</strong> <span id="receiptParentName"></span></p>
        <p><strong>Ruta:</strong> <span id="receiptRouteType"></span></p>
        <p><strong>Valor:</strong> $<span id="receiptAmount"></span></p>
        <p><strong>Mes:</strong> <span id="receiptMonth"></span></p>
        <p id="pendingMessage" style="display: block; color: #ff9800; font-weight: bold;">
          ⏳ Pendiente de verificación por el administrador
        </p>
        <button id="downloadReceipt" class="btn btn-success" style="display: none;">
          <i class="fas fa-download"></i> Descargar Comprobante
        </button>
      </div>
    </div>

    <!-- Notificación de éxito -->
    <div id="successNotification" class="success-notification" style="display: none;">
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <h4>¡Inscripción Exitosa!</h4>
        <p>Su inscripción ha sido registrada correctamente. Recibirá una notificación cuando sea verificada.</p>
        <button id="closeNotification" class="btn btn-secondary">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de términos y condiciones -->
<div id="termsModal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    <h2><i class="fas fa-file-contract"></i> Términos y Condiciones</h2>
    <div class="terms-content">
      <h3>1. Servicio de Transporte Escolar</h3>
      <p>El servicio de transporte escolar se presta de lunes a viernes en horarios escolares establecidos.</p>
      
      <h3>2. Responsabilidades del Usuario</h3>
      <ul>
        <li>Puntualidad en los puntos de recogida</li>
        <li>Comportamiento adecuado durante el trayecto</li>
        <li>Pago oportuno de los servicios</li>
        <li>Comunicación de cambios de dirección o teléfono</li>
      </ul>
      
      <h3>3. Responsabilidades del Prestador</h3>
      <ul>
        <li>Seguridad y cuidado de los estudiantes</li>
        <li>Puntualidad en los horarios establecidos</li>
        <li>Mantenimiento adecuado de los vehículos</li>
        <li>Comunicación de cambios o incidencias</li>
      </ul>
      
      <h3>4. Política de Pagos</h3>
      <p>Los pagos deben realizarse antes del día 5 de cada mes. Después de esta fecha se aplicará un recargo del 10%.</p>
      
      <h3>5. Suspensión del Servicio</h3>
      <p>El servicio puede ser suspendido por incumplimiento de pagos o comportamiento inadecuado del estudiante.</p>
      
      <h3>6. Contacto</h3>
      <p>Para consultas o reportes: <strong>Teléfono:</strong> 300-123-4567 | <strong>Email:</strong> contacto@rutaescolar.com</p>
    </div>
    <div class="modal-actions">
      <button id="acceptTerms" class="btn btn-primary">
        <i class="fas fa-check"></i> Aceptar Términos
      </button>
    </div>
  </div>
</div>`,

            // Plantilla de scripts
            scripts: `
<script src="js/config.js"></script>
<script src="js/jwt.js"></script>
<script src="js/security.js"></script>
<script src="js/roles.js"></script>
<script src="js/auth.js"></script>
<script src="js/notification.js"></script>
<script src="js/api.js"></script>
<script src="js/script.js"></script>
<script src="js/admin.js"></script>`
        };
    }

    // Renderizar plantilla con variables
    render(templateName, variables = {}) {
        let template = this.templates[templateName];
        if (!template) {
            console.error(`Template ${templateName} not found`);
            return '';
        }

        // Reemplazar variables
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, variables[key] || '');
        });

        return template;
    }

    // Obtener botones de navegación según el rol
    getNavigationButtons(userRole) {
        const buttons = {
            'admin': `
                <a href="#" id="userPanelBtn" class="btn" style="display: none;">
                  <i class="fas fa-users"></i> Panel de Usuario
                </a>
                <button id="btnLogout" class="btn">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>`,
            'conductor': `
                <a href="#" id="userPanelBtn" class="btn" style="display: none;">
                  <i class="fas fa-users"></i> Panel de Usuario
                </a>
                <button id="btnLogout" class="btn">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>`,
            'supervisor': `
                <a href="#" id="userPanelBtn" class="btn" style="display: none;">
                  <i class="fas fa-users"></i> Panel de Usuario
                </a>
                <button id="btnLogout" class="btn">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>`,
            'default': `
                <a href="#" id="adminPanelBtn" class="btn">
                  <i class="fas fa-cog"></i> Panel Administrativo
                </a>`
        };

        return buttons[userRole] || buttons['default'];
    }

    // Obtener título según el contexto
    getTitle(context, userRole = null) {
        const titles = {
            'admin': '🚌 Panel de Administración',
            'conductor': '🚌 Panel de Conductor',
            'supervisor': '🚌 Panel de Supervisor',
            'user': '🚌 Ruta Escolar Segura',
            'default': '🚌 Ruta Escolar Segura'
        };

        if (context === 'admin' && userRole) {
            return titles[userRole] || titles['admin'];
        }

        return titles[context] || titles['default'];
    }
}

// Crear instancia global
const templateManager = new TemplateManager();