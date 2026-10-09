let currentPage = 1;
let droneId = null;

document.addEventListener('DOMContentLoaded', () => {
  const statusMsg = document.getElementById('status-message');
  const tableContainer = document.getElementById('table-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // ดึงค่า Config จาก localStorage ที่เก็บไว้จาก Page #1
  const savedConfig = JSON.parse(localStorage.getItem('droneConfig'));

  if (!savedConfig || !savedConfig.drone_id) {
    statusMsg.textContent = "ไม่พบข้อมูล Drone Config กรุณาเปิด Page #1 ก่อน";
    statusMsg.style.color = "red";
    return;
  }

  droneId = savedConfig.drone_id;

  // ฟังก์ชันดึงและแสดงข้อมูล Logs
  async function fetchAndRenderLogs(page) {
    statusMsg.textContent = "กำลังโหลดข้อมูล...";
    statusMsg.style.display = "block";

    try {
      // เรียกใช้ API จาก Assignment #1 พร้อมส่ง page
      const res = await fetch(`/logs/${droneId}?page=${page}`);
      if (!res.ok) {
        throw new Error(`ดึงข้อมูลไม่สำเร็จ Status: ${res.status}`);
      }

      const logs = await res.json();
      const tbody = document.getElementById('logs-tbody');
      tbody.innerHTML = '';

      if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">ไม่มีข้อมูล Log ในหน้านี้</td></tr>';
      } else {
        // สร้างแถว <tr> ตาม 5 คอลัมน์ที่กำหนด
        logs.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.created || '-'}</td>
            <td>${item.country || '-'}</td>
            <td>${item.drone_id}</td>
            <td>${item.drone_name}</td>
            <td>${item.celsius}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      // อัปเดตสถานะปุ่มและเลขหน้า
      document.getElementById('page-info').textContent = `หน้า ${currentPage}`;
      prevBtn.disabled = (currentPage <= 1);
      // หากข้อมูลที่ได้น้อยกว่า 12 รายการ แสดงว่าเป็นหน้าสุดท้ายแล้ว
      nextBtn.disabled = (logs.length < 12);

      statusMsg.style.display = "none";
      tableContainer.style.display = "block";

    } catch (error) {
      console.error("Error loading logs:", error);
      statusMsg.textContent = "เกิดข้อผิดพลาดในการโหลด Logs: " + error.message;
      statusMsg.style.color = "red";
    }
  }

  // ผูกการทำงานปุ่ม Pagination
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndRenderLogs(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchAndRenderLogs(currentPage);
  });

  // โหลดหน้า 1 ทันทีเมื่อเปิดเข้ามา
  fetchAndRenderLogs(currentPage);
});