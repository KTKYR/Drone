# 🚁 Drone Telemetry Dashboard

**Web Application for Drone Monitoring and Data Logging**

โปรเจกต์นี้เป็นการพัฒนาระบบ Web Application สำหรับตรวจสอบและจัดการข้อมูลสถานะของโดรน โดยออกแบบให้มีหน้าจอผู้ใช้งานที่ทันสมัย รองรับการแสดงผลทุกขนาดหน้าจอ (Responsive Design) และมีการจัดการความปลอดภัยของข้อมูลผ่านสถาปัตยกรรมแบบ Client-Server

🔗 **Live Demo:** [Drone Dashboard](https://drone-eight-mu.vercel.app)



## 🏗️ Architecture Overview

ระบบถูกออกแบบโดยแยกส่วนการทำงานระหว่าง **Frontend** และ **Backend** อย่างชัดเจน เพื่อประสิทธิภาพและความปลอดภัยสูงสุด:

1. **Frontend (UI/UX):** พัฒนาด้วย HTML, CSS และ JavaScript มีการใช้ CSS Flexbox, CSS Grid และ `@media query` ร่วมกับแท็ก Viewport เพื่อให้หน้าต่างเว็บไซต์ (Card) และตารางข้อมูลสามารถปรับขนาดและเลื่อน (Scroll) ได้อย่างสวยงามบนสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์
2. **Backend (Proxy Server):** พัฒนาด้วย Node.js และ Express.js ทำหน้าที่เป็นตัวกลางในการสื่อสารกับ API แทนการให้ Frontend เรียก API โดยตรง ระบบจะส่ง Request มาที่ Backend เพื่อให้ Backend แนบ `API_TOKEN` และตั้งค่า Headers ก่อนส่งต่อไปยังเซิร์ฟเวอร์หลัก 
3. **Security:** TOKEN และ URL ของ API จะถูกเก็บซ่อนไว้อย่างปลอดภัยในไฟล์ `.env` (Environment Variables) ซึ่งจะไม่ถูกเปิดเผยสู่สาธารณะ



### 🛡️ การทำงานของ Backend (`server.js`)

ไฟล์ `server.js` เป็นส่วนสำคัญในการจัดการระบบหลังบ้าน (Node.js/Express) โดยมีหน้าที่หลักดังนี้:
* **Static File Serving:** จัดการ Routing เพื่อแสดงผลไฟล์ Frontend (HTML, CSS, JavaScript) ที่อยู่ในโฟลเดอร์ `public` ให้ผู้ใช้งาน
* **Secure API Proxy:** ทำหน้าที่เป็นตัวกลาง (Gateway) รับคำขอจากหน้าเว็บไซต์ นำมารวมกับ `LOG_API_TOKEN` ที่ดึงมาจาก Environment Variables แล้วจึงส่ง Request ไปหา API หลัก วิธีนี้ช่วยป้องกันไม่ให้ Token สำคัญรั่วไหลไปสู่ฝั่ง Client
* **Data Validation & Routing:** จัดการ Endpoint ต่างๆ (เช่น `/configs/:droneId`, `/logs`) พร้อมตรวจสอบความครบถ้วนของข้อมูลก่อนบันทึก และคัดกรองเฉพาะ Object ที่จำเป็นส่งกลับไปให้ Frontend เพื่อลดขนาด Bandwidth
* **Serverless Optimization:** มีการใช้ `path.join(__dirname, ...)` เพื่ออ้างอิงตำแหน่งโฟลเดอร์อย่างแม่นยำ และปิดท้ายด้วย `export default app` เพื่อให้ Code Architecture รองรับการ Deploy เป็น Serverless Function บน Vercel ได้อย่างสมบูรณ์แบบ



## ⚙️ การทำงานหลักของระบบ

ระบบประกอบด้วย 3 ฟังก์ชันหลักที่ทำงานเชื่อมโยงกัน ดังนี้:

### 1. Drone Config
เมื่อผู้ใช้เข้าสู่ระบบ หน้าต่างนี้จะทำการขอข้อมูลจาก Backend (`/configs/:droneId`) เพื่อดึงข้อมูลเฉพาะของโดรนหมายเลข `DRONE_ID` มาแสดงผล เช่น drone_id, drone_name, light, และ country

### 2. Temperature Log Form
หน้าต่างสำหรับจำลองการส่งข้อมูล Temperature กลับไป เมื่อผู้ใช้กดส่งข้อมูล:
* Frontend จะทำการตรวจสอบความครบถ้วนของข้อมูล
* ข้อมูลจะถูกแปลงให้อยู่ในรูปแบบ JSON และส่งผ่าน Method `POST` ไปยัง Backend
* หากบันทึกสำเร็จ ระบบจะแสดงแถบแจ้งเตือนบนหน้าจอ และหายไปอัตโนมัติเพื่อการใช้งานที่ราบรื่น

### 3. View Logs
หน้าต่างนี้ทำหน้าที่แสดงข้อมูลอุณหภูมิที่โดรนเคยส่งมาทั้งหมดในรูปแบบตาราง โดยมีกลไกการทำงานที่สำคัญคือ:
* **Pagination:** ระบบสามารถแบ่งหน้าข้อมูลและดึงข้อมูลทีละชุด (ชุดละ 12 รายการ) เพื่อไม่ให้โหลดข้อมูลหนักเกินไป
* **Timezone Conversion:** ข้อมูลเวลาที่ได้รับจาก API ซึ่งเป็นมาตรฐานสากล (UTC) จะถูกสคริปต์ของ Frontend แปลงให้เป็นรูปแบบเวลาของประเทศไทยโดยอัตโนมัติ เพื่อให้ผู้ดูแลระบบสามารถอ่านและวิเคราะห์ข้อมูลได้ง่ายขึ้น



## 🚀 Deployment

โปรเจกต์นี้ถูกปรับแต่งให้รองรับการทำงานแบบ **Serverless Functions** และนำไปติดตั้ง (Deploy) บนแพลตฟอร์ม **Vercel** 
* ไฟล์ `vercel.json` ถูกตั้งค่าระบบ Rewrites ให้สามารถจัดเสิร์ฟไฟล์ Static (CSS/JS) ในโฟลเดอร์ `public` ควบคู่ไปกับการรัน Express Server ได้อย่างสมบูรณ์แบบ
* ค่า Environment Variables (`CONFIG_API`, `LOG_API`, `LOG_API_TOKEN`, `DRONE_ID`) ถูกตั้งค่าไว้บน Vercel Dashboard อย่างปลอดภัย