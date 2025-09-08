"en-GB": { "name": "English", "country": "United Kingdom", "flag": "🇬🇧" },
  "en-AU": { "name": "English", "country": "Australia", "flag": "🇦🇺" },
  "bg": { "name": "Български", "country": "Bulgaria", "flag": "🇧🇬" },
  "de": { "name": "Deutsch", "country": "Germany", "flag": "🇩🇪" },
  "ru": { "name": "Русский", "country": "Russia", "flag": "🇷🇺" },
  "fr": { "name": "Français", "country": "France", "flag": "🇫🇷" },
  "pt": { "name": "Português", "country": "Brazil", "flag": "🇧🇷" }
}
```

### GET `/i18n/translations/:lang`
Obtém traduções para um idioma específico.

**Parameters:**
```
lang: string (required) - Código do idioma (ex: 'pt', 'en', 'fr')
```

**Response 200:**
```json
{
  "language": "pt",
  "translations": {
    "welcome": "Bem-vindo",
    "models": "Modelos",
    "search": "Buscar",
    "filter": "Filtrar",
    "sort": "Ordenar",
    "recent": "Recente",
    "popular": "Popular",
    "oldest": "Mais Antigos",
    "random": "Aleatório",
    "ethnicity": "Etnia",
    "age": "Idade",
    "height": "Altura",
    "weight": "Peso",
    "hair_color": "Cor do Cabelo",
    "eye_color": "Cor dos Olhos",
    "body_type": "Tipo de Corpo",
    "view_profile": "Ver Perfil",
    "share": "Compartilhar",
    "report": "Denunciar",
    "broken_link": "Link Quebrado",
    "child_content": "Conteúdo Infantil",
    "no_consent": "Sem Consentimento",
    "inappropriate": "Inapropriado",
    "login": "Entrar",
    "register": "Registrar",
    "email": "Email",
    "password": "Senha",
    "confirm_password": "Confirmar Senha",
    "name": "Nome",
    "age_confirmation": "Confirmo que tenho 18 anos ou mais",
    "verify_email": "Verificar Email",
    "forgot_password": "Esqueci a Senha",
    "premium": "Premium",
    "free": "Gratuito"
  }
}
```

**Response 404:**
```json
{
  "error": "Idioma não suportado"
}
```

### GET `/i18n/detect`
Detecta idioma automaticamente baseado no cabeçalho Accept-Language.

**Response 200:**
```json
{
  "detected": "pt",
  "supported": { "name": "Português", "country": "Brazil", "flag": "🇧🇷" },
  "translations": {
    "welcome": "Bem-vindo",
    "models": "Modelos"
  }
}
```

---

## 💳 Pagamentos

### POST `/purchase`
Cria sessão de pagamento Stripe (Usuário autenticado).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request:**
```json
{
  "email": "string (required)"
}
```

**Response 200:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Response 403:**
```json
{
  "error": "Este e-mail não está autorizado para pagamento."
}
```

### POST `/webhook`
Webhook do Stripe para processar pagamentos (Stripe apenas).

**Headers:**
```
stripe-signature: {stripe_signature}
Content-Type: application/json
```

**Body:** (Raw Stripe Event)

**Response 200:** (Empty)

---

## 🏥 Sistema

### GET `/health`
Verifica saúde do sistema.

**Response 200:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 📋 Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Requisição bem-sucedida, sem conteúdo |
| 400 | Bad Request | Dados da requisição inválidos |
| 401 | Unauthorized | Token de autenticação inválido ou ausente |
| 403 | Forbidden | Acesso negado (ex: não é admin, idade não confirmada) |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já existe) |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🔧 Middleware

### Age Verification Middleware
Aplicado automaticamente nas rotas `/models` e `/content`.

**Requisito:**
```
Header: x-age-confirmed: true
OU
Session: ageConfirmed = true
```

**Resposta de Bloqueio:**
```json
{
  "error": "Age verification required",
  "message": "You must confirm that you are 18 years or older to access this content",
  "requiresAgeVerification": true
}
```

### Auth Middleware
Verifica token JWT válido.

**Requisito:**
```
Header: Authorization: Bearer {valid_jwt_token}
```

**Resposta de Erro:**
```json
{
  "error": "Token inválido ou expirado"
}
```

### Admin Middleware
Verifica se usuário é administrador.

**Requisito:**
- Token JWT válido
- `user.isAdmin = true`

**Resposta de Erro:**
```json
{
  "error": "Acesso negado! Apenas administradores podem realizar esta ação."
}
```

---

## 📝 Exemplos de Uso com cURL

### Registrar Usuário
```bash
curl -X POST "http://localhost:3001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "ageConfirmed": true,
    "language": "pt",
    "country": "BR"
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

### Buscar Modelos com Filtros
```bash
curl -X GET "http://localhost:3001/models?ethnicity=latina&age=25&sortBy=popular&page=1&limit=10" \
  -H "x-age-confirmed: true"
```

### Obter Detalhes do Modelo
```bash
curl -X GET "http://localhost:3001/models/maria-silva-abc123" \
  -H "x-age-confirmed: true" \
  -H "Authorization: Bearer {jwt_token}"
```

### Criar Denúncia
```bash
curl -X POST "http://localhost:3001/reports" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {jwt_token}" \
  -d '{
    "contentId": 1,
    "reason": "broken_link",
    "description": "O link não está funcionando"
  }'
```

### Confirmar Idade
```bash
curl -X POST "http://localhost:3001/age-verification/confirm" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmed": true
  }'
```

### Obter Traduções
```bash
curl -X GET "http://localhost:3001/i18n/translations/pt"
```

---

## 🚀 Ambiente de Desenvolvimento

### Configuração Rápida
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Executar migrações do banco
# Execute os arquivos SQL na ordem

# 4. Iniciar servidor
npm start
```

### Testando APIs
```bash
# Verificar saúde do sistema
curl http://localhost:3001/health

# Listar idiomas suportados
curl http://localhost:3001/i18n/languages

# Detectar idioma automaticamente
curl -H "Accept-Language: pt-BR,pt;q=0.9,en;q=0.8" \
  http://localhost:3001/i18n/detect
```

---

## 📊 Estrutura de Resposta Padrão

### Sucesso com Dados
```json
{
  "data": { /* objeto ou array */ },
  "message": "Operação realizada com sucesso"
}
```

### Sucesso com Paginação
```json
{
  "models": [ /* array de modelos */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

### Erro
```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes adicionais (opcional)"
}
```

---

## 🔐 Segurança

### Headers de Segurança
- `Authorization: Bearer {jwt_token}` - Autenticação
- `x-age-confirmed: true` - Confirmação de idade
- `Content-Type: application/json` - Tipo de conteúdo

### Validações
- Idade mínima: 18 anos
- Senha mínima: 6 caracteres
- Email único por usuário
- Verificação de email obrigatória
- Rate limiting (configurável)

### Logs de Auditoria
- Todas as ações são registradas
- IPs são armazenados para denúncias
- Histórico de usuário é mantido
- Logs de autenticação e erros