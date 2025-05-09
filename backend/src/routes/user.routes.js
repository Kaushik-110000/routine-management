import { Router } from "express";

import {
  registerUser,
  loginUser,
  logOutUser,
  getAccessToken,
  getCurrentUser,
  checkRefreshToken,
  getUser,
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-tokens").post(getAccessToken);
router.route("/current/current-user").get(verifyJWT, getCurrentUser);
router.route("/check-refresh").get(checkRefreshToken);
router.route("/:userName").get(getUser);
export default router;