
---

# **YetuEdu Sponsored Content API**

> **Descrição**: Microserviço Backend desenvolvido com **Node.js** e **Express.js**, responsável por gerenciar conteúdos patrocinados, selos de verificação e assinaturas premium da plataforma **YetuEdu**. Ele é escalável, modular e se integra via APIs RESTful com autenticação JWT.

---

## **Tecnologias Utilizadas**

Este projeto utiliza as seguintes tecnologias:

* **Node.js**: Ambiente de execução para JavaScript no servidor.
* **Express.js**: Framework web minimalista e flexível.
* **PostGreSQL**: Banco de dados Relacional para persistência dos dados.
* **JWT (jsonwebtoken)**: Autenticação segura baseada em tokens.
* **dotenv**: Gerenciamento de variáveis de ambiente.
* **Tsx**: Hot reload em ambiente de desenvolvimento.
* **Tsup**: Facilita o build em ambiente de produção.
* **Swagger**: Para dopcumentação de todos os endpoints.

---

## 🧩 Arquitetura Geral da Solução de envio de notificações de conteúdos prestes a expirar e expirados
Microserviço de Patrocínio detecta:

📅 Quando faltar 1 dia para o patrocínio expirar.

📅 No dia da expiração.

Ele publica eventos no RabbitMQ:

sponsorship.expiring_soon

sponsorship.expired

Outros microsserviços (como o de notificações, relatórios ou e-mails) podem consumir esses eventos.


## **📁 Estrutura de Pastas**

```bash
src/
├── @types/                      # Tipagens customizadas para o projeto (ex: Express)
│   └── express.d.ts
│
├── config/                      # Arquivos de configuração (env, swagger, etc.)
│   ├── env/
│   │   └── index.ts
│   └── swagger.ts
│
├── domain/                      # Camada de domínio (Entidades e contratos)
│   ├── entities/
│   │   ├── Sponsored.ts
│   │   ├── Subscription.ts
│   └── repositories/            # Interfaces (contratos) dos repositórios
│
├── infra/                       # Infraestrutura e implementação dos repositórios
│   ├── database/                # Configurações de conexão ao banco de dados
│   ├── mappers/                 # Conversão entre entidades e modelos de persistência
│   └── repositories/
│       └── implementations/     # Implementações concretas dos repositórios em memória
│       ├── SponsoredContentRepository.ts
│       └──SubscriptionRepository.ts
│
├── interfaces/                  # Camada de entrada (controllers, rotas, DTOs, factories)
│
├── services/                    # Casos de uso (regras de negócio)
│
├── shared/                      # middlewares, erros, etc.
│
├── test/                        # Testes unitários e de integração
│
├── main.ts                      # Arquivo principal do app (injeção de dependências, loaders)
└── server.ts                    # Inicialização do servidor HTTP
```

---

## **📌 Funcionalidades Principais**

### ✅ Selos de Verificação

* Expiram junto com a assinatura.

### 📢 Publicações Patrocinadas

* Postagens com maior visibilidade no feed.
* Validade de 30 dias.

### 🌟 Perfis Patrocinados

* Destaque visual e maior alcance.
* Validade de 30 dias.

### 💼 Planos Premium

* Assinaturas: `basic`, `premium`, `enterprise`.
* Apenas uma assinatura ativa por usuário.
* Validade de 1 ano.

---

---

## **🔐 Segurança**

* **JWT**: Todos os endpoints sensíveis requerem autenticação via JWT (`Authorization: Bearer <token>`).
* **.env**: Informações sensíveis como URI do banco e chave JWT devem ser mantidas fora do controle de versão.

---

## **🧩 Integração com a Plataforma YetuEdu**

1. O usuário realiza login na plataforma e recebe um token JWT.
2. O frontend envia esse token nos headers das requisições ao microserviço.
3. O microserviço valida o token e, se necessário, consulta serviços adicionais (ex.: usuários).
4. Conteúdos patrocinados são armazenados no MongoDB e retornados ao frontend da plataforma principal.

---

## **📈 Requisitos Não Funcionais**

* **Escalabilidade**: Suporta até 10.000 requisições/minuto com < 200ms de tempo de resposta.
* **Disponibilidade**: Garantida em 99.9% por meio de containers e load balancing.
* **Performance**: Índices criados para otimizar consultas no MongoDB.
* **Manutenibilidade**: Código modular, com testes unitários em desenvolvimento.
* **Interoperabilidade**: Comunicação com outros microserviços via RESTful APIs.

---

## **Como Utilizar**

Siga os passos abaixo para rodar o microserviço localmente:

### 1. Clone o Repositório

```bash
git clone https://github.com/romeucajamba/sponsor-conten-api.git
cd sponsor-conten-api
```

### 2. Instale as Dependências

```bash
npm install
```

### 4. Inicie o Servidor

```bash
npm run dev
```
### 5. Rodar os testes

```bash
npm run test
```

### 6. Rodar as migrações

```bash
npx prisma migrate dev
```

---