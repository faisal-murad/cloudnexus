 
// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

const mailOptions = { 
    from: {
        name:'CLOUDNEXUS',
        address:process.env.SENDER_EMAIL, 
    }, // sender address
    to: "faisalmurad.baloch@gmail.com", // list of receivers
    subject: "Nah man", // Subject line
    text: "Camera wowo", // plain text body
    html: "<a href='www.google.com'>Hello world?</a>", // html body
}
 
export const sendMail = async(mailOptions)=>{
    
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SENDER_EMAIL, 
        pass: process.env.APP_PASSWORD, 
    },
});
    try{
        await transporter.sendMail(mailOptions)
        console.log("Email has been sent successfully");
    }
    catch(error)
    {
        console.error(error);
    }
}

sendMail(mailOptions);