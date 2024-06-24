import { Router } from 'express';
import channelRoutes from './channels';
import boardRoutes from './boards';

const router = Router();

router.use(channelRoutes);
router.use('/boards', boardRoutes);

export default router;
