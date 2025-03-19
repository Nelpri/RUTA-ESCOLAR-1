document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const registrationForm = document.getElementById('registrationForm');
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');
    const acceptTerms = document.getElementById('acceptTerms');
    const termsCheckbox = document.getElementById('termsAccepted');

    // Verificar que todos los elementos existen
    if (!registrationForm) {
        console.error('No se encontró el formulario de registro');
        return;
    }

    // Manejador del formulario de registro
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener todos los campos del formulario
        const nombreEstudiante = document.getElementById('nombreEstudiante');
        const grado = document.getElementById('grado');
        const nombreAcudiente = document.getElementById('nombreAcudiente');
        const telefono = document.getElementById('telefono');
        const tipoRuta = document.getElementById('tipoRuta');
        const mes = document.getElementById('mes');

        // Verificar que todos los campos existen y tienen valor
        if (!nombreEstudiante || !grado || !nombreAcudiente || !telefono || !tipoRuta || !mes) {
            alert('Error: Faltan campos en el formulario');
            return;
        }

        if (!termsCheckbox.checked) {
            alert('Debe aceptar los términos y condiciones');
            return;
        }

        // Crear objeto con datos del estudiante
        const studentData = {
            id: Date.now().toString(),
            fecha: new Date().toLocaleDateString(),
            nombreEstudiante: nombreEstudiante.value,
            grado: grado.value,
            nombreAcudiente: nombreAcudiente.value,
            telefono: telefono.value,
            tipoRuta: tipoRuta.value,
            mes: mes.value,
            precio: CONFIG.PRICES[tipoRuta.value]
        };

        // Guardar en localStorage
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        students.push(studentData);
        localStorage.setItem('students', JSON.stringify(students));

        // Crear y mostrar el recibo
        const receiptHTML = `
            <div id="receipt" style="background: white; padding: 20px; margin: 20px 0; border: 1px solid #ccc; border-radius: 8px;">
                <h2>Recibo de Inscripción</h2>
                <p><strong>Fecha:</strong> ${studentData.fecha}</p>
                <p><strong>Estudiante:</strong> ${studentData.nombreEstudiante}</p>
                <p><strong>Grado:</strong> ${studentData.grado}</p>
                <p><strong>Acudiente:</strong> ${studentData.nombreAcudiente}</p>
                <p><strong>Teléfono:</strong> ${studentData.telefono}</p>
                <p><strong>Tipo de Ruta:</strong> ${studentData.tipoRuta}</p>
                <p><strong>Mes:</strong> ${studentData.mes}</p>
                <p><strong>Valor a Pagar:</strong> $${studentData.precio.toLocaleString()}</p>
                <button onclick="window.print()" style="margin-top: 10px; padding: 8px 16px;">Imprimir Recibo</button>
            </div>
        `;

        // Eliminar recibo anterior si existe
        const oldReceipt = document.getElementById('receipt');
        if (oldReceipt) {
            oldReceipt.remove();
        }

        // Agregar nuevo recibo
        const receiptContainer = document.createElement('div');
        receiptContainer.innerHTML = receiptHTML;
        registrationForm.after(receiptContainer);

        // Mostrar mensaje de éxito
        alert('Inscripción realizada con éxito. La página se recargará en 3 segundos.');
        
        // Esperar 3 segundos y luego redirigir al inicio
        setTimeout(() => {
            // Limpiar el formulario
            registrationForm.reset();
            
            // Eliminar el recibo
            const receipt = document.getElementById('receipt');
            if (receipt) {
                receipt.remove();
            }
            
            // Hacer scroll al inicio
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Recargar la página
            location.reload();
        }, 3000); // 3000 milisegundos = 3 segundos
    });

    // Manejadores para términos y condiciones (solo si existen los elementos)
    if (termsLink && termsModal && closeTerms && acceptTerms) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.style.display = 'block';
        });

        closeTerms.addEventListener('click', () => {
            termsModal.style.display = 'none';
        });

        acceptTerms.addEventListener('click', () => {
            termsCheckbox.checked = true;
            termsModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                termsModal.style.display = 'none';
            }
        });
    }

    // Manejador para el botón de inicio
    const btnInicio = document.getElementById('btnInicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            // Si ya está autenticado, ir directamente al admin
            if (localStorage.getItem('isAuthenticated')) {
                window.location.href = 'admin.html';
            } else {
                // Si no está autenticado, mostrar el modal de login
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'block';
                }
            }
        });
    }

    // Referencias para el login
    const btnLogin = document.getElementById('btnLogin');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const closeModal = document.querySelector('.close-modal');

    // Mostrar modal de login
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            console.log('Botón login clickeado'); // Para debugging
            if (loginModal) {
                loginModal.style.display = 'block';
            }
        });
    }

    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Manejar envío del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulario de login enviado'); // Para debugging

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Credenciales:', { username, password }); // Para debugging

            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

    // Agregar función para verificar recibo
    const verificarRecibo = document.getElementById('verificarRecibo');
    if (verificarRecibo) {
        verificarRecibo.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreEstudiante = document.getElementById('nombreVerificacion').value;
            const mesVerificacion = document.getElementById('mesVerificacion').value;
            
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const student = students.find(s => 
                s.nombreEstudiante.toLowerCase() === nombreEstudiante.toLowerCase() && 
                s.mes === mesVerificacion
            );

            if (student && student.reciboAutorizado) {
                generarRecibo(student);
            } else if (student) {
                alert('El recibo aún no ha sido autorizado por administración.');
            } else {
                alert('No se encontró el registro del estudiante.');
            }
        });
    }

    function generarRecibo(student) {
        const receiptHTML = `
            <div id="receipt" class="receipt-container">
                <div class="receipt-header">
                    <h2>🚌 Ruta Escolar Segura</h2>
                    <h3>Recibo de Pago</h3>
                    <p class="receipt-number">No. ${student.numeroRecibo}</p>
                </div>
                
                <div class="receipt-body">
                    <div class="receipt-section">
                        <h4>Datos del Estudiante</h4>
                        <p><strong>Nombre:</strong> ${student.nombreEstudiante}</p>
                        <p><strong>Grado:</strong> ${student.grado}</p>
                    </div>

                    <div class="receipt-section">
                        <h4>Datos del Acudiente</h4>
                        <p><strong>Nombre:</strong> ${student.nombreAcudiente}</p>
                        <p><strong>Teléfono:</strong> ${student.telefono}</p>
                    </div>

                    <div class="receipt-section">
                        <h4>Detalles del Servicio</h4>
                        <p><strong>Tipo de Ruta:</strong> ${student.tipoRuta}</p>
                        <p><strong>Mes:</strong> ${student.mes}</p>
                        <p><strong>Valor:</strong> $${student.precio.toLocaleString()}</p>
                    </div>

                    <div class="receipt-footer">
                        <p>Recibo Autorizado por Administración</p>
                        <p>Fecha de emisión: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div class="receipt-actions">
                    <button onclick="window.print()" class="btn btn-primary">Imprimir Recibo</button>
                </div>
            </div>
        `;

        // Eliminar recibo anterior si existe
        const oldReceipt = document.getElementById('receipt');
        if (oldReceipt) {
            oldReceipt.remove();
        }

        // Mostrar nuevo recibo
        const receiptContainer = document.createElement('div');
        receiptContainer.innerHTML = receiptHTML;
        document.querySelector('.container').appendChild(receiptContainer);
    }
});
