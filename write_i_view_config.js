const fs = require('fs');

async function writeFile(printerName,printerFormat) {
  const contenuDuFichier = `; UNICODE FILE - edit with care ;-)

[Language]
DLL=ENGLISH
Lang=English
[Toolbar]
Skin=gnome-colors-wise_32.png
Size=32
[WinPosition]
xKoord=-2560
yKoord=0
Width=1923
Height=1400
Maximized=0
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
SizeTxt=${printerFormat}
[RecentFiles]
File0=
File1=
File2=
File3=
File4=
File5=
File6=
File7=
File8=
File9=
File10=
File11=
File12=
File13=
File14=`;

  await new Promise((resolve, reject)=>{
    fs.writeFile('i_view64_2.ini', contenuDuFichier,{encoding:'UTF16LE'}, function (erreur) {
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
