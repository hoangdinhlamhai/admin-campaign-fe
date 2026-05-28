import { Eye, FileText, Save, Smartphone } from "lucide-react";

type InstructionPreviewSidebarProps = {
  content: string;
  onSave: () => void;
};

export function InstructionPreviewSidebar({ content, onSave }: InstructionPreviewSidebarProps) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Eye className="size-4 text-emerald-300" />
          <h3 className="font-semibold text-white">Preview hướng dẫn</h3>
        </div>
        <div
          className="instruction-preview max-h-[560px] overflow-auto rounded-2xl border border-white/10 bg-zinc-950/45 p-4 text-sm leading-7 text-zinc-200"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
        <h3 className="font-semibold text-white">Công cụ</h3>
        <div className="mt-4 grid gap-2">
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200" onClick={onSave} type="button">
            <Save className="size-4" />
            Lưu hướng dẫn
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
            <Smartphone className="size-4" />
            Xem dạng mobile
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]" type="button">
            <FileText className="size-4" />
            Chèn mẫu mặc định
          </button>
        </div>
      </section>

      <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 text-sm text-zinc-400 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
        <h3 className="font-semibold text-white">Gợi ý nội dung</h3>
        <p className="mt-2">Dùng danh sách đánh số cho từng bước, in đậm keyword hoặc pass quan trọng, và giữ mỗi bước ngắn để user dễ làm theo.</p>
      </section>
    </aside>
  );
}
