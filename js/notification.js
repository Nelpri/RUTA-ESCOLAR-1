// Sistema de notificaciones
class NotificationSystem {
    constructor() {
      this.notifications = [];
      this.init();
    }
  
    init() {
      // No solicitar permiso automáticamente
      // Se solicitará solo cuando el usuario interactúe
      console.log('Sistema de notificaciones inicializado');
    }
  
    async requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return Notification.permission === 'granted';
    }

    async sendPaymentReminder(studentName, parentEmail, dueDate) {
      const message = `Recordatorio de pago para ${studentName}. Fecha límite: ${dueDate}`;
      
      // Solicitar permiso si es necesario
      const hasPermission = await this.requestNotificationPermission();
      
      // Enviar notificación push si está soportado
      if ('Notification' in window && hasPermission) {
        new Notification('Recordatorio de Pago', { body: message });
      }
  
      // Guardar la notificación en el historial
      this.notifications.push({
        type: 'payment',
        message,
        date: new Date(),
        status: 'sent'
      });
  
      // Aquí iría la lógica para enviar email
      console.log(`Email enviado a ${parentEmail}: ${message}`);
    }
  
    checkPaymentStatus() {
      const today = new Date();
      const day = today.getDate();
      
      // Recordatorio automático si es después del día 5
      if (day > 5) {
        const unpaidStudents = this.getUnpaidStudents();
        unpaidStudents.forEach(student => {
          this.sendPaymentReminder(
            student.name,
            student.email,
            '5 del mes actual'
          );
        });
      }
    }
  
    getUnpaidStudents() {
      // Aquí iría la lógica para obtener estudiantes con pagos pendientes
      return JSON.parse(localStorage.getItem('unpaidStudents') || '[]');
    }
  }
  
  const notificationSystem = new NotificationSystem(); 