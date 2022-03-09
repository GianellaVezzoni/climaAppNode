const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/Busquedas");

const main = async () => {
  let opt;
  const busquedas = new Busquedas();
  do{
    opt = await inquirerMenu();
    switch(opt){
      case 1:
        const termino  = await leerInput('Palabra clave: ');
        const lugares = await busquedas.ciudad(termino);
        const id = await listarLugares(lugares);
        if(id === '0') continue;
        const lugarSeleccionado = lugares.find(l=> l.id === id)
        busquedas.agregarHistorial(lugarSeleccionado.nombre);
        const climaLugarSeleccionado = await busquedas.climaPorLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)
        console.clear();
        console.log('\nInformacion de la ciudad: ');
        console.log('Ciudad: ', lugarSeleccionado.nombre);
        console.log('Lat: ', lugarSeleccionado.lat);
        console.log('Long: ', lugarSeleccionado.lng);
        console.log('Temperatura: ', climaLugarSeleccionado.temp);
        console.log('Min: ', climaLugarSeleccionado.min);
        console.log('Max: ', climaLugarSeleccionado.max);
        console.log('Descripcion: ', climaLugarSeleccionado.desc)
        break;
      case 2:
        const nombresCapitalizados = busquedas.getHistorialCapitalizado();
        nombresCapitalizados.forEach((lugar, index)=> {
          const idx = `${index + 1}.`.green;
          console.log(`${idx} ${lugar}`)
        })
        break;
      case 3: 
        break;
      default: break;
    }
    if(opt !== 0)await pausa();
  }while(opt !== 0);
}

main();