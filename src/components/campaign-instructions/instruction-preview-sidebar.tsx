import { Eye, FileText, Save, Smartphone } from "lucide-react";

type InstructionPreviewSidebarProps = {
  content: string;
  onSave: () => void;
};

export function InstructionPreviewSidebar({ content, onSave }: InstructionPreviewSidebarProps) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Eye className="size-4 text-brand" />
          <h3 className="font-semibold text-foreground">Preview hướng dẫn</h3>
        </div>
        <div
          className="instruction-light instruction-preview max-h-[560px] overflow-auto rounded-2xl border border-border p-4 text-sm leading-7"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      <section className="rounded-[1.1rem] border border-border bg-surface p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <h3 className="font-semibold text-foreground">Công cụ</h3>
        <div className="mt-4 grid gap-2">
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground transition hover:bg-emerald-200" onClick={onSave} type="button">
            <Save className="size-4" />
            Lưu hướng dẫn
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold text-foreground transition hover:bg-surface" type="button">
            <Smartphone className="size-4" />
            Xem dạng mobile
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold text-foreground transition hover:bg-surface" type="button">
            <FileText className="size-4" />
            Chèn mẫu mặc định
          </button>
        </div>
      </section>

      <section className="rounded-[1.1rem] border border-border bg-surface p-4 text-sm text-muted-foreground shadow-2xl backdrop-blur-2xl sm:p-5">
        <h3 className="font-semibold text-foreground">Gợi ý nội dung</h3>
        <p className="mt-2">Dùng danh sách đánh số cho từng bước, in đậm keyword hoặc pass quan trọng, và giữ mỗi bước ngắn để user dễ làm theo.</p>
      </section>
    </aside>
  );
}
