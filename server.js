import 'dotenv/config';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json());

app.use(express.static('public'));


app.get('/api/setup', (req, res) => {
  // ดึงค่า DRONE_ID มาจากไฟล์ .env
  res.json({
    droneId: process.env.DRONE_ID
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'config.html'));
});

app.get('/configs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'config.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/logs-view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'logs.html'));
});

async function createDroneLog(logData) {
  const url = process.env.LOG_API
  const LOG_API_TOKEN = process.env.LOG_API_TOKEN
  
  // check log data
  // if data complete : drone_id, drone_name, country, celsius
  // return {}
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOG_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {}
  }
}

async function getDroneLogs(droneId, page) {
  const baseURL = process.env.LOG_API
  const url = `${baseURL}?page=${page}&sort=-created&perPage=12&filter=(drone_id=${droneId})`
  const response = await fetch(url);
  const jsonData = await response.json();
  // console.log("API ตอบกลับมาว่า:", jsonData);
  const finalItems = jsonData.items.map((item)=>{
    const {drone_id, drone_name, created, country, celsius} = item
    return{drone_id, drone_name, created, country, celsius}
  })
  return finalItems
}

async function getDroneConfig(droneId) {
  const url = process.env.CONFIG_API
  const response = await fetch(url);
  const jsonData = await response.json();
  const configs = jsonData.data
  const config = configs.find((item) => item.drone_id === droneId)
  // console.log(config)
  return config || {error: "no drone match"}
}

app.get('/configs/:droneId', async (req, res) => {
  const droneId = Number(req.params.droneId);
  const droneConfig = await getDroneConfig(droneId)
  // const finalDroneConfig = {
  //   droneIdentity: droneConfig.drone_id ,
  //   name: droneConfig.drone_name,
  // }
  const {drone_id,drone_name,light,country,weight} = droneConfig
  const finalDroneConfig = {drone_id,drone_name,light,country,weight}
  res.json(finalDroneConfig)
})

app.get('/status/:droneId',async (req, res) => {
  const droneId = Number(req.params.droneId);
  const droneConfig = await getDroneConfig(droneId) // {}
  const {condition} = droneConfig
  const finalConfig = {condition}
  res.json(finalConfig)
})

app.get('/logs/:droneId',async (req, res) => {
  const droneId = Number(req.params.droneId);
  const page = req.query.page || 1;
  const logs = await getDroneLogs(droneId,page)
  res.json(logs)
})

app.post('/logs',async (req, res) => {

  try{
    // create new log item
    // const data = req.body
    const { drone_id, drone_name, country, celsius } = req.body;
    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "ข้อมูลไม่ครบถ้วน กรุณาส่ง drone_id, drone_name, country และ celsius ให้ครบ" 
      });
    }
    const logData = { drone_id, drone_name, country, celsius };
    const resultData = await createDroneLog(logData)
    console.log(resultData)
    res.status(201).json({success: true, data: resultData})
    // if(JSON.stringify(resultData) === "{}"){
    //   console.log("EQ")
    //   res.status(400).json({success: false, data: {} })
    // }else{
    //   res.status(201).json({success: true, data: resultData})
    // }
  } catch (error) {
    console.log(error)
    res.status(400).json({success: false})
  }
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})