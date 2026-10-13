<div align="center">

# 🌐 GoSocial - Full-Stack Social Media Platform

A minimal social networking web application built to replicate core social media interactions, featuring real-time updates, secure authentication, and a mobile user interface.

[**Explore Live Demo**]([LIVE_DEMO_LINK](https://go-social-chi.vercel.app) · [**Report Bug**](https://github.com/Salwa-mansour/go-social/issues)

</div>

<br>

<img width="499" height="891" alt="main-socail" src="https://github.com/user-attachments/assets/dcaeb3c9-2bc3-4dfa-8fe3-e2e2f18cadd9" />
<img width="505" height="884" alt="profile" src="https://github.com/user-attachments/assets/5842ff8c-6cea-4c30-af5d-285defb684fd" />

---

## 🚀 About The Project

GoSocial is a full-stack social media web application designed to connect users through dynamic post feeds, interactive comments, likes, and user follow management. Built with modern web technologies, this project emphasizes robust database relationships, secure backend routing, and a seamless client-side experience.

### ✨ Key Features
* **User Authentication & Profiles:** Secure account creation, login, and personalized user profiles.
* **Dynamic Post Feed:** Create, read, update, and delete posts with image or text content.
* **Interactive Social Actions:** Like/unlike posts and leave nested comments in real time.
* **Follow System:** Follow and unfollow other users to curate a personalized network feed.
* ** UI/UX:** Clean, mobile-friendly interface designed with modern styling conventions.

---

## 🛠️ Built With

* **Frontend:** React, Vite, React Router, CSS
* **Backend:** Node.js, Express.js
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Deployment:** Vercel (Frontend) & Render/Neon (Backend API)

---

## ⚙️ Architecture & Technical Highlights

* **Relational Database Modeling:** Utilized PostgreSQL via Prisma to manage complex many-to-many relationships (e.g., users following users, post likes, and comment associations) with optimized query performance.
* **RESTful API Design:** Structured clean, modular Express routers and controllers following MVC principles, complete with error-handling middleware and token-based authentication.
* **State Management:** Handled client-side global state and asynchronous data fetching cleanly to ensure instantaneous UI feedback on likes and follows.

---

## 📂 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have **Node.js** and **pnpm** (or npm) installed on your machine.

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/Salwa-mansour/go-social.git](https://github.com/Salwa-mansour/go-social.git)
