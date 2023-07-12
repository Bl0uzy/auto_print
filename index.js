const Printer = require('./printer/index.js')
const discover = require('./test.js')
const readline = require('readline');

let printer;

start()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function handleCommand(command,params) {
  switch (command) {
    case 'exit':
      rl.close();
      process.exit(0);
      break;
    case 'start':
      printer.start()
      console.log('Script is starting...');
      break;
    case 'pause':
      printer.start()
      console.log('Script is starting...');
      break;
    case 'status':
      if (printer.isStarted) {
        console.log('Script is running...');
      } else {
        console.log('Script is idle...')
      }
      break;
    case 'printedImg':
      console.log(printer.printedImg)
      break;
    case 'printerData':
      printer.getPrinterData()
      break;

    case 'printStoredImg':
      console.log('print')
      console.log(printer.printStoredImage())
      break;
    case 'test':
      console.log(process.argv)
      break;
    case 'help':
      console.log('exit : Ferme le script')
      console.log('start : Fémarre le script')
      console.log('pause : Met le script en pause')
      console.log('status : Etat du script (running, idle)')
      console.log('printedImg : Affiche les images imprimées (running, idle)')
      break;
    case 'options':
      console.log(`printerHost : ${printer.printerHost}`)
      console.log(`printerPort : ${printer.printerPort}`)
      console.log(`printerUri : ${printer.printerUri}`)
      console.log(`printerUrl : ${printer.printerUrl}`)

      console.log(`baseUrl (for api and img link) : ${printer.baseUrl}`)
      console.log(`urlApi : ${printer.urlApi}`)
      console.log(`cleGroupe : ${printer.cleGroupe}`)

      break;
    case 'setOptions':
      for (const paramsKey in params) {
        const value = params[paramsKey]
        switch (paramsKey) {
          case 'host':
            printer.printerHost = value;
            printer.printerUrl = `http://${printer.printerHost}:${printer.printerPort}${printer.printerUri}`
            printer.updatePrinterData()
            console.log(`printerHost set to : ${value}`)
            console.log(`new printerUrl : ${value}`)
            break;
          case 'port':
            printer.printerPort = value;
            printer.printerUrl = `http://${printer.printerHost}:${printer.printerPort}${printer.printerUri}`
            printer.updatePrinterData()
            console.log(`printerPort set to : ${value}`)
            console.log(`new printerUrl : ${value}`)
            break;
          case 'uri':
            printer.printerUri = value;
            printer.printerUrl = `http://${printer.printerHost}:${printer.printerPort}${printer.printerUri}`
            printer.updatePrinterData()
            console.log(`printerUri set to : ${value}`)
            console.log(`new printerUrl : ${value}`)
            break;
          case 'baseUrl':
            printer.baseUrl = value;
            console.log(`baseUrl set to : ${value}`)
            console.log(`new urlApi : $${printer.baseUrl}${printer.urlApi}?p_cle_groupe=${printer.cleGroupe}`)
            break;
          case 'cleGroupe':
            printer.cleGroupe = value;
            console.log(`cleGroupe set to : ${value}`)
            console.log(`new urlApi : $${printer.baseUrl}${printer.urlApi}?p_cle_groupe=${printer.cleGroupe}`)
            break;
          default:
            console.log('Paramètre non reconnue')
            break;
        }
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
      // console.log(process.argv)
      break;
  }
}


async function start() {
  urls = await discover()
  for (let i = 0; i < urls.length; i++) {
    console.log(`${i} : ${urls[i]}`)
  }
  let answer;
  while (isNaN(answer) || !(parseInt(answer) >= 0 && parseInt(answer) < urls.length)) {
    await new Promise(resolve => {
      rl.question(`Choisi un url [${0} - ${urls.length - 1}] : `,(data)=>{
        answer = data
        resolve()
      })
    })
  }
  // rl.close()


  printer = new Printer({printerUrl : urls[parseInt(answer)]})
  printer.start()

  console.log('Script started.');
  rl.on('line', (input) => {
    console.log('-----------------------------------')
    const commandParts = input.trim().split(' ');
    const command = commandParts[0];
    // const params = commandParts.slice(1);

    const regex = /-(\w+)\s+([^-\s]+)/g;
    const params = {};
    let match;
    while ((match = regex.exec(input)) !== null) {
      params[match[1]] = match[2];
    }

    console.log(`Params: ${JSON.stringify(params)}`);

    console.log(`Command: ${command}`);
    // console.log(`Params: ${params}`);

    handleCommand(command,params);
  });

}
