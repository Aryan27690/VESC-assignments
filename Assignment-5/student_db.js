const studentDb = db.getSiblingDB("student_db");
const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "rollNumber", "subjects"],
    properties: {
      name: {
        bsonType: "string",
        minLength: 1,
        description: "Student name"
      },
      rollNumber: {
        bsonType: "string",
        minLength: 1,
        description: "Unique student roll number"
      },
      subjects: {
        bsonType: "array",
        items: { bsonType: "string" },
        description: "Subjects taken by the student"
      }
    }
  }
};

if (studentDb.getCollectionNames().includes("students")) {
  studentDb.runCommand({
    collMod: "students",
    validator,
    validationLevel: "strict",
    validationAction: "error"
  });
} else {
  studentDb.createCollection("students", {
    validator,
    validationLevel: "strict",
    validationAction: "error"
  });
}

studentDb.students.createIndex({ rollNumber: 1 }, { unique: true });
print("Database student_db is ready with the students collection.");
