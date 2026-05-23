/** Figma 말풍선(73×31) — 꼬리가 데이터 포인트를 가리킴 */
export const createSpeechBubblePath = (
  width,
  {
    bodyHeight = 20,
    tailHeight = 7,
    radius = 10,
    tailCenterX,
    tailHalfWidth = 4,
    placement = "above",
  } = {}
) => {
  const tailX = tailCenterX ?? width / 2;
  const r = Math.min(radius, width / 2 - 1, bodyHeight / 2);

  if (placement === "below") {
    const bodyTop = tailHeight;
    const bodyBottom = bodyHeight + tailHeight;

    // 상단 꼬리 → 본체를 한 방향으로만 그림 (자기 교차 없음, fill 누락 방지)
    return [
      `M ${r} ${bodyTop}`,
      `H ${tailX - tailHalfWidth}`,
      `L ${tailX - 1.2} ${bodyTop}`,
      `L ${tailX} 0`,
      `L ${tailX + 1.2} ${bodyTop}`,
      `H ${width - r}`,
      `Q ${width} ${bodyTop} ${width} ${bodyTop + r}`,
      `V ${bodyBottom - r}`,
      `Q ${width} ${bodyBottom} ${width - r} ${bodyBottom}`,
      `H ${r}`,
      `Q 0 ${bodyBottom} 0 ${bodyBottom - r}`,
      `V ${bodyTop + r}`,
      `Q 0 ${bodyTop} ${r} ${bodyTop}`,
      "Z",
    ].join(" ");
  }

  const bottom = bodyHeight;
  const tipY = bodyHeight + tailHeight;

  return [
    `M ${r} 0`,
    `H ${width - r}`,
    `Q ${width} 0 ${width} ${r}`,
    `V ${bottom - r}`,
    `Q ${width} ${bottom} ${width - r} ${bottom}`,
    `H ${tailX + tailHalfWidth}`,
    `L ${tailX + 1.2} ${tipY}`,
    `L ${tailX} ${tipY + 0.2}`,
    `L ${tailX - 1.2} ${tipY}`,
    `L ${tailX - tailHalfWidth} ${bottom}`,
    `H ${r}`,
    `Q 0 ${bottom} 0 ${bottom - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
};

export const getTooltipLayout = (date, sessions) => {
  const dateText = `${date} `;
  const countText = `${sessions}개`;
  const textWidth = dateText.length * 6.5 + countText.length * 7 + 14;
  const width = Math.max(56, Math.ceil(textWidth));
  const bodyHeight = 20;
  const tailHeight = 7;
  const gapAboveDot = 6;
  const gapBelowDot = 6;

  return {
    width,
    bodyHeight,
    tailHeight,
    totalHeight: bodyHeight + tailHeight,
    gapAboveDot,
    gapBelowDot,
    dateText,
    countText,
  };
};
