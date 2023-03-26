import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"
import express, { Request, Response } from 'express';
import sgMail from '@sendgrid/mail'

// mongodb email verification

import nodemailer from "nodemailer"

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const transporter = nodemailer.createTransport({
  "host": "smtp.gmail.com",
  "port": 587,
  secure: false,
  auth: {

    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,

  },
  tls: {
    rejectUnauthorized: false
  }
});


export const getUserProfile = async (req: Request, res: Response) => {
  console.log(req.body)
  const id = req.body
  const user = await User.findById(id)
  console.log(user)
  if (user) {
    res.status(200).json(user._id)

  } else {
    res.status(401)
    throw new Error('User not found')
  }

}

// Register 
export const registerUser = async (req: Request, res: Response) => {

  // console.log(req.body)

  try {
    // Check if the email is in use
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })

    console.log('user exist', userExists)

    if (userExists) {
      res.status(404)
        .send({ error: 'User already exists' });
      // throw new Error('User already exists')
    } else {


      // Step 1 - Create and save the user
      const user = await User.create({
        name,
        email,
        password
      })
      // Step 2 - Generate a verification token with the user's ID
      const verificationToken = user.schema.methods.generateVerificationToken;
      // Step 3 - Email the user a unique verification link

      const url = `https://pure-citadel-43089.herokuapp.com/app/users/verify/${verificationToken}`
      const msg = {
        to: email,
        from: 'osopenworld@gmail.com', // Change to your verified sender
        subject: 'Devernote Account Verification',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
      // transporter.sendMail({
      //   to: email,
      //   subject: 'Verify Account',
      //   html: `Click <a href = '${url}'>here</a> to confirm your email.`
      // })
      return res.status(201).send({
        message: `Sent a verification email to ${email}`
      });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
}


export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params
  console.log(token)

  // Check we have a token 
  if (!token) {
    return res.status(422).send({
      message: "Missing Token"
    });
  }

  // Step 1 -  Verify the token from the URL
  let payload = jwt.verify(
    token,
    process.env.USER_VERIFICATION_TOKEN_SECRET
  )
  try {
    payload
  } catch (err) {
    return res.status(500).send("invalid token");
  }

  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload }).exec();
    console.log("theuser", user)
    if (!user) {
      return res.render("noUser", { title: "DeverNote" })
    }
    // Step 3 - Update user verification status to true
    user.verified = true;
    await user.save();
    return res.render("verified", { title: "DeverNote" })

  } catch (err) {
    return res.status(500).send(err);
  }
}

// Forgot Password

export const forgotPasswordLink = async (req: Request, res: Response) => {
  try {
    let { email } = req.body
    console.log(email)
    // if(email === undefined || null || ""){

    //   email = "blank"

    //     // throw new Error('email address not found')
    // }

    console.log("the body", email)
    const userExists = await User.findOne({ email: email })
    console.log(userExists)

    if (!userExists) {
      res.status(401).send("email doesn't exist")

    }
    if (userExists) {

      const verificationToken = userExists.schema.methods.generateVerificationToken

      const url = `https://developer-notes-next-client.vercel.app/forgotpassword/${verificationToken}`
      transporter.sendMail({
        to: email,
        subject: 'Reset Password',
        html: `Click <a href = '${url}'>here</a> to reset your password.`
      })
      return res.status(200).send({
        message: `Sent a verification email to ${email}`
      });
    }


    // Generate verification token





  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export const resetPassword = async (req: Request, res: Response) => {

  const { token, password } = req.body
  console.log(req.body)

  if (!token) {
    return res.status(422).send({
      message: "Not Authorized"
    });
  }

  // Step 1 -  Verify the token from the URL
  let payload = jwt.verify(
    token,
    process.env.USER_VERIFICATION_TOKEN_SECRET
  );
  try {
    payload
  } catch (err) {
    return res.status(500).send("Authorization Failed");
  }

  try {

    const user = await User.findOne({ _id: payload }).exec()

    if (!user) {
      res.status(400)
      throw new Error('User already exists')
    }

    user.password = password
    await user.save()

    return res.status(201).send("Password Updated")
  } catch (err) {
    return res.status(500).send(err);
  }


}
