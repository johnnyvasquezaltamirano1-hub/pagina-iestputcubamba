<?php
declare(strict_types=1);
// Solo para desarrollo local. No publiques este archivo con credenciales reales.
$host = '127.0.0.1';
$puerto = '3306'; // Cambia solo si tu MySQL usa otro puerto.
$base = 'bd_iestp_utcubamba';
$usuario = 'root';
$contrasena = ''; // Ajusta según tu instalación local.
try {
    $pdo = new PDO(
        "mysql:host={$host};port={$puerto};dbname={$base};charset=utf8mb4",
        $usuario,
        $contrasena,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
         PDO::ATTR_EMULATE_PREPARES => false]
    );
} catch (PDOException $e) {
    error_log('Error de conexión a BD: ' . $e->getMessage());
    http_response_code(500);
    exit('No se pudo conectar a la base de datos. Revisa la configuración de MySQL.');
}
