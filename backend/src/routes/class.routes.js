import { Router } from "express";
import {
  addClass,
  deleteClass,
  addSchedule,
  deleteSchedule,
  getAllClasses,
  getSchedule,
} from "../controllers/class.controller.js";

const router = Router();

router.route("/").post(addClass).get(getAllClasses);

router.route("/:classID").delete(deleteClass);


router
  .route("/:classID/schedule")
  .post(addSchedule)
  .get(getSchedule)
  .delete(deleteSchedule);

export default router;
