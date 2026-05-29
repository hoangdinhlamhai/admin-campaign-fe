import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type CopyBlockBubbleMenuProps = {
  editor: Editor | null;
};

export function CopyBlockBubbleMenu({ editor }: CopyBlockBubbleMenuProps) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!editor) return;
    const sync = () => {
      if (editor.isActive("copyBlock")) {
        const attrs = editor.getAttributes("copyBlock");
        setValue((attrs.value as string) ?? "");
        setLabel((attrs.label as string) ?? "");
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

  const onValueChange = (next: string) => {
    setValue(next);
    editor.chain().updateCopyBlock({ value: next, label }).run();
  };

  const onLabelChange = (next: string) => {
    setLabel(next);
    editor.chain().updateCopyBlock({ value, label: next }).run();
  };

  const onDelete = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="copyBlockBubble"
      shouldShow={({ editor }) => editor.isActive("copyBlock")}
      updateDelay={0}
    >
      <div className="flex w-72 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-2xl">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Giá trị copy</span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-brand/40"
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="VD: hãy trao cho anh"
            value={value}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Label hiển thị</span>
          <input
            className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-foreground outline-none focus:border-brand/40"
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Mặc định = giá trị copy"
            value={label}
          />
        </label>
        <button
          className="inline-flex items-center justify-center gap-1 rounded-md bg-rose-500/15 px-2 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25"
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
