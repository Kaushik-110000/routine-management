import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Class as ClassModel } from "../models/class.model.js";


const addClass = asyncHandler(async (req, res) => {
  const { lectureHall } = req.body;
  if (!lectureHall) {
    throw new ApiError(400, "`lectureHall` is required");
  }

  const exists = await ClassModel.findOne({ lectureHall });
  if (exists) {
    throw new ApiError(
      409,
      `Class with lectureHall '${lectureHall}' already exists.`
    );
  }

  const newClass = await ClassModel.create({ lectureHall });

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Class created successfully", {
        classID: newClass._id,
      })
    );
});

const deleteClass = asyncHandler(async (req, res) => {
  const { classID } = req.params;
  const deleted = await ClassModel.findByIdAndDelete(classID);
  if (!deleted) {
    throw new ApiError(404, `Class with ID '${classID}' not found`);
  }
  return res.json(
    new ApiResponse(200, "Class deleted successfully", { classID })
  );
});

const addSchedule = asyncHandler(async (req, res) => {
  const { classID } = req.params;
  const { day, startTime, endTime, userName } = req.body;

  if (!day || !startTime || !endTime || !userName) {
    throw new ApiError(
      400,
      "`day`, `startTime`, `endTime`, and `userName` are all required"
    );
  }

  const validDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, `\`${day}\` is not a valid day`);
  }

  const classDoc = await ClassModel.findById(classID);
  if (!classDoc) {
    throw new ApiError(404, `Class with ID '${classID}' not found`);
  }

  classDoc.routine[day.toLowerCase()].push({ startTime, endTime, userName });
  await classDoc.save();

  return res.status(201).json(
    new ApiResponse(201, "Schedule added", {
      classID,
      day: day.toLowerCase(),
      schedule: classDoc.routine[day.toLowerCase()],
    })
  );
});


const deleteSchedule = asyncHandler(async (req, res) => {
  const { classID } = req.params;
  const { day, slotIndex } = req.query;

  if (!day || slotIndex === undefined) {
    throw new ApiError(400, "`day` and `slotIndex` query params are required");
  }

  const validDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, `\`${day}\` is not a valid day`);
  }

  const idx = parseInt(slotIndex, 10);
  if (isNaN(idx)) {
    throw new ApiError(400, "`slotIndex` must be a number");
  }

  const classDoc = await ClassModel.findById(classID);
  if (!classDoc) {
    throw new ApiError(404, `Class with ID '${classID}' not found`);
  }

  const dayArray = classDoc.routine[day.toLowerCase()];
  if (idx < 0 || idx >= dayArray.length) {
    throw new ApiError(400, `No slot at index ${idx} for ${day}`);
  }

  const removed = dayArray.splice(idx, 1);
  await classDoc.save();

  return res.json(
    new ApiResponse(200, "Schedule slot removed", {
      classID,
      day: day.toLowerCase(),
      removedSlot: removed[0],
      schedule: dayArray,
    })
  );
});

const getAllClasses = asyncHandler(async (_req, res) => {
  const classes = await ClassModel.find().select("lectureHall routine");
  return res.json(new ApiResponse(200, "List of classes", classes));
});

const getSchedule = asyncHandler(async (req, res) => {
  const { classID } = req.params;
  const { day } = req.query;

  if (!day) {
    throw new ApiError(400, "`day` query param is required");
  }

  const validDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, `\`${day}\` is not a valid day`);
  }

  const classDoc = await ClassModel.findById(classID);
  if (!classDoc) {
    throw new ApiError(404, `Class with ID '${classID}' not found`);
  }

  const schedule = classDoc.routine[day.toLowerCase()];
  return res.json(
    new ApiResponse(200, `Schedule for ${day}`, {
      classID,
      day: day.toLowerCase(),
      schedule,
    })
  );
});


export {
  addClass,
  deleteClass,
  addSchedule,
  deleteSchedule,
  getAllClasses,
  getSchedule,
};
