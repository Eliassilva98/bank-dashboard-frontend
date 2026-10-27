# Bank Dashboard — Front-end

Interface de uma aplicação bancária desenvolvida com **React 19**, **JavaScript** e **Vite**, integrada a uma API REST para simulação de operações financeiras.

## Sobre o projeto

O **Bank Dashboard** é uma aplicação bancária Full-Stack que simula operações financeiras, incluindo cadastro de usuários, autenticação, recuperação de senha por e-mail, depósitos, transferências e consulta de extrato.

Este repositório contém o **Front-end da aplicação**, responsável pela interface, navegação, gerenciamento de estado, validação de formulários e comunicação com o Back-end.

O projeto foi desenvolvido para colocar em prática a construção de interfaces com React, a integração com APIs REST e a apresentação de informações financeiras, incluindo saldo, receitas, despesas e indicadores econômicos como dólar, Selic e CDI.

> **Observação:** as operações financeiras, a autenticação no servidor e a persistência dos dados são responsabilidades da API Back-end, mantida em um repositório separado.

---

## Funcionalidades

### Autenticação e gerenciamento de conta

- **Cadastro de usuários:** formulário para criação de conta com nome, e-mail e senha (mínimo de 8 caracteres).
- **Login:** autenticação por meio da API e acesso às áreas privadas.
- **Recuperação de senha:** formulário para solicitar o envio de um link de redefinição por e-mail.
- **Redefinição de senha:** interface para cadastrar uma nova senha utilizando o link recebido.
- **Rotas protegidas:** restrição de acesso às páginas privadas para usuários não autenticados.
- **Logout:** encerramento da sessão do usuário.

### Dashboard financeiro

- **Resumo financeiro:** visualização do saldo disponível, receitas e despesas.
- **Visibilidade do saldo:** opção de ocultar ou exibir valores financeiros.
- **Depósitos e transferências:** formulário em modal para registrar depósitos ou transferir valores para outra conta.
- **Atualização dos dados:** atualização do saldo e da lista de transações após as movimentações.
- **Últimas transações:** apresentação das movimentações recentes no dashboard, com acesso ao extrato completo.

### Histórico de transações

- **Extrato financeiro:** consulta ao histórico de depósitos e transferências.
- **Paginação:** navegação entre páginas do histórico.
- **Identificação das movimentações:** apresentação das transações conforme seu tipo.

### Indicadores econômicos

- **Cotação do dólar:** apresentação da cotação obtida pela API.
- **Selic e CDI:** exibição das taxas econômicas disponibilizadas pelo Back-end.
- **Tratamento de falhas:** apresentação de estados de carregamento e erro quando os dados não estão disponíveis.

O Back-end realiza as integrações com AwesomeAPI, BrasilAPI e Banco Central do Brasil (BCB); o Front-end apenas exibe os dados recebidos.

---

## Tecnologias utilizadas

### Desenvolvimento da interface

- **JavaScript (ES6+):** linguagem de programação.
- **React 19 e React DOM:** construção e renderização da interface.
- **React Router DOM:** gerenciamento da navegação e proteção de rotas.
- **Styled-Components:** estilização dos componentes e organização do tema.
- **React Hook Form:** gerenciamento e validação dos formulários.
- **React Hot Toast:** notificações e mensagens de feedback.
- **Lucide React e React Icons:** bibliotecas de ícones.

### Comunicação e gerenciamento de dados

- **Axios:** comunicação com a API REST.
- **Hooks personalizados (`useState` e `useEffect`):** busca de dados, estados de carregamento e erro, paginação e atualização após as operações.
- **Context API:** gerenciamento do estado global de autenticação.

### Testes e qualidade de código

- **Jest:** execução dos testes automatizados.
- **React Testing Library:** testes de componentes React.
- **Cypress:** testes end-to-end dos fluxos da aplicação.
- **ESLint:** análise estática e padronização do código.
- **Prettier:** formatação do código.

### Ferramentas e build

- **Vite:** ambiente de desenvolvimento e geração da versão de produção.
- **Babel:** transformação de código utilizada na configuração dos testes.

---

## Recursos técnicos

### Navegação e autenticação

- Organização das rotas públicas e privadas com React Router.
- Proteção de páginas que exigem autenticação.
- Gerenciamento da sessão por meio de Context API.
- Persistência da sessão (token e dados do usuário) no `localStorage` e envio do token nas requisições à API.
- Encerramento da sessão por meio da funcionalidade de logout.

### Comunicação com a API

- Cliente HTTP centralizado com Axios.
- Separação das requisições por domínio: autenticação, contas, transações e indicadores econômicos.
- Hooks que encapsulam a busca de dados, o carregamento, os erros e a nova tentativa.
- Tratamento padronizado de erros retornados pela API.
- Atualização dos dados financeiros após as operações.

### Formulários e experiência do usuário

- Gerenciamento de formulários com React Hook Form.
- Validação dos campos de entrada.
- Feedback visual para ações bem-sucedidas e erros.
- Indicadores de carregamento com Spinner e Skeleton.
- Modais para operações financeiras.
- Interface responsiva.
- Opção de ocultar e exibir o saldo financeiro.

### Organização e manutenção

- Componentes reutilizáveis.
- Separação entre páginas, componentes, hooks, serviços HTTP e utilitários.
- Estilização com tema centralizado e Styled-Components.
- Uso de variáveis de ambiente para configuração da API.
- Testes unitários, de componentes e end-to-end.
- Padronização do código com ESLint e Prettier.

---

## Como executar o projeto

### Pré-requisitos

- Node.js em versão compatível com o projeto.
- Yarn.
- Git.

Também é necessário ter o Back-end configurado e em execução para utilizar as funcionalidades que dependem da API.

### 1. Clone o repositório

```bash
git clone https://github.com/Eliassilva98/bank-dashboard-frontend.git
```

Substitua `https://github.com/Eliassilva98/bank-dashboard-frontend.git` pelo endereço HTTPS do repositório no GitHub.

### 2. Acesse a pasta

```bash
cd bank-dashboard-frontend
```

### 3. Instale as dependências

```bash
yarn install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência:

```dotenv
VITE_API_URL=http://localhost:3333
```

A variável `VITE_API_URL` deve apontar para o endereço da API Back-end. Se o Back-end estiver publicado, substitua o endereço local pela URL correspondente.

### 5. Inicie o servidor de desenvolvimento

```bash
yarn dev
```

O Vite exibirá no terminal o endereço de acesso à aplicação, normalmente `http://localhost:5173`.

### 6. Gere a versão de produção

```bash
yarn build
```

O resultado será gerado na pasta `dist/`.

### Outros comandos

```bash
yarn test            # testes unitários e de componentes (Jest)
yarn test:coverage   # testes com relatório de cobertura
yarn cy:open         # Cypress em modo interativo
yarn cy:run          # Cypress em modo headless
yarn lint            # análise estática com ESLint
```

---

## Organização do projeto

O Front-end foi desenvolvido com React e Vite, mantendo uma separação de responsabilidades entre navegação, comunicação com a API, gerenciamento de estado, componentes e páginas.

### Estrutura principal

```text
bank-dashboard-frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── dashboard/
│   │   └── ui/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── test/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── cypress/
│   ├── e2e/
│   └── support/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Responsabilidades principais

| Diretório         | Responsabilidade                                     |
| ----------------- | ---------------------------------------------------- |
| `src/api/`        | Centralizar as requisições HTTP ao Back-end.         |
| `src/components/` | Organizar os componentes visuais reutilizáveis.      |
| `src/config/`     | Centralizar configurações da aplicação.              |
| `src/context/`    | Gerenciar o estado global de autenticação.           |
| `src/hooks/`      | Encapsular a busca de dados e a lógica reutilizável. |
| `src/pages/`      | Organizar as páginas da aplicação.                   |
| `src/routes/`     | Definir a navegação e proteger rotas privadas.       |
| `src/styles/`     | Centralizar temas, estilos globais e responsividade. |
| `src/test/`       | Disponibilizar utilitários de apoio aos testes.      |
| `src/utils/`      | Reunir funções auxiliares reutilizáveis.             |
| `cypress/`        | Organizar os testes end-to-end.                      |

### Comunicação com a API

A camada `src/api/` concentra a comunicação HTTP:

- `client.js`: configura o cliente Axios, a URL base e o envio do token.
- `authAPI.js`: operações de autenticação e recuperação de senha.
- `accountAPI.js`: consultas relacionadas à conta.
- `transactionsAPI.js`: movimentações financeiras e extrato.
- `marketAPI.js`: consulta aos indicadores econômicos.

### Hooks e utilitários

Os hooks encapsulam a lógica reutilizável:

- `useAccount`: consulta dos dados da conta.
- `useTransactions`: consulta e paginação das transações.
- `useMarket`: consulta aos indicadores econômicos.
- `useBalanceVisibility`: controle da visibilidade do saldo.

Os utilitários concentram funcionalidades como formatação de valores e datas, classificação de transações, armazenamento da autenticação e tratamento de erros.

### Páginas e componentes

As páginas estão organizadas em `src/pages/`:

- Login.
- Cadastro.
- Recuperação e redefinição de senha.
- Dashboard.
- Extrato financeiro.

Os componentes são divididos entre:

- **Componentes de domínio:** cartões financeiros, indicadores econômicos, lista de transações e modal de movimentações.
- **Componentes reutilizáveis:** botões, campos de formulário, modais, cartões, notificações e indicadores de carregamento.

### Fluxo de comunicação

```text
Página React
    |
    v
Hook
    |
    v
Módulo da API
    |
    v
Cliente Axios
    |
    v
API REST (Back-end)
    |
    v
Resposta para a interface
```

Esse modelo mantém a comunicação HTTP separada dos componentes visuais e facilita a manutenção da aplicação.

---

## Testes automatizados

O projeto utiliza testes em diferentes níveis.

### Testes unitários e de componentes

Executados com Jest e React Testing Library, verificam funções, hooks, componentes e páginas. Os testes ficam próximos dos arquivos correspondentes, com nomes como `Component.test.jsx` e `function.test.js`.

### Testes end-to-end

Os testes E2E são realizados com Cypress e ficam em `cypress/e2e/`. Entre os cenários contemplados estão:

- Autenticação.
- Dashboard.
- Responsividade.
- Cores e apresentação visual.

---

## O que este projeto demonstra

### Desenvolvimento de interfaces com React

Construção de uma aplicação com múltiplas páginas, componentes reutilizáveis, formulários e gerenciamento de estado.

### Integração com APIs REST

Comunicação com o Back-end por meio de Axios, utilizando uma camada de API separada da interface.

### Autenticação e navegação

Fluxos de cadastro, login, recuperação de senha, gerenciamento de sessão e proteção de rotas privadas.

### Gerenciamento de dados assíncronos

Hooks personalizados para consultas, estados de carregamento e erro, paginação e atualização dos dados após as operações.

### Organização por responsabilidades

Separação entre páginas, componentes, hooks, contextos, utilitários, rotas e comunicação HTTP.

### Experiência do usuário

Interface responsiva, com validação de formulários, feedback visual, indicadores de carregamento e tratamento de erros.

### Qualidade e manutenção

Testes automatizados, reutilização de componentes e padronização do código para facilitar a evolução do projeto.

---

## Melhorias futuras

- **Filtros e busca no extrato:** utilizar na interface os filtros já oferecidos pela API (tipo e período), com campos de seleção e de data na página de extrato.
- **Migrar a busca de dados para TanStack Query:** obter cache e revalidação automática no lugar dos hooks manuais.
- **Ampliar os testes automatizados:** aumentar a cobertura dos componentes reutilizáveis, das páginas e dos fluxos end-to-end.
- **Melhorar o tratamento de erros:** diferenciar erros de rede, sessão expirada e falhas do servidor, oferecendo mensagens mais específicas.
- **Documentar os componentes:** registrar as propriedades e os comportamentos dos componentes reutilizáveis.
- **Aprimorar acessibilidade e responsividade:** revisar contraste, navegação por teclado, foco nos modais e comportamento em diferentes telas.

---

## Considerações finais

O **Bank Dashboard Front-end** foi desenvolvido para aplicar conhecimentos de React e do ecossistema JavaScript na construção de uma interface integrada a uma API REST.

O projeto reúne autenticação, navegação, formulários, operações financeiras simuladas, indicadores econômicos, gerenciamento de estado e testes automatizados, com foco em organização, reutilização de código e experiência do usuário.
