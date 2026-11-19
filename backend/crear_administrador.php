<?php
// Ejecutar SOLO desde terminal: php backend/crear_administrador.php correo@ejemplo.com
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require_once __DIR__.'/conexion.php';
$email=$argv[1]??'';if(!filter_var($email,FILTER_VALIDATE_EMAIL)){fwrite(STDERR,"Uso: php backend/crear_administrador.php correo@ejemplo.com\n");exit(1);}
echo "Nombre del administrador: ";$name=trim(fgets(STDIN));
echo "Contraseña nueva (mínimo 12 caracteres): ";$pass=rtrim(fgets(STDIN),"\r\n");
if(!$name||strlen($pass)<12){fwrite(STDERR,"Nombre requerido y contraseña mínimo 12 caracteres.\n");exit(1);}
$q=$pdo->query("SELECT id_rol FROM roles WHERE LOWER(nombre) IN ('administrador','admin') LIMIT 1");$role=$q->fetchColumn();
if(!$role){$pdo->prepare('INSERT INTO roles(nombre,descripcion) VALUES (?,?)')->execute(['Administrador','Administración del sitio']);$role=$pdo->lastInsertId();}
$q=$pdo->prepare('SELECT id_usuario FROM usuarios WHERE correo=?');$q->execute([$email]);if($q->fetch()){fwrite(STDERR,"Ese correo ya está registrado. No se realizaron cambios.\n");exit(1);}
$pdo->prepare('INSERT INTO usuarios(id_rol,nombres,correo,clave_hash,activo) VALUES (?,?,?,?,1)')->execute([$role,$name,$email,password_hash($pass,PASSWORD_DEFAULT)]);
echo "Administrador creado. Ingresa con tu correo y contraseña en el panel.\n";
