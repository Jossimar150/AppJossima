# Pruebas API App - Postman

Documentación completa de las pruebas de Postman para todas las gestiones del sistema.

**Base URL:** `http://localhost:8080/api`

---

## 📋 Tabla de Contenido

1. [Autenticación](#autenticación)
2. [Gestión de Usuarios](#gestión-de-usuarios)
3. [Gestión de Categorías](#gestión-de-categorías)
4. [Gestión de Subcategorías](#gestión-de-subcategorías)
5. [Gestión de Productos](#gestión-de-productos)
6. [Estadísticas](#estadísticas)

---

## 🔐 Autenticación

### 1. Login
**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2025-11-14T10:00:00"
  }
}
```

**Respuesta Error (400):**
```json
{
  "error": "Credenciales inválidas"
}
```

**Roles disponibles:**
- `ADMIN` - Acceso completo
- `COORDINADOR` - Acceso limitado (no puede eliminar)

---

## 👥 Gestión de Usuarios

### 2. Obtener Todos los Usuarios
**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2025-11-14T10:00:00"
  },
  {
    "id": 2,
    "username": "coordinador1",
    "email": "coord@example.com",
    "role": "COORDINADOR",
    "active": true,
    "createdAt": "2025-11-14T11:00:00"
  }
]
```

---

### 3. Obtener Usuario por ID
**Endpoint:** `GET /users/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /users/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2025-11-14T10:00:00"
}
```

---

### 4. Crear Usuario
**Endpoint:** `POST /users`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Body (JSON):**
```json
{
  "username": "nuevo_usuario",
  "password": "password123",
  "email": "nuevo@example.com",
  "role": "COORDINADOR",
  "active": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "username": "nuevo_usuario",
  "email": "nuevo@example.com",
  "role": "COORDINADOR",
  "active": true,
  "createdAt": "2025-11-14T12:00:00"
}
```

---

### 5. Actualizar Usuario
**Endpoint:** `PUT /users/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PUT /users/3`

**Body (JSON):**
```json
{
  "username": "usuario_actualizado",
  "password": "newpassword123",
  "email": "actualizado@example.com",
  "role": "COORDINADOR",
  "active": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "username": "usuario_actualizado",
  "email": "actualizado@example.com",
  "role": "COORDINADOR",
  "active": true,
  "createdAt": "2025-11-14T12:00:00"
}
```

**Respuesta Error (403):**
```json
{
  "message": "No tienes permiso para realizar esta acción"
}
```

---

### 6. Eliminar Usuario
**Endpoint:** `DELETE /users/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN` solamente

**Ejemplo:** `DELETE /users/3`

**Respuesta Exitosa (200):**
```json
{
  "message": "Usuario eliminado con éxito"
}
```

**Respuesta Error (400):**
```json
{
  "message": "Error al eliminar usuario"
}
```

---

## 📁 Gestión de Categorías

### 7. Obtener Todas las Categorías
**Endpoint:** `GET /categories`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Electrónica",
    "description": "Productos electrónicos y tecnología",
    "active": true
  },
  {
    "id": 2,
    "name": "Ropa",
    "description": "Vestimenta y accesorios",
    "active": true
  }
]
```

---

### 8. Obtener Categoría por ID
**Endpoint:** `GET /categories/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /categories/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "name": "Electrónica",
  "description": "Productos electrónicos y tecnología",
  "active": true
}
```

---

### 9. Crear Categoría
**Endpoint:** `POST /categories`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Body (JSON):**
```json
{
  "name": "Deportes",
  "description": "Artículos deportivos y equipamiento",
  "active": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Deportes",
  "description": "Artículos deportivos y equipamiento",
  "active": true
}
```

---

### 10. Actualizar Categoría
**Endpoint:** `PUT /categories/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PUT /categories/3`

**Body (JSON):**
```json
{
  "name": "Deportes y Fitness",
  "description": "Artículos deportivos, fitness y bienestar",
  "active": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Deportes y Fitness",
  "description": "Artículos deportivos, fitness y bienestar",
  "active": true
}
```

---

### 11. Eliminar Categoría
**Endpoint:** `DELETE /categories/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN` solamente

**Ejemplo:** `DELETE /categories/3`

**Respuesta Exitosa (200):**
```json
{
  "message": "Categoría eliminada con éxito"
}
```

---

### 12. Activar/Desactivar Categoría
**Endpoint:** `PATCH /categories/{id}/toggle-active`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PATCH /categories/1/toggle-active`

**Descripción:** Este endpoint cambia el estado `active` de la categoría. Si está activa (true), la desactiva (false) y viceversa.

**Respuesta Exitosa (200) - Categoría desactivada:**
```json
{
  "id": 1,
  "name": "Electrónica",
  "description": "Productos electrónicos y tecnología",
  "active": false
}
```

**Respuesta Exitosa (200) - Categoría activada:**
```json
{
  "id": 1,
  "name": "Electrónica",
  "description": "Productos electrónicos y tecnología",
  "active": true
}
```

**Respuesta Error (404):**
```json
{
  "message": "categoria no encontrada"
}
```

---

## 📂 Gestión de Subcategorías

### 13. Obtener Todas las Subcategorías
**Endpoint:** `GET /subcategories`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Smartphones",
    "description": "Teléfonos móviles inteligentes",
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    }
  },
  {
    "id": 2,
    "name": "Laptops",
    "description": "Computadoras portátiles",
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    }
  }
]
```

---

### 14. Obtener Subcategorías por Categoría
**Endpoint:** `GET /subcategories/category/{categoryId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /subcategories/category/1`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Smartphones",
    "description": "Teléfonos móviles inteligentes",
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    }
  },
  {
    "id": 2,
    "name": "Laptops",
    "description": "Computadoras portátiles",
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    }
  }
]
```

---

### 15. Obtener Subcategoría por ID
**Endpoint:** `GET /subcategories/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /subcategories/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "name": "Smartphones",
  "description": "Teléfonos móviles inteligentes",
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  }
}
```

---

### 16. Crear Subcategoría
**Endpoint:** `POST /subcategories`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Body (JSON):**
```json
{
  "name": "Tablets",
  "description": "Tabletas digitales",
  "active": true,
  "category": {
    "id": 1
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Tablets",
  "description": "Tabletas digitales",
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  }
}
```

---

### 17. Actualizar Subcategoría
**Endpoint:** `PUT /subcategories/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PUT /subcategories/3`

**Body (JSON):**
```json
{
  "name": "Tablets y iPads",
  "description": "Tabletas digitales y dispositivos iPad",
  "active": true,
  "category": {
    "id": 1
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Tablets y iPads",
  "description": "Tabletas digitales y dispositivos iPad",
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  }
}
```

---

### 18. Eliminar Subcategoría
**Endpoint:** `DELETE /subcategories/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN` solamente

**Ejemplo:** `DELETE /subcategories/3`

**Respuesta Exitosa (200):**
```json
{
  "message": "Subcategoría eliminada con éxito"
}
```

---

### 19. Activar/Desactivar Subcategoría
**Endpoint:** `PATCH /subcategories/{id}/toggle-active`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PATCH /subcategories/1/toggle-active`

**Descripción:** Este endpoint cambia el estado `active` de la subcategoría. Si está activa (true), la desactiva (false) y viceversa.

**Respuesta Exitosa (200) - Subcategoría desactivada:**
```json
{
  "id": 1,
  "name": "Smartphones",
  "description": "Teléfonos móviles inteligentes",
  "active": false,
  "category": {
    "id": 1,
    "name": "Electrónica"
  }
}
```

**Respuesta Exitosa (200) - Subcategoría activada:**
```json
{
  "id": 1,
  "name": "Smartphones",
  "description": "Teléfonos móviles inteligentes",
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  }
}
```

**Respuesta Error (404):**
```json
{
  "message": "Subcategoria no encontrada"
}
```

---

## 📦 Gestión de Productos

### 18. Obtener Todos los Productos
**Endpoint:** `GET /products`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación con chip A17 Pro",
    "price": 999.99,
    "stock": 50,
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    },
    "subcategory": {
      "id": 1,
      "name": "Smartphones"
    }
  },
  {
    "id": 2,
    "name": "MacBook Pro 16",
    "description": "Laptop profesional con chip M3 Pro",
    "price": 2499.99,
    "stock": 25,
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    },
    "subcategory": {
      "id": 2,
      "name": "Laptops"
    }
  }
]
```

---

### 19. Obtener Productos por Categoría
**Endpoint:** `GET /products/category/{categoryId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /products/category/1`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación con chip A17 Pro",
    "price": 999.99,
    "stock": 50,
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    },
    "subcategory": {
      "id": 1,
      "name": "Smartphones"
    }
  }
]
```

---

### 20. Obtener Productos por Subcategoría
**Endpoint:** `GET /products/subcategory/{subcategoryId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /products/subcategory/1`

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Smartphone de última generación con chip A17 Pro",
    "price": 999.99,
    "stock": 50,
    "active": true,
    "category": {
      "id": 1,
      "name": "Electrónica"
    },
    "subcategory": {
      "id": 1,
      "name": "Smartphones"
    }
  }
]
```

---

### 21. Obtener Producto por ID
**Endpoint:** `GET /products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `GET /products/1`

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "Smartphone de última generación con chip A17 Pro",
  "price": 999.99,
  "stock": 50,
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  },
  "subcategory": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

---

### 22. Crear Producto
**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Body (JSON):**
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Smartphone Android con cámara de 200MP",
  "price": 899.99,
  "stock": 75,
  "active": true,
  "category": {
    "id": 1
  },
  "subcategory": {
    "id": 1
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Samsung Galaxy S24",
  "description": "Smartphone Android con cámara de 200MP",
  "price": 899.99,
  "stock": 75,
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  },
  "subcategory": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

---

### 23. Actualizar Producto
**Endpoint:** `PUT /products/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PUT /products/3`

**Body (JSON):**
```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Smartphone Android premium con cámara de 200MP y S Pen",
  "price": 1199.99,
  "stock": 60,
  "active": true,
  "category": {
    "id": 1
  },
  "subcategory": {
    "id": 1
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Smartphone Android premium con cámara de 200MP y S Pen",
  "price": 1199.99,
  "stock": 60,
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  },
  "subcategory": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

---

### 24. Eliminar Producto
**Endpoint:** `DELETE /products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN` solamente

**Ejemplo:** `DELETE /products/3`

**Respuesta Exitosa (200):**
```json
{
  "message": "Producto eliminado con éxito"
}
```

---

### 25. Activar/Desactivar Producto
**Endpoint:** `PATCH /products/{id}/toggle-active`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Ejemplo:** `PATCH /products/1/toggle-active`

**Descripción:** Este endpoint cambia el estado `active` del producto. Si está activo (true), lo desactiva (false) y viceversa.

**Respuesta Exitosa (200) - Producto desactivado:**
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "Smartphone de última generación con chip A17 Pro",
  "price": 999.99,
  "stock": 50,
  "active": false,
  "category": {
    "id": 1,
    "name": "Electrónica"
  },
  "subcategory": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

**Respuesta Exitosa (200) - Producto activado:**
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "Smartphone de última generación con chip A17 Pro",
  "price": 999.99,
  "stock": 50,
  "active": true,
  "category": {
    "id": 1,
    "name": "Electrónica"
  },
  "subcategory": {
    "id": 1,
    "name": "Smartphones"
  }
}
```

**Respuesta Error (404):**
```json
{
  "message": "Producto no encontrado"
}
```

---

## 📊 Estadísticas

### 26. Obtener Estadísticas del Sistema
**Endpoint:** `GET /stats`

**Headers:**
```
Authorization: Bearer {token}
```

**Roles requeridos:** `ADMIN`, `COORDINADOR`

**Respuesta Exitosa (200):**
```json
{
  "totalUsers": 10,
  "totalCategories": 5,
  "totalSubcategories": 15,
  "totalProducts": 120,
  "activeProducts": 110,
  "inactiveProducts": 10,
  "lowStockProducts": 8
}
```

---

## 📝 Notas Importantes

### Autenticación
- Todas las peticiones (excepto `/auth/login`) requieren el token JWT en el header `Authorization`
- Formato del header: `Authorization: Bearer {token}`
- El token expira después de 24 horas (86400000 ms)

### Roles y Permisos
- **ADMIN**: Acceso completo (puede crear, leer, actualizar y eliminar)
- **COORDINADOR**: Puede crear, leer y actualizar, pero NO puede eliminar

### Códigos de Estado HTTP
- **200**: Petición exitosa
- **400**: Error en la petición (datos inválidos)
- **401**: No autenticado (token faltante o inválido)
- **403**: No autorizado (sin permisos suficientes)
- **404**: Recurso no encontrado

### Validaciones
- Los campos marcados como `nullable = false` son obligatorios
- Los campos `unique` no pueden duplicarse
- Las contraseñas se almacenan encriptadas (BCrypt)
- Los usuarios eliminados se eliminan permanentemente de la base de datos

---

## 🚀 Configuración de Postman

### Variables de Entorno Recomendadas

Crea un entorno en Postman con las siguientes variables:

| Variable | Valor Inicial | Descripción |
|----------|--------------|-------------|
| `base_url` | `http://localhost:8080/api` | URL base de la API |
| `token` | _(vacío)_ | Se actualiza automáticamente después del login |
| `user_id` | _(vacío)_ | ID del usuario logueado |

### Script de Login (Tests)

Agrega este script en la pestaña "Tests" de la petición de login para guardar automáticamente el token:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
}
```

### Uso del Token Automático

En el header `Authorization` de todas las peticiones (excepto login), usa:
```
Bearer {{token}}
```

---

## 🧪 Ejemplos de Casos de Prueba

### Flujo Completo: Crear Producto

1. **Login** - Obtener token
2. **Crear Categoría** - "Electrónica"
3. **Crear Subcategoría** - "Smartphones" (asociada a Electrónica)
4. **Crear Producto** - "iPhone 15" (asociado a la subcategoría)
5. **Verificar** - GET del producto creado
6. **Actualizar** - Modificar precio o stock
7. **Eliminar** - DELETE del producto (solo ADMIN)

### Pruebas de Autorización

1. Intentar acceder sin token → 401
2. Intentar eliminar como COORDINADOR → 403
3. Intentar acceder con token expirado → 401

---

**Última actualización:** 14 de noviembre de 2025
**Versión de la API:** 1.0
**Puerto del servidor:** 8080
