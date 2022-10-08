const sgMail = require("@sendgrid/mail");

const {EMAILF,SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);
/**
 * ### Description
 * This function gets information passed in an object then sends an email using the send grid api to the recipient of the data passed.

 */
exports.sendMail = async (data = {recipient,sender, subject, text:"Testing", html:"HTML"})=>{
    let mail;
    const msg = {
        to: data.recipient, // Change to your recipient
        from: data.sender ?? EMAILF, // Change to your verified sender
        subject: data.subject ?? "API WORKING",
        text: data.text,
        html: data.html ?? "undefined",
      }
  try{  
    console.log(msg)
    mail = await sgMail.send(msg);
  }catch(err){
    return Promise.reject(new Error("Mailing Error" + JSON.stringify(err)));
  }
}
