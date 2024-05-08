# DEVIN NTR-SUPRIS Template

> NextJS - tRPC - SUPABASE - PRISMA along with BunJS and TailwindCSS base

This is NextJS with React 18 template, which support auto format with eslint and integrated `husky` for code checking before commit. This will help in smooth out project building.

## Project detail

### Commands

- Run: `pnpm install` for install all packages
- Run: `pnpm dev` for start dev environment
- Run: `pnpm build` for build your project
- Run: `pnpm start` for start your built project
- Run: `pnpm lint` for checking error and fix it

### Project structure

```bash
├── app                 # New NextJS app folder
├── components          # All components that can share between screen
│   └── _template       # Template for component
├── locales             # I18N Language files
│   ├── en.json
│   └── vi.json
├── constants           # All configs and constant goes here
├── hooks               # Custom hooks for project
├── layouts             # Layouts of screen and components
├── pages               # Page file of old NextJS (Use as API route)
├── prisma              # Prisma folder
├── public              # Public folder, contain static files
├── server              # Handle TRPC server
│   ├── common          # Common folder for server
│   ├── routers         # Routers for server
│   └── services        # Services for server (3rd services)
├── states              # State management for app
├── styles              # App global styles (SCSS)
├── types               # App global type (Typescript)
└── utilities           # App's utils
```

### Some code rule

- Component that belong only to screen, should be placed on that screen's folder
- App's state should using Recoil, state relate to API should using Redux
- Function that can be used many time should place in utils or hooks if relate to state
- HOC placed in `layouts` have prefix `*HOC` like `AuthenticationHOC`
- Layout placed in `layouts` and have prefix `*Layout` like `MainLayout` or `DefaultLayout`
- All atom from recoil should have prefix `*Atom` like `DarkmodeAtom`
- All config export from configs folder should have export prefix `*Config` like `BaseConfig` or `ApiConfig`

## Tech included

- `tRPC` for API
- `Supabase` for database and authentication
- `Prisma` for ORM
- `NextJS + Typescript` Base source
- `zustand` State managerment
- `Husky` Git helper
- `SCSS modules` Style system
- `Eslint and Prettier` Rule of code
- `BunJS` for build
