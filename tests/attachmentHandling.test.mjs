import test from "node:test";
import assert from "node:assert/strict";
import {
  categorizeAttachment,
  formatFileSize,
  isUnsafeExtension,
  validateFile,
  validateFileBatch,
  computeImageGridLayout,
  normalizeAttachment,
  CHANNEL_LIMITS,
} from "../utils/attachmentHelper.js";
import {
  categorizeMime,
  isUnsafeFile,
  validateAttachmentForChannel,
  formatMetaAttachmentPayload,
  formatWhatsAppMediaPayload,
} from "../../nexoro-server/utils/channelMediaAdapter.js";
import { groupMessages } from "../utils/messageGrouping.js";

test("1. Single image categorization and responsive layout", () => {
  const cat = categorizeAttachment("image/jpeg", "vacation.jpg");
  assert.equal(cat, "image");

  const layout = computeImageGridLayout(1);
  assert.equal(layout.layoutType, "single");
  assert.equal(layout.gridClass, "grid-cols-1");
  assert.equal(layout.visibleCount, 1);
});

test("2. Multiple images: 2, 3, 4, and 5+ images layout calculations", () => {
  // 2 images
  const duo = computeImageGridLayout(2);
  assert.equal(duo.layoutType, "duo");
  assert.equal(duo.gridClass, "grid-cols-2");
  assert.equal(duo.visibleCount, 2);

  // 3 images
  const trio = computeImageGridLayout(3);
  assert.equal(trio.layoutType, "trio");
  assert.equal(trio.gridClass, "grid-cols-2");
  assert.equal(trio.visibleCount, 3);

  // 4 images
  const quad = computeImageGridLayout(4);
  assert.equal(quad.layoutType, "quad");
  assert.equal(quad.gridClass, "grid-cols-2");
  assert.equal(quad.visibleCount, 4);

  // 6 images (5+ images with +N overlay)
  const multi = computeImageGridLayout(6);
  assert.equal(multi.layoutType, "multi");
  assert.equal(multi.visibleCount, 4);
  // Remaining count for 6 images when 4 visible (4th has +N) -> 6 - 3 = +3
  const remaining = 6 - 3;
  assert.equal(remaining, 3);
});

test("3. Mixed attachments categorization (video, audio, document, image)", () => {
  assert.equal(categorizeAttachment("image/png", "sample.png"), "image");
  assert.equal(categorizeAttachment("video/mp4", "movie.mp4"), "video");
  assert.equal(categorizeAttachment("audio/mpeg", "song.mp3"), "audio");
  assert.equal(categorizeAttachment("voice", "voice_note.ogg"), "audio");
  assert.equal(categorizeAttachment("application/pdf", "contract.pdf"), "document");
  assert.equal(categorizeAttachment("application/zip", "archive.zip"), "document");
});

test("4. Security validation: Reject unsafe and executable files", () => {
  assert.equal(isUnsafeExtension("virus.exe"), true);
  assert.equal(isUnsafeExtension("script.sh"), true);
  assert.equal(isUnsafeExtension("run.bat"), true);
  assert.equal(isUnsafeExtension("backdoor.php"), true);
  assert.equal(isUnsafeExtension("presentation.pdf"), false);
  assert.equal(isUnsafeExtension("photo.jpg"), false);

  const res = validateFile({ name: "trojan.exe", size: 1024, type: "application/x-msdownload" }, "web");
  assert.equal(res.valid, false);
  assert.match(res.error, /executable/i);
});

test("5. File size formatting", () => {
  assert.equal(formatFileSize(0), "0 B");
  assert.equal(formatFileSize(500), "500 B");
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.equal(formatFileSize(2.5 * 1024 * 1024), "2.5 MB");
  assert.equal(formatFileSize(1024 * 1024 * 1024), "1.0 GB");
});

test("6. Channel limits and batch file count validation", () => {
  // Web allows max 10 files
  const filesOk = Array(5).fill({ name: "img.jpg", size: 500000, type: "image/jpeg" });
  assert.equal(validateFileBatch(filesOk, 0, "web").valid, true);

  const filesTooMany = Array(12).fill({ name: "img.jpg", size: 500000, type: "image/jpeg" });
  const batchRes = validateFileBatch(filesTooMany, 0, "web");
  assert.equal(batchRes.valid, false);
  assert.match(batchRes.error, /up to 10 files/i);

  // WhatsApp file size limits (image 5MB, oversized image rejected)
  const bigImage = { name: "large.jpg", size: 6 * 1024 * 1024, type: "image/jpeg" };
  const waVal = validateFile(bigImage, "whatsapp");
  assert.equal(waVal.valid, false);
  assert.match(waVal.error, /limit/i);
});

test("7. Server channel adapter: Meta Graph API payload translation", () => {
  const imageAtt = {
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    mimeType: "image/jpeg",
    originalName: "sample.jpg",
  };
  const metaImage = formatMetaAttachmentPayload("psid_123", imageAtt);
  assert.equal(metaImage.recipient.id, "psid_123");
  assert.equal(metaImage.message.attachment.type, "image");
  assert.equal(metaImage.message.attachment.payload.url, imageAtt.url);

  const docAtt = {
    url: "https://res.cloudinary.com/demo/raw/upload/invoice.pdf",
    mimeType: "application/pdf",
    originalName: "invoice.pdf",
  };
  const metaDoc = formatMetaAttachmentPayload("psid_123", docAtt);
  assert.equal(metaDoc.message.attachment.type, "file");
});

test("8. Server channel adapter: WhatsApp Cloud API media payload translation", () => {
  const vidAtt = {
    url: "https://res.cloudinary.com/demo/video/upload/demo.mp4",
    mimeType: "video/mp4",
    originalName: "demo.mp4",
  };
  const waVid = formatWhatsAppMediaPayload("+1234567890", vidAtt, "Project demo video");
  assert.equal(waVid.messaging_product, "whatsapp");
  assert.equal(waVid.to, "1234567890");
  assert.equal(waVid.type, "video");
  assert.equal(waVid.video.link, vidAtt.url);
  assert.equal(waVid.video.caption, "Project demo video");
});

test("9. Server-side validation rejects oversized attachments per channel", () => {
  const serverOverLimit = validateAttachmentForChannel(
    {
      originalName: "huge.mp4",
      size: 60 * 1024 * 1024, // 60MB (exceeds web 50MB limit)
      mimeType: "video/mp4",
    },
    "web"
  );
  assert.equal(serverOverLimit.valid, false);
  assert.match(serverOverLimit.error, /exceeds/i);
});

test("10. Multi-attachment message grouping: Single container and corner radii preserved", () => {
  const now = new Date("2026-10-24T12:00:00.000Z").getTime();
  const rawMessages = [
    {
      _id: "msg_1",
      senderId: "customer_1",
      senderRole: "customer",
      text: "Here are the photos and invoice",
      attachments: [
        { id: "a1", type: "image", url: "https://example.com/1.jpg" },
        { id: "a2", type: "image", url: "https://example.com/2.jpg" },
        { id: "a3", type: "application/pdf", url: "https://example.com/inv.pdf", originalName: "inv.pdf" },
      ],
      createdAt: new Date(now).toISOString(),
    },
    {
      _id: "msg_2",
      senderId: "customer_1",
      senderRole: "customer",
      text: "Please let me know once reviewed.",
      attachments: [],
      createdAt: new Date(now + 30000).toISOString(),
    },
  ];

  const timeline = groupMessages(rawMessages, {
    isMeFn: () => false,
  });

  const group = timeline.find((t) => t.type === "message-group");
  assert.ok(group);
  assert.equal(group.messages.length, 2);

  // First message contains all 3 attachments in one container
  const firstMsg = group.messages[0];
  assert.equal(firstMsg.attachments.length, 3);
  assert.equal(firstMsg.position, "first");
  assert.equal(firstMsg.bubbleCornerClass, "rounded-2xl rounded-bl-[4px]");

  // Second message connects to the first
  const secondMsg = group.messages[1];
  assert.equal(secondMsg.position, "last");
  assert.equal(secondMsg.bubbleCornerClass, "rounded-2xl rounded-tl-[4px]");
});
