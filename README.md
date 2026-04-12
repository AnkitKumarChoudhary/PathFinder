# 🧭 PathFinder

> An intelligent, full-stack platform that helps users discover and navigate the right paths — powered by a TypeScript monorepo and a dedicated Python ML service.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PathFinder is a full-stack web application with an integrated machine learning service. It features a React-based frontend, a Node.js/Express backend, and a Python ML microservice — all orchestrated via Docker Compose.

---

## Features

- 🔍 **Intelligent Recommendations** — ML-driven suggestions powered by a dedicated Python microservice
- 🖥️ **Modern Frontend** — Responsive, component-driven UI built with React and TypeScript
- ⚙️ **Robust Backend** — RESTful API built with Node.js and TypeScript
- 🐳 **Dockerized** — One-command setup for the entire stack with Docker Compose
- 🗄️ **Persistent Storage** — Database with seed scripts for development and testing
- 🔗 **Microservice Architecture** — Decoupled ML service allows independent scaling and updates

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Docker Network                  │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐  │
│  │          │    │          │    │               │  │
│  │  Client  │───▶│  Server  │───▶│  ML Service   │  │
│  │ (React/  │    │ (Node.js/│    │  (Python)     │  │
│  │   TS)    │    │   TS)    │    │               │  │
│  │          │    │          │    │               │  │
│  └──────────┘    └────┬─────┘    └───────────────┘  │
│                       │                             │
│                  ┌────▼─────┐                       │
│                  │          │                       │
│                  │    DB    │                       │
│                  │          │                       │
│                  └──────────┘                       │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript |
| **Backend** | Node.js, TypeScript, Express |
| **ML Service** | Python |
| **Database** | (Relational DB via Docker) |
| **Infrastructure** | Docker, Docker Compose |
| **Package Manager** | npm |

---

## Project Structure

```
PathFinder/
├── client/               # React + TypeScript frontend
├── server/               # Node.js + TypeScript REST API
├── ml-service/           # Python machine learning microservice
├── docker-compose.yml    # Multi-service Docker orchestration
├── docker_up.txt         # Docker startup notes/commands
├── docker_down.txt       # Docker teardown notes/commands
├── reset_db.bat          # Script to reset the database
├── reset_and_seed.bat    # Script to reset and seed the database
├── package.json          # Root workspace configuration
└── .gitignore
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18 or higher) — for local development
- [Python](https://www.python.org/) (v3.9 or higher) — for local ML service development
- [npm](https://www.npmjs.com/)

---

### Running with Docker (Recommended)

This is the easiest way to get the entire stack running.

**1. Clone the repository**

```bash
git clone https://github.com/AnkitKumarChoudhary/PathFinder.git
cd PathFinder
```

**2. Configure environment variables**

Copy the example env files (see [Environment Variables](#environment-variables) below) and fill in your values.

**3. Start all services**

```bash
docker-compose up --build
```

**4. Access the app**

| Service | URL |
|---|---|
| Frontend (Client) | http://localhost:3000 |
| Backend (Server) | http://localhost:5000 |
| ML Service | http://localhost:8000 |

**5. Stop all services**

```bash
docker-compose down
```

---

### Running Locally

If you prefer to run services individually without Docker:

**Install root dependencies**

```bash
npm install
```

**Start the frontend**

```bash
cd client
npm install
npm start
```

**Start the backend**

```bash
cd server
npm install
npm run dev
```

**Start the ML service**

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

---

## Database Setup

Scripts are provided to quickly reset and/or seed the database during development.

**Reset the database (Windows)**

```bat
reset_db.bat
```

**Reset and seed with sample data (Windows)**

```bat
reset_and_seed.bat
```

> On macOS/Linux, run the equivalent commands inside the Docker container or adapt the scripts accordingly.

---

## Environment Variables

Create `.env` files in the respective service directories. Below are the common variables you may need to configure:

**`server/.env`**

```env
PORT=5000
DATABASE_URL=your_database_connection_string
ML_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret
```

**`client/.env`**

```env
REACT_APP_API_URL=http://localhost:5000
```

**`ml-service/.env`**

```env
PORT=8000
MODEL_PATH=./models
```

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow consistent code style and include relevant tests where applicable.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/AnkitKumarChoudhary">Ankit Kumar Choudhary</a></p>
