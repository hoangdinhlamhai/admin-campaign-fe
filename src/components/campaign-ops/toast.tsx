import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/92 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          role="status"
        >
          <CheckCircle2 className="size-4 text-emerald-300" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
