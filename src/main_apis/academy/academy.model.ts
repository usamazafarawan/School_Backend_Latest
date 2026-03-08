import mongoose, { Schema, model } from "mongoose";
import { IAcademyStudentRecord,IAcademyStudentRecordModel  } from "./academy.interface";

const studentSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  gender: { type: String, required: true, default: "boy" },
  image: { type: String, default: null },
  monthlyFee: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
  hasLeftAcademy:{ type: Boolean, default: false },
},
  { timestamps: true } // ✅ this automatically adds createdAt & updatedAt
);


const parentSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  secondary_phone: { type: String },
  cnic: { type: String },
  address: { type: String },
  occupation: { type: String },
  isDeleted: { type: Boolean, default: false },
});

const academyStudentRecordSchema = new Schema<IAcademyStudentRecord>(
  {
    parent: { type: parentSchema, required: true },
    students: { type: [studentSchema], required: true }
  },
  { timestamps: true } // timestamps for whole record too
);

export default model<IAcademyStudentRecord,IAcademyStudentRecordModel>("AcademyStudentRecord", academyStudentRecordSchema);
