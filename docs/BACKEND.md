# Documentação Técnica - Backend

## Arquitetura

O backend foi desenvolvido utilizando NestJS, seguindo os princípios de arquitetura modular e injeção de dependências. A estrutura é organizada em módulos funcionais independentes que se comunicam através de services e controllers.

### Estrutura de Diretórios

```
src/
├── auth/           # Módulo de autenticação
├── books/          # Módulo de gerenciamento de livros
├── prisma/         # Módulo de integração com Prisma ORM
├── app.module.ts   # Módulo raiz da aplicação
└── main.ts         # Ponto de entrada da aplicação
```

## Módulos

### Auth Module

Responsável pela autenticação e gerenciamento de usuários.

#### Auth Controller (`auth.controller.ts`)

**Rotas Públicas:**

`POST /auth/register`
- Registra um novo usuário no sistema
- Body: `{ name: string, email: string, password: string }`
- Retorna: `{ id: number, name: string, email: string, access_token: string }`
- Valida unicidade de email
- Hash de senha com bcrypt

`POST /auth/login`
- Autentica um usuário existente
- Body: `{ email: string, password: string }`
- Retorna: `{ access_token: string }`
- Valida credenciais
- Gera token JWT com validade de 7 dias

#### Auth Service (`auth.service.ts`)

**Métodos Principais:**

`register(registerDto: RegisterDto)`
- Valida se o email já está em uso
- Cria hash da senha utilizando bcrypt (10 rounds)
- Persiste novo usuário no banco de dados
- Gera token JWT automaticamente
- Retorna dados do usuário sem a senha

`login(loginDto: LoginDto)`
- Busca usuário por email
- Valida senha usando bcrypt.compare
- Gera token JWT em caso de sucesso
- Lança UnauthorizedException para credenciais inválidas

`validateUser(email: string, password: string)`
- Método auxiliar para validação de credenciais
- Retorna usuário sem senha se válido
- Retorna null se inválido

#### JWT Strategy (`strategies/jwt.strategy.ts`)

- Extrai token JWT do header Authorization (Bearer token)
- Valida token usando secret key do environment
- Anexa payload do usuário ao objeto request
- Utilizado pelo JwtAuthGuard para proteção de rotas

#### JWT Auth Guard (`guards/jwt-auth.guard.ts`)

- Guard customizado para proteção de rotas
- Estende AuthGuard do Passport
- Aplicado a rotas que requerem autenticação
- Rejeita requisições sem token válido

#### DTOs

**RegisterDto** (`dto/register.dto.ts`)
- name: string (obrigatório)
- email: string (obrigatório, formato email)
- password: string (obrigatório, mínimo 6 caracteres)

**LoginDto** (`dto/login.dto.ts`)
- email: string (obrigatório, formato email)
- password: string (obrigatório)

### Books Module

Responsável pelo CRUD completo de livros.

#### Books Controller (`books.controller.ts`)

Todas as rotas são protegidas por `@UseGuards(JwtAuthGuard)`.

`GET /books`
- Lista todos os livros do usuário autenticado
- Query params: `search?: string` (busca por título)
- Retorna: Array de livros
- Filtra por userId do token JWT

`GET /books/:id`
- Busca um livro específico por ID
- Params: `id: number`
- Retorna: Objeto do livro
- Valida se o livro pertence ao usuário
- Lança NotFoundException se não encontrado

`POST /books`
- Cria um novo livro
- Body: CreateBookDto
- Retorna: Livro criado
- Associa automaticamente ao userId do token

`PATCH /books/:id`
- Atualiza um livro existente
- Params: `id: number`
- Body: UpdateBookDto
- Retorna: Livro atualizado
- Valida propriedade do livro

`DELETE /books/:id`
- Remove um livro
- Params: `id: number`
- Retorna: Livro removido
- Valida propriedade antes de deletar

#### Books Service (`books.service.ts`)

**Métodos Principais:**

`findAll(userId: number, search?: string)`
- Busca todos os livros do usuário
- Aplica filtro de busca por título se fornecido
- Ordenação por data de atualização (mais recente primeiro)
- Utiliza Prisma para queries type-safe

`findOne(id: number, userId: number)`
- Busca livro por ID
- Valida se pertence ao usuário
- Lança NotFoundException se não encontrado ou não autorizado

`create(createBookDto: CreateBookDto, userId: number)`
- Cria novo registro no banco
- Associa ao userId fornecido
- Retorna livro criado com timestamps

`update(id: number, updateBookDto: UpdateBookDto, userId: number)`
- Valida existência e propriedade do livro
- Atualiza apenas campos fornecidos (partial update)
- Retorna livro atualizado

`remove(id: number, userId: number)`
- Valida existência e propriedade
- Remove registro do banco de dados
- Retorna livro removido

#### DTOs

**CreateBookDto** (`dto/create-book.dto.ts`)
- title: string (obrigatório)
- author: string (obrigatório)
- year?: number (opcional)
- description?: string (opcional)

**UpdateBookDto** (`dto/update-book.dto.ts`)
- Estende PartialType(CreateBookDto)
- Todos os campos opcionais
- Permite atualização parcial

### Prisma Module

Módulo de integração com o banco de dados.

#### Prisma Service (`prisma.service.ts`)

- Estende PrismaClient do @prisma/client
- Implementa OnModuleInit para conexão automática
- Implementa OnModuleDestroy para desconexão limpa
- Fornece cliente Prisma para toda a aplicação
- Singleton gerenciado pelo NestJS

#### Schema (`prisma/schema.prisma`)

**Model User**
```prisma
id: Int (auto-increment, primary key)
name: String
email: String (unique)
password: String (hash bcrypt)
createdAt: DateTime (default now)
books: Book[] (relação one-to-many)
```

**Model Book**
```prisma
id: Int (auto-increment, primary key)
title: String
author: String
year: Int? (opcional)
description: String? (opcional)
userId: Int (foreign key)
user: User (relação many-to-one)
createdAt: DateTime (default now)
updatedAt: DateTime (auto-update)
```

**Relações:**
- User possui muitos Books (onDelete: Cascade)
- Book pertence a um User
- Deleção de User cascata para Books relacionados

## Configuração

### Variáveis de Ambiente

Arquivo `.env` requerido na raiz do projeto backend:

```
DATABASE_URL="mysql://user:password@localhost:3306/book_manager"
JWT_SECRET="chave_secreta_para_jwt"
PORT=3001
```

### Porta e CORS

**Porta:**
- Configurável via variável PORT (padrão: 3001)
- Definida em `main.ts`

**CORS:**
- Habilitado globalmente em `main.ts`
- Permite requisições do frontend (localhost:3000)
- Headers permitidos: Authorization, Content-Type

### Validação Global

- ValidationPipe aplicado globalmente
- Validação automática de DTOs
- Transformação de tipos automática
- Whitelist habilitada (ignora propriedades não definidas)

## Fluxo de Autenticação

1. Usuário envia credenciais para `/auth/login` ou `/auth/register`
2. AuthService valida credenciais e gera token JWT
3. Token é retornado ao cliente
4. Cliente armazena token (cookie HTTP-only)
5. Cliente envia token no header Authorization em requisições subsequentes
6. JwtStrategy valida token e extrai payload
7. JwtAuthGuard permite ou nega acesso à rota
8. Controller recebe request com user anexado
9. Service acessa userId para operações no banco

## Segurança Implementada

### Hash de Senhas
- Bcrypt com 10 rounds
- Senhas nunca armazenadas em texto plano
- Senhas nunca retornadas em responses

### JWT
- Secret key armazenada em variável de ambiente
- Expiração de 7 dias
- Payload contém apenas sub (userId) e email

### Validação de Propriedade
- Todas as operações validam userId
- Usuários só acessam seus próprios recursos
- Queries filtradas automaticamente por userId

### Validação de Entrada
- Class-validator em todos os DTOs
- Tipos validados em runtime
- Proteção contra injection

## Migrações de Banco

### Criar Nova Migração
```bash
npx prisma migrate dev --name nome_da_migracao
```

### Aplicar Migrações em Produção
```bash
npx prisma migrate deploy
```

### Resetar Banco (Desenvolvimento)
```bash
npx prisma migrate reset
```

### Gerar Cliente Prisma
```bash
npx prisma generate
```

## Testes

### Estrutura de Testes

- Testes unitários em arquivos `.spec.ts`
- Testes E2E em diretório `test/`
- Configuração Jest em `package.json`

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de código
npm run test:cov
```

## Build e Deployment

### Build de Produção
```bash
npm run build
```

### Iniciar Produção
```bash
npm run start:prod
```

### Modo Desenvolvimento
```bash
npm run start:dev
```

## Logs e Monitoramento

- Logger nativo do NestJS habilitado
- Logs de requisições HTTP automáticos
- Erros capturados e formatados
- Stack traces em ambiente de desenvolvimento
