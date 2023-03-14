import { Request, Response } from 'express';
import User from "../models/userModel";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"


export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        name,
        email,
        password,
      });
  
    //   const verificationToken: string = user.generateVerificationToken();
  
    //   const url: string = `https://pure-citadel-43089.herokuapp.com/app/users/verify/${verificationToken}`;
  
    //   await transporter.sendMail({
    //     to: email,
    //     subject: 'Verify Account',
    //     html: `Click <a href='${url}'>here</a> to confirm your email.`,
    //   });
  
      return res.status(201).json({ message: ` ${user.name} and email, ${email} has been added` });
    //   return res.status(201).json({ message: `Sent a verification email to ${email}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const getUser = async (req: Request, res: Response)=>{
   
    console.log(req.body)
    const id = req.body
   const user = await User.find({name:'mike'})
console.log(user)
    if(user){
        res.status(200).json(user)

    } else {
        res.status(401)
        throw new Error('User not found')
    }
  }
//        try{
//         // Step 2 - Find user with matching ID
//         const user = await User.findOne({ _id: payload.ID }).exec();
//         console.log("theuser",user)
//         if (!user) {
//            return  res.render("noUser", {title: "DeverNote"})
//         }
//         // Step 3 - Update user verification status to true
//         user.verified = true;
//         await user.save();
//         return res.render("verified", {title: "DeverNote"})
    
//      } catch (err) {
//         return res.status(500).send(err);
//      }
// }
