# 🐳 Microservices Docker Setup

## 📋 System Requirements

- Any operating system that supports **Docker**
- Minimum **1GB free RAM** and **1 vCPU core** for a smooth experience

## ⚙️ Prerequisites

- [Docker Community Edition](https://docs.docker.com/get-docker/)
- Docker Compose plugin
- Internet access (required only for the first run)

## 🚀 How to Run

1. Clone this repository

2. Copy `.env.example` to `.env`:

3. Edit the `.env` file with appropriate values

4. Build the app:
   ```bash
   docker compose build
   ```

4. Start the services using Docker Compose:

   ```bash
   docker compose up -d
   ```

---

## 🔍 How to Monitor

- View container status:

  ```bash
  docker compose ps -a
  ```

- View live logs:

  ```bash
  docker compose logs -tf
  ```

- Stop and remove everything, including volumes:

  ```bash
  docker compose down --volumes
  ```

## 🔍 How to Use

- Detailed information about API endoints have been given in [Endpoints.md](https://github.com/huseynaligadirov/nestjs-microservice/blob/main/Endpoints.md) file

- To run tests use command below given

  ```bash
  yarn test
  ```


---

> 💡 Tip: Make sure your ports are not in use by other applications before starting the containers.
