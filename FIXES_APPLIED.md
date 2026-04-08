# Correções Aplicadas — ValidZen

Data: 2026-04-07

---

## Issues Resolvidos

### 1. QuizzesPage — Remoção do Blur no Catálogo
**Arquivo:** `src/pages/QuizzesPage.tsx` (linha 250)

**Problema:** O catálogo de quizzes exibia `opacity-40 blur-[2px]` para usuários não-PRO, tornando o conteúdo ilegível e violando a spec que diz explicitamente "SEM desfoque/blur".

**Correção:** Removido `opacity-40 blur-[2px]`. Mantido apenas `pointer-events-none select-none` para bloquear os cliques. O banner sticky de bloqueio continua ativo. O conteúdo (títulos, descrições, temas) agora fica 100% visível.

```diff
- isLocked && "opacity-40 blur-[2px] pointer-events-none select-none"
+ isLocked && "pointer-events-none select-none"
```

---

### 2. QuizPage — Inconsistência no Limite de Quizzes Gratuitos
**Arquivo:** `src/pages/QuizPage.tsx` (linha 32)

**Problema:** A condição de bloqueio na tela de intro do quiz usava `>= 5` como limite, mas o `AuthContext.incrementQuizCompletion` — que é o enforcement real — usava `>= 3`. Isso criava uma janela onde o usuário passava pela tela de intro com 3, 4 ou 5 quizzes feitos, mas era redirecionado ao `/pro` ao tentar submeter. A spec define o limite como **3 quizzes simples** para usuários gratuitos.

**Correção:** Unificado o limite para `>= 3` no gate de intro, alinhando com o enforcement do AuthContext.

```diff
- const showUpgradeGate = !!user && !isPremium && (isGlobal || userUsage.quizzesDone >= 5);
+ const showUpgradeGate = !!user && !isPremium && (isGlobal || userUsage.quizzesDone >= 3);
```

---

### 3. DashboardPage — Remoção do Blur na Seção de Interpretação
**Arquivo:** `src/pages/DashboardPage.tsx` (linha 198 original)

**Problema:** A seção de interpretação textual aplicava `blur-[1.5px]` sobre o texto simulado, violando a mesma regra de "SEM desfoque" que se aplica ao Dashboard no modo demonstração.

**Correção:** Removido `blur-[1.5px]`. Mantido `opacity-60 select-none pointer-events-none` para indicar visualmente que o conteúdo é simulado sem torná-lo ilegível.

```diff
- isSimulacrum && "blur-[1.5px] select-none pointer-events-none opacity-60"
+ isSimulacrum && "select-none pointer-events-none opacity-60"
```

---

### 4. DashboardPage — Remoção do Grayscale no Histórico
**Arquivo:** `src/pages/DashboardPage.tsx` (linha 218 original)

**Problema:** A tabela de histórico simulado aplicava `grayscale-[0.5]` que degradava visualmente o conteúdo de demonstração desnecessariamente.

**Correção:** Removido `grayscale-[0.5]`. O histórico mock continua com `opacity-60 pointer-events-none`.

```diff
- isSimulacrum && "opacity-60 grayscale-[0.5] pointer-events-none"
+ isSimulacrum && "opacity-60 pointer-events-none"
```

---

### 5. DashboardPage — Banner Informativo para Usuários Não-PRO
**Arquivo:** `src/pages/DashboardPage.tsx` (inserido após o título)

**Problema:** Visitantes e usuários gratuitos acessavam o Dashboard sem nenhum aviso claro de que estavam vendo dados de demonstração. A spec exige que o Dashboard seja "coberto pelo banner" para não-pagantes.

**Correção:** Adicionado banner contextual no topo da página para todos os usuários `!isPremium`. O banner adapta o CTA dinamicamente:
- **Visitante não logado** → botão "Login ou Crie sua Conta Gratuita"
- **Logado gratuito** → botão de upgrade PRO

---

## O que Já Estava Correto (não alterado)

| Funcionalidade | Status |
|---|---|
| Header adaptativo por tier (visitante / free / PRO / admin) | ✅ |
| Link Admin exclusivo para `zagg@uol.com.br` e `continentemedia@gmail.com` | ✅ |
| Painel Admin usando `auth.admin.listUsers` como base (nenhum usuário invisível) | ✅ |
| QuizzesPage — layout coluna única agrupado por temas | ✅ |
| QuizzesPage — banner sticky distinguindo "login" vs "upgrade" | ✅ |
| Dashboard — 8 cards com mock data no modo demonstração | ✅ |
| Dashboard — card de upgrade embutido na grade do simulacro | ✅ |
| AuthContext — admins automaticamente `isPremium = true` | ✅ |
| AuthContext — limite real de 3 quizzes para usuários gratuitos | ✅ |
| AuthContext — limite de 3 artigos para visitantes (localStorage) | ✅ |
| AuthContext — limite de 5 artigos para logados gratuitos (DB) | ✅ |
| Migração de sessão anônima ao criar conta | ✅ |
| check-subscription — suporte ASAAS + Stripe com fallback | ✅ |
| admin-users function — merge authUsers + profiles | ✅ |
