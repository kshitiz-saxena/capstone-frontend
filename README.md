# How to Build and Run

To run the project in development mode, run following commands from root directory:

```bash
npm install
npm run dev
```

Then open the local URL shown in terminal (usually `http://localhost:5173`).

- `dev` → starts Vite dev server
- `build` → production build
- `preview` → preview built app

NOTE: To stop the server - In the terminal where `npm run dev` is running, press **`Ctrl + C`**.

For production preview:

```bash
npm run build
npm run preview
```

If `npm run dev` fails with a Node version error, update Node to a recent version (Vite 8 expects modern Node).

## Backend API expectations

- Base URL defaults to `http://localhost:4000` (override with `VITE_API_BASE_URL`).
- Demo requests are submitted to `POST /api/request-demo`.
- The request includes `name`, `email`, `company`, and `message`.
- Chat requests are submitted to `POST /api/chat` with `Authorization: Bearer <token>`.
- Chat payload is sent as `multipart/form-data` with `message` and optional `files` uploads.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
