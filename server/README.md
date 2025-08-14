# SSS Farmer Server & Admin

Simple Express server used for local development of the SSS Farmer App, including a lightweight Admin web UI.

## Run the server

- Install deps: `npm install`
- Start: `npm run dev` (auto-reload) or `npm start`
- Server runs on `http://localhost:4000`

## Admin UI

- Open `http://localhost:4000/admin/index.html` for dashboard
- Open `http://localhost:4000/admin/products.html` to manage products (CRUD)

## Products API

- GET `/products?category=fert|seed&active=1&q=urea`
- GET `/products/:id`
- POST `/products` { name, category, price, stock, sku?, unit?, imageUrl?, isActive? }
- PUT `/products/:id` partial body
- DELETE `/products/:id`

Data persists to `./data/products.json`.

> Note: This is a development-only server with in-memory state and JSON persistence. Replace with a proper database and auth before production.
