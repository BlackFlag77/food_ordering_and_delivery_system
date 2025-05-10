# Food Ordering & Delivery System - Microservices Project

![Microservices Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Docker](https://img.shields.io/badge/Container-Docker-green)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-orange)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

A cloud-native food ordering and delivery platform built with microservices architecture.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Services](#services)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

## Project Overview
Distributed food ordering system with:
- Customer web/mobile interface
- Restaurant management portal
- Real-time delivery tracking
- Secure payment integration
- Automated notifications


| Component          | Description                          |
|--------------------|--------------------------------------|
| API Gateway        | Single entry point for all requests  |
| Service Discovery  | Dynamic service registration         |
| Config Server      | Centralized configuration management |
| Circuit Breaker    | Fault tolerance implementation       |

## Features
### Customer
-  Browse restaurants/menus
-  Cart functionality
-  Order tracking
-  Payment processing

### Restaurant
-  Menu management (CRUD)
-  Order management
-  Availability control

### Admin
-  User management
-  Restaurant verification
-  Financial oversight

## Technology Stack
### Backend
| Technology       | Purpose                     |
|------------------|-----------------------------|
| mern stack      | Microservices framework     |
| MongoDB          | NoSQL database              |
| Appnet         | Asynchronous messaging      |
| JWT              | Authentication              |

### Frontend
- React.js with vite
- tailwind 
- Axios for API calls

### DevOps
- Docker containerization
- Kubernetes orchestration
- GitHub Actions CI/CD

## Services

1. **User Service** - Authentication & authorization
2. **Restaurant Service** - Menu management
3. **Order Service** - Order lifecycle
4. **Delivery Service** - Driver assignment
5. **Payment Service** - Transaction processing
5. **Notification Service** - Email/SMS alerts

## Getting Started
### Prerequisites
```bash
Docker 20.10+
Kubernetes 1.20+
Node.js 16+
Java JDK 17+
