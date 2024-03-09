import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    generateVerificationToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const userSchema = new mongoose.Schema({
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