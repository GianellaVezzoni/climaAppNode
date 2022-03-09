const fs = require('fs');
const axios = require("axios");
require('dotenv').config();

class Busquedas {
  historial = ['Tegucigalpa', 'Madrid', 'San Jose'];
  dbPath = './db/database.json';
  constructor(){
    this.leerDB();
  }

  async ciudad(lugar = ''){
    try{
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: {
          'access_token': process.env.MAPBOX_KEY,
          'limit': 5,
          'language': 'es'
        }
      })
      const response = await instance.get();
      return response.data.features.map(lugar => (
        {id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]}
      ));
    }catch(err){
      return[];
    }
  }

  async climaPorLugar(lat, long) {
    try{
      const instance = await axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          'lat': lat,
          'lon': long,
          'appid': process.env.WEATHER_KEY,
          'units': 'metric',
          'lang': 'es'
        }
      })
      const response = await instance.get();
      const {weather, main} = response.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }
    }catch(err){
      console.error(err)
    }
  }

  agregarHistorial(lugar=''){
    if(this.historial.includes(lugar.toLocaleLowerCase())){
      return;
    }

    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB(){
    const payload = {
      historial: this.historial
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  leerDB(){
    if(!fs.existsSync(this.dbPath))return;
    const info = fs.readFileSync( this.dbPath);
    const data = JSON.parse(info);
    this.historial = data.historial;
  }

  getHistorialCapitalizado(){
    return this.historial.map((lugar)=>{
      let palabras = lugar.split(' ');
      palabras = palabras.map(p=> p[0].toUpperCase() + p.substring(1));
      return palabras.join(' ');
    })
  }
} 

module.exports = Busquedas;