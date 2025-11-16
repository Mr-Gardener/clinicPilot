# ClinicPilot

ClinicPilot is an AI‑powered automation tool designed for medical and dental clinics. It helps reduce administrative workload by automatically handling patient communication and appointment workflows.

## 🚀 Features (Goal)

- Automatically answer and triage patient phone calls using AI
- Verify insurance information in real‑time
- Schedule patient appointments seamlessly
- Send reminders and follow‑up messages

## 🏗️ Tech Stack

**Frontend:** Next.js, TailwindCSS, shadcn/ui

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma

**Dev Tools:** ESLint, Prettier, Nodemon, GitHub Actions, Docker (planned)

## 📍 Current Progress

Project is being built in public with milestone‑based development.

**Completed:**

- Monorepo setup
- Backend TypeScript + Express initial configuration
- Prisma + PostgreSQL connection
- ESLint + Prettier formatting rules

**Next Steps:**

- Auth module setup (JWT + RBAC)
- User creation & login endpoints
- Basic frontend dashboard wireframe

## 📦 Repository Structure

```
clinicpilot/
│
├── client/        # Next.js frontend
├── server/        # Node.js + Express backend
└── README.md
```

## 🧑‍💻 Run Locally

**1️⃣ Clone repo**

```
git clone https://github.com/Mr-Gardener/clinicPilot.git
cd clinicpilot
```

**2️⃣ Setup environment variables** Create `.env` files in both `client/` and `server/` using `.env.example` as reference.

**3️⃣ Install dependencies**

```
cd server && npm install
cd ../client && npm install
```

**4️⃣ Start development servers (parallel)**

```
npm run dev
```

## 🏁 Roadmap (Epics)

- EPIC 1: Project Setup 🌱 _(done)_
- EPIC 2: Authentication & RBAC 🔐
- EPIC 3: Patient CRM + Intake Forms 📋
- EPIC 4: AI Voice Agent + Call Routing 🤖📞
- EPIC 5: Insurance API Integration 🧾
- EPIC 6: Deploy & CI/CD ☁️

---

Follow build‑in‑public updates here and on social media!
