# MovieBot para Cine Mercedes Digital
__**By**: Facundo Rodriguez_
[![Perfil de LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-blue)](https://www.linkedin.com/in/facurg/)

## Documentación del Proyecto:
A continuación dejo adjunta la documentación respectiva:
[Documentación - MovieBot](https://docs.google.com/document/d/1I6E3F135YnQXOOLx0g_5AdZQO5pZbN36KrvAYLPBUkc/edit?pli=1)

## Descripción
MovieBot es un bot de Telegram diseñado para mejorar la experiencia de los clientes del Cine Mercedes. 
Con MovieBot, los usuarios pueden gestionar reservas, consultar horarios de películas y mucho más, todo desde la comodidad de su hogar. 

Este bot busca transformar la experiencia tradicional de ir al cine en una experiencia digital cómoda y eficiente

## Contexto de la Realidad:
- El cine tiene una única sala.
- Los asientos no tienen número, por lo que escoger un asiento es por orden de llegada, siendo una problemática común llegar y no tener asientos y no tener donde corroborar si hay asientos disponibles o no.

## Funcionalidades
- **Consulta de Cartelera**: Verifica las películas disponibles y sus horarios.
- **Reservas de Entradas**: Reserva de entradas tus entradas en pocos segundos generando un QR que luego, en la vida real, permite ser escaneado y simular la "compra" del mismo.
- **Ver mis reservas**: Permite ver las reservas activas que tienes desplegando el QR con su fecha de caducidad.
- **Ubicación del cine:** Permite obtener la ubicación del cine para saber como llegar
- **Promociones y Descuentos**: Accede a promociones exclusivas y recibe recomendaciones basadas en tus visitas anteriores.
- **Precio Entradas**: Obtener el precio de las entradas por película
- **Buscar una pelicula en particular**: Permite, utilizando lenguaje natural gracias a DialogFlow, ingresar '¿A qué hora dan Inception?' y obtendrás los horarios de las funciones con unos botones desplegables para utilizar
- **Mostrar ayuda**: Despliega el menú de comandos
- **Hablar con un operador**: El operador está deshabilitado, solo despliega un mensaje notificando de manera simulada. (Esta funcionalidad se encuentra en construcción en la branch 'contactarAsistente')

## Extras
- **Información Detallada**: Obtén detalles sobre las películas
- **Interacción en Lenguaje Natural**: Interactúa con el bot usando lenguaje natural gracias a la integración con Dialogflow.
- **Soporte para Escaneo de QR**: Genera y escanea códigos QR para una experiencia de usuario ágil.

## Tecnologías Utilizadas
- **Node.js y Express.js**: Para la lógica del servidor y manejo de rutas.
- **Telegram API y Telegraf**: Para la interacción con Telegram.
- **Dialogflow**: Para el procesamiento de lenguaje natural.
- **Firestore**: Como base de datos NoSQL para almacenar datos de usuario, reservas, peliculas y funciones.
- **Render.com**: Para el despliegue y hosting del bot en producción.

#Herramientas de Gestión y Desarrollo

### Gestión de Proyecto
Para la organización y gestión del proyecto MovieBot, se utilizaron las siguientes herramientas que permitieron un seguimiento eficiente y una gestión ágil del desarrollo:

- **Trello**: Utilizado para la gestión de tareas con tableros KanBan, ayudando a mantener un seguimiento claro de las etapas del proyecto, tareas pendientes y progreso en tiempo real.
- **Google Keep**: Empleado para tomar notas rápidas y organizar ideas clave y requisitos durante las fases de brainstorming y desarrollo.

### Entorno de Desarrollo
- **Visual Studio Code (VSCode)**: Este editor de código fue utilizado para todo el desarrollo del backend y la integración con APIs. VSCode proporciona herramientas poderosas que facilitaron la escritura de código, la depuración y la gestión del repositorio.

### Herramientas de Desarrollo Avanzadas
- **GPT**: Utilizado para acelerar el aprendizaje y adaptación a nuevas tecnologías no previamente utilizadas, facilitando una comprensión más rápida y efectiva.
- **Github Copilot**: Empleado como asistente de autocompletado, mejorando la eficiencia en la escritura de código y reduciendo la probabilidad de errores.

## Casos de Prueba

-Se realizaron 2 ciclos de pruebas para asegurar la funcionalidad y robustez del MovieBot. 
Los resultados de estas pruebas están documentados detalladamente en el siguiente enlace:

[Documentación de Casos de Prueba](https://docs.google.com/spreadsheets/d/1HAoWx55wt1t7ylIFgOSmdqvVD9SxegrEJlWSc_UjgoE/edit?usp=sharing)

## Pruebas de Usabilidad | Usuario Final: 
- Además de la ejecución propia del producto para asegurar su funcionalidad, antes de lanzarlo al mercado, consideré necesario el feedback de los usuarios finales, a continuación puedes encontrar el informe de los mismos:

[Informe Final de Testing Funcional](https://docs.google.com/document/d/1X0JYb7LJuIAvmQbdDR5-UceCUnWao1iDs_JI9f-vuFA/edit?usp=sharing))

### Uso
- Para comenzar a usar MovieBot y experimentar una nueva forma de interactuar con el Cine Mercedes Digital, simplemente sigue este [link directo a MovieBot en Telegram](https://t.me/PruebitaDeBot).

### Nota Importante
- El bot puede tardar hasta un minuto en activarse por primera vez debido al estado de inactividad en Render. Esto solo ocurre durante el primer inicio o cuando el bot ha estado inactivo por un tiempo prolongado. Agradecemos tu paciencia y comprensión.

## Contribuciones
- Las contribuciones son bienvenidas. Si deseas contribuir, por favor, haz un fork del repositorio, realiza tus cambios y envía un pull request.
- Si bien **actualmente NO aceptaré ninguna**, no estoy cerrado a ver mejoras en mi proyecto. :)

## Consideraciones Finales:

- El proyecto está diseñado con fines educativos y aunque se basa en una problemática real y el nombre del cine es real, no utiliza datos reales más allá de la ubicación y el nombre del cine.

## Licencias

MovieBot se ha desarrollado utilizando tecnologías y servicios que ofrecen licencias gratuitas, lo que permite un acceso y uso sin costo pero puede influir en el rendimiento. Las tecnologías clave incluyen:

- **Render.com**: Utilizado para el despliegue y hosting del bot en producción. El plan gratuito puede causar tiempos de inactividad cuando el bot no se usa frecuentemente, lo que resulta en un arranque lento al reactivarse.
- **Dialogflow**: Para el procesamiento de lenguaje natural, operando bajo la capa gratuita que puede limitar algunas funcionalidades avanzadas y la velocidad de las respuestas.
- **Firestore**: Como nuestra base de datos NoSQL, donde el plan gratuito puede tener limitaciones en términos de operaciones de lectura y escritura por segundo.

### Consideraciones de Rendimiento
Debido al uso de estas licencias gratuitas, los usuarios pueden experimentar una ligera demora en las respuestas del bot, especialmente durante las primeras interacciones o después de períodos de inactividad. 
Lamento los inconvenientes, y por favor, paciencia y comprensión. Estas demoras son resultado directo de maximizar la accesibilidad y minimizar los costos operativos.

