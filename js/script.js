// CONFIG ya está disponible globalmente

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const termsModal = document.getElementById('termsModal');
    const termsLink = document.getElementById('termsLink');
    const closeModal = document.querySelector('.close-modal');
    const acceptTermsBtn = document.getElementById('acceptTerms');
    const readTermsBtn = document.getElementById('readTermsBtn');
    const termsNotice = document.getElementById('termsNotice');
    const submitBtn = document.getElementById('submitBtn');
    const successNotification = document.getElementById('successNotification');
    const closeNotificationBtn = document.getElementById('closeNotification');
    const paymentReceipt = document.getElementById('paymentReceipt');
    let currentReceipt = null;
    let termsAccepted = false;

    // Validación en tiempo real
    const initValidation = () => {
        const studentNameInput = document.getElementById('studentName');
        const phoneInput = document.getElementById('phone');
        
        if (studentNameInput) {
            studentNameInput.addEventListener('input', (e) => {
                validateField(e.target, CONFIG.VALIDATION.namePattern, 'Nombre inválido');
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                validateField(e.target, CONFIG.VALIDATION.phonePattern, 'Teléfono inválido');
            });
        }
    };

    const validateField = (input, pattern, errorMsg) => {
        const errorElement = input.nextElementSibling;
        if (errorElement && !pattern.test(input.value)) {
            errorElement.textContent = errorMsg;
            errorElement.style.display = 'block';
            return false;
        }
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    };

    // Validación completa del formulario
    const validateForm = (formData) => {
        let isValid = true;
        
        // Validar nombre del estudiante
        if (!CONFIG.VALIDATION.namePattern.test(formData.studentName)) {
            showError('studentName', 'Nombre inválido');
            isValid = false;
        }
        
        // Validar nombre del padre/madre
        if (!CONFIG.VALIDATION.namePattern.test(formData.parentName)) {
            showError('parentName', 'Nombre del padre/madre inválido');
            isValid = false;
        }
        
        // Validar email
        if (!CONFIG.VALIDATION.emailPattern.test(formData.email)) {
            showError('email', 'Email inválido');
            isValid = false;
        }
        
        // Validar teléfono
        if (!CONFIG.VALIDATION.phonePattern.test(formData.phone)) {
            showError('phone', 'Teléfono inválido');
            isValid = false;
        }
        
        // Validar tipo de ruta
        if (!formData.routeType) {
            showError('routeType', 'Seleccione un tipo de ruta');
            isValid = false;
        }
        
        // Validar mes de pago
        if (!formData.paymentMonth) {
            showError('paymentMonth', 'Seleccione un mes');
            isValid = false;
        }
        
        // Validar términos y condiciones
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            showError('terms', 'Debe aceptar los términos y condiciones');
            isValid = false;
        }
        
        return isValid;
    };

    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    };

    // Generar comprobante
    const generateReceipt = async (formData) => {
        try {
            const receiptNumber = generateReceiptNumber(formData.paymentMonth);
            const amount = CONFIG.PRICES[formData.routeType];
            
            // Llenar datos del comprobante
            document.getElementById('receiptNumber').textContent = receiptNumber;
            document.getElementById('receiptStudentName').textContent = formData.studentName;
            document.getElementById('receiptParentName').textContent = formData.parentName;
            document.getElementById('receiptRouteType').textContent = getRouteTypeName(formData.routeType);
            document.getElementById('receiptAmount').textContent = amount.toLocaleString();
            document.getElementById('receiptMonth').textContent = formData.paymentMonth;
            
            // Mostrar comprobante (pendiente de autorización)
            paymentReceipt.style.display = 'block';
            paymentReceipt.scrollIntoView({ behavior: 'smooth' });
            
            // Mostrar mensaje de pendiente y ocultar botón de descarga
            const downloadBtn = document.getElementById('downloadReceipt');
            const pendingMessage = document.getElementById('pendingMessage');
            if (downloadBtn) downloadBtn.style.display = 'none';
            if (pendingMessage) pendingMessage.style.display = 'block';
            
            // Guardar en localStorage
            saveRegistration(formData, receiptNumber);
            
            // Mostrar notificación de éxito
            setTimeout(() => {
                successNotification.style.display = 'block';
                successNotification.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
            
            // Limpiar formulario después de inscripción exitosa
            setTimeout(() => {
                form.reset();
                termsAccepted = false;
                updateSubmitButton();
                // Ocultar formulario y mostrar aviso de términos nuevamente
                form.style.display = 'none';
                termsNotice.style.display = 'block';
            }, 3000);
            
        } catch (error) {
            console.error('Error generando comprobante:', error);
            alert('Error al generar el comprobante');
        }
    };

    const generateReceiptNumber = (month) => {
        const base = CONFIG.RECEIPT_BASES[month] || 250000;
        const random = Math.floor(Math.random() * 1000);
        return base + random;
    };

    const getRouteTypeName = (routeType) => {
        const names = {
            'media168': 'Media Ruta - $168,000',
            'media180': 'Media Ruta - $180,000',
            'completa': 'Ruta Completa - $284,000'
        };
        return names[routeType] || routeType;
    };

    const saveRegistration = async (formData, receiptNumber) => {
        const registration = {
            ...formData,
            receiptNumber,
            amount: CONFIG.PRICES[formData.routeType],
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        try {
            if (api.isServerAvailable()) {
                // Usar API del servidor
                console.log('🌐 Usando API del servidor');
                const savedRegistration = await api.createRegistration(registration);
                console.log('✅ Inscripción guardada en servidor:', savedRegistration);
            } else {
                // Usar localStorage como fallback
                console.log('💾 Usando localStorage como fallback');
                registration.id = Date.now();
                
                const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
                registrations.push(registration);
                localStorage.setItem('registrations', JSON.stringify(registrations));
                
                // Verificar que se guardó correctamente
                const savedData = localStorage.getItem('registrations');
                console.log('✅ Datos guardados en localStorage:', savedData);
                console.log('✅ Número de registros guardados:', registrations.length);
                
                // Disparar evento personalizado para sincronizar con otras pestañas
                window.dispatchEvent(new CustomEvent('registrationUpdated', {
                    detail: { registrations }
                }));

                // Usar BroadcastChannel para sincronización entre pestañas
                if (typeof BroadcastChannel !== 'undefined') {
                    const channel = new BroadcastChannel('registration-updates');
                    channel.postMessage({ type: 'registrationAdded', data: registration });
                    channel.close();
                }
            }
            
            console.log('✅ Inscripción guardada exitosamente');
            
        } catch (error) {
            console.error('❌ Error al guardar inscripción:', error);
            alert('Error al guardar la inscripción. Intenta nuevamente.');
        }
    };

    // Función para mostrar mensaje de éxito
    const showSuccessMessage = (studentName) => {
        console.log(`Inscripción exitosa para: ${studentName}`);
        // Aquí podrías agregar más lógica si necesitas notificar algo más
    };

    // Manejo del formulario
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = getFormData();
            
            if (validateForm(formData)) {
                toggleLoading(true);
                await generateReceipt(formData);
                toggleLoading(false);
            }
        });
    }

    // Generar PDF
    const downloadBtn = document.getElementById('downloadReceipt');
    if (downloadBtn && paymentReceipt) {
        downloadBtn.addEventListener('click', () => {
            html2pdf().from(paymentReceipt).save();
        });
    }

    // Manejo del botón "Leer Términos"
    if (readTermsBtn) {
        readTermsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.style.display = 'block';
            }
        });
    }

    // Manejo del modal de términos y condiciones
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.style.display = 'block';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.style.display = 'none';
            }
        });
    }

    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox) {
                termsCheckbox.checked = true;
                termsAccepted = true;
            }
            
            if (termsModal) {
                termsModal.style.display = 'none';
            }
            
            // Mostrar formulario y ocultar aviso
            if (termsNotice) {
                termsNotice.style.display = 'none';
            }
            
            if (form) {
                form.style.display = 'block';
            }
            
            // Habilitar botón de envío
            updateSubmitButton();
        });
    }

    // Cerrar modal al hacer clic fuera de él
    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                termsModal.style.display = 'none';
            }
        });
    }

    // Manejo del checkbox de términos
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', () => {
            termsAccepted = termsCheckbox.checked;
            updateSubmitButton();
        });
    }

    // Función para actualizar el estado del botón de envío
    function updateSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = !termsAccepted;
            if (termsAccepted) {
                submitBtn.textContent = 'Inscribir';
                submitBtn.classList.remove('disabled');
            } else {
                submitBtn.textContent = 'Acepte los términos para continuar';
                submitBtn.classList.add('disabled');
            }
        }
    }

    // Manejo de la notificación de éxito
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            successNotification.style.display = 'none';
        });
    }

    // Helpers
    const toggleLoading = (isLoading) => {
        const button = form.querySelector('button');
        if (button) {
            button.disabled = isLoading;
            const loadingIcon = button.querySelector('i');
            if (loadingIcon) {
                loadingIcon.style.display = isLoading ? 'inline-block' : 'none';
            }
        }
    };

    const getFormData = () => ({
        studentName: document.getElementById('studentName')?.value || '',
        parentName: document.getElementById('parentName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        routeType: document.getElementById('routeType')?.value || '',
        paymentMonth: document.getElementById('paymentMonth')?.value || ''
    });

    // Función para verificar estado de autorización
    const checkAuthorizationStatus = () => {
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        
        // Verificar si hay algún registro que cambió de pendiente a pagado
        registrations.forEach(registration => {
            if (registration.status === 'paid' && !registration.notified) {
                showAuthorizedReceipt(registration);
                // Marcar como notificado para evitar notificaciones repetidas
                registration.notified = true;
                localStorage.setItem('registrations', JSON.stringify(registrations));
            }
        });
    };

    const showAuthorizedReceipt = (registration) => {
        const downloadBtn = document.getElementById('downloadReceipt');
        const pendingMessage = document.getElementById('pendingMessage');
        
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => {
                // Generar PDF del comprobante autorizado
                const receiptData = {
                    receiptNumber: registration.receiptNumber,
                    studentName: registration.studentName,
                    parentName: registration.parentName,
                    routeType: getRouteTypeName(registration.routeType),
                    amount: registration.amount,
                    month: registration.paymentMonth
                };
                generatePDF(receiptData);
            };
        }
        
        if (pendingMessage) {
            pendingMessage.style.display = 'none';
        }
        
        // Mostrar notificación de autorización
        showNotification('¡Su pago ha sido verificado! Ya puede descargar el comprobante.', 'success');
    };

    const generatePDF = (data) => {
        // Crear contenido HTML para el PDF
        const pdfContent = `
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h1>🚌 Ruta Escolar Segura</h1>
                <h2>Comprobante de Pago Autorizado</h2>
                <hr>
                <p><strong>Número:</strong> ${data.receiptNumber}</p>
                <p><strong>Estudiante:</strong> ${data.studentName}</p>
                <p><strong>Acudiente:</strong> ${data.parentName}</p>
                <p><strong>Ruta:</strong> ${data.routeType}</p>
                <p><strong>Valor:</strong> $${data.amount.toLocaleString()}</p>
                <p><strong>Mes:</strong> ${data.month}</p>
                <p><strong>Estado:</strong> ✅ AUTORIZADO</p>
                <hr>
                <p><em>Fecha de autorización: ${new Date().toLocaleDateString('es-ES')}</em></p>
            </div>
        `;
        
        // Crear elemento temporal para el PDF
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pdfContent;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        // Generar PDF
        html2pdf().from(tempDiv).save(`comprobante_${data.receiptNumber}.pdf`);
        
        // Limpiar elemento temporal
        document.body.removeChild(tempDiv);
    };

    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    // Verificar estado de autorización al cargar la página
    checkAuthorizationStatus();
    
    // Verificar cada 30 segundos si hay cambios
    setInterval(checkAuthorizationStatus, 30000);

    // Inicialización
    initValidation();
});