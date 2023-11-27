import User from "../models/userModel";
import UserTheme from "../models/userThemesModel";
import ProviderUser from "../models/providerUserModel";
import { generateToken, generateVerificationToken } from "../utils/generateToken";
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

// Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(req.body)

    // Step 1 - Find user with matching email
    const user = await User.findOne({ email }).exec();
    console.log('user info', user)
    const userTheme = await UserTheme.findOne({ _id: user?.theme })

    if (!user) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    // Step 2 - Check if the password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      res.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    // Step 3 - Generate a login token and send it in the response
    const token = generateToken(user._id);


    res.status(200).send({ name: user.name, email: email, token, theme: userTheme });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
// Provider Login
export const loginProviderUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    console.log(req.body)

    // Step 1 - Find user with matching email
    const user = await ProviderUser.findOne({ email }).exec();
    const userExists = await User.findOne({ email })
    const userTheme = await UserTheme.findOne({ _id: user?.theme })

    if (userExists) {
      res.status(409)
        .send({ error: 'User already exists' });
      return;
    }

    if (!user && userExists === null) {
      res.status(412)
        .send({ error: 'User does not exist' })
      return;
    }



    // Step 3 - Generate a login token and send it in the response
    const token = generateToken(user._id);
    res.status(200).send({ name: user.name, email: email, provider: user.provider, token, theme: userTheme });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};


// Register 
export const registerUser = async (req: Request, res: Response) => {

  // console.log(req.body)

  try {
    // Check if the email is in use
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email }) && ProviderUser.findOne({ email })

    console.log('user exist', userExists)

    if (userExists) {
      res.status(409)
        .send({ error: 'User already exists' });
      // throw new Error('User already exists')
    } else {


      // Step 1 - Create and save the user
      const user = await User.create({
        name,
        email,
        password,
        theme: '656111e1def738e6ee24e694'
      })
      // Step 2 - Generate a verification token with the user's ID
      const verificationToken = user.generateVerificationToken();
      // Step 3 - Email the user a unique verification link

      const url = `http://localhost:5001/app/users/verify/${verificationToken}`
      // const url = `https://pure-citadel-43089.herokuapp.com/app/users/verify/${verificationToken}`
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
        .catch((error) => {
          console.error(error)
        }
        )


      return res.status(201).send({
        message: `Sent a verification email to ${email}`,
        verifySent: true,

      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
}
// Provider Register 
export const registerProviderUser = async (req: Request, res: Response) => {

  // console.log('register req', req.body)

  try {
    // Check if the email is in use
    const { name, email, provider } = req.body
    const userExists = await User.findOne({ email })
    const providerUserExist = await ProviderUser.findOne({ email })

    console.log('user exist', userExists)
    console.log('provider user exist', providerUserExist)

    if (userExists || providerUserExist) {
      res.status(409)
        .send({ error: 'User already exists' });
      // throw new Error('User already exists')
    } else {


      // Step 1 - Create and save the user
      const user = await ProviderUser.create({
        name,
        email,
        provider,
        theme: '656111e1def738e6ee24e694'
      })
      // Step 2 - Generate a verification token with the user's ID
      const verificationToken = user.generateVerificationToken();
      // Step 3 - Email the user a unique verification link

      const url = `http://localhost:5001/app/users/verify/${verificationToken}`
      // const url = `https://pure-citadel-43089.herokuapp.com/app/users/verify/${verificationToken}`
      const msg = {
        to: email,
        from: 'osopenworld@gmail.com', // Change to your verified sender
        subject: 'Devernote Account Verification',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`,
      }
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log('Email sent')
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   }
      //   )


      return res.status(201).send({
        message: `Sent a verification email to ${email}`,
        verifySent: true,

      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
}



export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log('the token', token)

  if (!token) {
    return res.redirect("http://localhost:3000/verifyfail");
  }

  try {
    // Step 1 -  Verify the token from the URL
    const payload = generateVerificationToken(token);

    console.log('what is the payload', payload)
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload }).exec();
    console.log("theuser", user);

    if (!user) {
      return res.redirect("http://localhost:3000/login");
    }

    // Step 3 - Update user verification status to true
    user.verified = true;
    await user.save();
    return res.redirect("http://localhost:3000/login");
  } catch (err) {
    console.log('manin fail', err);
    console.log(err)
    return res.redirect("http://localhost:3000/verifyfail");
  }
};

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
  const { token, password } = req.body;
  console.log(req.body);

  if (!token) {
    return res.status(422).send({
      message: "Not Authorized",
    });
  }

  try {
    // Step 1 -  Verify the token from the URL
    const payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET) as { _id: string };

    const user = await User.findOne({ _id: payload._id }).exec();

    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    return res.status(201).send("Password Updated");
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateOrAddTheme = async (req: Request, res: Response) => {
  const { email, provider, themeName } = req.body;
  console.log('reqbody', req.body)
  try {

    if (provider) {
      const user = await ProviderUser.findOne({ email }).exec();
      const userTheme = await UserTheme.findOne({ name: themeName })
      console.log('userTheme info', userTheme)
      if (user) {
        user.theme = userTheme;
        await user.save();
        res.status(200).json({ message: 'User theme updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      const user = await User.findOne({ email: email });
      const userTheme = await UserTheme.findOne({ name: themeName })


      console.log('userTheme info', userTheme)
      if (user) {
        user.theme = userTheme;
        await user.save();
        res.status(200).json({
          message: 'User theme updated successfully',
          name: user.name, email: email, provider: user.provider,
          theme: userTheme
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};