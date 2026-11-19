<?php
require_once __DIR__.'/auth.php';
$action=$_GET['action']??'';
if($action==='status')respond(['logged'=>logged(),'csrf'=>logged()?csrf():null]);
if($_SERVER['REQUEST_METHOD']!=='POST')respond(['error'=>'Método no permitido'],405);
if($action==='login'){
 throttle();$d=jsonInput();$email=trim((string)($d['usuario']??''));$pass=(string)($d['clave']??'');
 $q=$pdo->prepare("SELECT u.id_usuario,u.clave_hash FROM usuarios u JOIN roles r ON r.id_rol=u.id_rol WHERE u.correo=? AND u.activo=1 AND LOWER(r.nombre) IN ('administrador','admin') LIMIT 1");$q->execute([$email]);$u=$q->fetch();
 if(!$u || !password_verify($pass,$u['clave_hash'])){$_SESSION['failed_logins']=($_SESSION['failed_logins']??0)+1;$_SESSION['last_failed']=time();respond(['error'=>'Credenciales incorrectas. Usa el correo del administrador.'],401);}
 session_regenerate_id(true);$_SESSION['admin_id']=(int)$u['id_usuario'];$_SESSION['failed_logins']=0;$pdo->prepare('UPDATE usuarios SET ultimo_acceso=NOW() WHERE id_usuario=?')->execute([$_SESSION['admin_id']]);respond(['logged'=>true,'csrf'=>csrf()]);
}
if($action==='logout'){guard();$_SESSION=[];session_destroy();respond(['logged'=>false]);}
respond(['error'=>'Acción desconocida'],404);
