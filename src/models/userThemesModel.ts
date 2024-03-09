import mongoose from "mongoose";



export interface ITheme extends Document {
    name: string;
    backgroundGradient1?: string;
    backgroundGradient2?: string;
    backgroundGradient3?: string;
    backgroundSolid?: string;
    backGroundText?: string;
    foregroundText?: string;
    gradient: boolean;
    boxShadow: boolean;
    boxShadowSettings1?: string;
    boxShadowSettings2?: string;


}



const usetThemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    backgroundGradient1: {
        type: String,
        required: false,
    },

    backgroundGradient2: {
        type: String,
        required: false,
    },
    backgroundGradient3: {
        type: String,
        required: false,
    },
    backgroundSolid: {
        type: String,
        required: false,
    },
    backgroundText: {
        type: String,
        required: false,
    },
    foregroundText: {
        type: String,
        required: false,
    },
    gradient: {
        type: Boolean,
        required: true,
    },
    boxShadows: {
        type: Boolean,
        required: true,
    },
    boxShadowSettings1: {
        type: String,
        required: false,
    },
    boxShadowSettings2: {
        type: String,
        required: false,
    }
})


const UserTheme = mongoose.model<ITheme>('theme', usetThemeSchema)
export default UserTheme