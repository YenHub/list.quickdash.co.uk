import express from 'express';
const router = express.Router();
import { index, reset, testPayload, magicalSpam } from '../controllers/testController';

router.get('/', index);
router.get('/payload', testPayload);
router.get('/magicalSpam', magicalSpam);
router.get('/reset', reset);

export { router };
