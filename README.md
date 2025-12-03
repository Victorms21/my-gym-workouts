# My Gym Workouts

App para creación y gestión de rutinas para ganancia de masa muscular.

## Características

- 🔐 **Autenticación JWT**: Sistema de login seguro con tokens JWT
- 🏠 **Página de inicio**: Dashboard principal para gestión de rutinas
- 🛡️ **Protección de rutas**: Guards para proteger rutas autenticadas
- 🌐 **Interceptor HTTP**: Manejo automático de tokens en las peticiones

## Tecnologías

- Angular 20
- TypeScript
- SCSS
- RxJS

## Requisitos previos

- Node.js 20.x o superior
- npm 10.x o superior
- Backend API con autenticación JWT (corriendo en `http://localhost:3000/api`)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Victorms21/my-gym-workouts.git
cd my-gym-workouts
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL del backend en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Cambiar según tu configuración
};
```

## Ejecución

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/gym-workouts-frontend`

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/        # Componente de login
│   │   └── home/         # Componente de inicio
│   ├── guards/           # Guards de autenticación
│   ├── interceptors/     # Interceptores HTTP
│   ├── models/           # Modelos e interfaces
│   └── services/         # Servicios (AuthService)
├── environments/
│   ├── environment.ts    # Desarrollo
│   └── environment.prod.ts # Producción
└── styles.scss           # Estilos globales
```

## Endpoints del Backend esperados

La aplicación espera los siguientes endpoints en el backend:

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |

#### POST /api/auth/login

**Request body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  },
  "token": "jwt_token_here"
}
```

## Testing

```bash
npm test
```

## Licencia

Este proyecto está bajo la Licencia MIT.
