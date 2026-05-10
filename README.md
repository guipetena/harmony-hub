# FindSinger 🎤

Plataforma que conecta **músicos independentes** (cantores solo, duplas e bandas) com **estabelecimentos e pessoas** que querem contratar música ao vivo.

> Marketplace inspirado em Airbnb, Fiverr e GetNinjas — focado em UX premium, mobile-first e contato direto via WhatsApp.

---

## 🧱 Stack

- **[TanStack Start](https://tanstack.com/start)** (React 19 + Vite 7) — SSR e roteamento por arquivos
- **TypeScript** (strict)
- **TailwindCSS v4** + **shadcn/ui** + **Radix UI**
- **Lucide Icons**
- **TanStack Query** para data-fetching
- **Zod** + **React Hook Form**

---

## 📋 Pré-requisitos

Instale no seu computador:

| Ferramenta | Versão | Link |
|---|---|---|
| **Node.js** | 20+ (LTS) | https://nodejs.org |
| **Bun** | mais recente | https://bun.sh |
| **Git** | qualquer | https://git-scm.com |

### Instalando o Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

> Você pode usar `npm` ou `pnpm`, mas o projeto usa `bun.lockb` — o Bun garante as mesmas versões instaladas no Lovable.

---

## 🚀 Como rodar localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/<seu-usuario>/<seu-repo>.git
cd <seu-repo>

# 2. Instalar dependências
bun install

# 3. Subir o servidor de desenvolvimento
bun dev
```

Acesse **http://localhost:8080** (ou a porta exibida no terminal).

---

## 📜 Scripts disponíveis

| Comando | O que faz |
|---|---|
| `bun dev` | Servidor de desenvolvimento com hot reload |
| `bun run build` | Build de produção |
| `bun run build:dev` | Build em modo desenvolvimento |
| `bun run preview` | Pré-visualiza o build de produção |
| `bun run lint` | Roda o ESLint |
| `bun run format` | Formata código com Prettier |

---

## 🔐 Variáveis de ambiente

No estado atual (protótipo), **não é necessário `.env`** — todos os dados vêm de um mock estático em `src/lib/mock-data.ts`.

Quando o **Lovable Cloud** (auth + banco) for ativado, o Lovable gera automaticamente um `.env` no repositório com as chaves públicas, sincronizado via GitHub.

---

## 📂 Estrutura do projeto

```
src/
├── assets/            # Imagens (heros, fotos de músicos)
├── components/
│   ├── ui/            # Componentes shadcn/ui
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── musician-card.tsx
│   ├── auth-shell.tsx
│   └── dashboard-layout.tsx
├── hooks/             # Hooks customizados
├── lib/
│   ├── mock-data.ts   # Mock de músicos, estilos e cidades
│   └── utils.ts
├── routes/            # Rotas (file-based routing)
│   ├── __root.tsx     # Layout raiz
│   ├── index.tsx      # Landing page
│   ├── buscar.tsx     # Busca com filtros
│   ├── musicos.$slug.tsx        # Perfil do artista
│   ├── login.tsx
│   ├── cadastro.tsx
│   ├── dashboard.musico.tsx
│   └── dashboard.estabelecimento.tsx
├── styles.css         # Tokens do design system (cores, fontes)
├── router.tsx
└── start.ts
```

---

## 🎨 Design System

Os tokens de cor, tipografia e sombras vivem em **`src/styles.css`** (formato `oklch`). Use sempre as classes semânticas do Tailwind (`bg-primary`, `text-foreground`, `shadow-elevated` etc.) ao invés de cores literais.

Fontes:
- **Fraunces** (display / títulos)
- **Plus Jakarta Sans** (corpo)

---

## 🗺️ Status do MVP

- ✅ Landing page com hero, benefícios e CTAs
- ✅ Busca com filtros (cidade, estilo, preço, disponibilidade)
- ✅ Perfil detalhado do artista com galeria, vídeo e avaliações
- ✅ Telas de login/cadastro (visual)
- ✅ Dashboards de músico e estabelecimento (visual)
- ✅ Contato direto via link do WhatsApp
- ⏳ Autenticação real (Lovable Cloud)
- ⏳ Banco de dados (perfis, favoritos, histórico)
- ⏳ Upload de fotos/vídeos

---

## 🔄 Sync com Lovable

Este repositório está conectado ao [Lovable](https://lovable.dev) — qualquer alteração feita no editor Lovable é enviada automaticamente para o GitHub, e qualquer push para a branch principal é refletido no editor.

**Edite onde preferir** (Lovable, VS Code, Cursor, etc.) — a sincronização é bidirecional.

---

## 📄 Licença

Projeto privado — todos os direitos reservados.
