import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Student from "../models/student.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/c2c";

const seedStudent = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    const email = "zaira.test@example.com";

    const existingStudent =
      await Student.findOne({ email }).select("+password");

    if (existingStudent) {
      console.log(
        `Student already exists: ${email}`,
      );

      await mongoose.disconnect();
      return;
    }

    const password = "Test@12345";

    const student = new Student({
      name: "Zaira Hussain",

      email,

      password,

      phone: "9876543210",

      // Leave null because this field references
      // the College collection.
      college: null,

      branch:
        "Computer Science and Engineering",

      semester: 8,

      percentage: 82,

      skills: [
        "Python",
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "MongoDB",
        "SQL",
        "Machine Learning",
      ],

      skillDetails: [
        {
          name: "Python",
          proficiency: 85,
          category: "Programming",
          yearsOfExperience: 2,
        },
        {
          name: "JavaScript",
          proficiency: 80,
          category: "Programming",
          yearsOfExperience: 2,
        },
        {
          name: "React",
          proficiency: 78,
          category: "Frontend",
          yearsOfExperience: 1.5,
        },
        {
          name: "Node.js",
          proficiency: 72,
          category: "Backend",
          yearsOfExperience: 1,
        },
        {
          name: "MongoDB",
          proficiency: 70,
          category: "Database",
          yearsOfExperience: 1,
        },
        {
          name: "SQL",
          proficiency: 82,
          category: "Database",
          yearsOfExperience: 2,
        },
        {
          name: "Machine Learning",
          proficiency: 75,
          category: "AI/ML",
          yearsOfExperience: 1,
        },
      ],

      interests: [
        "Artificial Intelligence",
        "Machine Learning",
        "Web Development",
        "Data Analytics",
        "Software Engineering",
      ],

      education: [
        {
          degree: "B.Tech",
          institution:
            "Indore Institute of Science and Technology",
          fieldOfStudy:
            "Computer Science and Engineering",
          startYear: 2023,
          endYear: 2027,
          grade: "8.2 CGPA",
        },
        {
          degree: "Higher Secondary",
          institution:
            "Senior Secondary School",
          fieldOfStudy: "Science",
          startYear: 2021,
          endYear: 2023,
          grade: "82%",
        },
      ],

      resume:
        "/uploads/resumes/zaira-hussain-resume.pdf",

      resumeUrl:
        "/uploads/resumes/zaira-hussain-resume.pdf",

      bio:
        "Computer Science Engineering student interested in AI, machine learning, full-stack development, and data analytics.",

      location: "Indore, Madhya Pradesh, India",

      linkedIn:
        "https://www.linkedin.com/in/zaira-hussain",

      github:
        "https://github.com/zairahussain",

      portfolio:
        "https://zairahussain.dev",

      status: "Active",

      learningProgress: [
        {
          moduleId: "python-basics",
          title: "Python Programming",
          description:
            "Core Python programming concepts.",
          progressPercentage: 100,
          status: "completed",
          enrolledAt: new Date(
            "2026-01-10",
          ),
          completedAt: new Date(
            "2026-02-10",
          ),
          history: [
            {
              progressPercentage: 25,
              status: "in-progress",
              note: "Started Python module.",
              updatedAt: new Date(
                "2026-01-20",
              ),
            },
            {
              progressPercentage: 100,
              status: "completed",
              note:
                "Completed all Python lessons.",
              updatedAt: new Date(
                "2026-02-10",
              ),
            },
          ],
        },

        {
          moduleId: "sql-basics",
          title: "SQL Fundamentals",
          description:
            "SQL queries, joins, aggregation and databases.",
          progressPercentage: 75,
          status: "in-progress",
          enrolledAt: new Date(
            "2026-02-15",
          ),
          history: [
            {
              progressPercentage: 40,
              status: "in-progress",
              note: "Completed SQL basics.",
              updatedAt: new Date(
                "2026-02-25",
              ),
            },
            {
              progressPercentage: 75,
              status: "in-progress",
              note:
                "Completed joins and aggregation.",
              updatedAt: new Date(
                "2026-03-05",
              ),
            },
          ],
        },

        {
          moduleId: "ml-fundamentals",
          title: "Machine Learning Fundamentals",
          description:
            "Supervised and unsupervised learning concepts.",
          progressPercentage: 45,
          status: "in-progress",
          enrolledAt: new Date(
            "2026-03-01",
          ),
          history: [
            {
              progressPercentage: 45,
              status: "in-progress",
              note:
                "Completed introductory ML concepts.",
              updatedAt: new Date(
                "2026-03-15",
              ),
            },
          ],
        },
      ],

      assignmentSubmissions: [
        {
          assignmentId: "assignment-001",
          title: "Python Data Processing",
          content:
            "Implement a Python data-processing solution.",
          submissionUrl:
            "https://example.com/submissions/python-001",
          answers: {
            language: "Python",
            completed: true,
          },
          score: 88,
          status: "graded",
          feedback:
            "Good implementation with clear logic.",
          submittedAt: new Date(
            "2026-02-15",
          ),
        },

        {
          assignmentId: "assignment-002",
          title: "SQL Queries",
          content:
            "Write SQL queries using joins and aggregation.",
          submissionUrl:
            "https://example.com/submissions/sql-001",
          answers: {
            completed: true,
          },
          score: 91,
          status: "graded",
          feedback:
            "Strong understanding of SQL.",
          submittedAt: new Date(
            "2026-03-01",
          ),
        },
      ],

      quizSubmissions: [
        {
          quizId: "quiz-001",
          title: "Python Fundamentals Quiz",
          answers: {
            q1: "B",
            q2: "A",
            q3: "C",
            q4: "B",
            q5: "A",
          },
          score: 90,
          totalQuestions: 5,
          correctAnswers: 4,
          submittedAt: new Date(
            "2026-02-20",
          ),
        },

        {
          quizId: "quiz-002",
          title: "SQL Fundamentals Quiz",
          answers: {
            q1: "A",
            q2: "C",
            q3: "B",
            q4: "B",
            q5: "C",
          },
          score: 80,
          totalQuestions: 5,
          correctAnswers: 4,
          submittedAt: new Date(
            "2026-03-10",
          ),
        },
      ],

      scoreHistory: [
        {
          score: 68,
          eligibilityStatus: "Not Eligible",
          breakdown: {
            technical: 65,
            communication: 70,
            skills: 69,
          },
          calculatedAt: new Date(
            "2026-01-15",
          ),
        },

        {
          score: 78,
          eligibilityStatus: "Eligible",
          breakdown: {
            technical: 76,
            communication: 80,
            skills: 78,
          },
          calculatedAt: new Date(
            "2026-02-15",
          ),
        },

        {
          score: 84,
          eligibilityStatus: "Eligible",
          breakdown: {
            technical: 85,
            communication: 82,
            skills: 85,
          },
          calculatedAt: new Date(
            "2026-03-15",
          ),
        },
      ],
    });

    await student.save();

    console.log(
      "====================================",
    );
    console.log(
      "Student created successfully",
    );
    console.log(
      "====================================",
    );
    console.log(
      `Email: ${email}`,
    );
    console.log(
      `Password: ${password}`,
    );
    console.log(
      "Percentage: 82",
    );
    console.log(
      "Status: Active",
    );
    console.log(
      "====================================",
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Student seed failed:",
      error,
    );

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedStudent();