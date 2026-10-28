document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('temperature-form');
  const alertBox = document.getElementById('alert-box');
  const submitBtn = document.getElementById('submit-btn');

  // ดึงข้อมูล Config ที่บันทึกไว้ใน localStorage
  const savedConfig = JSON.parse(localStorage.getItem('droneConfig'));

  // ตรวจสอบว่ามีข้อมูล Config
  if (!savedConfig || !savedConfig.drone_id) {
    showAlert("ไม่พบข้อมูล Drone Config กรุณาเปิดหน้า CONFIG ก่อน", "error");
    submitBtn.disabled = true;
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tempInput = document.getElementById('celsius').value;
    const celsiusValue = Number(tempInput);

    const logData = {
      drone_id: savedConfig.drone_id,
      drone_name: savedConfig.drone_name,
      country: savedConfig.country,
      celsius: celsiusValue
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "กำลังส่งข้อมูล...";

    try {
      const response = await fetch('/logs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(logData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert("บันทึกข้อมูล Temperature Log สำเร็จ!", "success");
        form.reset();
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      showAlert(`เกิดข้อผิดพลาด: ${error.message}`, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit data";
    }
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);
  }
});