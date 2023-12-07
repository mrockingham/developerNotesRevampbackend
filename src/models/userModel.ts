import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();
import UserTheme, { ITheme } from './userThemesModel';


interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    theme: Types.ObjectId | ITheme;
    provider: Boolean;
    generateVerificationToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },


    email: {
        type: String,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedPass: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
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

userSchema.methods.matchPassword = async function (enteredPassword: any) {
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },

        process.env.VERIFICATION_TOKEN,
        { expiresIn: "1d" }
    );
    return verificationToken;
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()

    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model<IUser>('user', userSchema);
export default User;