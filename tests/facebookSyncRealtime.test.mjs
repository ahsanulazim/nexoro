import test from "node:test";
import assert from "node:assert/strict";

test("Room ID normalization matches prefixed and unprefixed formats", () => {
  const cleanRoomId = (r) => String(r || "").replace(/^(fb_|ig_|wa_|room_)/, "");

  const currentRoomA = "fb_102234567890123";
  const incomingRoomA = "102234567890123";
  assert.equal(cleanRoomId(incomingRoomA), cleanRoomId(currentRoomA));

  const currentRoomB = "102234567890123";
  const incomingRoomB = "fb_102234567890123";
  assert.equal(cleanRoomId(incomingRoomB), cleanRoomId(currentRoomB));

  const unrelatedRoom = "fb_999999999999999";
  assert.notEqual(cleanRoomId(unrelatedRoom), cleanRoomId(currentRoomA));
});

test("Realtime message deduplication prevents duplicate messages from multiple rooms/sync", () => {
  const initialMessages = [
    { _id: "msg_1", text: "Hello", metaMessageId: "mid_101" },
    { _id: "msg_2", text: "How can I help you?", metaMessageId: "mid_102" },
  ];

  const incomingDuplicateByMongoId = {
    _id: "msg_2",
    text: "How can I help you?",
  };

  const incomingDuplicateByMetaId = {
    _id: "msg_temp_xyz",
    metaMessageId: "mid_101",
    text: "Hello",
  };

  const incomingBrandNew = {
    _id: "msg_3",
    metaMessageId: "mid_103",
    text: "Here is my inquiry",
  };

  const deduplicate = (prev, newMsg) => {
    const exists = prev.some(
      (m) =>
        (m._id && newMsg._id && String(m._id) === String(newMsg._id)) ||
        (m.metaMessageId &&
          newMsg.metaMessageId &&
          m.metaMessageId === newMsg.metaMessageId)
    );
    if (exists) return prev;
    return [...prev, newMsg];
  };

  const afterDup1 = deduplicate(initialMessages, incomingDuplicateByMongoId);
  assert.equal(afterDup1.length, 2);

  const afterDup2 = deduplicate(afterDup1, incomingDuplicateByMetaId);
  assert.equal(afterDup2.length, 2);

  const afterNew = deduplicate(afterDup2, incomingBrandNew);
  assert.equal(afterNew.length, 3);
  assert.equal(afterNew[2].text, "Here is my inquiry");
});

test("Database roomQuery matches any variant of Facebook room ID", () => {
  const roomId = "102234567890123";
  const cleanId = String(roomId).replace(/^(fb_|ig_|wa_|room_)/, "");
  const roomQuery = {
    $in: [
      roomId,
      cleanId,
      `fb_${cleanId}`,
      `ig_${cleanId}`,
      `wa_${cleanId}`,
      `room_${cleanId}`,
    ],
  };

  assert.ok(roomQuery.$in.includes("102234567890123"));
  assert.ok(roomQuery.$in.includes("fb_102234567890123"));
  assert.ok(!roomQuery.$in.includes("fb_999999999999999"));
});

test("groupMessages removes duplicate messages with different MongoDB _ids", async () => {
  const { groupMessages } = await import("../utils/messageGrouping.js");

  const rawMessagesWithDuplicates = [
    {
      _id: "mongo_id_1",
      text: "is it syncting",
      senderRole: "customer",
      senderId: "customer_1",
      createdAt: new Date("2026-10-24T15:52:00Z"),
    },
    {
      _id: "mongo_id_2_from_meta_sync",
      text: "is it syncting",
      metaMessageId: "meta_mid_1",
      senderRole: "customer",
      senderId: "customer_1",
      createdAt: new Date("2026-10-24T15:52:02Z"),
    },
    {
      _id: "mongo_id_3",
      text: "working",
      senderRole: "admin",
      senderId: "admin_1",
      createdAt: new Date("2026-10-24T16:17:00Z"),
    },
    {
      _id: "mongo_id_4_from_meta_sync",
      text: "working",
      metaMessageId: "meta_mid_2",
      senderRole: "admin",
      senderId: "admin_1",
      createdAt: new Date("2026-10-24T16:17:01Z"),
    },
  ];

  const grouped = groupMessages(rawMessagesWithDuplicates, {
    isMeFn: (m) => m.senderRole === "admin",
  });

  // Extract all individual messages from groups
  const messageGroups = grouped.filter((g) => g.type === "message-group");
  const allMessages = messageGroups.flatMap((g) => g.messages);

  assert.equal(allMessages.length, 2);
  assert.equal(allMessages[0].text, "is it syncting");
  assert.equal(allMessages[1].text, "working");
});

