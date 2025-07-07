#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

# Configurar el puerto
PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

# Cambiar al directorio del script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Configurar el servidor
Handler = MyHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Servidor iniciado en http://localhost:{PORT}")
        print(f"📁 Sirviendo archivos desde: {os.getcwd()}")
        print("🔄 Presiona Ctrl+C para detener el servidor")
        
        # Abrir el navegador automáticamente
        webbrowser.open(f'http://localhost:{PORT}')
        
        # Iniciar el servidor
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n🛑 Servidor detenido")
    sys.exit(0)
except OSError as e:
    if e.errno == 98:  # Puerto ya en uso
        print(f"❌ Error: El puerto {PORT} ya está en uso")
        print("💡 Intenta cerrar otras aplicaciones que usen este puerto o cambia el puerto")
    else:
        print(f"❌ Error: {e}")
    sys.exit(1)
