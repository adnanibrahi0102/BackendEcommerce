import express from 'express';
import { registerController, loginController, testController, getOrdersController, getAllOrdersController, changeOrderStatusController } from '../controllers/authController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/test', requireSignIn, isAdmin, testController);

router.get('/userAuth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/adminAuth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//orders
router.get('/orders', requireSignIn,getOrdersController)

router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)
//update order status
router.put('/change-order-status/:orderId', requireSignIn,isAdmin,changeOrderStatusController)

export default router;
