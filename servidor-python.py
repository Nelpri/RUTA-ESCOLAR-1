#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor local para la aplicación de Ruta Escolar
Ejecuta este archivo para servir la aplicación localmente
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from datetime import datetime

# Puerto para el servidor
PORT = 8000

# Directorio base de la aplicación
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class RutaEscolarHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)
    
    def do_GET(self):
        """Manejar peticiones GET"""
        if self.path == '/':
            # Redirigir a la página principal del usuario
            self.send_response(302)
            self.send_header('Location', '/index%20ruta1.html')
            self.end_headers()
            return
        
        # Servir archivos estáticos normalmente
        super().do_GET()
    
    def do_POST(self):
        """Manejar peticiones POST para la API"""
        if self.path == '/api/registrations':
            self.handle_registrations()
        elif self.path == '/api/sync':
            self.handle_sync()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_registrations(self):
        """Manejar operaciones CRUD de registros"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Leer registros existentes
            registrations_file = os.path.join(BASE_DIR, 'data', 'registrations.json')
            os.makedirs(os.path.dirname(registrations_file), exist_ok=True)
            
            if os.path.exists(registrations_file):
                with open(registrations_file, 'r', encoding='utf-8') as f:
                    registrations = json.load(f)
            else:
                registrations = []
            
            # Procesar operación
            operation = data.get('operation', 'read')
            
            if operation == 'create':
                # Agregar nuevo registro
                new_registration = data.get('data')
                new_registration['id'] = int(datetime.now().timestamp() * 1000)
                new_registration['date'] = datetime.now().isoformat()
                registrations.append(new_registration)
                
                # Guardar
                with open(registrations_file, 'w', encoding='utf-8') as f:
                    json.dump(registrations, f, indent=2, ensure_ascii=False)
                
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Registro creado exitosamente',
                    'data': new_registration
                }).encode('utf-8'))
                
            elif operation == 'read':
                # Leer todos los registros
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'data': registrations
                }).encode('utf-8'))
                
            elif operation == 'update':
                # Actualizar registro
                registration_id = data.get('id')
                updated_data = data.get('data')
                
                for i, reg in enumerate(registrations):
                    if reg.get('id') == registration_id:
                        registrations[i].update(updated_data)
                        break
                
                # Guardar
                with open(registrations_file, 'w', encoding='utf-8') as f:
                    json.dump(registrations, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Registro actualizado exitosamente'
                }).encode('utf-8'))
                
            elif operation == 'delete':
                # Eliminar registro
                registration_id = data.get('id')
                registrations = [reg for reg in registrations if reg.get('id') != registration_id]
                
                # Guardar
                with open(registrations_file, 'w', encoding='utf-8') as f:
                    json.dump(registrations, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Registro eliminado exitosamente'
                }).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))
    
    def handle_sync(self):
        """Manejar sincronización entre paneles"""
        try:
            # Leer registros
            registrations_file = os.path.join(BASE_DIR, 'data', 'registrations.json')
            
            if os.path.exists(registrations_file):
                with open(registrations_file, 'r', encoding='utf-8') as f:
                    registrations = json.load(f)
            else:
                registrations = []
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'data': registrations,
                'timestamp': datetime.now().isoformat()
            }).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

def main():
    """Función principal"""
    print("🚌 Iniciando servidor para Ruta Escolar...")
    print(f"📁 Directorio base: {BASE_DIR}")
    print(f"🌐 Servidor disponible en: http://localhost:{PORT}")
    print(f"👤 Panel de Usuario: http://localhost:{PORT}/index%20ruta1.html")
    print(f"👨‍💼 Panel de Administrador: http://localhost:{PORT}/index.html")
    print("⏹️  Presiona Ctrl+C para detener el servidor")
    print("-" * 60)
    
    try:
        with socketserver.TCPServer(("", PORT), RutaEscolarHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
    except Exception as e:
        print(f"❌ Error al iniciar servidor: {e}")

if __name__ == "__main__":
    main()
