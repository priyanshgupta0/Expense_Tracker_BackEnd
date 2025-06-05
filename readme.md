# 🧰 TypeScript Node.js Template

A minimal and clean boilerplate to kickstart your Node.js backend projects using TypeScript. This setup includes essential tools and a scalable folder structure with features like routing, middleware, controller logic, MongoDB integration via Mongoose, and environment-based configurations.

---

## 📁 Project Structure

```

priyanshgupta0-typescript\_template\_nodejs/
├── index.ts                   # App entry point
├── package.json               # Project metadata and scripts
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variable sample file
└── src/
├── server.ts             # Server setup and configuration
├── config/
│   └── database.ts       # MongoDB connection setup
├── controllers/
│   └── user.controller.ts # Sample user controller
├── middleware/
│   └── auth.ts           # Sample authentication middleware
├── models/
│   └── User.ts           # Mongoose schema/model for User
└── routes/
├── index.ts          # Root route
└── userRoutes.ts     # User-related routes

```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/priyanshgupta0/priyanshgupta0-typescript_template_nodejs.git
cd priyanshgupta0-typescript_template_nodejs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an `.env` file

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

Update with your MongoDB URI and any other config values.

### 4. Run in development mode

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Start the built app

```bash
npm start
```

---

## 📦 Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [ts-node-dev](https://github.com/wclr/ts-node-dev)

---

## 🛠 Features

- Express server with TypeScript
- Environment variable support
- MongoDB integration with Mongoose
- Layered architecture (Routes, Controllers, Models, Middleware)
- Hot-reloading in development
- Strict typing enabled

---

## 📜 Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the app in dev mode        |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start`     | Run the built app from `dist/`   |

---

## 🧪 API Structure (Sample)

- `GET /api/users` – Get all users
- `POST /api/users` – Create a new user

You can expand this further in the `controllers` and `routes` directories.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## ✍️ Author

**Priyansh Gupta**
[GitHub](https://github.com/priyanshgupta0)

---

## 🙏 Contributions

Contributions are welcome! Feel free to fork the repository, submit issues, and create pull requests.
