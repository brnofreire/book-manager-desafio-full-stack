# Bibliotecas e Dependências

## Backend

### Framework Principal

**@nestjs/core** `^11.0.1`
- Framework principal para construção da API
- Arquitetura modular baseada em TypeScript
- Suporte a injeção de dependências
- Decoradores para definição de rotas e middlewares

**@nestjs/platform-express** `^11.0.1`
- Adaptador HTTP para integração com Express.js
- Gerenciamento de requisições e respostas HTTP
- Middleware pipeline para processamento de requisições

### Autenticação e Segurança

**@nestjs/jwt** `^11.0.2`
- Geração e validação de tokens JWT
- Integração nativa com NestJS
- Configuração de expiração e secret key

**@nestjs/passport** `^11.0.5`
- Integração do Passport.js com NestJS
- Estratégias de autenticação modulares
- Guards para proteção de rotas

**passport** `^0.7.0`
- Middleware de autenticação para Node.js
- Suporte a múltiplas estratégias de autenticação

**passport-jwt** `^4.0.1`
- Estratégia JWT para Passport
- Extração e validação de tokens de requisições

**bcrypt** `^5.1.1`
- Hash e comparação segura de senhas
- Algoritmo bcrypt para criptografia
- Proteção contra rainbow tables e força bruta

### ORM e Banco de Dados

**@prisma/client** `^6.19.2`
- Cliente TypeScript type-safe para banco de dados
- Auto-geração de tipos baseado no schema
- Query builder intuitivo e otimizado

**prisma** `^6.19.2`
- CLI e ferramentas de migração
- Schema definition language
- Introspection e geração de código

### Validação

**class-validator** `^0.14.1`
- Validação declarativa usando decoradores
- Validação de DTOs (Data Transfer Objects)
- Mensagens de erro customizáveis

**class-transformer** `^0.5.1`
- Transformação de objetos plain para classes
- Serialização e deserialização de dados
- Type casting automático

### Desenvolvimento

**typescript** `^5.7.2`
- Superset tipado de JavaScript
- Verificação estática de tipos
- Compilação para JavaScript

**@nestjs/cli** `^11.0.1`
- Interface de linha de comando do NestJS
- Geração de módulos, controllers e services
- Build e desenvolvimento automatizado

**ts-node** `^10.9.2`
- Execução de TypeScript diretamente
- Desenvolvimento sem necessidade de compilação prévia

### Testes

**jest** `^29.7.0`
- Framework de testes JavaScript
- Suporte a mocks e snapshots
- Cobertura de código integrada

**@nestjs/testing** `^11.0.1`
- Utilitários de teste específicos do NestJS
- Criação de módulos de teste
- Injeção de dependências em testes

## Frontend

### Framework Principal

**next** `15.1.6`
- Framework React com renderização híbrida
- App Router para roteamento moderno
- Server Components e Client Components
- Otimizações automáticas de performance

**react** `19.0.0`
- Biblioteca para construção de interfaces
- Virtual DOM para renderização eficiente
- Hooks para gerenciamento de estado

**react-dom** `19.0.0`
- Renderização de componentes React no DOM
- Manipulação de eventos do navegador

### Estilização

**tailwindcss** `^4.0.0`
- Framework CSS utility-first
- Design system configurável
- Purge de CSS não utilizado em produção

**postcss** `^8.4.49`
- Processador de CSS
- Transformações e otimizações de estilos

### Requisições HTTP

**axios** `^1.7.9`
- Cliente HTTP baseado em Promises
- Interceptors para requisições e respostas
- Tratamento automático de JSON
- Configuração de baseURL e headers

### Gerenciamento de Estado

**js-cookie** `^3.0.5`
- Manipulação de cookies no navegador
- API simples para leitura e escrita
- Armazenamento de tokens de autenticação

### Interface do Usuário

**@heroicons/react** `^2.2.0`
- Biblioteca de ícones SVG
- Componentes React otimizados
- Variações outline e solid

**sweetalert2** `^11.15.2`
- Modais e alertas customizáveis
- Substituição moderna para alert() e confirm()
- Tema configurável
- Suporte a promises

### Drag and Drop

**@dnd-kit/core** `^6.3.1`
- Biblioteca principal de drag and drop
- Sensores de mouse e teclado
- Detecção de colisão

**@dnd-kit/sortable** `^9.0.2`
- Componentes sortable para listas
- Estratégias de ordenação
- Animações de transição

**@dnd-kit/utilities** `^3.2.2`
- Utilitários para transformações CSS
- Helpers para cálculos de posição

### Desenvolvimento

**typescript** `^5.7.2`
- Tipagem estática para JavaScript
- IntelliSense aprimorado
- Detecção de erros em tempo de desenvolvimento

**eslint** `^9.18.0`
- Linter para identificação de problemas no código
- Regras de estilo configuráveis
- Integração com TypeScript

**@types/node** `^22.10.5`
- Definições de tipos TypeScript para Node.js
- Tipagem para APIs do Node.js

**@types/react** `^19.0.6`
- Definições de tipos para React
- Tipagem para componentes e hooks

**@types/react-dom** `^19.0.3`
- Definições de tipos para ReactDOM
- Tipagem para métodos de renderização

## Versionamento de Dependências

### Backend
- Todas as dependências principais fixadas em versões específicas
- Dependências de desenvolvimento permitem patches automáticos
- Node.js requerido: >=18.0.0

### Frontend
- Next.js fixado em versão major específica
- React 19 para recursos mais recentes
- TailwindCSS 4.0 para melhorias de performance

## Gerenciamento de Pacotes

Ambos os projetos utilizam **npm** como gerenciador de pacotes padrão. Para garantir consistência:

- Utilize `npm ci` em ambientes de produção
- Mantenha `package-lock.json` versionado
- Evite misturar gerenciadores de pacotes (npm, yarn, pnpm)
