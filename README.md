# Sistema de Gerenciamento de Chamados

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

Um sistema completo de gerenciamento de chamados técnicos com múltiplos níveis de acesso, categorização, calendário de eventos e acompanhamento de status.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para gerenciar chamados técnicos em uma organização, permitindo que usuários abram chamados, administradores gerenciem categorias e subcategorias, e superadministradores controlem todos os aspectos do sistema, incluindo usuários.

## 🚀 Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **Firebase**
  - Authentication - Autenticação de usuários
  - Firestore - Banco de dados NoSQL
  - Storage - Armazenamento de arquivos
- **React Router** - Navegação entre páginas
- **React Bootstrap** - Componentes estilizados
- **React Toastify** - Notificações
- **React Icons** - Ícones
- **React Quill** - Editor de texto rico
- **React Big Calendar** - Calendário de eventos

## 🔧 Requisitos Funcionais

1. **Autenticação e Autorização**
   - Login de usuários
   - Diferentes níveis de acesso (superAdmin, admin, user)
   - Logout

2. **Gerenciamento de Usuários**
   - Cadastro de novos usuários
   - Visualização de usuários por categoria (superAdmin, admin, user)
   - Remoção de usuários

3. **Gerenciamento de Chamados**
   - Abertura de novos chamados
   - Edição de chamados existentes
   - Visualização de chamados
   - Filtro por status (aberto, atendimento, finalizado, reaberto)
   - Detalhamento de chamados
   - Reabertura de chamados finalizados

4. **Categorização**
   - Criação de categorias
   - Criação de subcategorias
   - Atribuição de usuários a subcategorias
   - Edição e exclusão de categorias e subcategorias

5. **Calendário de Eventos**
   - Visualização de eventos em calendário
   - Criação de eventos
   - Atribuição de eventos a usuários
   - Definição de prioridade para eventos
   - Exclusão de eventos

6. **Perfil de Usuário**
   - Visualização de dados do perfil
   - Atualização de nome
   - Upload de foto de perfil

## 📊 Requisitos Não Funcionais

1. **Segurança**
   - Autenticação via Firebase
   - Controle de acesso baseado em papéis (RBAC)
   - Proteção de rotas

2. **Usabilidade**
   - Interface responsiva
   - Feedback visual através de notificações
   - Modais para confirmação de ações importantes
   - Navegação intuitiva

3. **Performance**
   - Carregamento otimizado de dados
   - Paginação de resultados
   - Feedback visual durante carregamentos (spinners)

4. **Manutenibilidade**
   - Código organizado em componentes
   - Separação de responsabilidades
   - Uso de hooks personalizados para lógica de negócio

5. **Escalabilidade**
   - Estrutura de dados flexível no Firestore
   - Componentes reutilizáveis

6. **Disponibilidade**
   - Hospedagem em serviços cloud
   - Persistência de dados no Firebase

## 📱 Páginas do Sistema

### Login
Página de autenticação com campos para email e senha.

### Dashboard
Visão geral dos chamados abertos, em atendimento e finalizados.

### Novo Chamado
Formulário para abertura de novos chamados com seleção de categoria, subcategoria, prioridade e descrição.

### Chamados Resolvidos
Lista de chamados finalizados com opção de reabertura.

### Calendário
Visualização e gerenciamento de eventos em formato de calendário.

### Categorias
Gerenciamento de categorias e subcategorias, com atribuição de usuários.

### Usuários
Gerenciamento de usuários do sistema, com diferentes níveis de acesso.

### Perfil
Visualização e edição de informações do usuário logado.

### Clientes
Cadastro e gerenciamento de clientes.

## 🔧 Instalação e Uso

1. Clone o repositório:
   \`\`\`
   git clone https://github.com/seu-usuario/ReactJS-calling-system.git
   \`\`\`

2. Instale as dependências:
   \`\`\`
   cd ReactJS-calling-system
   npm install
   \`\`\`

3. Configure o Firebase:
   - Crie um projeto no Firebase
   - Ative Authentication, Firestore e Storage
   - Copie as credenciais para o arquivo src/services/firebaseConnection.js

4. Execute o projeto:
   \`\`\`
   npm start
   \`\`\`

## 🔐 Níveis de Acesso

- **superAdmin**: Acesso total ao sistema, incluindo gerenciamento de usuários, categorias e chamados
- **admin**: Acesso ao atendimento de chamados, gerenciamento de categorias e eventos
- **user**: Acesso à abertura de chamados e visualização de seus próprios chamados

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Patrick Franco](https://github.com/devpatrickfranco)

---

⭐️ Feito com ❤️ por [Patrick Franco](https://github.com/devpatrickfranco)
