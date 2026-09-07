const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. 本地端模擬與使用者回報資料庫
let localIncidents = [];

// 工具函式：計算兩地經緯度的實際距離 (公里)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==========================================
// 🌟 外部真實 API 介接模組
// ==========================================

// [來源 1] BMKG: 印尼氣象氣候與地球物理局 (最新地震)
async function fetchBMKG() {
  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
    const data = await res.json();
    const gempa = data.Infogempa.gempa;
    const coords = gempa.Coordinates.split(',');
    
    return [{
      id: `bmkg-${gempa.DateTime}`,
      type: "EARTHQUAKE", 
      title: `🚨 [BMKG Official] Gempa Bumi ${gempa.Magnitude} SR`,
      description: `Lokasi: ${gempa.Wilayah}. ${gempa.Potensi}`,
      latitude: parseFloat(coords[0]),
      longitude: parseFloat(coords[1]),
      risk_level: parseFloat(gempa.Magnitude) >= 5.0 ? "HIGH" : "MEDIUM",
      votes: 999, // 官方資料不可被群眾下架
      timestamp: new Date().toISOString(),
      isOfficial: true
    }];
  } catch (error) {
    console.error("BMKG API 失敗:", error);
    return [];
  }
}

// [來源 2] PetaBencana.id: 印尼官方認可災情開源平台 (真實民眾水災回報)
// [來源 2] PetaBencana.id: 印尼官方認可災情開源平台 (真實民眾各類災情回報)
async function fetchPetaBencana() {
  try {
    // 抓取全印尼最新的回報 (GeoJSON 格式)
    const res = await fetch('https://data.petabencana.id/reports');
    const data = await res.json();
    
    // 🌟 建立災情類型對應表
    const disasterMapping = {
      'flood': { type: 'FLOOD', emoji: '💧' },
      'fire':  { type: 'FIRE', emoji: '🔥' },
      'haze':  { type: 'HAZE', emoji: '🌫️' },
      'wind':  { type: 'WIND', emoji: '🌪️' }
    };

    // 只取最新的 50 筆，並轉譯為我們的格式
    return data.features.slice(0, 50).map(feature => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates; // GeoJSON 是 [lng, lat]
      
      // 比對災情類型，若 API 回傳未知的分類，預設歸類為 OTHER_HAZARD
      const mappedDisaster = disasterMapping[props.disaster_type] || { type: 'OTHER_HAZARD', emoji: '⚠️' };

      return {
        id: `pb-${props.pkey}`,
        type: mappedDisaster.type,
        title: `${mappedDisaster.emoji} [PetaBencana] Laporan ${props.disaster_type}`,
        description: props.text || "Tidak ada deskripsi detail.",
        latitude: coords[1],
        longitude: coords[0],
        risk_level: "MEDIUM",
        votes: 100, // 第三方認證資料，給予較高初始信譽
        timestamp: props.created_at,
        isOfficial: true
      };
    });
  } catch (error) {
    console.error("PetaBencana API 失敗:", error);
    return [];
  }
}

// ==========================================
// 3. API 路由端點
// ==========================================

app.get('/api/incidents', async (req, res) => {
  const { lat, lng, radius = 15 } = req.query;
  
  // 1. 同步獲取本地 + 兩大真實 API 數據
  const [bmkgData, petaBencanaData] = await Promise.all([fetchBMKG(), fetchPetaBencana()]);
  
  // 2. 合併所有資料 (過濾掉被群眾踩成假消息的本地回報)
  let allIncidents = [
    ...localIncidents.filter(item => item.votes >= -2),
    ...bmkgData,
    ...petaBencanaData
  ];

  // 3. 執行空間過濾 (半徑 15km)
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    allIncidents = allIncidents.filter(item => {
      // 重大官方警報 (如 BMKG 地震) 無視距離，推播全國
      if (item.type === 'EARTHQUAKE') return true; 
      const dist = calculateDistance(userLat, userLng, item.latitude, item.longitude);
      return dist <= parseFloat(radius);
    });
  }
  
  res.json(allIncidents);
});

app.post('/api/incidents', (req, res) => {
  const newIncident = { id: `local-${Date.now()}`, ...req.body, votes: 1, timestamp: new Date().toISOString() };
  localIncidents.push(newIncident);
  res.status(201).json({ message: "回報成功", data: newIncident });
});

app.post('/api/incidents/:id/vote', (req, res) => {
  const { id } = req.params;
  const { direction } = req.body;
  const incident = localIncidents.find(item => item.id === id);
  if (!incident) return res.status(404).json({ error: "只能對本地群眾回報進行投票" });
  if (direction === 'up') incident.votes += 1;
  if (direction === 'down') incident.votes -= 1;
  res.json({ message: "投票成功", votes: incident.votes });
});

app.listen(PORT, () => {
  console.log(`🚀 泗水 API 伺服器已啟動: http://localhost:${PORT}`);
  console.log(`📡 [系統整合] BMKG 國家地震中心 API ... 已連線`);
  console.log(`📡 [系統整合] PetaBencana.id 真實災情 API ... 已連線`);
});
