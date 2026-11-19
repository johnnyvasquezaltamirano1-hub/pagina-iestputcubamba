<?php
require_once __DIR__.'/auth.php';
$method=$_SERVER['REQUEST_METHOD'];
if($method==='GET'){
 $q=$pdo->query('SELECT p.id_proyecto,p.titulo,p.descripcion,p.enlace,p.publicado,COALESCE(GROUP_CONCAT(i.nombre ORDER BY i.id_integrante SEPARATOR ", "),"") AS autor FROM proyectos p LEFT JOIN integrantes_proyecto i ON i.id_proyecto=p.id_proyecto WHERE p.publicado=1 GROUP BY p.id_proyecto,p.titulo,p.descripcion,p.enlace,p.publicado ORDER BY p.id_proyecto DESC');
 respond(['items'=>$q->fetchAll()]);
}
guard();$d=jsonInput();$action=(string)($d['action']??'');
if($action==='save'){
 $id=(int)($d['id']??0);$title=trim((string)($d['name']??''));$author=trim((string)($d['author']??''));$url=trim((string)($d['url']??''));
 if($title===''||mb_strlen($title)>220||$author===''||mb_strlen($author)>160||strlen($url)>2048||!filter_var($url,FILTER_VALIDATE_URL)||!in_array(strtolower((string)parse_url($url,PHP_URL_SCHEME)),['http','https'],true))respond(['error'=>'Verifica el nombre, estudiante y enlace HTTPS/HTTP.'],422);
 try{$pdo->beginTransaction();if($id){$q=$pdo->prepare('UPDATE proyectos SET titulo=?,enlace=?,publicado=1 WHERE id_proyecto=?');$q->execute([$title,$url,$id]);$q=$pdo->prepare('SELECT id_proyecto FROM proyectos WHERE id_proyecto=?');$q->execute([$id]);if(!$q->fetch())throw new RuntimeException('Proyecto inexistente');$pdo->prepare('DELETE FROM integrantes_proyecto WHERE id_proyecto=?')->execute([$id]);}else{$q=$pdo->prepare('INSERT INTO proyectos (titulo,enlace,publicado,creado_por) VALUES (?,?,1,?)');$q->execute([$title,$url,$_SESSION['admin_id']]);$id=(int)$pdo->lastInsertId();}
 $pdo->prepare('INSERT INTO integrantes_proyecto(id_proyecto,nombre,rol) VALUES (?, ?, ?)')->execute([$id,$author,'Integrante']);$pdo->commit();respond(['ok'=>true,'id'=>$id]);}catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();error_log($e->getMessage());respond(['error'=>'No se pudo guardar el proyecto.'],500);}
}
if($action==='delete'){$id=(int)($d['id']??0);if($id<1)respond(['error'=>'ID inválido'],422);$pdo->prepare('DELETE FROM proyectos WHERE id_proyecto=?')->execute([$id]);respond(['ok'=>true]);}
respond(['error'=>'Acción no reconocida'],400);
