const Printer = require('./printer/index.js')
const discover = require('./test.js')
const readline = require('readline');
const { exec } = require('child_process');
const i_view_config = require('./write_i_view_config.js')

let printer;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

start()

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
  // urls = await discover()
  // for (let i = 0; i < urls.length; i++) {
  //   console.log(`${i} : ${urls[i]}`)
  // }
  // let answer;
  // while (isNaN(answer) || !(parseInt(answer) >= 0 && parseInt(answer) < urls.length)) {
  //   await new Promise(resolve => {
  //     rl.question(`Choisi un url [${0} - ${urls.length - 1}] : `,(data)=>{
  //       answer = data
  //       resolve()
  //     })
  //   })
  // }
  // // rl.close()
  //
  //
  // printer = new Printer({printerUrl : urls[parseInt(answer)]})
  //////////////////////////////////////////////////////////////////////
  let printers = [];
  await new Promise((resolve)=>{
    exec('wmic printer list brief', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        resolve()
        return;
      }
      // list of printers with brief details
      console.log(stdout);
      // the *entire* stdout and stderr (buffered)
      stdout = stdout.split("  ");
      j = 0;
      stdout = stdout.filter(item => item);
      for (i = 0; i < stdout.length; i++) {
        if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
          printers[j] = stdout[i + 1].trim();
          console.log(`${j} : ${printers[j]}`);
          j++;
        }
      }
      resolve()
    });
  })

  let printerName;
  let printerFormat;

  let printerAnswer;
  while (isNaN(printerAnswer) || !(parseInt(printerAnswer) >= 0 && parseInt(printerAnswer) < printers.length)) {
    await new Promise(resolve => {
      rl.question(`Choisi une imprimante [${0} - ${printers.length - 1}] : `, (data) => {
        printerAnswer = data
        resolve()
      })
    })
  }
  printerName = printers[printerAnswer]
  console.log(`Imprimante ${printerName} choisi`)
  //
  // let formatAnswer;
  // const formats = ['(6x9)','(8x6)','(6x6)'];
  // while (isNaN(formatAnswer) || !(parseInt(formatAnswer) >= 0 && parseInt(formatAnswer) < formats.length)) {
  //   for (let i = 0; i < formats.length; i++) {
  //     console.log(`${i} : ${formats[i]}`);
  //   }
  //   await new Promise(resolve => {
  //     rl.question(`Choisi un format [0 - ${formats.length - 1}] : `, (data) => {
  //       formatAnswer = data
  //       resolve()
  //     })
  //   })
  // }
  // printerFormat = formats[formatAnswer]
  // console.log(`Format ${printerFormat} choisi`)

  exec(`"${process.env.IRFANVIEW_PATH}/i_view64.exe" WEB_PHOTOS-1173363E1E934782A85C6CCA873789A2.jpg /ini=.`, (err, stdout, stderr) => {})

  await i_view_config(printerName,printerFormat)

  // return;

  printer = new Printer({})
  // printer.start()

  console.log('Écrit "start" pour commencer')

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

    handleCommand(command, params);
  });

}
