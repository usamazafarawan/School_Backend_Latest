import { Model, Schema ,Document } from "mongoose";
export interface IAcademyStudent {
  name: string;
  class: string;
  gender: string;
  image?: string | null;
  monthlyFee: number;
  totalFee: number;
  createdAt?: Date; // ✅ Added this line
  updatedAt?: Date;
  hasLeftAcademy?: boolean;
  isDeleted?:boolean;
  
}

export interface IAcademyParent {
  name: string;
  phone: string;
  secondary_phone?: string;
  cnic: string;
  address?: string;
  isDeleted?:boolean;
  occupation?: string;
}

export interface IAcademyStudentRecord extends Document {
  parent: IAcademyParent;
  students: IAcademyStudent[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAcademyStudentRecordModel extends Model<IAcademyStudentRecord> {}



