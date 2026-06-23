import { Router } from "express";
import { getMe, updateMe } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";


const router = Router();

router.use(protect);

router.get("/me", getMe);
router.put("/me", updateMe);


export default router;