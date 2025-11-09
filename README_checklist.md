# ✅ Checklist de Producción - Backend NestJS

## 🧩 1. Validación técnica del backend

**Objetivo:** confirmar que todas las rutas, servicios y roles funcionan.

- [ ] Correr servidor en modo `development` (`npm run start:dev`)
- [ ] Revisar consola: sin errores ni warnings.
- [ ] Crear colección Postman:
  - [ ] Login (`/auth/login`)
  - [ ] CRUD `users`
  - [ ] CRUD `customers`
  - [ ] CRUD `orders`
  - [ ] CRUD `payments`
  - [ ] CRUD `deliveries`
- [ ] Testear roles:
  - [ ] ADMIN (acceso total)
  - [ ] EMPLOYEE / DELIVERY (solo endpoints autorizados)
- [ ] Revisar guards y decorators (`@Roles`, `@UseGuards`, etc.)
- [ ] Verificar que todos los endpoints usan DTOs con validaciones (`class-validator`)

---

## ⚙️ 2. Optimización y saneamiento

**Objetivo:** reducir errores y preparar para entorno real.

- [ ] Crear archivo `.env.example`
- [ ] Ignorar `.env` en `.gitignore`
- [ ] Activar `ValidationPipe` y CORS en `main.ts`
- [ ] Implementar `GlobalExceptionFilter`
- [ ] Configurar logs (`nestjs-pino` o `winston`)
- [ ] Revisar `PrismaService` y relaciones
- [ ] Eliminar código o imports innecesarios

---

## 🧱 3. Base de datos

**Objetivo:** garantizar consistencia y migraciones seguras.

- [ ] `npx prisma validate`
- [ ] `npx prisma migrate deploy`
- [ ] Crear y ejecutar seed (`prisma/seed.ts`)
- [ ] Revisar `@relation` y `onDelete`
- [ ] Probar conexión a DB remota

---

## 🧑‍💻 4. Integración con frontend

**Objetivo:** conectar backend y frontend sin errores CORS ni JWT.

- [ ] Definir `BASE_URL` por entorno
- [ ] Configurar `AuthContext` o `useAuth()`
- [ ] Probar login / logout
- [ ] Probar endpoints protegidos
- [ ] Confirmar configuración CORS

---

## 🚀 5. Deploy backend

**Objetivo:** tener backend corriendo en entorno productivo.

- [ ] Subir a GitHub
- [ ] Deploy en Render / Railway / Vercel
- [ ] Configurar variables de entorno
- [ ] Testear endpoints productivos
- [ ] Confirmar HTTPS
- [ ] `NODE_ENV=production`

---

## 💻 6. Deploy frontend

**Objetivo:** publicar interfaz y conectar con backend.

- [ ] Build (`npm run build`)
- [ ] Hostear (Vercel / Hostinger / Netlify)
- [ ] Configurar `BASE_URL`
- [ ] Revisar CORS
- [ ] Test visual y funcional

---

## 🧠 7. QA y control final

**Objetivo:** verificar estabilidad total.

- [ ] Revisar logs
- [ ] Testear tiempos de respuesta
- [ ] Crear usuario admin real
- [ ] Flujo completo: Login → Acción → Logout
- [ ] Backup DB
- [ ] Documentar en README principal
- [ ] (Opcional) Agregar Swagger
