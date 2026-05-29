import { Node, mergeAttributes, type RawCommands } from "@tiptap/core";

/**
 * Unlock Gate — Tiptap atom node for campaign instructions.
 * Admin sets a code + prompt; user-end renderer shows input + button.
 * Correct code unlocks content below the gate.
 *
 * NOTE: The code is stored in DOM attributes — this is a UX challenge,
 * NOT a security mechanism. Users can inspect the DOM to find the code.
 */

export interface UnlockGateAttrs {
  code: string;
  prompt: string;
  placeholder: string;
  buttonLabel: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    unlockGate: {
      insertUnlockGate: (attrs?: Partial<UnlockGateAttrs>) => ReturnType;
      updateUnlockGate: (attrs: Partial<UnlockGateAttrs>) => ReturnType;
    };
  }
}

export const UnlockGateExtension = Node.create({
  name: "unlockGate",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: "12345",
        parseHTML: (element) => element.getAttribute("data-code") ?? "12345",
        renderHTML: (attributes) => ({ "data-code": attributes.code }),
      },
      prompt: {
        default: "Hoàn thành thử thách nhanh dưới đây để mở khoá nhé!",
        parseHTML: (element) => element.getAttribute("data-prompt") ?? "",
        renderHTML: (attributes) => ({ "data-prompt": attributes.prompt }),
      },
      placeholder: {
        default: "Nhập mã mở khoá vào đây...",
        parseHTML: (element) =>
          element.getAttribute("data-placeholder") ?? "",
        renderHTML: (attributes) => ({
          "data-placeholder": attributes.placeholder,
        }),
      },
      buttonLabel: {
        default: "Mở Khoá Ngay!",
        parseHTML: (element) =>
          element.getAttribute("data-button-label") ?? "",
        renderHTML: (attributes) => ({
          "data-button-label": attributes.buttonLabel,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-unlock-gate]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-unlock-gate": "" }, HTMLAttributes),
    ];
  },

  addCommands(): Partial<RawCommands> {
    return {
      insertUnlockGate:
        (attrs?: Partial<UnlockGateAttrs>) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: attrs ?? {},
          }),
      updateUnlockGate:
        (attrs: Partial<UnlockGateAttrs>) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});
