import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProxyLog extends Document {
  method: string;
  originalUrl: string;
  proxiedUrl: string;
  statusCode: number;
  user: Types.ObjectId;
  timestamp: Date;
  duration: number;
  isEnabled: boolean;
  isWhitelisted: boolean;
}

const ProxyLogSchema = new Schema<IProxyLog>(
  {
    method: { type: String, required: true },
    originalUrl: { type: String, required: true },
    proxiedUrl: { type: String, required: true },
    statusCode: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number },
    isEnabled: { type: Boolean, default: true },
    isWhitelisted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProxyLog = mongoose.model<IProxyLog>("ProxyLog", ProxyLogSchema);


