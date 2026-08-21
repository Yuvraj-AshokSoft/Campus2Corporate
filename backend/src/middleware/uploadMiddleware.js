import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ---------------------------------------------------------
// Resolve __dirname for ES modules
// ---------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------
// LOCAL TEMPORARY STORAGE
// ---------------------------------------------------------

const uploadDirectory = path.join(
  __dirname,
  "../uploads/interviews",
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ---------------------------------------------------------
// MULTER STORAGE
// ---------------------------------------------------------

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension =
      path.extname(file.originalname) ||
      ".webm";

    const filename = `interview-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    callback(null, filename);
  },
});

// ---------------------------------------------------------
// FILE FILTER
// ---------------------------------------------------------

const fileFilter = (_req, file, callback) => {
  const allowedMimeTypes = [
    "video/webm",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/mp4",
    "video/quicktime",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const allowedExtensions = [
    ".webm",
    ".mp4",
    ".mov",
  ];

  const mimeTypeAllowed =
    allowedMimeTypes.includes(
      file.mimetype,
    );

  const extensionAllowed =
    allowedExtensions.includes(
      extension,
    );

  if (
    mimeTypeAllowed ||
    extensionAllowed
  ) {
    callback(null, true);
    return;
  }

  callback(
    new Error(
      "Only WebM, MP4, and MOV video files are allowed.",
    ),
  );
};

// ---------------------------------------------------------
// MULTER CONFIGURATION
// ---------------------------------------------------------

const uploadInterviewVideo = multer({
  storage,

  limits: {
    fileSize:
      100 * 1024 * 1024,
  },

  fileFilter,
}).single("video");

const resumeUploadDirectory = path.join(
  __dirname,
  "../uploads/resumes",
);

if (!fs.existsSync(resumeUploadDirectory)) {
  fs.mkdirSync(resumeUploadDirectory, {
    recursive: true,
  });
}

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, resumeUploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `resume-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    callback(null, filename);
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error("Resume must be a PDF, DOC, or DOCX file."));
  },
}).single("resume");

// ---------------------------------------------------------
// EXPORT
// ---------------------------------------------------------

export {
  uploadInterviewVideo,
  uploadResume,
};