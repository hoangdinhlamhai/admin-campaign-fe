import { Maximize2, Minimize2 } from "lucide-react";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { uploadMedia, uploadMediaWithProgress } from "@/lib/api/media-api";
import type { CampaignCreateForm } from "@/lib/campaign-create-data";
import { DEFAULT_PREVIEW_DEVICE_ID, getPreviewDevice } from "@/lib/preview-devices";
import { CopyBlock } from "./copy-block-extension";
import { CopyBlockBubbleMenu } from "./copy-block-bubble-menu";
import { DevicePreviewToggle } from "./device-preview-toggle";
import { InstructionImage } from "./instruction-image-extension";
import { InstructionVideo } from "./instruction-video-extension";
import { InstructionToolbar } from "./instruction-toolbar";

type InstructionInlineEditorProps = {
  content: string;
  form: CampaignCreateForm;
  onChange: (content: string) => void;
  onUploadStateChange?: (uploading: boolean, error: string | null) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export function InstructionInlineEditor({
  content,
  form: _form,
  onChange,
  onUploadStateChange,
}: InstructionInlineEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState(DEFAULT_PREVIEW_DEVICE_ID);
  const [fullscreen, setFullscreen] = useState(false);
  const device = getPreviewDevice(deviceId);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  useEffect(() => {
    onUploadStateChange?.(uploading, uploadError);
  }, [uploading, uploadError, onUploadStateChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      UnderlineExtension,
      InstructionImage.configure({ allowBase64: false, HTMLAttributes: { class: "instruction-image" } }),
      InstructionVideo,
      CopyBlock,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: "text-emerald-200 underline underline-offset-4" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Nhập hướng dẫn nhiệm vụ cho user..." }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[480px] max-w-none outline-none px-5 py-5 text-sm leading-7 text-foreground",
      },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((file) => uploadAndInsert(file));
        return true;
      },
      handleDrop(_view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((file) => uploadAndInsert(file));
        return true;
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  const uploadAndInsert = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (file.size > MAX_FILE_SIZE) {
        setUploadError("Ảnh vượt quá 5MB");
        return;
      }
      try {
        setUploading(true);
        setUploadError(null);
        const { id, publicUrl } = await uploadMedia(file);
        editor.chain().focus().setImage({ src: publicUrl, alt: file.name, title: id }).run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Lỗi tải ảnh");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  const handleImageButton = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadAndInsert(file);
    };
    input.click();
  }, [uploadAndInsert]);

  const uploadAndInsertVideo = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!file.type.startsWith("video/")) {
        setUploadError("Chỉ chấp nhận file video");
        return;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        setUploadError("Video vượt quá 50MB");
        return;
      }
      try {
        setUploadError(null);
        setVideoProgress(0);
        const { publicUrl } = await uploadMediaWithProgress(file, (pct) => {
          setVideoProgress(pct);
        });
        editor.chain().focus().insertUploadedVideo(publicUrl).run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Lỗi tải video");
      } finally {
        setVideoProgress(null);
      }
    },
    [editor],
  );

  const handleVideoButton = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadAndInsertVideo(file);
    };
    input.click();
  }, [uploadAndInsertVideo]);

  useEffect(() => {
    if (!editor || editor.getHTML() === content) return;
    editor.commands.setContent(content);
  }, [content, editor]);

  return (
    <section
      className={
        fullscreen
          ? "fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-background shadow-2xl"
          : "overflow-hidden rounded-[1.1rem] border border-border bg-surface shadow-2xl backdrop-blur-2xl"
      }
    >
      <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-foreground">
          {fullscreen ? "Hướng dẫn nhiệm vụ — Fullscreen" : "Xem trước hướng dẫn (Preview)"}
        </h3>
        <div className="flex items-center gap-3">
          {uploading && <span className="text-xs text-brand">Đang tải ảnh...</span>}
          {videoProgress !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand">Đang tải video {videoProgress}%</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-brand transition-[width] duration-150"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          )}
          {uploadError && <span className="text-xs text-rose-400">{uploadError}</span>}
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface"
            onClick={() => setFullscreen((v) => !v)}
            type="button"
          >
            {fullscreen ? (
              <>
                Thoát fullscreen
                <Minimize2 className="size-4" />
              </>
            ) : (
              <>
                Xem fullscreen
                <Maximize2 className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <InstructionToolbar editor={editor} onUploadImage={handleImageButton} onUploadVideo={handleVideoButton} />

      <div className="border-b border-border px-5 py-4">
        <DevicePreviewToggle selectedId={deviceId} onSelect={setDeviceId} />
      </div>

      <div className={fullscreen ? "flex-1 overflow-auto p-5" : "p-5"}>
        <div className="flex justify-center">
          <div
            className="instruction-light w-full rounded-2xl border border-border"
            style={{
              maxWidth: device.width ? `${device.width}px` : "100%",
              transition: "max-width 200ms ease",
            }}
          >
            <EditorContent className="instruction-editor" editor={editor} />
          </div>
        </div>
        {!fullscreen && (
          <p className="mt-3 text-xs text-muted-foreground">Chỉnh sửa nội dung và chèn ảnh trực tiếp. Hỗ trợ paste, kéo-thả, hoặc nút ảnh trên thanh công cụ.</p>
        )}
      </div>
      <CopyBlockBubbleMenu editor={editor} />
    </section>
  );
}
