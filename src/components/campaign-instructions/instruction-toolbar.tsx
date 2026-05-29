import type { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { UnlockGateToolbarButton } from "./unlock-gate-toolbar-button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ClipboardCopy,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import type { ImageAlign } from "./instruction-image-extension";
import { parseYouTubeId } from "./youtube-url-parser";

type InstructionToolbarProps = {
  editor: Editor | null;
  onUploadImage?: () => void;
  onUploadVideo?: () => void;
};

export function InstructionToolbar({ editor, onUploadImage, onUploadVideo }: InstructionToolbarProps) {
  const [, forceRender] = useState(0);
  const [videoMenuOpen, setVideoMenuOpen] = useState(false);
  const videoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (videoMenuRef.current && !videoMenuRef.current.contains(e.target as Node)) {
        setVideoMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [videoMenuOpen]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateToolbarState = () => forceRender((value) => value + 1);

    editor.on("selectionUpdate", updateToolbarState);
    editor.on("transaction", updateToolbarState);
    editor.on("update", updateToolbarState);

    return () => {
      editor.off("selectionUpdate", updateToolbarState);
      editor.off("transaction", updateToolbarState);
      editor.off("update", updateToolbarState);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL", previousUrl || "https://");

    if (url === null) {
      return;
    }

    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImageByUrl = () => {
    const url = window.prompt("Nhập URL ảnh", "https://");

    if (!url) {
      return;
    }

    insertImage(url);
  };

  const insertImage = (src: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          align: "left",
          src,
        },
      })
      .run();
  };

  const insertYouTube = () => {
    setVideoMenuOpen(false);
    const url = window.prompt("Dán URL YouTube:");
    if (!url) return;
    const id = parseYouTubeId(url);
    if (!id) {
      window.alert("URL YouTube không hợp lệ");
      return;
    }
    editor.chain().focus().insertYouTube(id).run();
  };

  const triggerUploadVideo = () => {
    setVideoMenuOpen(false);
    onUploadVideo?.();
  };

  const insertCopyBlock = () => {
    const value = window.prompt("Giá trị sẽ được copy:");
    if (!value) return;
    editor.chain().focus().insertCopyBlock({ value, label: "" }).run();
  };

  const isImageSelected = editor.isActive("image");

  const setAlignment = (align: ImageAlign) => {
    if (isImageSelected) {
      editor.chain().updateAttributes("image", { align }).focus().run();
      return;
    }

    editor.chain().focus().setTextAlign(align).run();
  };

  const isAlignActive = (align: ImageAlign) => {
    if (isImageSelected) {
      return editor.getAttributes("image").align === align;
    }

    return editor.isActive({ textAlign: align });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 p-2">
      <ToolbarButton active={editor.isActive("heading", { level: 1 })} label="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("heading", { level: 2 })} label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton active={editor.isActive("bold")} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("underline")} label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton active={editor.isActive("bulletList")} label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("orderedList")} label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("blockquote")} label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton active={isAlignActive("left")} label="Align left" onClick={() => setAlignment("left")}>
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={isAlignActive("center")} label="Align center" onClick={() => setAlignment("center")}>
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton active={isAlignActive("right")} label="Align right" onClick={() => setAlignment("right")}>
        <AlignRight className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton active={editor.isActive("link")} label="Link" onClick={setLink}>
        <Link className="size-4" />
      </ToolbarButton>
      {onUploadImage && (
        <ToolbarButton label="Upload image" onClick={onUploadImage}>
          <ImagePlus className="size-4" />
        </ToolbarButton>
      )}
      <ToolbarButton label="Image URL" onClick={insertImageByUrl}>
        <ImagePlus className="size-4" />
      </ToolbarButton>
      <div className="relative" ref={videoMenuRef}>
        <button
          aria-label="Insert video"
          className="flex h-9 items-center gap-1 rounded-lg px-2 text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          onClick={() => setVideoMenuOpen((v) => !v)}
          onMouseDown={(e) => e.preventDefault()}
          title="Video"
          type="button"
        >
          <Video className="size-4" />
          <ChevronDown className="size-3" />
        </button>
        {videoMenuOpen && (
          <div className="absolute left-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
            <button
              className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-2"
              onClick={insertYouTube}
              onMouseDown={(e) => e.preventDefault()}
              type="button"
            >
              YouTube URL
            </button>
            {onUploadVideo && (
              <button
                className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-2"
                onClick={triggerUploadVideo}
                onMouseDown={(e) => e.preventDefault()}
                type="button"
              >
                Upload MP4
              </button>
            )}
          </div>
        )}
      </div>
      <ToolbarButton label="Copy block" onClick={insertCopyBlock}>
        <ClipboardCopy className="size-4" />
      </ToolbarButton>
      <UnlockGateToolbarButton editor={editor} />
      <ToolbarButton label="Clear format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton disabled={!editor.can().undo()} label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().redo()} label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`grid size-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
      }`}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-border" />;
}
