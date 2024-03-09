import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();
import UserTheme, { ITheme } from './userThemesModel';

interface IProviderUser extends Document {
    name: string;
    email: string;
    generateVerificationToken(): string;
    verified: boolean;
    theme: Types.ObjectId | ITheme;
    roles: number;
    provider: boolean;

}

const providerUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },


    email: {
        type: String,
        required: true,
        unique: true,
    },
    roles: {
        type: Number,
        required: false,
    },
    provider: {
        type: Boolean,
        required: true,
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'theme', // Reference to the UserTheme model
    },

},
    {
        timestamps: true,
    })


providerUserSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },

        process.env.VERIFICATION_TOKEN,
        { expiresIn: "1d" }
    );
    return verificationToken;
};



const ProviderUser = mongoose.model<IProviderUser>('providerUser', providerUserSchema);
export default ProviderUser;