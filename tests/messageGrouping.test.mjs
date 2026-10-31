import test from "node:test";
import assert from "node:assert/strict";
import {
  groupMessages,
  formatDateSeparator,
  getBubbleCornerClasses,
  getCalendarDateKey,
  getInitials,
  getAvatarColor,
  formatMessageTime,
  formatRelativeShort,
} from "../utils/messageGrouping.js";

test("A. Group consecutive messages from same sender within threshold", () => {
  const baseTime = new Date("2026-10-24T10:00:00.000Z").getTime();
  const raw = [
    { _id: "1", senderId: "user_a", text: "Hey", createdAt: new Date(baseTime).toISOString() },
    { _id: "2", senderId: "user_a", text: "How are you?", createdAt: new Date(baseTime + 60000).toISOString() }, // +1 min
    { _id: "3", senderId: "user_a", text: "Are you free today?", createdAt: new Date(baseTime + 120000).toISOString() }, // +2 min
  ];

  const items = groupMessages(raw, {
    thresholdMs: 300000,
    isMeFn: (m) => m.senderId === "me",
    referenceDate: new Date("2026-10-24T12:00:00.000Z"),
  });

  // 1 date separator + 1 group with 3 messages
  assert.equal(items.length, 2);
  assert.equal(items[0].type, "date-separator");
  assert.equal(items[1].type, "message-group");
  assert.equal(items[1].messages.length, 3);

  // Positions within group
  assert.equal(items[1].messages[0].position, "first");
  assert.equal(items[1].messages[1].position, "middle");
  assert.equal(items[1].messages[2].position, "last");

  // Messenger Corner classes for incoming
  assert.equal(items[1].messages[0].bubbleCornerClass, "rounded-2xl rounded-bl-[4px]");
  assert.equal(items[1].messages[1].bubbleCornerClass, "rounded-2xl rounded-l-[4px]");
  assert.equal(items[1].messages[2].bubbleCornerClass, "rounded-2xl rounded-tl-[4px]");

  // Avatar only on first message
  assert.equal(items[1].messages[0].showAvatar, true);
  assert.equal(items[1].messages[1].showAvatar, false);
  assert.equal(items[1].messages[2].showAvatar, false);
});

test("A2. Outgoing messages corner radii for Messenger", () => {
  const baseTime = new Date("2026-10-24T10:00:00.000Z").getTime();
  const raw = [
    { _id: "1", senderId: "me", text: "Hello", createdAt: new Date(baseTime).toISOString() },
    { _id: "2", senderId: "me", text: "Thanks for waiting", createdAt: new Date(baseTime + 30000).toISOString() },
  ];

  const items = groupMessages(raw, {
    isMeFn: (m) => m.senderId === "me",
    referenceDate: new Date("2026-10-24T12:00:00.000Z"),
  });

  const group = items.find((i) => i.type === "message-group");
  assert.equal(group.isMe, true);
  assert.equal(group.messages[0].position, "first");
  assert.equal(group.messages[1].position, "last");
  assert.equal(group.messages[0].bubbleCornerClass, "rounded-2xl rounded-br-[4px]");
  assert.equal(group.messages[1].bubbleCornerClass, "rounded-2xl rounded-tr-[4px]");
  // Outgoing messages should never show avatar
  assert.equal(group.messages[0].showAvatar, false);
  assert.equal(group.messages[1].showAvatar, false);
});

test("A3. Single message has full rounded corners", () => {
  const baseTime = new Date("2026-10-24T10:00:00.000Z").getTime();
  const raw = [
    { _id: "1", senderId: "user_a", text: "Just one message", createdAt: new Date(baseTime).toISOString() },
  ];

  const items = groupMessages(raw, { isMeFn: () => false });
  const group = items.find((i) => i.type === "message-group");
  assert.equal(group.messages.length, 1);
  assert.equal(group.messages[0].position, "single");
  assert.equal(group.messages[0].bubbleCornerClass, "rounded-2xl");
  assert.equal(group.messages[0].showAvatar, true);
});

test("B. Sender change starts a new group", () => {
  const baseTime = new Date("2026-10-24T10:00:00.000Z").getTime();
  const raw = [
    { _id: "1", senderId: "customer", text: "Hi", createdAt: new Date(baseTime).toISOString() },
    { _id: "2", senderId: "agent", text: "Hello! How can I help?", createdAt: new Date(baseTime + 10000).toISOString() },
    { _id: "3", senderId: "customer", text: "I have a question", createdAt: new Date(baseTime + 20000).toISOString() },
  ];

  const items = groupMessages(raw, {
    isMeFn: (m) => m.senderId === "agent",
  });

  const groups = items.filter((i) => i.type === "message-group");
  assert.equal(groups.length, 3);
  assert.equal(groups[0].isMe, false);
  assert.equal(groups[1].isMe, true);
  assert.equal(groups[2].isMe, false);
});

test("C. Grouping timeout breaks group even when sender is unchanged", () => {
  const baseTime = new Date("2026-10-24T10:00:00.000Z").getTime();
  const raw = [
    { _id: "1", senderId: "user_a", text: "Message 1", createdAt: new Date(baseTime).toISOString() },
    // 6 minutes later (> 5 minutes threshold)
    { _id: "2", senderId: "user_a", text: "Message 2 after delay", createdAt: new Date(baseTime + 360000).toISOString() },
  ];

  const items = groupMessages(raw, {
    thresholdMs: 300000,
    isMeFn: () => false,
  });

  const groups = items.filter((i) => i.type === "message-group");
  assert.equal(groups.length, 2);
  assert.equal(groups[0].messages[0].position, "single");
  assert.equal(groups[1].messages[0].position, "single");
});

test("D. Midnight boundary inserts date separator and breaks group", () => {
  // 11:59 PM on Oct 23 and 12:01 AM on Oct 24 (2 minutes apart, but different calendar dates)
  const time1 = new Date("2026-10-23T23:59:00").toISOString();
  const time2 = new Date("2026-10-24T00:01:00").toISOString();

  const raw = [
    { _id: "1", senderId: "user_a", text: "Before midnight", createdAt: time1 },
    { _id: "2", senderId: "user_a", text: "After midnight", createdAt: time2 },
  ];

  const refDate = new Date("2026-10-24T12:00:00");
  const items = groupMessages(raw, {
    thresholdMs: 300000,
    isMeFn: () => false,
    referenceDate: refDate,
  });

  // Should have: date-separator (Oct 23), message-group, date-separator (Oct 24), message-group
  assert.equal(items.length, 4);
  assert.equal(items[0].type, "date-separator");
  assert.equal(items[0].label, "Yesterday");
  assert.equal(items[1].type, "message-group");
  assert.equal(items[2].type, "date-separator");
  assert.equal(items[2].label, "Today");
  assert.equal(items[3].type, "message-group");
});

test("E. Date separators formatting: Today, Yesterday, and readable dates", () => {
  const ref = new Date("2026-10-24T12:00:00");

  const todayStr = formatDateSeparator(new Date("2026-10-24T09:00:00"), ref);
  assert.equal(todayStr, "Today");

  const yesterdayStr = formatDateSeparator(new Date("2026-10-23T15:00:00"), ref);
  assert.equal(yesterdayStr, "Yesterday");

  const olderStr = formatDateSeparator(new Date("2026-10-20T10:00:00"), ref);
  assert.equal(olderStr, "October 20, 2026");
});

test("F. Pagination boundary & deduplication when merging batches", () => {
  const batchOlder = [
    { _id: "1", senderId: "user_a", text: "Older msg 1", createdAt: "2026-10-24T09:00:00.000Z" },
    { _id: "2", senderId: "user_a", text: "Older msg 2", createdAt: "2026-10-24T09:01:00.000Z" },
  ];

  const batchCurrent = [
    { _id: "2", senderId: "user_a", text: "Older msg 2", createdAt: "2026-10-24T09:01:00.000Z" }, // duplicate from boundary
    { _id: "3", senderId: "user_a", text: "Current msg 3", createdAt: "2026-10-24T09:02:00.000Z" },
  ];

  const merged = [...batchOlder, ...batchCurrent];
  const items = groupMessages(merged, { isMeFn: () => false });

  const group = items.find((i) => i.type === "message-group");
  // Duplicate _id 2 must be eliminated
  assert.equal(group.messages.length, 3);
  assert.deepEqual(
    group.messages.map((m) => m._id),
    ["1", "2", "3"]
  );
});

test("G. Out of order messages are chronologically sorted safely", () => {
  const raw = [
    { _id: "3", senderId: "user_a", text: "Third", createdAt: "2026-10-24T10:05:00.000Z" },
    { _id: "1", senderId: "user_a", text: "First", createdAt: "2026-10-24T10:01:00.000Z" },
    { _id: "2", senderId: "user_a", text: "Second", createdAt: "2026-10-24T10:02:00.000Z" },
  ];

  const items = groupMessages(raw, { isMeFn: () => false });
  const group = items.find((i) => i.type === "message-group");
  assert.deepEqual(
    group.messages.map((m) => m._id),
    ["1", "2", "3"]
  );
});

test("H. System messages and internal notes are kept visually separate", () => {
  const raw = [
    { _id: "1", senderId: "user_a", text: "Hello", createdAt: "2026-10-24T10:00:00.000Z" },
    { _id: "2", senderId: "system", isInternalNote: true, text: "Customer assigned to Support", createdAt: "2026-10-24T10:01:00.000Z" },
    { _id: "3", senderId: "user_a", text: "Still there?", createdAt: "2026-10-24T10:02:00.000Z" },
  ];

  const items = groupMessages(raw, { isMeFn: () => false });
  // [date-separator, group(msg1), system-message(msg2), group(msg3)]
  assert.equal(items.length, 4);
  assert.equal(items[1].type, "message-group");
  assert.equal(items[2].type, "system-message");
  assert.equal(items[3].type, "message-group");
});

test("I. Avatar initials fallback extraction and color determinism", () => {
  assert.equal(getInitials("John Doe"), "JD");
  assert.equal(getInitials("Md Ahsan Habib"), "MA");
  assert.equal(getInitials("Ahsan"), "AH");
  assert.equal(getInitials("x"), "X");
  assert.equal(getInitials(""), "U");
  assert.equal(getInitials(null), "U");
  assert.equal(getInitials(undefined), "U");
  assert.equal(getInitials("   Farhan   Kabir  "), "FK");

  // Deterministic color assignment
  const color1 = getAvatarColor("user_123");
  const color2 = getAvatarColor("user_123");
  assert.equal(color1, color2, "Color must be deterministic for the same user identifier");
  assert.match(color1, /bg-/);
});

test("J. High-volume 5,000 messages grouping & pre-computed time formatting performance", () => {
  const baseTs = new Date("2026-10-24T10:00:00.000Z").getTime();
  const largeBatch = Array.from({ length: 5000 }, (_, i) => ({
    _id: `msg_${i}`,
    senderId: i % 3 === 0 ? "admin" : "customer_1",
    senderRole: i % 3 === 0 ? "admin" : "customer",
    text: `Message number ${i}`,
    createdAt: new Date(baseTs + i * 30000).toISOString(),
  }));

  const start = performance.now();
  const grouped = groupMessages(largeBatch, {
    isMeFn: (m) => m.senderRole === "admin",
  });
  const elapsedMs = performance.now() - start;

  assert.ok(grouped.length > 0);
  const firstGroup = grouped.find((g) => g.type === "message-group");
  assert.ok(firstGroup.messages[0].formattedTime);
  assert.ok(firstGroup.messages[0].formattedFullDate);
  assert.ok(elapsedMs < 500, `Expected < 500ms for 5,000 messages, took ${elapsedMs.toFixed(1)}ms`);

  // Relative short time formatting check
  assert.equal(formatRelativeShort(baseTs, baseTs + 10000), "now");
  assert.equal(formatRelativeShort(baseTs, baseTs + 5 * 60 * 1000), "5m");
  assert.equal(formatRelativeShort(baseTs, baseTs + 2 * 3600 * 1000), "2h");
  assert.ok(formatMessageTime(baseTs).length > 0);
});


