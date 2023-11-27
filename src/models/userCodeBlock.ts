import mongoose, { Schema, Document, Types } from 'mongoose';

interface IUserCodeBlock extends Document {
  title: string;
  creator: string;
  provider: boolean;
  category: string;
  subCategory: string;
  html: string;
  css: string;
  javascript: string;
  note: string;
  tags: [string];
  usefulCount: number;
}

const userCodeBlockSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true
    },
    provider: {
      type: Boolean,
      required: true
    },
    category: {
      type: String,
      required: false,
    },
    subCategory: {
      type: String,
      required: false,
    },
    html: {
      type: String,
      required: false,
    },
    css: {
      type: String,
      required: false,
    },
    javascript: {
      type: String,
      required: false,
    },

    note: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    useFullCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  {
    timestamps: true,
  })

const UserCodeBlock =
  mongoose.model<IUserCodeBlock>('userCodeBlock', userCodeBlockSchema);
export default UserCodeBlock;
