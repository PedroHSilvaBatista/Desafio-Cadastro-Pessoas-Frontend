# Cadastro de Pessoas — Front-end

Interface web desenvolvida em **React + Vite** para o cadastro de pessoas, consumindo a API REST do back-end.

---

## Tecnologias Utilizadas

- React 19
- Vite
- React Hook Form
- Axios

---

## Pré-requisitos

- Node.js 20.19+
- npm
- Back-end rodando em `http://localhost:8080`

---

## Como Rodar

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio-frontend.git
```

Ou baixe o `.zip` pelo GitHub e extraia na pasta de sua preferência.

### 2. Instalar as Dependências

```bash
npm install
```

### 3. Executar

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> **Atenção:** o front-end verifica automaticamente se o back-end está online ao carregar. Certifique-se de que a API está rodando antes de abrir a aplicação.

---

## Estrutura do Projeto

```
cadastro-pessoas-front/
├── src/
│   ├── components/
│   │   └── CadastroPessoa/
│   │       ├── CadastroPessoa.jsx  # Formulário principal de cadastro
│   │       └── CadastroPessoa.css  # Estilos do formulário
│   ├── services/
│   │   └── api.js                  # Configuração do Axios e chamadas à API
│   ├── App.jsx                     # Componente raiz com health check
│   ├── App.css                     # Estilos globais
│   └── main.jsx                    # Ponto de entrada da aplicação
└── package.json
```

---

## Funcionalidades

- Formulário de cadastro com validação de campos no cliente
- Máscara automática de CPF (`123.456.789-09`) e CEP (`00000-000`)
- Preenchimento automático de endereço via **ViaCEP** ao informar o CEP
- Normalização do nome antes do envio — remove acentos, cedilha e espaços excedentes silenciosamente
- Validação de data de nascimento futura antes do envio
- Exibição detalhada de erros retornados pelo back-end por campo
- Exibição do login gerado após cadastro bem-sucedido
- Health check na inicialização — exibe mensagem caso o back-end esteja indisponível

---

## Decisões Técnicas

### React Hook Form
Utilizado para gerenciamento do formulário e validações no cliente. Oferece melhor performance que soluções baseadas em estado controlado, pois evita re-renderizações desnecessárias a cada digitação.

### Axios
Utilizado para as chamadas HTTP à API. Centralizado no `services/api.js` com a URL base configurada, evitando repetição em cada chamada.

### Normalização do nome no front-end
O nome é normalizado antes do envio para melhorar a experiência do usuário — ele digita normalmente com acentos e o sistema trata automaticamente, sem exibir erros desnecessários. O back-end também realiza essa normalização como camada de segurança adicional.

### Máscaras manuais sem biblioteca externa
As máscaras de CPF e CEP foram implementadas manualmente usando o `Controller` do React Hook Form, evitando dependências externas que apresentaram incompatibilidades com a versão do React utilizada.

### Health Check
Ao carregar a aplicação, é feita uma chamada ao endpoint `/health-check` do back-end. Caso a API esteja indisponível, uma mensagem de erro é exibida antes do formulário, evitando que o usuário tente cadastrar sem conexão com o servidor.

---

## Variáveis de Ambiente

A URL base da API está configurada diretamente no `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080',
});
```

Caso o back-end esteja rodando em outra porta ou host, atualize esse valor.
