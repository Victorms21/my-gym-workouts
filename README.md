# My Gym Workouts

App para creación y gestión de rutinas para ganancia de masa muscular.

## Características

- 🔐 **Autenticación con Laravel Sanctum**: Sistema de login y registro seguro
- 🏠 **Página de inicio**: Dashboard principal para gestión de rutinas
- 🛡️ **Protección de rutas**: Guards para proteger rutas autenticadas
- 🌐 **Interceptor HTTP**: Manejo automático de tokens en las peticiones
- 💪 **Catálogo de ejercicios**: Lista de ejercicios disponibles
- 📋 **Gestión de rutinas**: Crear y visualizar rutinas de entrenamiento

## Tecnologías

- Angular 20
- TypeScript
- SCSS
- RxJS

## Requisitos previos

- Node.js 20.x o superior
- npm 10.x o superior
- Backend API Laravel con Sanctum (corriendo en `http://localhost:3000/api`)

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
│   └── services/         # Servicios (AuthService, RoutineService, ExerciseService)
├── environments/
│   ├── environment.ts    # Desarrollo
│   └── environment.prod.ts # Producción
└── styles.scss           # Estilos globales
```

## Endpoints del Backend

La aplicación consume los siguientes endpoints del backend Laravel:

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/register` | Registrar usuario |
| GET | `/api/user` | Obtener usuario actual |

#### POST /api/login

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
  "token": "sanctum_token_here"
}
```

#### POST /api/register

**Request body:**
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@email.com",
  "password": "contraseña",
  "password_confirmation": "contraseña"
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
  "token": "sanctum_token_here"
}
```

#### GET /api/user

**Response:**
```json
{
  "id": "123",
  "email": "usuario@email.com",
  "name": "Nombre Usuario"
}
```

### Ejercicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/exercises` | Obtener todos los ejercicios |
| GET | `/api/exercises/:id` | Obtener un ejercicio específico |

#### GET /api/exercises

**Response:**
```json
[
  {
    "id": "1",
    "name": "Bench Press",
    "description": "A compound chest exercise",
    "muscle_group": "Chest",
    "equipment": "Barbell",
    "instructions": "Lie on bench and press the barbell up"
  }
]
```

#### GET /api/exercises/:id

**Response:**
```json
{
  "id": "1",
  "name": "Bench Press",
  "description": "A compound chest exercise",
  "muscle_group": "Chest",
  "equipment": "Barbell",
  "instructions": "Lie on bench and press the barbell up"
}
```

### Rutinas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/routines` | Obtener todas las rutinas del usuario |
| GET | `/api/routines/:id` | Obtener una rutina específica |
| POST | `/api/routines` | Crear una nueva rutina |
| PUT | `/api/routines/:id` | Actualizar una rutina existente |
| DELETE | `/api/routines/:id` | Eliminar una rutina |

#### GET /api/routines

**Response:**
```json
[
  {
    "id": "123",
    "name": "Push Day",
    "description": "Chest and Triceps workout",
    "exercises": [
      {
        "id": "e1",
        "name": "Bench Press",
        "sets": [
          { "reps": 10, "weight": 60, "restSeconds": 90 },
          { "reps": 8, "weight": 70, "restSeconds": 90 }
        ],
        "notes": "Focus on form"
      }
    ],
    "userId": "user123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### GET /api/routines/:id

**Response:**
```json
{
  "id": "123",
  "name": "Push Day",
  "description": "Chest and Triceps workout",
  "exercises": [...],
  "userId": "user123",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/routines

**Request body:**
```json
{
  "name": "Leg Day",
  "description": "Legs workout",
  "exercises": [
    {
      "name": "Squats",
      "sets": [
        { "reps": 12, "weight": 100 },
        { "reps": 10, "weight": 120 }
      ],
      "notes": "Deep squats"
    }
  ]
}
```

**Response:**
```json
{
  "id": "456",
  "name": "Leg Day",
  "description": "Legs workout",
  "exercises": [
    {
      "id": "e2",
      "name": "Squats",
      "sets": [
        { "reps": 12, "weight": 100 },
        { "reps": 10, "weight": 120 }
      ],
      "notes": "Deep squats"
    }
  ],
  "userId": "user123",
  "createdAt": "2024-01-16T10:30:00Z",
  "updatedAt": "2024-01-16T10:30:00Z"
}
```

#### PUT /api/routines/:id

**Request body:**
```json
{
  "name": "Updated Leg Day",
  "description": "Updated description",
  "exercises": [...]
}
```

**Response:**
```json
{
  "id": "456",
  "name": "Updated Leg Day",
  "description": "Updated description",
  "exercises": [...],
  "userId": "user123",
  "createdAt": "2024-01-16T10:30:00Z",
  "updatedAt": "2024-01-17T10:30:00Z"
}
```

#### DELETE /api/routines/:id

**Response:** `204 No Content`

## Testing

```bash
npm test
```

## Licencia

Este proyecto está bajo la Licencia MIT.
