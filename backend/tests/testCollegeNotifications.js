import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import http from "http";
import app from "../src/app.js";
import College from "../src/models/college.js";
import CollegeNotification from "../src/models/collegeNotification.js";
import generateToken from "../src/utils/generateToken.js";

async function runTests() {
  console.log("=== Starting College Notifications Module Integration Tests ===");

  const mongoUri = process.env.MONGO_URI || "mongodb+srv://chatlu1201_db_user:pMZcWt5kxVnTWERw@cluster0.mpi71hx.mongodb.net/?appName=Cluster0";
  await mongoose.connect(mongoUri);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedCount++;
    }
  }

  let collegeA, collegeB, tokenA, tokenB;
  let notifA1, notifA2, notifA3, notifB1;

  try {
    // 1. Setup Test Colleges and Tokens
    await College.deleteMany({ email: { $in: ["notif_college_a@college.edu", "notif_college_b@college.edu"] } });

    collegeA = await College.create({
      name: "Notification College A",
      email: "notif_college_a@college.edu",
      phone: "9876543230",
      password: "password123",
      address: "100 Notif Way",
      website: "https://notif-a.edu",
      university: "State Tech"
    });

    collegeB = await College.create({
      name: "Notification College B",
      email: "notif_college_b@college.edu",
      phone: "9876543231",
      password: "password123",
      address: "200 Signal Blvd",
      website: "https://notif-b.edu",
      university: "City Tech"
    });

    tokenA = generateToken(collegeA._id);
    tokenB = generateToken(collegeB._id);

    // Clean up notifications for test colleges
    await CollegeNotification.deleteMany({ college: { $in: [collegeA._id, collegeB._id] } });

    // Seed test notifications for College A
    notifA1 = await CollegeNotification.create({
      college: collegeA._id,
      title: "Placement Drive Created: Infosys",
      message: "Infosys drive has been scheduled for CSE batch.",
      type: "Drive",
      priority: "High",
      isRead: false
    });

    notifA2 = await CollegeNotification.create({
      college: collegeA._id,
      title: "New Student Application",
      message: "Ishaan Verma submitted application for TCS drive.",
      type: "Application",
      priority: "Normal",
      isRead: false
    });

    notifA3 = await CollegeNotification.create({
      college: collegeA._id,
      title: "Scheduled Maintenance Tonight",
      message: "System maintenance scheduled from 1-2 AM IST.",
      type: "System",
      priority: "Low",
      isRead: true,
      readAt: new Date()
    });

    // Seed test notification for College B
    notifB1 = await CollegeNotification.create({
      college: collegeB._id,
      title: "College B System Alert",
      message: "Welcome to Notification Center.",
      type: "General",
      priority: "Normal",
      isRead: false
    });

    // Test 1: GET /api/college/notifications without token -> 401
    const res1 = await fetch(`${baseUrl}/api/college/notifications`);
    const body1 = await res1.json();
    assert(res1.status === 401 && body1.success === false, "Missing token returns 401 Unauthorized");

    // Test 2: GET /api/college/notifications with College A token -> 200 OK, returns 3 items, unreadCount=2
    const res2 = await fetch(`${baseUrl}/api/college/notifications`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body2 = await res2.json();
    assert(
      res2.status === 200 &&
      body2.success === true &&
      body2.data.notifications.length === 3 &&
      body2.data.unreadCount === 2,
      "Get notifications for College A returns 3 items with unreadCount=2"
    );

    // Test 3: GET /api/college/notifications?isRead=false -> returns 2 unread notifications
    const res3 = await fetch(`${baseUrl}/api/college/notifications?isRead=false`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body3 = await res3.json();
    assert(res3.status === 200 && body3.data.notifications.length === 2, "Filter by isRead=false returns 2 unread items");

    // Test 4: GET /api/college/notifications?type=Drive -> returns 1 notification
    const res4 = await fetch(`${baseUrl}/api/college/notifications?type=Drive`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body4 = await res4.json();
    assert(res4.status === 200 && body4.data.notifications.length === 1 && body4.data.notifications[0].type === "Drive", "Filter by type=Drive returns matching item");

    // Test 5: GET /api/college/notifications with College B token -> returns 1 item for College B
    const res5 = await fetch(`${baseUrl}/api/college/notifications`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body5 = await res5.json();
    assert(res5.status === 200 && body5.data.notifications.length === 1 && body5.data.unreadCount === 1, "Get notifications for College B returns only College B's notifications");

    // Test 6: PATCH /api/college/notifications/:id/read -> mark Notif A1 as read
    const res6 = await fetch(`${baseUrl}/api/college/notifications/${notifA1._id}/read`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body6 = await res6.json();
    assert(res6.status === 200 && body6.success === true && body6.data.isRead === true && body6.data.readAt !== null, "Mark notification as read sets isRead=true and readAt timestamp");

    // Test 7: PATCH /api/college/notifications/invalid-id/read -> 400
    const res7 = await fetch(`${baseUrl}/api/college/notifications/invalid-objectid/read`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body7 = await res7.json();
    assert(res7.status === 400 && body7.success === false, "Malformed ObjectId returns 400 Bad Request");

    // Test 8: PATCH /api/college/notifications/<non-existent-id>/read -> 404
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const res8 = await fetch(`${baseUrl}/api/college/notifications/${nonExistentId}/read`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body8 = await res8.json();
    assert(res8.status === 404 && body8.success === false, "Non-existent notification ID returns 404 Not Found");

    // Test 9: Cross-college PATCH read (College B token for College A's Notif A2) -> 403
    const res9 = await fetch(`${baseUrl}/api/college/notifications/${notifA2._id}/read`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body9 = await res9.json();
    assert(res9.status === 403 && body9.success === false, "Cross-college PATCH read returns 403 Forbidden");

    // Test 10: PATCH /api/college/notifications/read-all -> mark all unread for College A as read
    const res10 = await fetch(`${baseUrl}/api/college/notifications/read-all`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body10 = await res10.json();
    assert(res10.status === 200 && body10.success === true && body10.data.modifiedCount >= 1, "Mark all as read updates remaining unread notifications");

    // Test 11: GET /api/college/notifications after read-all -> unreadCount=0
    const res11 = await fetch(`${baseUrl}/api/college/notifications`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body11 = await res11.json();
    assert(res11.status === 200 && body11.data.unreadCount === 0, "After mark all as read, unreadCount is 0");

    // Test 12: DELETE /api/college/notifications/:id -> delete Notif A3
    const res12 = await fetch(`${baseUrl}/api/college/notifications/${notifA3._id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body12 = await res12.json();
    assert(res12.status === 200 && body12.success === true && body12.data === null, "Delete notification returns 200 OK");

    // Test 13: Cross-college DELETE (College B token for College A's Notif A1) -> 403
    const res13 = await fetch(`${baseUrl}/api/college/notifications/${notifA1._id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body13 = await res13.json();
    assert(res13.status === 403 && body13.success === false, "Cross-college DELETE returns 403 Forbidden");

    // Test 14: GET /api/college/notifications after deletion -> total=2
    const res14 = await fetch(`${baseUrl}/api/college/notifications`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body14 = await res14.json();
    assert(res14.status === 200 && body14.data.notifications.length === 2, "After deletion, remaining notifications count is 2");

  } finally {
    // Clean up
    if (collegeA) await College.findByIdAndDelete(collegeA._id);
    if (collegeB) await College.findByIdAndDelete(collegeB._id);
    if (notifA1) await CollegeNotification.findByIdAndDelete(notifA1._id);
    if (notifA2) await CollegeNotification.findByIdAndDelete(notifA2._id);
    if (notifA3) await CollegeNotification.findByIdAndDelete(notifA3._id);
    if (notifB1) await CollegeNotification.findByIdAndDelete(notifB1._id);

    server.close();
    await mongoose.connection.close();
  }

  console.log(`\n=== Test Results: ${passedCount} Passed, ${failedCount} Failed ===`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
