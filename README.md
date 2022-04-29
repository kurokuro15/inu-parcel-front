# inu-presupuestos-envios

### Proyecto de la materia INU-554 INTERFACES WEB CON EL USUARIO. 
#### Creado en Vanila Javascript más CSS y HTML. 

Se dispone en este repositorio el apartado de **client-side** o **Frontend**, desarrollado como se menciona principalmente con _Javascript_, creando una **SPA** interactiva.
La cual permite el registro de usuarios, recuperación de contraseñas e inicio de sesión. Así mismo la creación y cálculo de encomiendas realizadas por el currier ficticio.
De igual forma tiene la capacidad de realizar un pseudo seguimiento de las encomiendas realizadas buscando por número de rastreo (**tracking**) y pudiendo visualizar su estado en el sistema.



###  Para Descargar e Instalar el proyecto: 
#### *CON HTTPS:
~~~~
git clone https://github.com/kurokuro15/inu-presupuestos-envios.git
~~~~
#### CON SSH:
~~~~
git clone git@github.com:kurokuro15/inu-presupuestos-envios.git
~~~~
#### CON GitHub CLI:
~~~~
gh repo clone kurokuro15/inu-presupuestos-envios
~~~~
#### Opcional:
##### Instalar dependencias de desarrollo:
~~~~
npm install
~~~~

### Estructura:
Se recomienda desplegar el frontend dentro de la carpeta raiz o redireccionar la raiz del servidor a esta. En caso de no poder hacerlo se debe tomar en cuenta los siguientes atributos en el archivo 
~~~~
~/inu-presupuestos-envios/js/Config.js
~~~~
![Config.js](https://i.ibb.co/8g80jx6/image.png)

Para así evitar problemas de envío y recepción de peticiones y consumo de _venezuela.json_ y la RESTFUL API 

Por último. Este proyecto no servirá en gran medida sin la descarga y configuración de la [Rest-api](https://github.com/kurokuro15/api-rest) diseñada para este proyecto en _**PHP** vanila_. 
