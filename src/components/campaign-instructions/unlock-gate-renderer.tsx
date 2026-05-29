"use client";

import { useState } from "react";

type Props = {
  code: string;
  prompt: string;
  placeholder: string;
  buttonLabel: string;
  onUnlock: () => void;
};

export function UnlockGateRenderer({
  code,
  prompt,
  placeholder,
  buttonLabel,
  onUnlock,
}: Props) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);

  const onSubmit = () => {
    if (input.trim() === code) {
      setUnlocked(true);
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  if (unlocked) {
    return (
      <div className="text-sm text-success font-medium my-3">
        ✅ Đã mở khoá
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 my-4">
      <p className="text-center text-sm italic text-muted-foreground">
        {prompt}
      </p>
      <div className="flex gap-2">
        <input
          className={`flex-1 rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-border-strong ${shake ? "animate-shake border-danger" : ""}`}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
        />
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-[#5b67d8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4f5acb]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
