# Documentação Técnica - Frontend

## Arquitetura

O frontend foi desenvolvido utilizando Next.js 15 com App Router, React 19 e TypeScript. A arquitetura segue princípios de componentização, separação de responsabilidades e gerenciamento centralizado de estado de autenticação.

### Estrutura de Diretórios

```
src/
├── app/              # App Router do Next.js
│   ├── books/        # Páginas de gerenciamento de livros
│   ├── login/        # Página de autenticação
│   ├── register/     # Página de registro
│   ├── layout.tsx    # Layout raiz da aplicação
│   └── page.tsx      # Página inicial (redirect)
├── contexts/         # Context API do React
│   └── AuthContext.tsx
└── services/         # Serviços de comunicação com API
    ├── api.ts
    ├── auth.ts
    └── books.ts
```

## Roteamento

### App Router do Next.js

O sistema utiliza o App Router (Next.js 13+) com roteamento baseado em sistema de arquivos.

**Rotas Públicas:**
- `/` - Página inicial (redireciona para /books)
- `/login` - Autenticação de usuários
- `/register` - Registro de novos usuários

**Rotas Protegidas:**
- `/books` - Listagem e gerenciamento de livros
- `/books/new` - Formulário de criação de livro
- `/books/[id]/edit` - Formulário de edição de livro

### Proteção de Rotas

Implementada através do AuthContext que verifica autenticação em cada página protegida:

1. Hook useAuth verifica token em cookies
2. Se não autenticado, redireciona para /login
3. Loading state durante verificação
4. Componente só renderiza após validação

## Páginas

### Layout Raiz (`app/layout.tsx`)

**Responsabilidades:**
- Define estrutura HTML base
- Aplica fonte Inter do Google Fonts
- Configura metadados da aplicação
- Envolve aplicação com AuthProvider
- Aplica estilos globais

**Metadados:**
- Title: "Book Manager"
- Description: "Gerencie sua biblioteca pessoal"

### Página Inicial (`app/page.tsx`)

**Funcionalidade:**
- Redireciona automaticamente para /books
- Utiliza useRouter do Next.js
- Execução client-side

### Página de Login (`app/login/page.tsx`)

**Interface:**
- Layout split-screen
- Painel esquerdo: Gradiente roxo com elementos decorativos SVG
- Painel direito: Formulário de login

**Campos:**
- Email (obrigatório, validação de formato)
- Senha (obrigatório, toggle de visibilidade)
- Checkbox "Lembrar-me"
- Link "Esqueceu a senha?"

**Funcionalidades:**
- Validação de formulário em tempo real
- Toggle de visibilidade de senha (EyeIcon/EyeSlashIcon)
- Estado de loading durante requisição
- Mensagens de erro formatadas
- Redirecionamento automático após login
- Link para página de registro

**Tratamento de Erros:**
- Exibe mensagens do backend
- Formata arrays de erros em lista
- Mensagem padrão para erros inesperados

### Página de Registro (`app/register/page.tsx`)

**Interface:**
- Layout split-screen similar ao login
- Gradiente indigo-roxo-rosa no painel esquerdo

**Campos:**
- Nome completo (obrigatório)
- Email (obrigatório, validação de formato)
- Senha (obrigatório, mínimo 6 caracteres)
- Confirmar Senha (obrigatório, deve coincidir)

**Validações Client-Side:**
- Verificação de senha mínima (6 caracteres)
- Comparação de senhas (match)
- Toggle de visibilidade para ambas as senhas
- Validação de formato de email

**Fluxo:**
1. Preenchimento do formulário
2. Validação local
3. Submissão para API
4. Armazenamento automático de token
5. Redirecionamento para /books

### Página de Listagem de Livros (`app/books/page.tsx`)

**Interface:**

**Header/Topbar:**
- Logo do aplicativo
- Título "Book Manager"
- Nome do usuário autenticado
- Botão de logout
- Sticky top para permanecer visível no scroll

**Toolbar:**
- Campo de busca com ícone
- Botão de limpar busca
- Toggle de visualização (Grid/Lista)
- Botão "Novo Livro"

**Visualizações:**

**Modo Grid:**
- Layout em 3 colunas (desktop)
- 2 colunas (tablet)
- 1 coluna (mobile)
- Cards com informações completas
- Handle de drag visível no topo

**Modo Lista:**
- Layout vertical compacto
- Handle de drag à esquerda
- Informações inline
- Ações à direita

**Funcionalidades:**

**Busca:**
- Busca por título do livro
- Requisição debounced ao backend
- Botão de limpar busca visível quando ativo
- Estado de loading durante busca

**Drag and Drop:**
- Biblioteca @dnd-kit
- Sensores de mouse e teclado
- Feedback visual durante drag (opacidade 50%)
- Reordenação local (não persistida)
- Funciona em ambos os modos de visualização

**Exclusão:**
- Modal SweetAlert2 para confirmação
- Tema dark consistente com o design
- Modal de sucesso após exclusão
- Modal de erro em caso de falha
- Estado de loading no botão durante exclusão

**Estados:**
- Loading: Spinner durante carregamento inicial
- Empty: Mensagem quando não há livros
- Empty Search: Mensagem quando busca não retorna resultados
- Error: Tratamento de erros de API

### Página de Novo Livro (`app/books/new/page.tsx`)

**Interface:**
- Header com breadcrumb (botão Voltar)
- Ícone de livro no título
- Formulário centralizado

**Campos:**
- Título (obrigatório)
- Autor (obrigatório)
- Ano de Publicação (opcional, número)
- Descrição (opcional, textarea)

**Validações:**
- Validação HTML5 nativa
- Campos obrigatórios marcados com asterisco
- Tipo número para ano

**Ações:**
- Botão Cancelar: Retorna para listagem
- Botão Salvar: Cria livro e redireciona
- Estado de loading durante salvamento
- Mensagens de erro do backend

### Página de Edição de Livro (`app/books/[id]/edit/page.tsx`)

**Interface:**
- Idêntica à página de novo livro
- Título "Editar Livro"
- Campos pré-preenchidos

**Funcionalidades:**
- Carregamento assíncrono dos dados do livro
- Hook use() para unwrap de params assíncronos
- Loading durante busca do livro
- Redirecionamento se livro não encontrado
- Atualização parcial (apenas campos modificados)
- Estado de loading durante salvamento

**Fluxo:**
1. Extração do ID da rota
2. Verificação de autenticação
3. Carregamento dos dados do livro
4. Preenchimento do formulário
5. Edição dos campos
6. Submissão da atualização
7. Redirecionamento para listagem

## Contextos

### Auth Context (`contexts/AuthContext.tsx`)

**Estado Gerenciado:**
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

**Métodos Expostos:**
- `login(email, password)`: Autentica usuário
- `register(name, email, password)`: Registra novo usuário
- `logout()`: Remove token e limpa estado
- `checkAuth()`: Verifica validade do token

**Funcionamento:**
- Verifica token em cookies na montagem
- Armazena user no estado após login/registro
- Limpa cookies e estado no logout
- Fornece isLoading para controle de UI
- Provider envolve toda a aplicação

**Persistência:**
- Token armazenado em cookie HTTP-only
- Nome do cookie: "token"
- Validade: Gerenciada pelo backend (7 dias)
- Enviado automaticamente em requisições

## Serviços

### API Service (`services/api.ts`)

**Configuração:**
- BaseURL: Lida de `NEXT_PUBLIC_API_URL`
- Timeout padrão: 10 segundos
- Headers padrão: Content-Type application/json

**Interceptor de Request:**
- Adiciona token JWT automaticamente
- Lê token de cookies
- Anexa ao header Authorization como Bearer token
- Executa antes de cada requisição

**Interceptor de Response:**
- Tratamento centralizado de erros
- Log de erros no console
- Propaga erro para tratamento local
- Extração de mensagem do backend

### Auth Service (`services/auth.ts`)

**Métodos:**

`login(email: string, password: string)`
- POST /auth/login
- Retorna: `{ access_token: string }`
- Armazena token em cookie automaticamente
- Lança erro em caso de falha

`register(name: string, email: string, password: string)`
- POST /auth/register
- Retorna: `{ id, name, email, access_token }`
- Armazena token em cookie
- Retorna dados do usuário criado

`getCurrentUser()`
- GET /auth/me (se implementado no backend)
- Valida token atual
- Retorna dados do usuário autenticado
- Usado para restaurar sessão

### Books Service (`services/books.ts`)

**Interface Book:**
```typescript
{
  id: number;
  title: string;
  author: string;
  year?: number;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
```

**Métodos:**

`getAll(search?: string): Promise<Book[]>`
- GET /books
- Query param: search (opcional)
- Retorna array de livros do usuário
- Ordenados por atualização (mais recente primeiro)

`getById(id: number): Promise<Book>`
- GET /books/:id
- Retorna livro específico
- Valida propriedade no backend

`create(data: CreateBookDto): Promise<Book>`
- POST /books
- Body: `{ title, author, year?, description? }`
- Retorna livro criado com ID e timestamps

`update(id: number, data: UpdateBookDto): Promise<Book>`
- PATCH /books/:id
- Body: Campos a atualizar
- Retorna livro atualizado

`delete(id: number): Promise<void>`
- DELETE /books/:id
- Remove livro permanentemente
- Sem retorno em caso de sucesso

## Estilização

### TailwindCSS

**Configuração:**
- Versão 4.0
- PostCSS configurado
- Purge automático de classes não utilizadas

**Tema:**
- Cores primárias: Gray-scale (900, 800, 700, 600)
- Acentos: Purple (500, 600, 700) e Blue (500, 600, 700)
- Gradientes: Purple-to-Blue
- Bordas arredondadas: lg, xl
- Shadows: Sutis, purple glow

**Responsividade:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid adaptativo
- Stack em mobile, side-by-side em desktop

### Componentes de UI

**SweetAlert2:**
- Tema dark customizado
- Background: gray-800
- Texto: gray-100
- Botões com cores do tema
- Bordas arredondadas
- Classes customizadas

**Heroicons:**
- Variação outline para ícones de ação
- Tamanhos consistentes (h-5 w-5)
- Cores adaptativas ao hover
- Integração com TailwindCSS

**@dnd-kit:**
- Sortable components para drag and drop
- Estratégias: rect (grid) e vertical (lista)
- Sensores de pointer e teclado
- Animações suaves de transição
- Feedback visual durante drag

## Gerenciamento de Estado

### Estado Local (useState)

Utilizado para:
- Formulários (valores de inputs)
- Estados de loading
- Mensagens de erro
- Filtros e buscas
- Modo de visualização

### Estado Global (Context API)

Utilizado para:
- Dados do usuário autenticado
- Status de autenticação
- Token JWT
- Informações compartilhadas entre páginas

### Server State

Gerenciado através de:
- Requisições diretas à API
- Revalidação manual quando necessário
- Loading states locais
- Cache do navegador para assets

## Segurança

### Proteção XSS
- React escapa automaticamente conteúdo
- Uso de dangerouslySetInnerHTML evitado
- Sanitização de inputs no backend

### CSRF
- Tokens em cookies HTTP-only
- SameSite configurado
- Validação no backend

### Validação Client-Side
- Validação de formato de email
- Verificação de senha mínima
- Comparação de senhas
- Validação complementa backend (não substitui)

## Performance

### Otimizações Next.js
- Code splitting automático por rota
- Lazy loading de componentes
- Prefetch de links visíveis
- Otimização de fontes (Google Fonts)
- Compilação otimizada em produção

### Bundle Size
- Tree shaking automático
- CSS purging via TailwindCSS
- Minificação de JavaScript e CSS
- Compressão de assets

## Build e Deploy

### Desenvolvimento
```bash
npm run dev
```
- Hot reload habilitado
- Source maps completos
- Erros detalhados no console

### Produção
```bash
npm run build
npm run start
```
- Otimizações máximas
- Minificação de código
- Static generation quando possível

### Variáveis de Ambiente

Arquivo `.env.local` requerido:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Prefixo `NEXT_PUBLIC_` expõe variável ao cliente.

## Acessibilidade

### Boas Práticas Implementadas
- Labels associados a inputs
- Atributos ARIA quando necessário
- Contraste adequado de cores
- Navegação por teclado funcional
- Focus states visíveis
- Textos alternativos para ícones

### Melhorias Futuras
- Anúncios de screen reader para ações
- Skip links para navegação
- Landmarks semânticos
- Testes com ferramentas de acessibilidade
