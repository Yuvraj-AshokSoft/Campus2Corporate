import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    senderRole: { type: String, default: "Admin" },
    senderId: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String, required: true },
    isInternalNote: { type: Boolean, default: false },
    attachmentUrl: { type: String, default: "" },
    attachmentName: { type: String, default: "" },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Ticket description is required"],
      trim: true,
    },
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    requesterRole: {
      type: String,
      enum: ["Student", "College", "Recruiter", "Mentor", "Other"],
      default: "Student",
    },
    requesterOrg: {
      type: String,
      default: "Campus2Corporate",
    },
    priority: {
      type: String,
      enum: ["Standard", "Escalated", "Critical Priority"],
      default: "Standard",
    },
    type: {
      type: String,
      enum: ["Dispute", "Request", "System Issue", "Billing", "General"],
      default: "Request",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    slaTarget: {
      type: String,
      default: "4h 00m SLA",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    messages: [supportMessageSchema],
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });
supportTicketSchema.index({ requesterEmail: 1 });

export default mongoose.model("SupportTicket", supportTicketSchema);
