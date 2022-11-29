import { Router } from 'express';

const empty = new Buffer([5, 0, 0, 0, 0]);
const router = Router();

router.get('/debug', (req, res) => {
  console.log('debug');
  return res.json({
    isElevated: false,
  });
});

export default {
  route: '/stub',
  router,
  orderWeight: 100,
};
