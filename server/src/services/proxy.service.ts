import { Types } from "mongoose";
import appAssert from "../utlis/appAssert";
import { BAD_REQUEST } from "../constants/http";
import { IProxyLog, ProxyLog } from "../models/proxy.model";

export const createProxyLog = async (
  logData: Partial<IProxyLog>
): Promise<IProxyLog> => {
  appAssert(logData.user, BAD_REQUEST, "User ID is required");
  appAssert(logData.originalUrl, BAD_REQUEST, "Original URL is required");
  const existingLog = await ProxyLog.findOne({ user: logData.user })
    .sort({ timestamp: -1 })
    .select("isEnabled");

  if (existingLog && existingLog.isEnabled === false) {
    throw new Error("Proxy Log is disabled");
  }

  const log = await ProxyLog.create(logData);
  return log;
};

export const getAllProxyLogs = async (filters: {
  method?: string;
  userId?: string;
  url?: string;
  from?: Date;
  to?: Date;
}) => {
  const query: any = {};

  if (filters.method) query.method = filters.method;
  if (filters.userId) query.user = new Types.ObjectId(filters.userId);
  if (filters.url) query.originalUrl = { $regex: filters.url, $options: "i" };
  if (filters.from || filters.to) {
    query.timestamp = {};
    if (filters.from) query.timestamp.$gte = filters.from;
    if (filters.to) query.timestamp.$lte = filters.to;
  }

  return await ProxyLog.find(query)
    .populate("user", "name email")
    .sort({ timestamp: -1 });
};

export const enableProxyLog = async (
  userId: Types.ObjectId,
  enabled: boolean
): Promise<{ modifiedCount: number }> => {
  appAssert(userId, BAD_REQUEST, "User ID is required");

console.log('asds',userId);

  const result = await ProxyLog.updateMany(
    { user: userId },
    { $set: { isEnabled: enabled } }
  );

  console.log(
    `Updated ${result.modifiedCount} logs for user ${userId}, set isEnabled = ${enabled}`
  );

  return { modifiedCount: result.modifiedCount };
};

export const addToWhitelist = async (
  originalUrl: string,
  whitelisted: boolean
): Promise<{ modifiedCount: number }> => {
  appAssert(originalUrl, BAD_REQUEST, "Endpoint is required");

  const result = await ProxyLog.updateMany(
    { originalUrl },
    { $set: { isWhitelisted: whitelisted } }
  );

  return { modifiedCount: result.modifiedCount };
};
