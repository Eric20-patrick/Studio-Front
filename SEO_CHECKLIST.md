# 🎯 SEO Checklist - Studio Neo

**Objetivo**: Melhorar ranking nos buscadores e visibilidade orgânica
**Stack**: Next.js 14 (App Router) + Node.js/Express

---

## 📊 Diagnóstico Atual

| Item SEO | Status | Prioridade |
|----------|--------|-----------|
| robots.txt | ✅ Existe (básico) | OK |
| sitemap.xml | ❌ **Não existe** | 🔴 Crítica |
| Metadata global | ⚠️ Muito básica | 🔴 Crítica |
| Metadata por página | ❌ Não existe | 🔴 Crítica |
| Open Graph | ❌ Não existe | 🔴 Crítica |
| Twitter Cards | ❌ Não existe | 🟡 Alta |
| Schema.org / JSON-LD | ❌ Não existe | 🔴 Crítica |
| Canonical URLs | ❌ Não definida | 🟡 Alta |
| Alt text em imagens | ⚠️ Inconsistente | 🟡 Alta |
| Heading hierarchy (h1-h6) | ⚠️ Verificar | 🟡 Alta |
| Performance (Core Web Vitals) | ⚠️ Não medida | 🔴 Crítica |
| Mobile-friendly | ✅ Responsivo | OK |
| HTTPS | ⚠️ Em produção | OK |
| Lazy loading imagens | ⚠️ Parcial | 🟡 Alta |
| next/image otimização | ⚠️ Parcial | 🟡 Alta |
| Internal linking | ⚠️ Verificar | 🟢 Média |
| Conteúdo estruturado | ⚠️ Verificar | 🟡 Alta |

---

## 🔴 FRONT-END: Tarefas Críticas

### 1️⃣ **Metadata Avançada por Página** (Impacto: 🔥🔥🔥)

**Problema atual**: Apenas título e descrição genéricos em `layout.tsx`

**Solução**: Adicionar metadata em cada `page.tsx`

```typescript
// src/app/(marketing)/page.tsx (Home)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Neo | Salão de Beleza Premium em [Cidade]",
  description: "Studio Neo é o salão de beleza referência em [bairro/cidade]. Oferecemos cabelo, manicure, maquiagem e estética. Agende online 24h.",
  keywords: ["salão de beleza", "studio neo", "cabeleireiro", "manicure", "maquiagem", "[cidade]"],
  authors: [{ name: "Studio Neo" }],
  alternates: {
    canonical: "https://studioneo.com.br",
  },
  openGraph: {
    title: "Studio Neo | Salão de Beleza Premium",
    description: "Agende seus serviços de beleza online. Cabelo, unhas, maquiagem e mais.",
    url: "https://studioneo.com.br",
    siteName: "Studio Neo",
    images: [
      {
        url: "https://studioneo.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Studio Neo - Salão de Beleza",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Neo | Salão de Beleza Premium",
    description: "Agende seus serviços de beleza online.",
    images: ["https://studioneo.com.br/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

**Aplicar em todas as páginas**:
- [ ] `(marketing)/page.tsx` - Home
- [ ] `(marketing)/servicos/page.tsx` - Serviços
- [ ] `(marketing)/equipe/page.tsx` - Equipe
- [ ] `(marketing)/galeria/page.tsx` - Galeria
- [ ] `(marketing)/quem-somos/page.tsx` - Sobre
- [ ] `(marketing)/contato/page.tsx` - Contato
- [ ] `(marketing)/blog/page.tsx` - Blog

---

### 2️⃣ **Criar sitemap.xml Dinâmico** (Impacto: 🔥🔥🔥)

**Criar arquivo**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://studioneo.com.br';
  
  // URLs estáticas
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/servicos`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/equipe`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/galeria`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/quem-somos`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
  ];
  
  // URLs dinâmicas (ex: serviços individuais)
  // const procedures = await fetchProcedures();
  // const procedureUrls = procedures.map(p => ({
  //   url: `${baseUrl}/servicos/${p.slug}`,
  //   lastModified: new Date(p.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));
  
  return [...staticUrls];
}
```

**Resultado**: `https://studioneo.com.br/sitemap.xml` gerado automaticamente

---

### 3️⃣ **Schema.org / JSON-LD** (Impacto: 🔥🔥🔥)

**Criar componente**: `src/components/seo/StructuredData.tsx`

```typescript
export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          "name": "Studio Neo",
          "image": "https://studioneo.com.br/logo.jpg",
          "description": "Salão de beleza premium",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua X, 123",
            "addressLocality": "Cidade",
            "addressRegion": "UF",
            "postalCode": "00000-000",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -23.5505,
            "longitude": -46.6333
          },
          "telephone": "+55-XX-XXXXX-XXXX",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
              "opens": "09:00",
              "closes": "20:00"
            }
          ],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
          }
        }),
      }}
    />
  );
}
```

**Outros schemas úteis**:
- [ ] `Service` schema para cada procedimento
- [ ] `Person` schema para profissionais
- [ ] `BreadcrumbList` para navegação
- [ ] `FAQPage` para perguntas frequentes

---

### 4️⃣ **Robots.txt Aprimorado**

**Atualizar**: `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /_next/static
Crawl-delay: 1

Sitemap: https://studioneo.com.br/sitemap.xml
```

**Ou usar**: `src/app/robots.ts` (dinâmico)

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: 'https://studioneo.com.br/sitemap.xml',
    host: 'https://studioneo.com.br',
  };
}
```

---

### 5️⃣ **Performance / Core Web Vitals** (Impacto: 🔥🔥🔥)

Google usa Core Web Vitals como fator de ranking.

**Métricas a otimizar**:
- ⚡ **LCP** (Largest Contentful Paint) < 2.5s
- 👁️ **FID** (First Input Delay) < 100ms
- 📐 **CLS** (Cumulative Layout Shift) < 0.1

**Ações**:
- [ ] Converter `<img>` para `<Image>` do next/image (lazy loading automático)
- [ ] Adicionar `priority` em imagens above-the-fold
- [ ] Usar `next/font` para fonts (evita FOIT/FOUT)
- [ ] Lazy load de componentes pesados com `dynamic()`
- [ ] Reduzir JavaScript bundle (remover Radix UI não usados)
- [ ] Comprimir imagens (WebP/AVIF)
- [ ] Habilitar HTTP/2 ou HTTP/3 no servidor

---

### 6️⃣ **Hierarquia de Headings (H1-H6)**

**Regras SEO**:
- ✅ Apenas **1 H1 por página** com keyword principal
- ✅ H2 para seções principais
- ✅ H3 para subseções
- ❌ Não pular níveis (H1 → H3 sem H2)

**Auditoria necessária**:
- [ ] Cada página tem exatamente 1 H1?
- [ ] H1 contém a keyword principal da página?
- [ ] Hierarquia lógica de h2/h3/h4?

---

### 7️⃣ **Otimização de Imagens**

- [ ] Converter PNGs grandes para WebP/AVIF
- [ ] Adicionar `alt` text descritivo em TODAS as imagens
- [ ] Usar `priority` em imagens above-the-fold
- [ ] Lazy load em imagens below-the-fold
- [ ] Definir width/height explícitos (evita CLS)
- [ ] Comprimir imagens (target: <100KB cada)

```typescript
<Image
  src={image}
  alt="Salão de beleza Studio Neo - ambiente principal"
  width={1200}
  height={630}
  quality={85}
  priority={true} // só para above-the-fold
  placeholder="blur"
/>
```

---

### 8️⃣ **URLs Amigáveis / Slugs**

**Estrutura ideal**:
```
✅ /servicos/corte-feminino-curto
❌ /servicos?id=123
✅ /equipe/maria-silva
❌ /equipe?prof=8a7sd
```

**Implementar**:
- [ ] Slugs em URLs de procedimentos (`/servicos/[slug]`)
- [ ] Slugs em URLs de profissionais (`/equipe/[slug]`)
- [ ] URLs em português (não inglês)
- [ ] Sem caracteres especiais ou acentos

---

### 9️⃣ **Conteúdo Estruturado**

- [ ] Blog com artigos otimizados (mínimo 500 palavras)
- [ ] FAQ section com keywords
- [ ] Páginas de serviços com descrição completa
- [ ] Bios detalhadas dos profissionais
- [ ] CTAs claros em cada página

---

### 🔟 **Acessibilidade (a11y) = SEO**

Google considera acessibilidade como fator de ranking:

- [ ] Todas imagens com `alt` text
- [ ] Botões com `aria-label`
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Navegação por teclado funcionando
- [ ] Skip links para navegação principal
- [ ] Form labels associados aos inputs

---

## 🔴 BACK-END: Tarefas para Apoio ao SEO

### 1️⃣ **Server-Side Rendering (SSR) / SSG**

Já está usando Next.js 14 App Router. Garantir que páginas-chave sejam:
- [ ] **SSG** (Static Site Generation) para Home, Sobre, Contato
- [ ] **ISR** (Incremental Static Regeneration) para Serviços, Galeria, Blog
- [ ] **SSR** apenas para conteúdo dinâmico

### 2️⃣ **API de Procedimentos com SEO**

Adicionar campo `slug` no Prisma:

```prisma
model Procedure {
  id           String  @id @default(auto()) @map("_id") @db.ObjectId
  name         String  @unique
  slug         String  @unique // NOVO
  description  String?
  // ...
  metaTitle       String? // NOVO - SEO
  metaDescription String? // NOVO - SEO
  ogImageUrl      String? // NOVO - SEO
}
```

### 3️⃣ **API de Profissionais com SEO**

```prisma
model Professional {
  id           String  @id
  name         String
  slug         String  @unique // NOVO
  // ...
  bioHtml         String? // NOVO - Conteúdo SEO-friendly
  metaTitle       String? // NOVO
  metaDescription String? // NOVO
}
```

### 4️⃣ **Cache HTTP / Edge**

Adicionar headers de cache no Express:

```typescript
// Para rotas públicas
app.get('/api/procedures', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  // ...
});
```

### 5️⃣ **Performance API**

Endpoints que retornam dados SEO devem ser:
- [ ] < 200ms de response time
- [ ] Cache em CDN/edge
- [ ] Gzip/Brotli enabled
- [ ] Sem N+1 queries

### 6️⃣ **Suporte a OpenGraph Images Dinâmicas**

Criar endpoint que gera imagens OG dinâmicas para serviços/profissionais:

```typescript
// src/app/api/og/[type]/[id]/route.ts
import { ImageResponse } from 'next/og';

export async function GET(req: Request, { params }) {
  // Gerar imagem 1200x630 com nome do serviço/profissional
  return new ImageResponse(/* JSX */);
}
```

---

## 📋 Checklist Resumido (Priorizado)

### Sprint 1 - Fundamental (1-2 dias)
- [ ] Adicionar metadata avançada no `layout.tsx` (Open Graph, Twitter)
- [ ] Criar `src/app/sitemap.ts` dinâmico
- [ ] Criar `src/app/robots.ts`
- [ ] Adicionar metadata específica em cada page.tsx
- [ ] Verificar 1 único H1 por página

### Sprint 2 - Performance (2-3 dias)
- [ ] Converter todas `<img>` para `<Image>` (next/image)
- [ ] Adicionar `priority` em imagens hero
- [ ] Usar `next/font` para fontes
- [ ] Remover Radix UI não usados (-20KB)
- [ ] Lazy load de componentes pesados
- [ ] Comprimir imagens (WebP/AVIF)

### Sprint 3 - Dados Estruturados (1-2 dias)
- [ ] Implementar Schema.org BeautySalon (LocalBusiness)
- [ ] Schema Service para cada procedimento
- [ ] Schema Person para profissionais
- [ ] BreadcrumbList em todas as páginas

### Sprint 4 - Backend SEO (2 dias)
- [ ] Adicionar campo `slug` em Procedures e Professionals
- [ ] Criar rotas com slug: `/servicos/[slug]`, `/equipe/[slug]`
- [ ] Cache HTTP headers nas APIs públicas
- [ ] Endpoint para OG images dinâmicas

### Sprint 5 - Conteúdo (Contínuo)
- [ ] Criar artigos de blog (mín 500 palavras)
- [ ] Bios completas dos profissionais
- [ ] FAQ na página de serviços
- [ ] Depoimentos de clientes

---

## 🎯 Métricas para Acompanhar

**Ferramentas**:
- 📊 Google Search Console
- 📈 Google Analytics 4
- 🔍 Google PageSpeed Insights
- 🌍 Ahrefs / SEMrush (pago)
- 🆓 Ubersuggest

**KPIs**:
- Posição média no Google
- Impressões (Search Console)
- CTR orgânico
- Core Web Vitals (LCP, FID, CLS)
- Backlinks
- Tempo de carregamento

---

## 🎁 Impacto Esperado

| Implementação | Ganho SEO |
|---------------|-----------|
| Metadata completa | +15-25% CTR |
| Sitemap.xml | Indexação 3x mais rápida |
| Schema.org | Rich snippets no Google |
| Core Web Vitals OK | +10-20% ranking boost |
| Slugs amigáveis | +5-10% ranking |
| Conteúdo de qualidade | +30-50% tráfego orgânico |

**Estimativa total**: **+50-100% de tráfego orgânico em 3-6 meses**

---

**Próximo passo recomendado**: Começar pelo Sprint 1 (metadata + sitemap) - é o que dá maior ROI no curto prazo.
