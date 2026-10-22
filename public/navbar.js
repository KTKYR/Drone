// ==========================================
// ส่วนจัดการ Navigation Bar (แบบเรียบง่ายสำหรับแยกหน้า)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    // ถ้า href ของปุ่มตรงกับ URL ที่กำลังเปิดอยู่
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active'); // เพิ่มเส้นสีน้ำเงิน
    }
  });
});