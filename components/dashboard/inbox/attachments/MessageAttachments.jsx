"use client";
import { useState, useMemo } from "react";
import ImageGrid from "./ImageGrid";
import VideoCard from "./VideoCard";
import AudioPlayerCard from "./AudioPlayerCard";
import DocumentCard from "./DocumentCard";
import MediaViewerModal from "./MediaViewerModal";
import { categorizeAttachment, normalizeAttachment } from "@/utils/attachmentHelper";

/**
 * MessageAttachments renders all attachments associated with a single message,
 * adhering to Facebook Messenger grouping rules:
 * - Images are grouped into a cohesive responsive grid with a single viewer.
 * - Videos, audios, and documents are rendered in cards with consistent spacing.
 */
export default function MessageAttachments({ attachments = [], isMe = false }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const normalizedList = useMemo(() => {
    if (!Array.isArray(attachments)) return [];
    return attachments.map(normalizeAttachment);
  }, [attachments]);

  // Separate attachments by category
  const { images, videos, audios, documents } = useMemo(() => {
    const imgList = [];
    const vidList = [];
    const audList = [];
    const docList = [];

    for (const att of normalizedList) {
      if (att.category === "image") {
        imgList.push(att);
      } else if (att.category === "video") {
        vidList.push(att);
      } else if (att.category === "audio") {
        audList.push(att);
      } else {
        docList.push(att);
      }
    }

    return {
      images: imgList,
      videos: vidList,
      audios: audList,
      documents: docList,
    };
  }, [normalizedList]);

  if (normalizedList.length === 0) return null;

  const handleOpenImageViewer = (index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleOpenVideoViewer = (videoAtt) => {
    const idx = normalizedList.findIndex((a) => a.url === videoAtt.url);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 my-1 max-w-full">
      {/* 1. Cohesive Image Grid */}
      {images.length > 0 && (
        <ImageGrid images={images} onSelectImage={handleOpenImageViewer} />
      )}

      {/* 2. Videos */}
      {videos.map((vid, idx) => (
        <VideoCard
          key={vid.id || idx}
          attachment={vid}
          isMe={isMe}
          onOpenModal={handleOpenVideoViewer}
        />
      ))}

      {/* 3. Audio & Voice notes */}
      {audios.map((aud, idx) => (
        <AudioPlayerCard key={aud.id || idx} attachment={aud} isMe={isMe} />
      ))}

      {/* 4. Documents & other files */}
      {documents.map((doc, idx) => (
        <DocumentCard key={doc.id || idx} attachment={doc} isMe={isMe} />
      ))}

      {/* Lightbox / Modal Media Viewer for images & videos */}
      {viewerOpen && (
        <MediaViewerModal
          items={images.length > 0 ? images : normalizedList}
          initialIndex={viewerIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
