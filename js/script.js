import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const termsModal = document.getElementById('termsModal');
    const authOverlay = document.getElementById('authOverlay');
    let currentReceipt = null;

    // Validación en tiempo real
    const initValidation = () => {
        document.getElementById('studentName').addEventListener('input', (e) => {
            validateField(e.target, CONFIG.VALIDATION.namePattern, 'Nombre inválido');
        });
        
        document.getElementById('phone').addEventListener('input', (e) => {
            validateField(e.target, CONFIG.VALIDATION.phonePattern, 'Teléfono inválido');
        });
    };

    const validateField = (input, pattern, errorMsg) => {
        const errorElement = input.nextElementSibling;
        if (!pattern.test(input.value)) {
            errorElement.textContent = errorMsg;
            errorElement.style.display = 'block';
            return false;
        }
        errorElement.style.display = 'none';
        return true;
    };

    // Manejo del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = getFormData();
        
        if (validateForm(formData)) {
            toggleLoading(true);
            await generateReceipt(formData);
            toggleLoading(false);
        }
    });

    // Generar PDF
    document.getElementById('downloadReceipt').addEventListener('click', () => {
        html2pdf().from(paymentReceipt).save();
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