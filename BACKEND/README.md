# 📚 Documentação do Backend - Sistema de Catálogo de Modelos Adultos

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Modelos de Dados](#modelos-de-dados)
4. [APIs e Endpoints](#apis-e-endpoints)
5. [Autenticação](#autenticação)
6. [Middleware](#middleware)
7. [Internacionalização](#internacionalização)
8. [Sistema de Denúncias](#sistema-de-denúncias)
9. [Exemplos de Uso](#exemplos-de-uso)
10. [Códigos de Erro](#códigos-de-erro)

---

## 🎯 Visão Geral

Sistema backend completo para catálogo de modelos adultos com funcionalidades de:
- Autenticação com verificação de email
- Catálogo de modelos com filtros avançados
- Sistema de conteúdos (vídeos/imagens)
- Sistema de denúncias
- Verificação de idade (+18)
- Internacionalização (10 idiomas)
- Histórico de usuários

### Tecnologias Utilizadas
- **Node.js** + **Express.js**
- **PostgreSQL** com **Sequelize ORM**
- **JWT** para autenticação
- **Nodemailer** para emails
- **Stripe** para pagamentos
- **bcryptjs** para hash de senhas

---

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos
```bash
Node.js >= 16.x
PostgreSQL >= 12.x
```

### 2. Instalação
```bash
cd BACKEND
npm install
```

### 3. Configuração do Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```env
# Database
POSTGRES_URL=postgresql://username:password@localhost:5432/database_name

# JWT
TOKEN_VERIFY_ACCESS=your_jwt_secret_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yoursite.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRICEID_MONTHLY=price_your_monthly_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Environment
NODE_ENV=development
```

### 4. Banco de Dados
Execute as migrações SQL na ordem:
```bash
# Execute os arquivos SQL em ordem:
# 001_create_models_table.sql
# 002_create_contents_table.sql
# 003_create_reports_table.sql
# 004_create_user_history_table.sql
# 005_update_users_table.sql
```

### 5. Iniciar Servidor
```bash
npm start
```

---

## 🗄️ Modelos de Dados

### User (Usuário)
```javascript
{
  id: INTEGER (PK),
  name: STRING,
  email: STRING (UNIQUE),
  password: STRING (HASH),
  isVerified: BOOLEAN,
  verificationToken: STRING,
  resetPasswordToken: STRING,
  resetPasswordExpires: DATE,
  language: STRING,
  country: STRING,
  ageConfirmed: BOOLEAN,
  lastLoginAt: DATE,
  isPremium: BOOLEAN,
  isAdmin: BOOLEAN,
  expiredPremium: DATE,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Model (Modelo)
```javascript
{
  id: INTEGER (PK),
  name: STRING,
  photoUrl: STRING,
  bio: TEXT,
  hairColor: STRING,
  eyeColor: STRING,
  bodyType: STRING,
  bustSize: STRING,
  height: INTEGER, // em cm
  weight: INTEGER, // em kg
  age: INTEGER,
  birthPlace: STRING,
  ethnicity: ENUM('arab', 'asian', 'ebony', 'indian', 'latina', 'white'),
  orientation: STRING,
  tags: JSON,
  views: INTEGER,
  slug: STRING (UNIQUE),
  isActive: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Content (Conteúdo)
```javascript
{
  id: INTEGER (PK),
  modelId: INTEGER (FK),
  title: STRING,
  url: STRING,
  thumbnailUrl: STRING,
  type: ENUM('video', 'image', 'gallery'),
  tags: JSON,
  views: INTEGER,
  status: ENUM('active', 'broken', 'reported', 'removed'),
  language: STRING,
  isActive: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Report (Denúncia)
```javascript
{
  id: INTEGER (PK),
  contentId: INTEGER (FK),
  modelId: INTEGER (FK),
  userId: INTEGER (FK),
  reason: ENUM('broken_link', 'child_content', 'no_consent', 'spam', 'inappropriate', 'other'),
  description: TEXT,
  status: ENUM('pending', 'reviewed', 'resolved', 'dismissed'),
  ipAddress: STRING,
  reviewedAt: DATE,
  reviewedBy: INTEGER,
  adminNotes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### UserHistory (Histórico)
```javascript
{
  id: INTEGER (PK),
  userId: INTEGER (FK),
  contentId: INTEGER (FK),
  modelId: INTEGER (FK),
  action: ENUM('view', 'like', 'share', 'download'),
  metadata: JSON,
  createdAt: DATE,
  updatedAt: DATE
}
```

---

## 🔌 APIs e Endpoints

### 🔐 Autenticação (`/auth`)

#### POST `/auth/register`
Registra um novo usuário com verificação de email.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "language": "pt",
  "country": "BR",
  "ageConfirmed": true
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso. Verifique seu email para ativar a conta.",
  "userId": 1
}
```

#### POST `/auth/login`
Realiza login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "isPremium": false,
    "isVerified": true,
    "language": "pt",
    "country": "BR"
  }
}
```

#### POST `/auth/verify-email`
Verifica o email do usuário.

**Body:**
```json
{
  "token": "verification_token"
}
```

#### POST `/auth/forgot-password`
Solicita redefinição de senha.

**Body:**
```json
{
  "email": "joao@email.com"
}
```

#### POST `/auth/reset-password`
Redefine a senha do usuário.

**Body:**
```json
{
  "token": "reset_token",
  "password": "nova_senha123"
}
```

#### GET `/auth/dashboard`
Retorna dados do usuário logado.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "isPremium": false,
  "isAdmin": false,
  "expiredPremium": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 👥 Modelos (`/models`)

#### GET `/models`
Lista modelos com filtros e paginação.

**Query Parameters:**
```
page=1
limit=20
ethnicity=latina
minAge=18
maxAge=30
hairColor=Blonde
eyeColor=Blue
bodyType=Slim
tags=["tag1", "tag2"]
sortBy=recent|popular|oldest|random
search=nome_do_modelo
```

**Response:**
```json
{
  "models": [
    {
      "id": 1,
      "name": "Maria Silva",
      "photoUrl": "https://example.com/photo.jpg",
      "bio": "Biografia da modelo...",
      "age": 25,
      "ethnicity": "latina",
      "views": 1500,
      "slug": "maria-silva-abc123",
      "contents": [
        {
          "id": 1,
          "type": "video"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

#### GET `/models/:slug`
Detalhes de um modelo específico.

**Response:**
```json
{
  "id": 1,
  "name": "Maria Silva",
  "photoUrl": "https://example.com/photo.jpg",
  "bio": "Biografia completa...",
  "hairColor": "Blonde",
  "eyeColor": "Blue",
  "bodyType": "Slim",
  "bustSize": "36C",
  "height": 165,
  "weight": 55,
  "age": 25,
  "birthPlace": "São Paulo, Brasil",
  "ethnicity": "latina",
  "orientation": "Heterosexual",
  "tags": ["tag1", "tag2"],
  "views": 1500,
  "slug": "maria-silva-abc123",
  "contents": [
    {
      "id": 1,
      "title": "Vídeo 1",
      "url": "https://example.com/video1",
      "thumbnailUrl": "https://example.com/thumb1.jpg",
      "type": "video",
      "views": 500
    }
  ]
}
```

#### POST `/models`
Cria um novo modelo (admin).

**Body:**
```json
{
  "name": "Nova Modelo",
  "photoUrl": "https://example.com/photo.jpg",
  "bio": "Biografia...",
  "age": 22,
  "ethnicity": "white",
  "tags": ["tag1", "tag2"]
}
```

### 📱 Conteúdo (`/content`)

#### GET `/content/model/:modelId`
Lista conteúdos de um modelo.

**Query Parameters:**
```
page=1
limit=20
type=video|image|gallery
tags=["tag1"]
sortBy=recent|popular|oldest
```

**Response:**
```json
{
  "contents": [
    {
      "id": 1,
      "modelId": 1,
      "title": "Vídeo Especial",
      "url": "https://example.com/video",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "type": "video",
      "tags": ["tag1"],
      "views": 250,
      "status": "active",
      "model": {
        "id": 1,
        "name": "Maria Silva",
        "slug": "maria-silva-abc123"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

#### POST `/content/:id/view`
Registra visualização de conteúdo.

**Response:**
```json
{
  "message": "Visualização registrada",
  "views": 251
}
```

#### POST `/content/:id/share`
Compartilha conteúdo.

**Body:**
```json
{
  "platform": "twitter"
}
```

**Response:**
```json
{
  "shareUrl": "https://site.com/model/maria-silva-abc123?content=1",
  "shareText": "Confira Vídeo Especial - Maria Silva",
  "platform": "twitter"
}
```

### 🚨 Denúncias (`/reports`)

#### POST `/reports`
Cria uma denúncia.

**Body:**
```json
{
  "contentId": 1,
  "modelId": null,
  "reason": "broken_link",
  "description": "O link não está funcionando"
}
```

**Response:**
```json
{
  "message": "Denúncia registrada com sucesso",
  "reportId": 1
}
```

#### GET `/reports` (Admin)
Lista denúncias.

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
page=1
limit=20
status=pending|reviewed|resolved|dismissed
reason=broken_link|child_content|no_consent|spam|inappropriate|other
sortBy=recent|oldest
```

### 🔞 Verificação de Idade (`/age-verification`)

#### POST `/age-verification/confirm`
Confirma idade +18.

**Body:**
```json
{
  "confirmed": true,
  "birthDate": "1990-01-01"
}
```

**Response:**
```json
{
  "message": "Age confirmed successfully",
  "ageConfirmed": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/age-verification/status`
Verifica status da confirmação.

**Response:**
```json
{
  "ageConfirmed": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 🌍 Internacionalização (`/i18n`)

#### GET `/i18n/languages`
Lista idiomas suportados.

**Response:**
```json
{
  "en": { "name": "English", "country": "US", "flag": "🇺🇸" },
  "pt": { "name": "Português", "country": "Brazil", "flag": "🇧🇷" },
  "fr": { "name": "Français", "country": "France", "flag": "🇫🇷" }
}
```

#### GET `/i18n/translations/:lang`
Obtém traduções para um idioma.

**Response:**
```json
{
  "language": "pt",
  "translations": {
    "welcome": "Bem-vindo",
    "models": "Modelos",
    "search": "Buscar",
    "filter": "Filtrar"
  }
}
```

#### GET `/i18n/detect`
Detecta idioma automaticamente.

**Response:**
```json
{
  "detected": "pt",
  "supported": { "name": "Português", "country": "Brazil", "flag": "🇧🇷" },
  "translations": { "welcome": "Bem-vindo" }
}
```

---

## 🔒 Autenticação

### JWT Token
Todas as rotas protegidas requerem o header:
```
Authorization: Bearer jwt_token_here
```

### Middleware de Autenticação
```javascript
// Exemplo de uso
const authMiddleware = require('./Middleware/Auth');
router.get('/protected', authMiddleware, (req, res) => {
  // req.user contém os dados do usuário
  res.json({ user: req.user });
});
```

### Verificação de Admin
```javascript
const isAdmin = require('./Middleware/isAdmin');
router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  // Apenas administradores podem acessar
});
```

---

## 🛡️ Middleware

### Age Verification Middleware
Bloqueia acesso a conteúdo adulto sem confirmação de idade:

```javascript
const { ageVerificationMiddleware } = require('./routes/ageVerification');

// Aplicado automaticamente nas rotas de modelos e conteúdo
app.use('/models', ageVerificationMiddleware, modelsRouter);
app.use('/content', ageVerificationMiddleware, contentRouter);
```

### Session Middleware
Gerencia sessões para verificação de idade:

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));
```

---

## 🌍 Internacionalização

### Idiomas Suportados
- **en** - English (US)
- **en-CA** - English (Canada)
- **en-IN** - English (India)
- **en-GB** - English (UK)
- **en-AU** - English (Australia)
- **bg** - Български (Bulgaria)
- **de** - Deutsch (Germany)
- **ru** - Русский (Russia)
- **fr** - Français (France)
- **pt** - Português (Brazil)

### Detecção Automática
O sistema detecta automaticamente o idioma baseado no header `Accept-Language` do navegador.

### Uso das Traduções
```javascript
// Middleware para adicionar traduções
app.use('/api/:lang', (req, res, next) => {
  req.translations = getTranslations(req.params.lang);
  next();
});
```

---

## 🚨 Sistema de Denúncias

### Tipos de Denúncia
- **broken_link** - Link quebrado
- **child_content** - Conteúdo infantil
- **no_consent** - Sem consentimento
- **spam** - Spam
- **inappropriate** - Inapropriado
- **other** - Outro motivo

### Status de Denúncia
- **pending** - Pendente
- **reviewed** - Revisado
- **resolved** - Resolvido
- **dismissed** - Descartado

### Fluxo de Processamento
1. Usuário cria denúncia
2. Sistema registra com IP e timestamp
3. Admin revisa e atualiza status
4. Ações automáticas para certos tipos (ex: link quebrado)

---

## 💡 Exemplos de Uso

### Buscar Modelos Latinas
```bash
curl -X GET "http://localhost:3001/models?ethnicity=latina&page=1&limit=10" \
  -H "x-age-confirmed: true"
```

### Registrar Usuário
```bash
curl -X POST "http://localhost:3001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "ageConfirmed": true
  }'
```

### Fazer Login
```bash
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Denunciar Conteúdo
```bash
curl -X POST "http://localhost:3001/reports" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d '{
    "contentId": 1,
    "reason": "broken_link",
    "description": "Link não funciona"
  }'
```

---

## ⚠️ Códigos de Erro

### Códigos HTTP
- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Requisição inválida
- **401** - Não autorizado
- **403** - Acesso negado
- **404** - Não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor

### Mensagens de Erro Comuns
```json
{
  "error": "Não autorizado"
}

{
  "error": "Email já cadastrado!"
}

{
  "error": "Credenciais incorretas!"
}

{
  "error": "Age verification required",
  "message": "You must confirm that you are 18 years or older",
  "requiresAgeVerification": true
}
```

---

## 🔧 Configuração de Produção

### Variáveis de Ambiente Obrigatórias
```env
NODE_ENV=production
POSTGRES_URL=postgresql://user:pass@host:port/db
TOKEN_VERIFY_ACCESS=strong_jwt_secret
SMTP_HOST=smtp.provider.com
SMTP_USER=your_email
SMTP_PASS=your_password
FRONTEND_URL=https://yourdomain.com
```

### Configurações de Segurança
- Use HTTPS em produção
- Configure CORS adequadamente
- Use senhas fortes para JWT
- Configure rate limiting
- Use SSL para conexão com banco

### Monitoramento
- Logs estruturados
- Métricas de performance
- Alertas para erros críticos
- Backup automático do banco

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme configuração do `.env`
3. Teste conectividade com banco de dados
4. Verifique configuração SMTP para emails

### Logs Importantes
```bash
# Logs de autenticação
console.log('User authenticated:', user.email);

# Logs de denúncias
console.log('Report created:', reportId);

# Logs de erro
console.error('Database error:', error);
```