
import StudentRecord from './students.model';
const { createTableForStudentAccount } = require('../studentAccount/studentAccount.controller');






export const createStudentAdmissionRecord = async (req, res) => {
  try {
    console.log("📥 Received Student Admission Record:", req.body);

    const { parent, students } = req.body;

    // 🔹 Basic validation
    if (!parent || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid payload — parent or students missing" });
    }

    // 🔹 Generate random roll numbers for each student
    const studentsWithRollNos = students.map((s) => {
      const prefix = s.class?.substring(0, 3).toUpperCase() || "STD";
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const rollNo = `${prefix}-${randomNum}`;

      return {
        ...s,
        rollNo,
        createdAt: new Date(),
      };
    });

    // 🔹 Create new record
    const record = new StudentRecord({
      parent,
      students: studentsWithRollNos,
    });

    const savedRecord = await record.save();

    console.log("✅ Saved Student Record:", savedRecord);

    return res.status(201).json({
      message: "Student record created successfully",
      record: savedRecord,
    });
  } catch (error) {
    console.error("❌ Error creating student record:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


