let droneConfig = null;

async function loadDroneConfig() {
  const statusMsg = document.getElementById('status-message');
  const content = document.getElementById('config-content');

  try {
    const envRes = await fetch('/api/setup');
    const envData = await envRes.json();
    const droneId = envData.droneId;

    if (!droneId) {
      throw new Error("ไม่พบ DRONE_ID ใน .env");
    }
    
    //ขอข้อมูล Config จาก API Server
    const configRes = await fetch(`/configs/${droneId}`);
    if (!configRes.ok) {
      throw new Error(`ดึงข้อมูลไม่สำเร็จ Status: ${configRes.status}`);
    }

    droneConfig = await configRes.json();

    localStorage.setItem('droneConfig', JSON.stringify(droneConfig));

    document.getElementById('val-drone-id').textContent = droneConfig.drone_id;
    document.getElementById('val-drone-name').textContent = droneConfig.drone_name;
    document.getElementById('val-light').textContent = droneConfig.light;
    document.getElementById('val-country').textContent = droneConfig.country;

    statusMsg.style.display = 'none';
    content.style.display = 'block';

  } catch (error) {
    console.error("Error loading config:", error);
    statusMsg.textContent = "เกิดข้อผิดพลาดในการโหลดข้อมูล: " + error.message;
    statusMsg.style.color = "red";
  }
}

document.addEventListener('DOMContentLoaded', loadDroneConfig);