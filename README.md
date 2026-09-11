# 🌿 Ladesar Organics

Ultra-Premium Organic Foods, Ayurvedic Remedies & Cold-Pressed Staples.

---

## 📁 Project Structure

```
Ladesar-organics/
│
├── 🛍️ Ladesar-Organics-frontend/    # Customer eCommerce React App (Port 5173)
├── 🛡️ Ladesar-Organics-admin/       # Admin ERP & Catalog Management (Port 5174)
└── ⚙️ Ladesar-Organics-backend/     # Express REST API & AI Server (Port 5000)
```

---

## 🚀 Running the Projects

### 1. Backend API (Port 5000)
```bash
cd Ladesar-Organics-backend
npm run dev
```

### 2. Customer Frontend Website (Port 5173)
```bash
cd Ladesar-Organics-frontend
npm run dev
```

### 3. Admin ERP Dashboard (Port 5174)
```bash
cd Ladesar-Organics-admin
npm run dev
```

---

### Or Run directly from Root:
```bash
npm run dev:backend   # Start backend
npm run dev:frontend  # Start frontend
npm run dev:admin     # Start admin
```

---

## 🌐 Deploy to Render (Live Production)

This repository includes a `render.yaml` Blueprint file for automatic 1-click deployment on Render:

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New +** -> Select **Blueprint**
4. Connect the repository `Shivam55-bit/Ladesar-project`
5. Render will automatically detect `render.yaml` and set up:
   - `ladesar-backend` (Node Web Service)
   - `ladesar-frontend` (Static Site)
   - `ladesar-admin` (Static Site)
6. Click **Apply** to deploy all services!

