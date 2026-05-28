import { Image } from "@tiptap/extension-image";

export type ImageAlign = "left" | "center" | "right";

export const InstructionImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align") || "left",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
    };
  },
});
