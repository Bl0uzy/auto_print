const fs = require('fs');

async function writeFile(printerName,printerFormat) {
  const contenuDuFichier = `
[Print]
AlwaysDefPrinter=0
AutoRotate=1
Option=1
Left=0.00
Top=0.00
Inches=0
Borderless=0
CheckOverflow=0
FitFillPaper=0
ScaleX=1.00
ScaleY=1.00
Centered=0
CenteredY=0
Copies=1
Head=0
HeadTxt=
Collate=1
Foot=0
FootTxt=
FontParam=-13|0|0|0|400|0|0|0|0|1|2|4|49|
Font=Courier New
Printer=${printerName}
Orient=2
Size=127
Src=15
Color=2
Duplex=1
SizeTxt=${printerFormat}`;

  await new Promise((resolve, reject)=>{
    fs.writeFile('i_view64_2.ini', contenuDuFichier, function (erreur) {
      if (erreur) {
        reject()
        throw erreur
      }
      console.log('Le fichier a été écrit avec succès');
      resolve()
    });
  })

}

module.exports = writeFile
