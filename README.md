# Nusantara Live Alerts 🚨
**A Geospatial Disaster Response & Decentralized Verification System**

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Deployed-Render-purple?style=for-the-badge&logo=render)

## 📖 Project Overview
Developed for the **CommTECH Camp Highlight 2026 Stream 2: Engineering Innovations** in Surabaya, Indonesia. 

Nusantara Live Alerts bridges the critical gap between official government meteorological data and real-time civilian reporting. Situated on the Ring of Fire, Indonesia frequently faces overlapping natural hazards. This full-stack web application is designed to act as a highly scalable, localized API gateway and tactical map interface. It actively fetches authoritative alerts while empowering citizens to report hyper-local threats with a built-in decentralized truth-verification mechanism.

## 🔗 Live Deployments
* **Frontend Application (Vercel):** [https://surabaya-citizen-web.vercel.app](https://surabaya-citizen-web.vercel.app)
* **Backend API Gateway (Render):** [https://surabaya-api-v1ey.onrender.com/api/incidents](https://surabaya-api-v1ey.onrender.com/api/incidents)

---

## ✨ Core Engineering Highlights

### 1. Spatial Filtering Engine (Haversine Algorithm)
To prevent "alert fatigue" and conserve critical bandwidth during a crisis, the system does not download nationwide data. Instead, it utilizes **Turf.js** and the **Haversine formula** on the client side to dynamically calculate the great-circle distance between the user's GPS coordinates and active threats. Users only see reports strictly within a **15-kilometer radius**. *(Note: National-level emergencies like earthquakes bypass this filter for immediate broadcasting).*

### 2. Decentralized Verification (Trust Score Mechanism)
During disasters, social media is often plagued by unverified rumors. This system introduces a self-regulating crowdsourced engine. Users can upvote (`👍 Konfirmasi`) or downvote (`👎 Palsu`) civilian reports. The algorithm automatically ranks credibility, ensuring self-regulating information purity and mitigating the spread of fake news.

### 3. Highly Modular & Scalable Architecture
Built with React's component-based architecture, the current system supports 5 major hazard types (Flood, Fire, Road Hazard, Security, Earthquake). However, the codebase is structurally designed for infinite scalability. Adding a new crisis category (e.g., Tsunami or Volcanic Eruption) requires modifying only a single categorization switch, instantly deploying new tactical UI elements.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
* **Framework:** React.js / Vite
* **Mapping & GIS:** Leaflet / React-Leaflet
* **Geospatial Math:** Turf.js
* **Hosting:** Vercel (CI/CD Integrated)

**Backend Architecture:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Middleware:** CORS
* **Hosting:** Render (Cloud Web Service)

**External API Integrations:**
* **BMKG:** Indonesian Meteorological, Climatological, and Geophysical Agency (Earthquake Data)
* **PetaBencana.id:** Open-source civic flood reporting 
* **OpenWeatherMap:** Dynamic precipitation and climatology radar layers

---

## 🚀 Installation & Local Development

### Prerequisites
* Node.js (v18.0 or higher)
* npm or yarn

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/gingerlintw/surabaya-citizen-web.git](https://github.com/gingerlintw/surabaya-citizen-web.git)
   cd surabaya-citizen-web
   
   Install dependencies:npm install
   
   Start the Vite development server:npm run dev
   
   The application will run at http://localhost:5173
   
   Backend Setup

   Clone the backend repository:git clone [https://github.com/gingerlintw/surabaya-api.git](https://github.com/gingerlintw/surabaya-api.git)
cd surabaya-api

Install dependencies:npm install

Start the Express server:npm start
The API will be available at http://localhost:3000

👨‍💻 Author
Chun-Chen Lin (林雋宸)
Undergraduate Program, College of Electrical Engineering and Computer Science
National Chung Hsing University (NCHU)

Developed during the CommTECH Camp Highlight 2026 Stream 2: Engineering Innovations in Surabaya, Indonesia.
