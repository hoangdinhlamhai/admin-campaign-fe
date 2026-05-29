"use client";

import { useLayoutEffect, createElement, type RefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import { UnlockGateRenderer } from "./unlock-gate-renderer";

/**
 * Hydrates all `[data-unlock-gate]` DOM nodes inside the given container ref.
 * Each gate hides all sibling elements after it until the next gate or end.
 * When user enters the correct code, siblings are revealed.
 */
export function useUnlockGateHydration(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const gates = Array.from(
      root.querySelectorAll<HTMLDivElement>("[data-unlock-gate]"),
    );
    const reactRoots: Root[] = [];

    gates.forEach((gate) => {
      const code = gate.dataset.code ?? "12345";
      const prompt =
        gate.dataset.prompt ??
        "Hoàn thành thử thách nhanh dưới đây để mở khoá nhé!";
      const placeholder =
        gate.dataset.placeholder ?? "Nhập mã mở khoá vào đây...";
      const buttonLabel =
        gate.dataset.buttonLabel ?? "Mở Khoá Ngay!";

      // Collect siblings after this gate until next gate or end
      const siblings: HTMLElement[] = [];
      let next = gate.nextElementSibling as HTMLElement | null;
      while (next) {
        if (next.dataset.unlockGate !== undefined) break;
        siblings.push(next);
        next.style.display = "none";
        next = next.nextElementSibling as HTMLElement | null;
      }

      // Clear gate inner DOM and mount React renderer
      gate.innerHTML = "";
      const reactRoot = createRoot(gate);
      reactRoot.render(
        createElement(UnlockGateRenderer, {
          code,
          prompt,
          placeholder,
          buttonLabel,
          onUnlock: () =>
            siblings.forEach((s) => {
              s.style.display = "";
            }),
        }),
      );
      reactRoots.push(reactRoot);
    });

    return () => {
      reactRoots.forEach((r) => {
        try {
          r.unmount();
        } catch {
          // Already unmounted — safe to ignore
        }
      });
    };
  }, [rootRef]);
}
