//Required package
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

// Read HTML Template

async function GenerateCertificatePDF(data){
    
    const fileLocation = path.resolve(__dirname, "../templates/certificate.html");
    
    let html = fs.readFileSync(fileLocation, "utf8");
    let date = formatDate()
    const  options = {
        format: "letterA3",
        orientation: "landscape",
        border: "10mm",
        // setting phantomjs path;
        phantomPath: path.resolve(
            process.cwd(),
            "node_modules/phantomjs-prebuilt/bin/phantomjs"
          )
    
    };
    const document = {
        html: html,
        data: {
          name: data.user,
          date: date,
          department:data.department,
        },
        path: "./Participation_Certificate.pdf",
        type: "",
      };

    try{

        let pdfDocument = await pdf.create(document, options);
        let attachment = fs.readFileSync(pdfDocument.filename).toString("base64");
        return attachment
    }catch(error){
        return Promise.reject(error);
    }
    


}

//Deletes the file that is passed in as a parameter;
function deleteGeneratedPDF(filename){
    const root = path.resolve(__dirname, "../");
    fs.rmSync(root+"/"+filename);
}

function formatDate(){
    // day full_Month year
    date = new Date().toLocaleString('default', { month: 'long', day:'numeric', year:'numeric' });
    let dateArr = date.split(' ');
    dateArr
    return correctFormat = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
}



module.exports = { 
    GenerateCertificatePDF,
    deleteGeneratedPDF
}

  