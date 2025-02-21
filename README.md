# RegistroGaseosas

## Descripción
RegistroGaseosas es una aplicación diseñada para gestionar el inventario y las ventas de gaseosas. Permite registrar nuevas gaseosas, actualizar información existente, y llevar un control de las ventas realizadas.

## Características
- Registro de nuevas gaseosas.
- Actualización de información de gaseosas existentes.
- Control de inventario.
- Registro de ventas.

## Tecnologías Utilizadas
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB
- **Control de Versiones:** Git

## Instalación
Para instalar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/RegistroGaseosas.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd RegistroGaseosas
    ```
3. Instala las dependencias necesarias:
    ```bash
    npm install
    ```

## Configuración
1. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/registroGaseosas
    ```

## Uso
Para iniciar la aplicación, ejecuta el siguiente comando:
```bash
npm start
```
La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto
```
RegistroGaseosas/
├── public/
│   ├── css/
│   ├── js/
│   └── index.html
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env
├── package.json
└── README.md
```

## Contribución
Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a tu fork (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
