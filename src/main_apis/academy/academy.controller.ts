import StudentRecord from '../students/students.model';





export const getSchoolAcademyStudents = async (req, res) => {
  try {

    const students = await StudentRecord.aggregate([
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
          parentId: "$parent._id",   // ✅ parent id
          parentName: "$parent.name",
          parentPhone: "$parent.phone",
          studentId: "$students._id", // optional but useful
          studentName: "$students.name",
          class: "$students.class",
          rollNo: "$students.rollNo",
          academyFee: "$students.academyFee",
          gender: "$students.gender",
          category:'school'
        }
      }

    ]);

    return res.status(200).json({
      message: "School academy students",
      record: students,
    });


  } catch (error) {
    console.error("❌ Error getting  school academy students:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

