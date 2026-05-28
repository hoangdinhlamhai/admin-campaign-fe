import { Node, mergeAttributes, type RawCommands } from "@tiptap/core";

export type InstructionVideoType = "youtube" | "upload";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    instructionVideo: {
      insertYouTube: (videoId: string) => ReturnType;
      insertUploadedVideo: (src: string) => ReturnType;
    };
  }
}

export const InstructionVideo = Node.create({
  name: "instructionVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null as string | null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-src") ??
          element.querySelector("iframe,video")?.getAttribute("src") ??
          null,
      },
      type: {
        default: "youtube" as InstructionVideoType,
        parseHTML: (element: HTMLElement) =>
          (element.getAttribute("data-type") ??
            element.getAttribute("data-instruction-video") ??
            "youtube") as InstructionVideoType,
      },
      title: {
        default: null as string | null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-title") ??
          element.querySelector("iframe")?.getAttribute("title") ??
          null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-instruction-video]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src ?? "";
    const type = (HTMLAttributes.type ?? "youtube") as InstructionVideoType;
    const title = HTMLAttributes.title ?? "";

    if (type === "youtube") {
      return [
        "div",
        mergeAttributes(
          { "data-instruction-video": "youtube", class: "instruction-video" },
          { "data-src": src, "data-type": type },
        ),
        [
          "iframe",
          {
            src: `https://www.youtube.com/embed/${src}`,
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "true",
            title: title || "YouTube video",
          },
        ],
      ];
    }

    return [
      "div",
      mergeAttributes(
        { "data-instruction-video": "upload", class: "instruction-video" },
        { "data-src": src, "data-type": type },
      ),
      ["video", { src, controls: "true", playsinline: "true" }],
    ];
  },

  addCommands(): Partial<RawCommands> {
    return {
      insertYouTube:
        (videoId: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src: videoId, type: "youtube" },
          }),
      insertUploadedVideo:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src, type: "upload" },
          }),
    };
  },
});
