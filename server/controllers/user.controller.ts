require("dotenv").config();

import { NextFunction, Request, Response } from "express";

import { initClient } from "messagebird";
import messagebird, { MessageBird } from 'messagebird';

import twilio from "twilio"


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const  authToken = process.env.TWILIO_AUTH_TOKEN;

const messageBirdKey = process.env.MESSAGEBIRD_ACCESS_KEY
const messageBirdKey1 ="qdCAL3C0oTyR6mvQE54nMYlLRb2hZZD9hDDI"


const client = twilio(accountSid, authToken, {
    lazyLoading : true,
})

const messageBirdInit = initClient(messageBirdKey1)
// const messageBirdClient :MessageBird  = messagebird('messageBirdKey1');

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phone_number } = req.body;

        console.log(phone_number);

        // Send verification using MessageBird
        messageBirdInit.verify.create(phone_number, { template: 'Your verification code is %code%' }, (err, response) => {
            if (err) {
                console.error('Error sending verification:', err);
                return res.status(500).json({ success: false, message: 'Failed to send verification.' });
            }

            console.log('Verification sent:', response);
            return res.status(200).json({
                success: true,
                message: 'Verification sent.',
                response,
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred during registration.' });
    }
};

//TWILIO VERIFIFCATION
// export const registerUser = async(
//     req: Request, 
//     res: Response, 
//     next: NextFunction
// ) =>{
//       try{
//         const {phone_number} = req.body;

//         console.log(phone_number)

//             try{
//                 await client.verify.v2
//                 .services(process.env.TWILIO_SERVICE_SID!)
//                 .verifications.create({
//                     channel : "sms",
//                     // to : '+233205451517'
//                     to : phone_number,
//                 })

//                 console.log(res.statusMessage, res.status)
//                 res.status(201).json({
//                     success : true,
//                 })

//             }catch(error: any){
//                 console.error('Error details:', error.response ? error.response.data : error.message);
//                 // console.log(error)
//             }


//       }catch(error){
//         console.log(error)
//       }
// }



// import { NextFunction, Request, Response } from "express";
// import twilio from "twilio"; // Ensure you have this import
// const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);


// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const  authToken = process.env.TWILIO_AUTH_TOKEN;

// // const client = twilio(accountSid, authToken, {
// //     lazyLoading : true,
// // })

// export const registerUser = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { phone_number } = req.body;

//         console.log(phone_number);

//         // Check if TWILIO_SERVICE_SID is defined
//         const serviceSid = process.env.TWILIO_SERVICE_SID;
//         if (!serviceSid) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Twilio service SID is not configured."
//             });
//         }

//         // Send verification
//         await client.verify.v2.services(serviceSid).verifications.create({
//             channel: "sms",
//             to: phone_number,
//         });

//         res.status(201).json({
//             success: true,
//             message: "Verification SMS sent successfully."
//         });

//     } catch (error) {
//         console.error("Error details:", error); // Log the entire error object
//         const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
//         res.status(500).json({
//             success: false,
//             message: "An error occurred during registration.",
//             error: errorMessage // Safely access the message
//         });
//     }
// };