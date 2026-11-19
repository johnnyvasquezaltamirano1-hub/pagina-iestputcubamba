<?php
declare(strict_types=1);
require __DIR__ . '/conexion.php';
header('Content-Type: text/html; charset=utf-8');
$tablas = (int) $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'")->fetchColumn();
echo '<!doctype html><html lang="es"><meta charset="utf-8"><title>Prueba de conexión</title><body style="font-family:Arial;padding:30px">';
echo '<h2>Conexión a MySQL correcta</h2>';
echo '<p>Base de datos: <strong>bd_iestp_utcubamba</strong></p>';
echo '<p>Tablas encontradas: <strong>' . $tablas . '</strong></p>';
echo '<p>Esta prueba no modifica datos ni el diseño del sitio.</p></body></html>';
