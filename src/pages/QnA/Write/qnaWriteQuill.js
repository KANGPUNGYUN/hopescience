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

// base64 저장 대신 URL 입력 방식으로 교체 — base64는 수 백KB가 되어 백엔드 크기 제한에 걸림
function imageUrlHandler() {
  const url = prompt("이미지 URL을 입력해주세요");
  if (!url) return;
  const normalizedUrl =
    /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const quill = this.quill;
  const range = quill.getSelection(true);
  quill.insertEmbed(range.index, "image", normalizedUrl, "user");
  quill.setSelection(range.index + 1, 0, "silent");
}

export const QNA_QUILL_MODULES = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageUrlHandler,
    },
  },
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
