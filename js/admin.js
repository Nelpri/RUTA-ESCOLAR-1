document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación al inicio
    if (!localStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
        return;
    }

    // Referencias a elementos del DOM
    const studentsTableBody = document.getElementById('studentsTableBody');
    const filterMonth = document.getElementById('filterMonth');
    const btnLogout = document.getElementById('btnLogout');

    // Función para cargar estudiantes
    function loadStudents(monthFilter = '') {
        try {
            // Obtener estudiantes del localStorage
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            console.log('Estudiantes cargados:', students); // Para debugging

            // Limpiar tabla
            studentsTableBody.innerHTML = '';

            // Filtrar y mostrar estudiantes
            students
                .filter(student => !monthFilter || student.mes === monthFilter)
                .forEach(student => {
                    const row = document.createElement('tr');
                    const estadoRecibo = student.reciboAutorizado ? 'Autorizado' : 'Pendiente';
                    
                    row.innerHTML = `
                        <td>${student.fecha || '-'}</td>
                        <td>${student.nombreEstudiante}</td>
                        <td>${student.grado}</td>
                        <td>${student.nombreAcudiente}</td>
                        <td>${student.telefono}</td>
                        <td>${student.tipoRuta}</td>
                        <td>${student.mes}</td>
                        <td>${estadoRecibo}</td>
                        <td>
                            ${!student.reciboAutorizado ? 
                                `<button class="btn-action btn-authorize" onclick="autorizarRecibo('${student.id}')">Autorizar</button>` : 
                                ''
                            }
                            <button class="btn-action btn-view" onclick="verRecibo('${student.id}')">Ver Recibo</button>
                            <button class="btn-action btn-delete" onclick="eliminarEstudiante('${student.id}')">Eliminar</button>
                        </td>
                    `;
                    studentsTableBody.appendChild(row);
                });
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    }

    // Event Listeners
    filterMonth.addEventListener('change', (e) => {
        loadStudents(e.target.value);
    });

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    });

    // Cargar estudiantes inicialmente
    loadStudents();
});

// Funciones globales para los botones de acción
function autorizarRecibo(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        // Generar número de consecutivo
        const mes = students[studentIndex].mes;
        const baseNumber = CONFIG.RECEIPT_BASES[mes];
        const existingReceipts = students.filter(s => s.mes === mes && s.numeroRecibo).length;
        const consecutivo = baseNumber + existingReceipts + 1;
        
        // Actualizar estudiante con autorización y consecutivo
        students[studentIndex].reciboAutorizado = true;
        students[studentIndex].numeroRecibo = consecutivo;
        localStorage.setItem('students', JSON.stringify(students));
        
        alert('Recibo autorizado con éxito. El estudiante puede generar su recibo desde la página principal.');
        location.reload();
    }
}

function verRecibo(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        alert(`
            Datos del Recibo:
            Estudiante: ${student.nombreEstudiante}
            Estado: ${student.reciboAutorizado ? 'Autorizado' : 'Pendiente'}
            ${student.reciboAutorizado ? 'Número de Recibo: ' + student.numeroRecibo : ''}
        `);
    }
}

function eliminarEstudiante(studentId) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = students.filter(s => s.id !== studentId);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        location.reload();
    }
}
