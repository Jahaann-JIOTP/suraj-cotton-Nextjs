import mongoose, { Document, Schema } from "mongoose";

// export type StatusType = "Verified" | "Not Verified" | "Not Sure" | "Not Used";

export const ALLOWED_STATUSES = [
  "Verified",
  "Not Verified",
  "Not Sure",
  "Not Used",
];


const ParameterSchema = new Schema(
  {
    paramName: { type: String, required: true },
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      default: "Not Verified",
      required: true,
    },
  },
  { _id: false }
);

const MeterSchema = new Schema(
  {
    unique_key: { type: String, required: true, index: true, unique: true },
    name: { type: String },
    location: { type: String },
    parameters: { type: [ParameterSchema], default: [] },
    comment: { type: String, default: "" },
  },
  { timestamps: true, collection: "meters" }
);

const Meter =
  (mongoose.models.Meter) ||
  mongoose.model("Meter", MeterSchema);

export default Meter;