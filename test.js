const mdns = require('mdns-js')

const TIMEOUT = 500; //5 seconds

const browser = mdns.createBrowser(mdns.tcp('ipp'));


async function getPrinters() {
  const urls = []

  browser.on('ready', function () {
    browser.discover();
  });

  browser.on('update', function (data) {
    // console.log('data:', data);

    // console.log(data.addresses)
    // data.type.map(type=>console.log(type.protocol))
    //
    for (let i = 0; i < data.txt?.length; i++) {
      if (data.type.filter(type => type.name === 'ipp').length > 0) {
        if (data.txt[i].includes("rp")) {
          let adminurlValue = data.txt[i].split("=")[1];
          if (!urls.includes(`http://${data.addresses}/${adminurlValue}`)) {
            urls.push(`http://${data.addresses}/${adminurlValue}`)
          }
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, TIMEOUT));

  browser.stop();
  return urls;
}

module.exports = getPrinters
