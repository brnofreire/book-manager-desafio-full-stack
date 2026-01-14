# Book Manager - Guia de Uso

## Visão Geral

Book Manager é um sistema completo de gerenciamento de biblioteca pessoal que permite aos usuários cadastrar, organizar e gerenciar seus livros de forma eficiente. O sistema implementa autenticação de usuários e operações CRUD completas.

## Requisitos do Sistema

### Software Necessário

- Node.js versão 18.x ou superior
- MySQL versão 8.0 ou superior
- npm versão 9.x ou superior

### Portas Utilizadas

- Backend: 3001
- Frontend: 3000
- MySQL: 3306

## Instalação

### 1. Configuração do Banco de Dados

Certifique-se de que o MySQL está em execução e crie o banco de dados:

```sql
CREATE DATABASE book_manager;
```

### 2. Configuração do Backend

Navegue até a pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Configure o arquivo `.env` com as seguintes variáveis:

```
DATABASE_URL="mysql://usuario:senha@localhost:3306/book_manager"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=3001
```

Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

Inicie o servidor backend:

```bash
npm run start:dev
```

### 3. Configuração do Frontend

Em outro terminal, navegue até a pasta do frontend:

```bash
cd frontend
npm install
```

Configure o arquivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Acesso ao Sistema

Após a inicialização, acesse o sistema através do navegador:

```
http://localhost:3000
```

## Funcionalidades Principais

### Autenticação

#### Registro de Usuário

1. Acesse a página de registro em `/register`
2. Preencha os campos obrigatórios:
   - Nome completo
   - Email válido
   - Senha (mínimo 6 caracteres)
   - Confirmação de senha
3. Clique em "Criar Conta"
4. Após o registro bem-sucedido, será redirecionado para a página de login

#### Login

1. Acesse a página de login em `/login`
2. Insira suas credenciais:
   - Email
   - Senha
3. Opcionalmente, marque "Lembrar-me" para manter a sessão
4. Clique em "Entrar"

### Gerenciamento de Livros

#### Listagem de Livros

A tela principal (`/books`) exibe todos os livros cadastrados pelo usuário. Funcionalidades disponíveis:

- **Busca**: Campo de busca por título na barra superior
- **Modos de Visualização**:
  - Grid: Visualização em cards com informações detalhadas
  - Lista: Visualização compacta em formato de lista
- **Ordenação**: Arraste os livros para reorganizá-los conforme preferência
- **Ações Rápidas**: Botões de editar e excluir em cada livro

#### Cadastro de Livro

1. Na tela de listagem, clique em "Novo Livro"
2. Preencha os campos do formulário:
   - Título (obrigatório)
   - Autor (obrigatório)
   - Ano de Publicação (opcional)
   - Descrição (opcional)
3. Clique em "Salvar Livro"

#### Edição de Livro

1. Na listagem, clique no botão "Editar" do livro desejado
2. Modifique os campos necessários
3. Clique em "Salvar Alterações"

#### Exclusão de Livro

1. Na listagem, clique no botão "Excluir" do livro desejado
2. Confirme a ação no modal de confirmação
3. O livro será removido permanentemente

## Segurança

### Autenticação JWT

O sistema utiliza tokens JWT (JSON Web Tokens) para autenticação. Os tokens são:

- Gerados no momento do login
- Válidos por 7 dias
- Armazenados em cookies HTTP-only
- Enviados automaticamente em todas as requisições autenticadas

### Proteção de Rotas

- Todas as rotas de gerenciamento de livros requerem autenticação
- Usuários só podem visualizar e manipular seus próprios livros
- Tentativas de acesso não autorizado resultam em redirecionamento para login

## Resolução de Problemas

### Backend não inicia

Verifique:
- MySQL está em execução
- Credenciais do banco de dados no `.env` estão corretas
- Porta 3001 não está em uso por outro processo
- Migrações do Prisma foram executadas

### Frontend não conecta ao Backend

Verifique:
- Backend está em execução na porta 3001
- Arquivo `.env.local` contém a URL correta
- CORS está configurado corretamente no backend

### Erros de Autenticação

Verifique:
- JWT_SECRET está definido no backend
- Cookies estão habilitados no navegador
- Token não expirou (validade de 7 dias)

## Suporte Técnico

Para problemas não resolvidos por este guia, consulte:
- Documentação técnica do backend em `BACKEND.md`
- Documentação técnica do frontend em `FRONTEND.md`
- Lista completa de bibliotecas em `LIBRARIES.md`
