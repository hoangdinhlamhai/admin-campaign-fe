"use client";

import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type UnlockGateBubbleMenuProps = {
  editor: Editor | null;
};

export function UnlockGateBubbleMenu({ editor }: UnlockGateBubbleMenuProps) {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");

  useEffect(() => {
    if (!editor) return;
    const sync = () => {
      if (editor.isActive("unlockGate")) {
        const attrs = editor.getAttributes("unlockGate");
        setCode((attrs.code as string) ?? "");
        setPrompt((attrs.prompt as string) ?? "");
        setPlaceholder((attrs.placeholder as string) ?? "");
        setButtonLabel((attrs.buttonLabel as string) ?? "");
      }
    };
    editor.on("selectionUpdate", sync);
    editor.on("transaction", sync);
    sync();
    return () => {
      editor.off("selectionUpdate", sync);
      editor.off("transaction", sync);
    };
  }, [editor]);

  if (!editor) return null;

  const update = (attrs: Record<string, string>) => {
    editor.chain().updateUnlockGate(attrs).run();
  };

  const onCodeChange = (next: string) => {
    setCode(next);
    update({ code: next });
  };

  const onPromptChange = (next: string) => {
    setPrompt(next);
    update({ prompt: next });
  };

  const onPlaceholderChange = (next: string) => {
    setPlaceholder(next);
    update({ placeholder: next });
  };

  const onButtonLabelChange = (next: string) => {
    setButtonLabel(next);
    update({ buttonLabel: next });
  };

  const onDelete = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="unlockGateBubble"
      shouldShow={({ editor: e }) => e.isActive("unlockGate")}
      updateDelay={0}
    >
      <div className="flex w-80 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-2xl">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Mã mở khoá
          </span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-border-strong"
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="VD: 12345"
            value={code}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Câu prompt
          </span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-border-strong"
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Hoàn thành thử thách..."
            value={prompt}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Placeholder input
          </span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-border-strong"
            onChange={(e) => onPlaceholderChange(e.target.value)}
            placeholder="Nhập mã mở khoá..."
            value={placeholder}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Label nút
          </span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-border-strong"
            onChange={(e) => onButtonLabelChange(e.target.value)}
            placeholder="Mở Khoá Ngay!"
            value={buttonLabel}
          />
        </label>
        <button
          className="inline-flex items-center justify-center gap-1 rounded-md bg-danger/15 px-2 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/25"
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="size-3.5" />
          Xóa block
        </button>
      </div>
    </BubbleMenu>
  );
}
