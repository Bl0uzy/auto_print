const ipp = require('ipp');
const fs = require('fs');
const axios = require("axios");
// import "getters/index.js"
const Getter_printer = require('./getters/index.js')

// Replace these values with your printer's information
const printerHost = '192.168.15.71';
const printerPort = 631;
const printerUri = '/ipp/print';
const printerUrl = `http://${printerHost}:${printerPort}${printerUri}`
const baseUrl = 'https://test.tadaaam.studio'
const urlApi = baseUrl+'/pls/auto_print/api'
const images = []
const cle_groupe = 'D2B3B426FD934D9C929562C2F749AFB3'

const printer_data = new Getter_printer(printerUrl)
// printer_data.ipp_versions_supported().then((data)=>console.log(data))
get_images_to_print()
async function check_img_to_print() {
  setInterval(()=>{
    get_images_to_print()
  },1000)
}

function print(file) {
  // Create a new IPP printer object
  const printer = ipp.Printer(printerUrl);

  // Replace this with the path to your image file
  const imagePath = 'WEB_PHOTOS-48DB0D35FEA849C5BEE34B0963B33667.jpg';

  // Load the image file
  const imageData = fs.readFileSync(imagePath);

  // Create an IPP print job with the image data
  const job = {
    'operation-attributes-tag': {
      'job-name': 'My Image',
      'document-format': 'image/jpeg',
    },
    data: imageData,
  };

  // Submit the print job to the printer
  printer.execute('Print-Job', job, (error, response) => {
    if (error) {
      console.error(`Error submitting print job: ${error}`);
      return;
    }
    if (response.statusCode === 'successful-ok') {
      console.log('Print job submitted successfully');
    } else {
      console.error(`Error submitting print job: ${response.statusCode}`);
    }
  });
}

function get_images_to_print() {
  axios.get(`${urlApi}?p_cle_groupe=${cle_groupe}`).then(response => {
    const files = response.data
    console.log(files)
    for (const file in files) {
      if (!images.includes(file.cle_auto_print)) {
        images.push(file.cle_auto_print)
        console.log('print img')
        // print(baseUrl+file.url)
      }
    }
  }).catch(err=> {
    console.log(err)
  })
}