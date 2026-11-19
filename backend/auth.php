<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if (session_status() !== PHP_SESSION_ACTIVE) { session_set_cookie_params(['httponly'=>true,'samesite'=>'Lax','secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off']); session_start(); }
require_once __DIR__.'/conexion.php';
function respond($v,$code=200){http_response_code($code);echo json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function logged(){return isset($_SESSION['admin_id']);}
function csrf(){if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(24));return $_SESSION['csrf'];}
function guard(){if(!logged())respond(['error'=>'Inicia sesión.'],401);if(!hash_equals(csrf(),(string)($_SERVER['HTTP_X_CSRF_TOKEN']??'')))respond(['error'=>'Sesión inválida. Recarga la página.'],403);}
function jsonInput(){return json_decode(file_get_contents('php://input'),true) ?: [];}
function throttle(){ $n=$_SESSION['failed_logins']??0; $t=$_SESSION['last_failed']??0; if($n>=5 && time()-$t<300)respond(['error'=>'Demasiados intentos. Espera cinco minutos.'],429);if(time()-$t>=300)$_SESSION['failed_logins']=0; }
