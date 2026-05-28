# admin-campaign-fe

Vite + React 19 SPA — admin dashboard cho Senlyzer Campaign.

## Stack

- Vite 8, React 19, TypeScript 6
- react-router 7 (SPA routing)
- Tailwind CSS 4, Tiptap, Recharts, Framer Motion
- pnpm 10

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # tsc + vite build → dist/
pnpm lint
pnpm preview      # serve dist/ locally
```

## Env Vars

Build-time env (Vite inline at build, prefix `VITE_` required). Xem `.env.example`.

Local dev: tạo `.env.local`:

```
VITE_API_URL=https://admin-campaign-be.hoangdinhlamhai1.workers.dev
```

**Lưu ý:** Vite inline env tại build time → đổi giá trị phải rebuild. Cloudflare dashboard env vars KHÔNG có tác dụng cho static build này.

## Deploy lên Cloudflare Pages

Project name: `admin-campaign-fe` → URL: `https://admin-campaign-fe.pages.dev`

### Lần đầu

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
```

### Production

PowerShell:
```powershell
$env:VITE_API_URL = "https://admin-campaign-be.hoangdinhlamhai1.workers.dev"
pnpm deploy:prod
```

bash/zsh:
```bash
VITE_API_URL=https://admin-campaign-be.hoangdinhlamhai1.workers.dev pnpm deploy:prod
```

### Preview branch

PowerShell:
```powershell
$env:VITE_API_URL = "https://staging-api.example.com"
pnpm deploy:preview
```

bash/zsh:
```bash
VITE_API_URL=https://staging-api.example.com pnpm deploy:preview
```

### Cảnh báo bảo mật

- Chỉ đặt **public values** vào `VITE_*` — chúng được inline vào bundle JS phía client.
- Không bao giờ đưa secret (API key, token, DB credential) qua `VITE_*`. Secrets phải ở backend.
