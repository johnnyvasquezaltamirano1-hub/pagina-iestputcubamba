# IESTP Utcubamba — Página institucional con panel local de atención

## Qué hace esta versión

- Conserva el sitio institucional, menú, enlaces, imágenes, secciones y formulario de contacto de la versión recibida.
- El **buzón de sugerencias** guarda cada registro en el navegador y muestra un código `SUG-...`.
- El **libro de reclamaciones** guarda cada registro en el navegador y muestra un código `REC-...`.
- El **panel de atención** permite acceder a una bandeja, ver cada registro, buscar, filtrar, cambiar su estado, eliminar y exportar a CSV.
- Ambos formularios ofrecen **preparar correo**, que abre un borrador en la aplicación de correo. **Ningún correo se envía automáticamente**.

## Cómo ejecutarlo en Windows

La forma recomendada es usar un servidor web local para que todos los archivos compartan un mismo origen y almacenamiento. **No abras los HTML por separado con doble clic**: dependiendo del navegador, podrían guardar datos en orígenes distintos.

**Opción A — Un solo clic**: haz doble clic en `iniciar-en-windows.bat`. Si existe `C:\xampp\php\php.exe` o Python instalado, se abrirá `http://127.0.0.1:8765/`. Mantén abierta la ventana negra mientras uses el sitio.

**Opción B — XAMPP**: copia la carpeta del proyecto dentro de `C:\xampp\htdocs\instituto\`, abre XAMPP, inicia Apache y visita `http://localhost/instituto/`.

## Acceso al panel

En la página principal, abre **Panel de atención** desde el pie de página, o ve directamente a `administracion.html`.

- Usuario: `admin`
- Contraseña: `Registro2026!`

Estas credenciales están en el JavaScript del sitio y **no son seguras**. Son únicamente para comprobar el flujo con un sitio estático, sin backend. Un despliegue real necesita autenticación y almacenamiento protegidos del lado del servidor.

## Prueba rápida

1. Abre el sitio con el servidor local.
2. Ve al buzón, completa datos ficticios y pulsa **Registrar sugerencia**. Verás una constancia con un código.
3. Ve al libro de reclamaciones y registra un caso ficticio. Obtendrás otro código.
4. Entra al **Panel de atención** con las credenciales indicadas.
5. Verifica los dos registros, cambia uno a **En revisión** y exporta CSV.
6. Cierra y vuelve a abrir el mismo navegador (mismo perfil, URL y dispositivo): los registros siguen disponibles.

## Límites importantes

- El almacenamiento es `localStorage` del navegador (no existe base de datos, servidor de registro o correo automático).
- Los registros se mantienen **solo en el mismo navegador y origen**; otros equipos, perfiles, navegadores o modo incógnito no los comparten.
- Borrar los datos del sitio en el navegador elimina los registros. Exporta a CSV si deseas conservarlos.
- No se debe introducir información personal real ni utilizar como libro oficial de reclamaciones. Este sistema es para un proyecto académico.
- Para operación institucional verdadera debe implementarse una base de datos, acceso seguro, gestión de privacidad, respaldos y envío autenticado de correos.
- Las fotografías institucionales se cargan de Internet. El sitio cuenta con una imagen de respaldo cuando no están disponibles.

## Estructura

- `index.html`: portada del instituto.
- `buzon-sugerencias.html`: registro local de sugerencias.
- `libro-reclamaciones.html`: registro local de reclamaciones.
- `administracion.html`: acceso y gestión de registros locales.
- `assets/css/styles.css`: estilos.
- `assets/js/main.js`: navegación y formulario general de contacto.
- `assets/js/registro-store.js`: almacenamiento local compartido.
- `assets/js/feedback.js`: formularios y constancias.
- `assets/js/administracion.js`: acceso de prueba, filtros, estados y exportación.


## Páginas internas (actualización 12/11/2026)

- Se añadieron 30 páginas internas dentro de `paginas/` para las secciones del instituto.
- Los enlaces de navegación de la portada que apuntaban al sitio antiguo se reemplazaron por páginas locales.
- El campus virtual y Google Maps no se reproducen dentro del proyecto: desde sus páginas informativas puede abrirse el servicio externo si se necesita.
- Los contenidos se resumieron a partir de las páginas de `https://iestputcubamba.edu.pe/`, `https://iestputcubamba.edu.pe/iestpu_web/` y una nota oficial del Ministerio de Educación del 22 de mayo de 2026. No se copiaron textos enteros ni se inventaron requisitos, plazos o costos.
- Algunas secciones de la web antigua carecen de información textual verificable. Las páginas interiores informan esa limitación y ofrecen los datos de contacto publicados.
- El buzón, el libro de reclamaciones y el panel de administración no se modificaron.


## Actualización del contacto y páginas informativas

- Correo institucional configurado: **istputcubamba@hotmail.com**. Se actualizó en los textos, enlaces `mailto:` y los borradores de correo preparados por los formularios.
- Las cuatro páginas de programas tienen ilustraciones SVG locales específicas, sin depender de Internet.
- Las páginas de historia, misión, actividades, campus y noticias pueden mostrar fotografías enlazadas al portal institucional. Si la imagen no carga, se muestra una ilustración de respaldo almacenada en el proyecto.
- Se mantuvo el estilo y funcionamiento de la página principal, los formularios y el panel de gestión.
- El envío de correos sigue requiriendo abrir y enviar el mensaje desde una aplicación de correo; el registro del buzón y las reclamaciones se realiza en el navegador según la versión de este proyecto.


## Proyectos de estudiantes (nuevo)
- En **Accesos > Servicios institucionales** aparece el listado de proyectos y el enlace a `proyectos.html`.
- En `administracion.html`, tras iniciar sesión, se pueden añadir, editar y eliminar proyectos.
- Los enlaces se guardan únicamente en `localStorage` del navegador de administración. **No se publican automáticamente para otros visitantes ni otros dispositivos.**
- El botón **Exportar JSON** permite respaldar los registros. Para publicar de verdad en una web accesible a todos, es necesario un backend con base de datos y autenticación segura.
- El inicio de sesión existente es de demostración: sus credenciales están en JavaScript y **no ofrecen seguridad real**. No lo publiques como un panel privado real.
