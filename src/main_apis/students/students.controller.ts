
import StudentRecord from './students.model';
import ParentAccount from '../parents_account/parents_account.model';






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

        // ➤ CALCULATE total admission + monthly fees for ALL students
    const admissionTotal = students.reduce((sum, s) => sum + s.admissionFee, 0);
    const monthlyTotal = students.reduce((sum, s) => sum + s.monthlyFee, 0);
    const totalInitialDebit = admissionTotal + monthlyTotal;

        // ➤ CREATE Parent Account
    const account = new ParentAccount({
      parentId: savedRecord._id,
      totalDebit: totalInitialDebit,
      balance: totalInitialDebit,
      transactions: [
        {
          type: "DEBIT",
          description: "Initial Admission + Monthly Fee",
          amount: totalInitialDebit,
        },
      ],
    });

    await account.save();

    return res.status(201).json({
      message: "Student record created successfully",
      record: savedRecord,
      account:account
    });
  } catch (error) {
    console.error("❌ Error creating student record:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



export const getAllStudentsWithParents = async (req, res) => {
  try {
    const classOrder = [
      "PG",
      "Nursery",
      "Prep",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
    ];

    const students = await StudentRecord.aggregate([
      { $unwind: "$students" },
      { $match: { "students.isDeleted": { $ne: true } } },

      // Add custom sort index based on your manual order
      {
        $addFields: {
          sortOrder: {
            $indexOfArray: [classOrder, "$students.class"],
          },
        },
      },

      // Project student + parent info
      {
        $project: {
          _id: "$students._id",
          name: "$students.name",
          class: "$students.class",
          rollNo: "$students.rollNo",
          // monthlyFee: "$students.monthlyFee",
          // admissionFee: "$students.admissionFee",
          // totalFee: "$students.totalFee",
          // createdAt: "$students.createdAt",
          hasAcademy: "$students.hasAcademy",
          // academyFee: "$students.academyFee",
          // image: "$students.image",

          parentId: "$_id",
          parentName: "$parent.name",
          parentPhone: "$parent.phone",

          sortOrder: 1, // keep for debugging (optional)
        },
      },

      // Sort by the computed sort order
      { $sort: { sortOrder: 1, name: 1 } },
    ]);

   return res.status(200).json({
      data: {
        totalStudents: students.length,
        students,
      },
      message: "Students fetched successfully"
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getStudentDetailsById = async (req, res) => {
  try {

     const studentId = req.params.studentId;
    console.log('studentId: ', studentId);

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

  
   // Find the record containing that student
    const record = await StudentRecord.findOne(
      { "students._id": studentId },
      {
        parent: 1,
        students: 1,
        createdAt: 1,
        updatedAt: 1
      }
    );

    if (!record) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Extract the student
    const student = record.students.find((s:any) => s._id.toString() === studentId);

     const parentData = {
      ...record.parent, // convert Mongoose doc to plain object
      _id: record._id || 'CUSTOM_ID' // replace _id with rollNo or any custom value
    };

    res.status(200).json({
      message: "Student details",
      parent: parentData,
      student: student,
      siblings: record.students.filter((s:any) => s._id.toString() !== studentId)
    });


  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
