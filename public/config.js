// ตัวแปรระดับ Global สำหรับเก็บ Config ไว้ใช้งาน
let droneConfig = null;

async function loadDroneConfig() {
  const statusMsg = document.getElementById('status-message');
  const content = document.getElementById('config-content');

  try {
    // 1. ดึง Drone ID ที่ตั้งไว้ใน .env ผ่านเซิร์ฟเวอร์
    const envRes = await fetch('/api/setup');
    const envData = await envRes.json();
    const droneId = envData.droneId;

    if (!droneId) {
      throw new Error("ไม่พบ DRONE_ID ใน .env");
    }

    // 2. ขอข้อมูล Config จาก API Server Assignment #1
    const configRes = await fetch(`/configs/${droneId}`);
    if (!configRes.ok) {
      throw new Error(`ดึงข้อมูลไม่สำเร็จ Status: ${configRes.status}`);
    }

    droneConfig = await configRes.json();

    // 3. เก็บข้อมูลไว้ใน localStorage เพื่อให้หน้า Page #2 และ Page #3 ดึงไปใช้ต่อได้ง่าย
    localStorage.setItem('droneConfig', JSON.stringify(droneConfig));

    // 4. แสดงข้อมูลบนหน้าเว็บ
    document.getElementById('val-drone-id').textContent = droneConfig.drone_id;
    document.getElementById('val-drone-name').textContent = droneConfig.drone_name;
    document.getElementById('val-light').textContent = droneConfig.light;
    document.getElementById('val-country').textContent = droneConfig.country;

    // สลับการแสดงผล
    statusMsg.style.display = 'none';
    content.style.display = 'block';

  } catch (error) {
    console.error("Error loading config:", error);
    statusMsg.textContent = "เกิดข้อผิดพลาดในการโหลดข้อมูล: " + error.message;
    statusMsg.style.color = "red";
  }
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', loadDroneConfig);