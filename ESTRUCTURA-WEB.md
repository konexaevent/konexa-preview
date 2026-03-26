# Estructura web de Konexa

Per mantenir totes les funcionalitats, `Konexa` continua sent una web feta amb `Next.js`.
No és una app nativa, però sí una web moderna amb estructura una mica diferent d'un `index.html` clàssic.

## Si vols trobar "l'index"

- Entrada principal de la home: `index.tsx`
- Pàgina real de la home: `app/page.tsx`

## Equivalències amb una web clàssica

- `app/page.tsx`
  Equival a la pàgina principal (`index.html`)

- `app/layout.tsx`
  Equival a l'estructura comuna de la web (`header`, `footer`, contenidor general)

- `app/globals.css`
  Equival al CSS global principal

- `components/site-header.tsx`
  Capçalera de la web

- `app/profile/page.tsx`
  Pàgina de perfil

- `app/activities/[id]/page.tsx`
  Detall d'una activitat

- `app/login/page.tsx`
  Accés / login

## Com previsualitzar-la

Obre una terminal dins del projecte i executa:

```bash
PATH=/opt/homebrew/bin:$PATH npm run dev -- --hostname 127.0.0.1 --port 3000
```

Després obre:

`http://127.0.0.1:3000`

## Idea important

Hem mantingut aquesta estructura perquè:

- conserva login, perfil i historial
- permet activitats i connexions socials
- és molt més fàcil de mantenir que una web estàtica amb tot això

Però a nivell d'editor, pots pensar en `app/page.tsx` com si fos el teu `index`.
