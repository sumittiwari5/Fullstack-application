# 🛒 ClickNCart — Full Stack E-Commerce Application

(<img width="1360" height="688" alt="image" src="https://github.com/user-attachments/assets/2fc3596d-912a-427b-a677-b3d3efdc5d8a" />)
(<img width="1366" height="591" alt="image" src="https://github.com/user-attachments/assets/56bf85f5-8dae-43a9-9474-b518f83208f5" />)
(<img width="1297" height="650" alt="image" src="https://github.com/user-attachments/assets/ea642e53-b00a-4f57-8070-5e6def7d61cc" />)
(<img width="1225" height="490" alt="image" src="https://github.com/user-attachments/assets/217286dd-177e-42c5-900b-2339545b0be3" />)

A full-stack e-commerce web application built with **React**, **Spring Boot**, and **MySQL**, deployed on **AWS EC2** with **Amazon RDS** as the managed cloud database.

---

## 🚀 Live Demo

> Deployed at: `http://<EC2-PUBLIC-IP>:3000`  
> Backend API: `http://<EC2-PUBLIC-IP>:8080/api`

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Node.js 18, npm         |
| Backend    | Spring Boot, Java 21, Maven 3.8.7 |
| Database   | MySQL 8.0 (Amazon RDS)            |
| Server     | Ubuntu on AWS EC2 (m7i-flex.large)|
| Storage    | 25 GiB EBS Volume                 |

---

## ☁️ AWS Architecture

```
        [ User Browser ]
               |
        [ EC2 Instance ]  ← Ubuntu, m7i-flex.large
        /              \
  [ React :3000 ]   [ Spring Boot :8080 ]
                            |
                    [ Amazon RDS ]
                  MySQL 8.0, Port 3306
                  (Private, VPC-secured)
```

### Security Configuration
- RDS is **not publicly accessible** — only allows inbound traffic from the EC2 security group on port `3306`
- EC2 exposes only ports `80` (HTTP) and `3000` (React frontend)
- Credentials managed via `application.properties` (use AWS Secrets Manager in production)

---

## 📦 Features

- 🛍️ Browse and discover products by category
- 🔍 Search and filter by name and max price
- 🛒 Add to cart and manage orders
- ➕ Add new products (admin)
- 🔐 User authentication (Register / Login / Logout)
- 💳 Razorpay payment integration

---

## 🛠️ Local Setup

### Prerequisites
- Java 21
- Node.js 18+
- Maven 3.8+
- MySQL (local or RDS)

### Backend
```bash
cd Backend/
# Update src/main/resources/application.properties with your DB URL
mvn clean install
cd target/
java -jar ClickNcart-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd Frondend/
# Update .env with your EC2 public IP or localhost
npm install
npm start
```

---

## ☁️ AWS Deployment Guide

### 1. Create Amazon RDS (MySQL)
- Engine: MySQL 8.0
- Instance: `db.t4g.micro` (Free Tier)
- Credentials: Set master username and password
- Note the **RDS endpoint hostname**

### 2. Launch EC2 Instance
- AMI: Ubuntu 24.04 LTS
- Instance type: `m7i-flex.large`
- Storage: 25 GiB

### 3. Configure Security Groups
RDS inbound rule:
```
Type:   MySQL/Aurora
Port:   3306
Source: <EC2 Security Group ID>
```

### 4. Install Dependencies on EC2
```bash
sudo apt update
sudo apt install nodejs npm openjdk-21-jdk maven mysql-client -y
```

### 5. Clone & Configure
```bash
git clone https://github.com/mantu0tech/Fullstack-application.git
cd Fullstack-application/
git checkout Design
```

Update `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://<RDS-ENDPOINT>:3306/ClickNcart
spring.datasource.username=root
spring.datasource.password=<your-password>
```

Update `Frondend/.env`:
```
REACT_APP_API_URL=http://<EC2-PUBLIC-IP>:8080
```

### 6. Import Database Schema
```bash
mysql -h <RDS-ENDPOINT> -P 3306 -u root -p < db.sql
```

### 7. Build & Run Backend
```bash
cd Backend/
mvn clean install
cd target/
java -jar ClickNcart-0.0.1-SNAPSHOT.jar
```

### 8. Run Frontend
```bash
cd Frondend/
npm install
npm start
```

---

## 📁 Project Structure

```
Fullstack-application/
├── Backend/               # Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/      # Controllers, Services, Repositories
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── Frondend/              # React.js frontend
│   ├── src/
│   │   └── components/    # React components
│   └── .env
└── db.sql                 # Database schema & seed data
```

---

## 🔒 Security Best Practices (Recommended)

- [ ] Store DB credentials in **AWS Secrets Manager**
- [ ] Enable **HTTPS** with an SSL certificate (AWS ACM + Load Balancer)
- [ ] Place RDS in a **private subnet** within a VPC
- [ ] Use **IAM roles** instead of hardcoded credentials
- [ ] Enable **RDS automated backups**
- [ ] Set up **CloudWatch alarms** for CPU and connection metrics

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

---

> Built with ❤️ and deployed on AWS ☁️
