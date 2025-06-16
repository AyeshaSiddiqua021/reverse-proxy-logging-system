import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { createProxyLog } from '../services/proxy.service';
import { Types } from 'mongoose';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { TARGET_PROXY_REQUEST_URL } from '../constants/env';

// Extend Request type to include userId from authMiddleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

const target = TARGET_PROXY_REQUEST_URL;

export const proxyMiddleware = createProxyMiddleware<AuthenticatedRequest, Response>({
  target,
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true,
  timeout: 15000,
  proxyTimeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json',
  },
  on: {
    proxyReq: (proxyReq: ClientRequest, req: AuthenticatedRequest, res: ServerResponse) => {
      const originalUrl = req.originalUrl;
      const method = req.method;
      (req as any)._proxyData = { originalUrl, method };

      // Remove Content-Type and Content-Length for GET requests
      if (method === 'GET') {
        proxyReq.removeHeader('Content-Type');
        proxyReq.removeHeader('Content-Length');
      }

      console.log('[Proxy Request]', {
        url: originalUrl,
        method,
        userId: req.userId,
        headers: req.headers,
        proxyHeaders: proxyReq.getHeaders(),
      });
    },
    proxyRes: responseInterceptor(
      async (
        responseBuffer: Buffer,
        proxyRes: IncomingMessage,
        req: AuthenticatedRequest,
        res: Response
      ): Promise<Buffer> => {
        const { originalUrl, method } = (req as any)._proxyData || {};

        // Parse response JSON safely
        let data;
        try {
          data = JSON.parse(responseBuffer.toString('utf8'));
        } catch (e) {
          console.error('[Proxy Response Parse Error]', e);
          data = responseBuffer.toString('utf8');
        }

        // Create log
        let proxyLog;
        try {
          proxyLog = await createProxyLog({
            user: req.userId ? new Types.ObjectId(req.userId) : undefined,
            method,
            originalUrl,
            isEnabled: true,
            isWhitelisted: false,
            proxiedUrl: `${target}${originalUrl}`,
            statusCode: proxyRes.statusCode || 200,
            timestamp: new Date(),
          });
          console.log('[Proxy Log Saved]', {
            originalUrl,
            statusCode: proxyRes.statusCode,
          });
        } catch (error) {
          console.error('[Proxy Log Error]', {
            error: (error as Error).message,
            originalUrl,
            method,
            userId: req.userId,
          });
        }

        console.log('[Proxy Response]', {
          originalUrl,
          statusCode: proxyRes.statusCode,
        });

        // Return a combined response as a Buffer
        return Buffer.from(
          JSON.stringify({
            data,
            proxyLog,
          })
        );
      }
    ),
    error: (err: Error, req: AuthenticatedRequest, res: Response | Socket) => {
      console.error('[Proxy Error]', {
        error: err.message,
        code: (err as any).code,
        syscall: (err as any).syscall,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        userId: req.userId,
        headers: req.headers,
        proxyHeaders: (req as any)._proxyReq?.getHeaders?.(),
      });

      if ('status' in res) {
        res.status(500).json({
          message: 'Proxy error occurred',
          error: err.message,
          code: (err as any).code,
        });
      } else {
        console.warn('[Proxy Error] Socket encountered, closing connection');
        res.end();
      }
    },
  },
});