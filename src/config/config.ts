import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// const MONGODB_URI = 'mongodb+srv://mikeydes:nDXwwShJoGazqd5f@cluster0.ogcbsi7.mongodb.net/?retryWrites=true&w=majority'
const MONGODB_URI = process.env.MONGO_URI



interface ExtendedConnectOptions extends ConnectOptions {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;

}
const connectDB = async (): Promise<void> => {

    console.log('MONGODB_URI', MONGODB_URI)
    try {
        const options: ExtendedConnectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        };
        await mongoose.connect(MONGODB_URI, options);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;