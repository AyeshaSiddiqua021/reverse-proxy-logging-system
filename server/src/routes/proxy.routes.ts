import { Router } from 'express';
import {
  getAllProxyLogsController,
  postProxyLogController,
  addToWhitelistController,
  toggleLoggingStatusController,
} from '../controllers/proxy.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { proxyMiddleware } from '../middleware/proxy.middleware';

const proxyRoutes = Router();

proxyRoutes.use(authMiddleware);
proxyRoutes.post('/logs', postProxyLogController);
proxyRoutes.get('/logs', getAllProxyLogsController);
proxyRoutes.put('/whitelist', addToWhitelistController);
proxyRoutes.put('/logging', toggleLoggingStatusController);
proxyRoutes.use('/', proxyMiddleware);

export default proxyRoutes;
