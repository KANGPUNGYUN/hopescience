import { Quill } from "react-quill-new";

const Link = Quill.import("formats/link");

class ExternalLink extends Link {
  static create(value) {
    if (value && !/^https?:\/\//i.test(value) && !/^mailto:/i.test(value)) {
      value = `https://${value}`;
    }
    const node = super.create(value);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    return node;
  }
}

Quill.register(ExternalLink, true);

export const QNA_QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export const QNA_QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

export function isQuillEmpty(html) {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return text.length === 0;
}

export function isHtmlContent(content) {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}
