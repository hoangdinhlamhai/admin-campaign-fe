import { Node, mergeAttributes, type RawCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    copyBlock: {
      insertCopyBlock: (attrs: { value: string; label?: string }) => ReturnType;
      updateCopyBlock: (attrs: { value: string; label?: string }) => ReturnType;
    };
  }
}

export const CopyBlock = Node.create({
  name: "copyBlock",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      value: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-value") ?? "",
      },
      label: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-label") ?? "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-copy-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const value = (HTMLAttributes.value ?? "") as string;
    const label = (HTMLAttributes.label ?? "") as string;
    const display = label || value || "Copy";
    return [
      "span",
      mergeAttributes(
        { "data-copy-block": "true", class: "copy-block" },
        { "data-value": value, "data-label": label },
      ),
      ["span", { class: "copy-block-text" }, display],
      [
        "button",
        { class: "copy-btn", type: "button", "data-copy": value, contenteditable: "false" },
        "Copy",
      ],
    ];
  },

  addCommands(): Partial<RawCommands> {
    return {
      insertCopyBlock:
        (attrs: { value: string; label?: string }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { value: attrs.value, label: attrs.label ?? "" },
          }),
      updateCopyBlock:
        (attrs: { value: string; label?: string }) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});
