const fs = require('fs');
const moment = require("moment");
const PDF = require("pdfkit");
const path = require("path");


// The document that will be generated



function createPDF(registrant,regNumber, demonstrator, department){
    const doc = new PDF({
        layout: "landscape",
        size: "A4",
    
    });

    doc.pipe(fs.createWriteStream(`./assets/PARTICIPANT_CERTIFICATE.pdf`))

    doc.image(path.resolve(__dirname, "../assets/images/certificate_alt_text.png"),0,0,{width:850});


    doc.font(path.resolve(__dirname, "../assets/fonts/ocr-abt.ttf")).fontSize(50).text(registrant, 40, 240,{
        align:"center"
    });
    doc.font(path.resolve(__dirname, "../assets/fonts/ocr-abt.ttf")).fontSize(20).text(regNumber, 30, 50,{
        align:"center"
    });

    doc.font(path.resolve(__dirname, "../assets/fonts/ocr-abt.ttf")).fontSize(12).text(demonstrator, 148,452,{
    
    })
    doc.font(path.resolve(__dirname, "../assets/fonts/ocr-abt.ttf")).fontSize(18).text(department, 355,323,{

    })
    doc.font(path.resolve(__dirname, "../assets/fonts/ocr-abt.ttf")).fontSize(12).text(moment().format("MMMM D,YYYY"), 525,452,{
        align:"center"
    })

    doc.end();
}


// createPDF("Pharell Williams", "12345678", "Daniel Pheobe", "Network Support")
module.exports = createPDF;