import StudentRecord from '../students/students.model';
import AcademyStudentRecord from './academy.model';
import ParentAccount from '../parents_account/parents_account.model';


export const createAcademyStudentAdmissionRecord = async (req, res) => {
  try {
    console.log("📥 Received Academy Student Admission Record:", req.body);

    const { parent, students } = req.body;

    // 🔹 Basic validation
    if (!parent || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid payload — parent or students missing" });
    }

    // Remove _id if empty string
    if (parent && parent._id === "") {
      delete parent._id;
    }

    // Also remove studentId if empty
    students.forEach(s => {
      if (s.studentId === "") delete s.studentId;
    });

    const studentsWithRollNos = students.map((s) => {
      return {
        ...s,
        createdAt: new Date(),
      };
    });

    // 🔹 Create new record
    const record = new AcademyStudentRecord({
      parent,
      students: studentsWithRollNos,
    });

    console.log('record: ', record);

    const savedRecord = await record.save();

    console.log("✅ Saved Academy Student Record:", savedRecord);

    const monthlyTotal = students.reduce((sum, s) => sum + s.monthlyFee, 0);
    const totalInitialDebit = monthlyTotal;

    const account = new ParentAccount({
      parentId: savedRecord._id,
      totalDebit: totalInitialDebit,
      balance: totalInitialDebit,
      transactions: [
        {
          type: "DEBIT",
          description: "Monthly Fee",
          amount: totalInitialDebit,
        },
      ],
    });

    await account.save();

    return res.status(201).json({
      message: "Student record created successfully",
      record: savedRecord,
      account: account
    });
  } catch (error) {
    console.error("❌ Error creating student record:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getSchoolAcademyStudents = async (req, res) => {
  try {

    const studentsSchoolAcademy = await StudentRecord.aggregate([
      { $unwind: "$students" },

      {
        $match: {
          "students.hasAcademy": true,
          "students.isDeleted": false
        }
      },

      {
        $project: {
          _id: 0,
          parentId: "$_id",   // ✅ parent id
          parentName: "$parent.name",
          parentPhone: "$parent.phone",
          studentId: "$students._id", // optional but useful
          studentName: "$students.name",
          class: "$students.class",
          rollNo: "$students.rollNo",
          academyFee: "$students.academyFee",
          gender: "$students.gender",
          category: 'school'
        }
      }

    ]);


    const onlyAcademyStudents = await AcademyStudentRecord.aggregate([
      { $unwind: "$students" },
      { $match: { "students.isDeleted": { $ne: true } } },


      // Project student + parent info
      {
        $project: {
          studentId: "$students._id",
          studentName: "$students.name",
          class: "$students.class",
          gender: "$students.gender",
          hasLeftSchool: "$students.hasLeftAcademy",
          parentId: "$_id",
          parentName: "$parent.name",
          parentPhone: "$parent.phone",
          category: 'Academy',
          academyFee: "$students.totalFee",
          sortOrder: 1, // keep for debugging (optional)
        },
      },

      // Sort by the computed sort order
      { $sort: { sortOrder: 1, name: 1 } },
    ]);


    const allStudents = [
      ...studentsSchoolAcademy,
      ...onlyAcademyStudents
    ];


    return res.status(200).json({
      message: "School academy students",
      record: allStudents,
    });


  } catch (error) {
    console.error("❌ Error getting  school academy students:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteStudentAccount = async (req, res) => {
  try {

     const studentId = req.body.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const result: any = await AcademyStudentRecord.updateOne(
      { "students._id": studentId },
      {
        $set: {
          "students.$.isDeleted": true,
          "students.$.updatedAt": new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Student soft-deleted successfully",
      data: result
    });

  } catch (error) {
    console.error("❌ Error in deleting student account:", error);
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

    let record: any = await AcademyStudentRecord.findOne(
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

    // Extract student
    const student = record.students.find(
      (s: any) => s._id.toString() === studentId
    );

    record.parent._id = record._id;

    res.status(200).json({
      message: "Student details",
      parent: record.parent,
      student: student,
      siblings: record.students.filter(
        (s: any) => s._id.toString() !== studentId
      ),
    });


  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateParentAndStudentRecord = async (req, res) => {
  try {


    const { parent, students } = req.body;
    console.log('students: ', students);

    // 🔹 Basic validation
    if (!parent || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid payload — parent or students missing" });
    }

    // new functionality to update parent and students

      const recordId = parent._id; // Record and parent document share ID

    // 1️⃣ Update parent
    await AcademyStudentRecord.updateOne(
      { _id: recordId },
      { $set: { parent } }
    );

    const updates = [];
    const newStudents = [];

    for (const s of students) {

      // 2️⃣ Existing student → update inside array
      if (s.studentId) {

        updates.push(
          AcademyStudentRecord.updateOne(
            { "students._id": s.studentId },
            {
              $set: {
                "students.$.name": s.name,
                "students.$.class": s.class,
                "students.$.gender": s.gender,
                "students.$.monthlyFee": s.monthlyFee,
                "students.$.totalFee": s.totalFee,
                "students.$.hasLeftAcademy": s.hasLeftAcademy,
                "students.$.updatedAt": new Date()
              }
            }
          )
        );

      } else {

        newStudents.push({
          ...s,
          createdAt: new Date()
        });
      }
    }

    // 4️⃣ Push new siblings (if any)
    if (newStudents.length > 0) {
      updates.push(
        AcademyStudentRecord.updateOne(
          { _id: recordId },
          { $push: { students: { $each: newStudents } } }
        )
      );
    }

    await Promise.all(updates);

    return res.json({
      success: true,
      message: "Record updated successfully"
    });





  } catch (error) {
    console.error("❌ Error in deleting student account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


