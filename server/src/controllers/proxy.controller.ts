import { Request, Response } from "express";
import { OK, CREATED } from "../constants/http";
import catchErrors from "../utlis/catchErrors";
import {
  createProxyLog,
  getAllProxyLogs,
  addToWhitelist,
  enableProxyLog,
} from "../services/proxy.service";


export const getAllProxyLogsController = catchErrors(async (req: Request, res: Response) => {
  const { method, userId, url, from, to } = req.query;

  const logs = await getAllProxyLogs({
    method: method as string,
    userId: userId as string,
    url: url as string,
    from: from ? new Date(from as string) : undefined,
    to: to ? new Date(to as string) : undefined,
  });

  res.status(OK).json({ message: "Proxy logs fetched", logs });
});


export const postProxyLogController = catchErrors(async (req: Request, res: Response) => {
  const log = await createProxyLog(req.body);
  if (!log) {
    return res.status(OK).json({ message: "Request skipped: endpoint is whitelisted" });
  }
  res.status(CREATED).json({ message: "Log created", log });
});


export const toggleLoggingStatusController = catchErrors(async (req: Request, res: Response) => {
  const userId = (req as any).userId; 
  const { enabled } = req.body;
  const result = await enableProxyLog(userId, enabled);

  res.status(OK).json({
    message: `Logging ${enabled ? "enabled" : "disabled"} for user`,
    modifiedCount: result.modifiedCount,
  });
});
export const addToWhitelistController = catchErrors(async (req: Request, res: Response) => {
  const { endpoint, whitelisted } = req.body;

  const result = await addToWhitelist(endpoint, whitelisted);
  res.status(OK).json({
    message: `Endpoint "${endpoint}" whitelisted`,
    modifiedCount: result.modifiedCount,
  });
});
