const axios = require("axios");
const ipp = require("ipp");
const Printer_data = require('../getters/index.js')
require('dotenv').config();

class Printer {
  imgs = []
  img = {
    cle_auto_print:'',
    url:'',
    status:'pending,sended,printed'
  }
  printedImg = []
  imgToPrint = [
    // {"cle_auto_print":"893D36D04F314BE3AD82401E78D69B93","url":"blob_contents/GOOGLE_FORMS_ANSWERS_LOBS-810E500984DD4A8ABC687221BEA58631.jpg"},
    // {"cle_auto_print":"8DD61F2770D94E21A9FCDD6976BFEB13","url":"blob_contents/GOOGLE_FORMS_ANSWERS_LOBS-8E4AEB1CB7854E439EB63652F8ADADC2.webp"},
    // {"cle_auto_print":"AFEA3F4B95CB449DB1BFD0A717EBBF64","url":"blob_contents/GOOGLE_FORMS_ANSWERS_LOBS-9A7B5C453F4D4D81BA4FA3FDB27B7647.jpg"}
  ]
  isStarted = false

  constructor({
                baseUrl = process.env.BASE_URL,
                urlApi = process.env.URL_API,
                cleGroupe = process.env.CLE_GROUPE,
                printerUrl
              }) {
    // this.printerUrl = `http://${printerHost}:${printerPort}${printerUri}`
    this.printerUrl = printerUrl
    this.baseUrl = baseUrl
    this.urlApi = urlApi
    this.cleGroupe = cleGroupe
    this.printerData = new Printer_data(this.printerUrl)
    // this.printerData.fetch_data()
  }

  updatePrinterData() {
    this.printerData = new Printer_data(this.printerUrl)
  }

  getPrinterData() {
    // if (this.printerData == null) {
    //   this.printerData = new Printer_data(this.printerUrl)
    // }
    this.printerData.fetch_data().then(res=>{
      console.log(res)
    })
  }

  start() {
    const self = this
    self.isStarted = true
    self.routine = setInterval(()=>{
      self.get_images_to_print(()=>{
        for (let i = 0; i < self.imgs.length; i++) {
          if (self.imgs[i].status === 'pending') {
            console.log(self.imgs[i])
            self.print(self.imgs[i])
          }
        }
      })
    },5000)
  }

  pause() {
    const self = this;
    self.isStarted = false
    clearInterval(self.routine)
  }

  get_images_to_print(cb) {
    const self = this
    const url = `${self.baseUrl}${self.urlApi}?p_cle_groupe=${self.cleGroupe}`
    console.log(url)
    axios.get(url).then(response => {
      const files = response.data
      // console.log(files)
      for (let i = 0; i < files.length; i++) {
        //Si ce n'est pas dans les img à imprimer ni dans les images imprimées
        if (!self.imgs.some(img=> img.cle_auto_print ===  files[i].cle_auto_print)) {
          self.imgs.push({...files[i],status:'pending'})
        }
        // if (!self.imgToPrint.some(img => img.cle_auto_print === files[i].cle_auto_print) &&
        //     !self.printedImg.some(img => img.cle_auto_print === files[i].cle_auto_print)) {
        //   self.imgToPrint.push(files[i])
        //   // self.print(files[i])
        // }
      }
      cb()
    }).catch(err=> {
      // console.log(err)
      console.log(`${Date.now()} : Erreur lors de la connection au serveur`)
      cb()
    })
  }

  async print(image) {
    // Create a new IPP printer object
    const myImg = this.imgs.find(img => img.cle_auto_print === image.cle_auto_print)
    myImg.status = 'sended'

    const printer = ipp.Printer(this.printerUrl);


    console.log(`${this.baseUrl}${image.url}`)
    // console.log(image)
    const response = await axios.get(`${this.baseUrl}${image.url}`,  { responseType: 'arraybuffer' })
    const imageData = Buffer.from(response.data, "utf-8")

    console.log(imageData.length)
    // console.log(imageData)



    // // Create an IPP print job with the image data
    const job = {
      'operation-attributes-tag': {
        'job-name': 'My Image',
        'document-format': 'image/jpeg',
      },
      data: imageData,
    };

    // printer.execute('Get-Jobs','',(item1,item2,item3)=>{
    //   console.log('item1')
    //   console.log(item1)
    //   console.log('item2')
    //   console.log(item2)
    //   console.log('item3')
    //   console.log(item3)
    // })

    // Submit the print job to the printer
    printer.execute('Print-Job', job, (error, response) => {
      if (error) {
        console.error(`Error submitting print job: ${error}`);
        myImg.status = 'pending'
        return;
      }
      // console.log(response)
      if (response.statusCode === 'successful-ok') {
        console.log('Print job submitted successfully');
        myImg.status = 'printed'
        myImg.jobId = response.id
        // (
        //   async ()=>{
        //     const interval = setInterval(()=>{
        //
        //     },500)
        //   }
        // )
        this.set_printed(image)
      } else {
        console.error(`Error submitting print job: ${response.statusCode}`);
        myImg.status = 'pending'
      }
    });
  }

  set_printed(image) {
    //Ajoute à la liste des images imprimées
    // this.printedImg.push(image)
    //Supprime de la liste a imprimer
    // this.imgToPrint = this.imgToPrint.filter(img=>img.cle_auto_print != image.cle_auto_print)

    const url = `${this.baseUrl}${this.urlApi}?p_cle_auto_print=${image.cle_auto_print}`
    // console.log(url)
    axios.delete(url).then((res)=>{
      console.log(res.data)
    }).catch(err=> {
      console.log(err)
    })
  }
}

module.exports = Printer