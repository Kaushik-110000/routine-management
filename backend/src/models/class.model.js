import mongoose, { Schema } from "mongoose";
// Define the subdocument schema for each time slot
const slotSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { _id: false }
);

// Define the schema for the weekly routine
const routineSchema = new Schema(
  {
    sunday: { type: [slotSchema], default: [] },
    monday: { type: [slotSchema], default: [] },
    tuesday: { type: [slotSchema], default: [] },
    wednesday: { type: [slotSchema], default: [] },
    thursday: { type: [slotSchema], default: [] },
    friday: { type: [slotSchema], default: [] },
    saturday: { type: [slotSchema], default: [] },
  },
  { _id: false }
);

// Main class schema

const classSchema = new Schema(
  {
    lectureHall: {
      type: String,
      required: true,
      unique: true,
    },
    routine: {
      type: routineSchema,
      required: true,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);
