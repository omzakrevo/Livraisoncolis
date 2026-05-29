import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import driversRouter from "./drivers";
import ordersRouter from "./orders";
import notificationsRouter from "./notifications";
import partnersRouter from "./partners";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(driversRouter);
router.use(ordersRouter);
router.use(notificationsRouter);
router.use(partnersRouter);
router.use(adminRouter);

export default router;
