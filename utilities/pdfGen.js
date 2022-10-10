const fs = require('fs');
const moment = require("moment");
const PDF = require("pdfkit");
const path = require("path");


// The document that will be generated



function createPDF(registrant, demonstrator){
    const doc = new PDF({
        layout: "landscape",
        size: "A4",
    
    });
    doc.pipe(fs.createWriteStream(`./assets/PARTICIPANT_CERTIFICATE.pdf`))

    doc.image(path.resolve(__dirname, "../assets/images/certificate_with_text.png"),0,0,{width:850});

    doc.fontSize(60).text(registrant, 30, 250,{
        align:"center"
    });

    doc.fontSize(14).text(demonstrator, -380,452,{
        align:"center"
    })
    doc.fontSize(14).text(moment().format("MMMM D, YYYY"), 500,453,{
        align:"center"
    })

    doc.end();
}


module.exports = createPDF;