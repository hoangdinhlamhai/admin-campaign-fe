"use client";

import type { Editor } from "@tiptap/react";
import { Lock } from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function UnlockGateToolbarButton({ editor }: Props) {
  if (!editor) return null;

  const onClick = () => {
    editor.chain().focus().insertUnlockGate({}).run();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-2"
      title="Chèn ô mở khoá"
    >
      <Lock className="size-3.5" />
      Ô mở khoá
    </button>
  );
}
