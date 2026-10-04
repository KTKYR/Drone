import 'dotenv/config';
import express from 'express'

const app = express()

async function getDroneLogs(droneId) {
  const baseURL = process.env.LOG_API
  const url = `${baseURL}?sort=-created&perPage=12&filter={drone_id=${droneId}}`
  const response = await fetch(url);
  const jsonData = await response.json();
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
  const logs = await getDroneLogs(droneId)
  res.json(logs)
})

app.post('/logs',async (req, res) => {
  // create new log item
  const data = req.body
  console.log(data)

  res.status(201).json({status:success,data})
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})