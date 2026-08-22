import fs from "fs";
import path from "path";
import { createReadStream } from "fs";
import Groq from "groq-sdk";

// ---------------------------------------------------------
// Groq client (lazy-initialised so missing key fails at
// call-time with a clear error, not at startup)
// ---------------------------------------------------------

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

// ---------------------------------------------------------
// Derive a file extension from the mimetype reported by
// multer.  Groq requires the filename to have a recognised
// audio extension.
// ---------------------------------------------------------

const mimeToExtension = (mimetype = "") => {
  const base = mimetype.split(";")[0].trim().toLowerCase();

  const map = {
    "audio/webm": ".webm",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",
    "audio/wave": ".wav",
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/mp4": ".mp4",
    "audio/aac": ".aac",
  };

  return map[base] || ".webm";
};

// ---------------------------------------------------------
// Cleanup helper — delete the temp file silently
// ---------------------------------------------------------

const cleanupFile = (filePath) => {
  if (!filePath) return;

  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error(
        "Groq transcription: failed to delete temp audio file:",
        error.message,
      );
    }
  });
};

// ---------------------------------------------------------
// transcribeAudio
//
// Sends the uploaded audio file to Groq Whisper and returns
// the plain-text transcript string.
//
// Parameters:
//   filePath  {string}  Absolute path to the temp audio file
//   mimetype  {string}  MIME type reported by multer
//
// Returns:
//   {string}  Transcript text
// ---------------------------------------------------------

const transcribeAudio = async (filePath, mimetype) => {
  if (!filePath) {
    throw new Error("No audio file path provided.");
  }

  const client = getGroqClient();

  const extension = mimeToExtension(mimetype);

  /*
   * Groq SDK requires the file object to have a .name
   * property with a valid audio extension.  We build a
   * pseudo-filename by appending the correct extension to
   * the actual temporary filename.
   */
  const audioFileName =
    path.basename(filePath, path.extname(filePath)) + extension;

  let transcription;

  try {
    const fileStream = createReadStream(filePath);

    /*
     * The Groq Node SDK expects either a ReadStream with a
     * .name property or a File/Blob object.  We set .name
     * directly on the stream so it carries the extension.
     */
    fileStream.name = audioFileName;

    transcription =
      await client.audio.transcriptions.create({
        file: fileStream,
        model: "whisper-large-v3-turbo",
        response_format: "json",
        language: "en",
      });
  } catch (error) {
    const status = error?.status || error?.statusCode;
    const message = String(error?.message || "");

    if (status === 429) {
      throw new Error(
        "Transcription service is temporarily busy. Please try again.",
      );
    }

    if (status === 401) {
      throw new Error(
        "Speech-to-text service authentication failed.",
      );
    }

    if (status === 413 || message.includes("too large")) {
      throw new Error(
        "Audio recording is too large. Please record a shorter answer.",
      );
    }

    console.error(
      "Groq transcription error:",
      error?.message || "Unknown error",
    );

    throw new Error(
      "Unable to transcribe your response. Please try again.",
    );
  }

  const text = transcription?.text?.trim() || "";

  return text;
};

export { transcribeAudio, cleanupFile };
