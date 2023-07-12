const ipp = require("ipp");

class Printer_data {
  constructor(url) {
    this.url = url
    this.data = this.fetch_data()
  }
  fetch_data() {
    const self = this
    const data = ipp.serialize({
      "operation": "Get-Printer-Attributes",
      "operation-attributes-tag": {
        "attributes-charset": "utf-8",
        "attributes-natural-language": "fr",
        "printer-uri": this.url
      }
    })
    return new Promise((resolve, reject) => {
      ipp.request(this.url, data, function (err, res) {
        if (err) {
          reject("Failed to fetch data");
        }
        self.data = res
        resolve(res)
      })
    })
  }
  async ipp_versions_supported() {
    await this.data
    return this.data['printer-attributes-tag']['ipp-versions-supported']
  }
  async document_format_supported() {
    await this.data
    return this.data['printer-attributes-tag']['document-format-supported']
  }
  async operations_supported() {
    await this.data
    return this.data['printer-attributes-tag']['operations-supported']
  }
}

module.exports = Printer_data

// function get_infos(cb) {
//   const uri = `http://${printerHost}:${printerPort}${printerUri}`
//   var data = ipp.serialize({
//     "operation":"Get-Printer-Attributes",
//     "operation-attributes-tag": {
//       "attributes-charset": "utf-8",
//       "attributes-natural-language": "fr",
//       "printer-uri": uri
//     }
//   });
//
//   ipp.request(uri, data, function (err, res) {
//     if (err) {
//       return console.log(err);
//     }
//     const json = JSON.stringify(res, null, 2)
//     // console.log(json);
//     if (typeof cb === 'function') {
//       cb(res)
//     }
//     // const ret =
//     // return await JSON.stringify(res, null, 2)
//   })
// }
//
// function get_ipp_versions_supported() {
//   get_infos((data)=>{
//     console.log(data['printer-attributes-tag']['ipp-versions-supported'])
//   })
// }
// function get_document_format_supported() {
//   get_infos((data)=>{
//     console.log(data['printer-attributes-tag']['document-format-supported'])
//   })
// }
// function get_operations_supported() {
//   get_infos((data)=>{
//     console.log(data['printer-attributes-tag']['operations-supported'])
//   })
// }