import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { InstructionImage } from "./instruction-image-extension";
import { InstructionToolbar } from "./instruction-toolbar";

type InstructionEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export function InstructionEditor({ content, onChange }: InstructionEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      InstructionImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "instruction-image",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-200 underline underline-offset-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Nhập hướng dẫn nhiệm vụ cho user...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[520px] max-w-none outline-none px-5 py-5 text-sm leading-7 text-foreground prose-headings:text-foreground prose-strong:text-foreground",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === content) {
      return;
    }

    editor.commands.setContent(content);
  }, [content, editor]);

  return (
    <section className="overflow-hidden rounded-[1.1rem] border border-border bg-surface shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Nội dung hướng dẫn</h3>
          <p className="mt-1 text-sm text-muted-foreground">Chỉnh sửa trực tiếp, định dạng như trình soạn thảo văn bản.</p>
        </div>
      </div>
      <InstructionToolbar editor={editor} />
      <EditorContent className="instruction-editor instruction-light" editor={editor} />
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        Nội dung sẽ được dùng cho phần preview hướng dẫn của chiến dịch.
      </div>
    </section>
  );
}
