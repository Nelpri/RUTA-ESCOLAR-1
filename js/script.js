import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Constantes y referencias DOM
    const form = document.getElementById('registrationForm');
    const termsModal = document.getElementById('termsModal');
    const authOverlay = document.getElementById('authOverlay');
    const paymentReceipt = document.getElementById('paymentReceipt');
    let currentReceipt = null;

    // Objeto de validación con reglas específicas
    const VALIDATION_RULES = {
        studentName: {
            pattern: CONFIG.VALIDATION.namePattern,
            message: 'El nombre debe contener solo letras y espacios',
            minLength: 3
        },
        parentName: {
            pattern: CONFIG.VALIDATION.namePattern,
            message: 'El nombre debe contener solo letras y espacios',
            minLength: 3
        },
        phone: {
            pattern: CONFIG.VALIDATION.phonePattern,
            message: 'El teléfono debe tener 10 dígitos',
            minLength: 10
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingrese un correo electrónico válido'
        }
    };

    // Validación mejorada
    const initValidation = () => {
        Object.keys(VALIDATION_RULES).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.addEventListener('input', debounce((e) => {
                    validateField(e.target, VALIDATION_RULES[fieldId]);
                }, 300));
            }
        });
    };

    // Función debounce para optimizar la validación
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const validateField = (input, rules) => {
        const errorElement = input.nextElementSibling;
        const value = input.value.trim();
        
        if (!value) {
            showError(errorElement, 'Este campo es requerido');
            return false;
        }

        if (rules.minLength && value.length < rules.minLength) {
            showError(errorElement, `Mínimo ${rules.minLength} caracteres`);
            return false;
        }

        if (!rules.pattern.test(value)) {
            showError(errorElement, rules.message);
            return false;
        }

        hideError(errorElement);
        return true;
    };

    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
        element.setAttribute('aria-invalid', 'true');
    };

    const hideError = (element) => {
        element.style.display = 'none';
        element.setAttribute('aria-invalid', 'false');
    };

    // Manejo del formulario mejorado
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = getFormData();
        
        if (validateForm(formData)) {
            try {
                toggleLoading(true);
                await generateReceipt(formData);
                showSuccessMessage('Inscripción exitosa');
            } catch (error) {
                showErrorMessage('Error al procesar la inscripción');
                console.error('Error:', error);
            } finally {
                toggleLoading(false);
            }
        }
    });

    // Validación completa del formulario
    const validateForm = (formData) => {
        let isValid = true;
        Object.keys(VALIDATION_RULES).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input && !validateField(input, VALIDATION_RULES[fieldId])) {
                isValid = false;
            }
        });

        if (!document.getElementById('terms').checked) {
            showError(
                document.querySelector('.terms .error-message'),
                'Debe aceptar los términos y condiciones'
            );
            isValid = false;
        }

        return isValid;
    };

    // Generación de recibo mejorada
    const generateReceipt = async (formData) => {
        const receiptNumber = generateReceiptNumber();
        currentReceipt = {
            ...formData,
            date: new Date().toLocaleDateString('es-CO'),
            number: receiptNumber
        };

        updateReceiptDisplay(currentReceipt);
        return currentReceipt;
    };

    // Generador de número de recibo
    const generateReceiptNumber = () => {
        return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    // Actualización del display del recibo
    const updateReceiptDisplay = (receipt) => {
        Object.keys(receipt).forEach(key => {
            const element = document.getElementById(`receipt${capitalize(key)}`);
            if (element) {
                element.textContent = receipt[key];
            }
        });
        paymentReceipt.style.display = 'block';
    };

    // Utilidades
    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const showSuccessMessage = (message) => {
        // Implementar notificación de éxito
        alert(message); // Reemplazar con una mejor UI
    };

    const showErrorMessage = (message) => {
        // Implementar notificación de error
        alert(message); // Reemplazar con una mejor UI
    };

    // Manejo de PDF mejorado
    document.getElementById('downloadReceipt')?.addEventListener('click', async () => {
        if (!currentReceipt) return;
        
        const opt = {
            margin: 1,
            filename: `recibo-${currentReceipt.number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(paymentReceipt).save();
        } catch (error) {
            showErrorMessage('Error al generar el PDF');
            console.error('Error PDF:', error);
        }
    });

    // Autorización del conductor
    document.getElementById('authButton').addEventListener('click', () => {
        const password = document.getElementById('authPassword').value;
        if (password === CONFIG.SECURITY.driverPassword) {
            authOverlay.style.display = 'none';
            return true;
        }
        alert('Contraseña incorrecta');
        return false;
    });

    // Helpers
    const toggleLoading = (isLoading) => {
        const button = form.querySelector('button');
        button.disabled = isLoading;
        button.querySelector('i').style.display = isLoading ? 'inline-block' : 'none';
    };

    const getFormData = () => ({
        studentName: document.getElementById('studentName').value,
        parentName: document.getElementById('parentName').value,
        routeType: document.getElementById('routeType').value,
        paymentMonth: document.getElementById('paymentMonth').value
    });

    // Inicialización
    initValidation();
});