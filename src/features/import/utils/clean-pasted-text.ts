type CleanPastedTextResult = {
  cleanedText: string;
  removedLineCount: number;
  changed: boolean;
};

const STANDALONE_NOISE_PATTERNS = [
  /^\[图片(?:\s*\d+)?\]$/i,
  /^\[图(?:\s*\d+)?\]$/i,
  /^\[image(?:\s*\d+)?\]$/i,
  /^!\[[^\]]*]\([^)]*\)$/,
  /^<img[^>]*>$/i
] as const;

const STANDALONE_NOISE_MARKERS = new Set([
  "阅读原文",
  "点击关注",
  "点击上方关注",
  "点击下方关注",
  "广告",
  "免责声明",
  "赞赏",
  "推广",
  "继续滑动看下一个",
  "点击名片关注",
  "原文链接",
  "readmore",
  "readthefullarticle",
  "followusformore",
  "advertisement",
  "sponsored",
  "disclaimer"
]);

function normalizeLineForMarkerCheck(line: string) {
  return line
    .replace(/[：:!！。.,，、…·•\-—_~*#|（）()【】\[\]<>《》\s]/g, "")
    .toLowerCase();
}

function shouldDropStandaloneNoiseLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed) {
    return false;
  }

  if (STANDALONE_NOISE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  if (trimmed.length > 30) {
    return false;
  }

  return STANDALONE_NOISE_MARKERS.has(normalizeLineForMarkerCheck(trimmed));
}

export function cleanPastedText(input: string): CleanPastedTextResult {
  const normalizedText = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedText.split("\n");
  const keptLines: string[] = [];
  let removedLineCount = 0;
  let previousLineWasBlank = false;

  for (const line of lines) {
    if (shouldDropStandaloneNoiseLine(line)) {
      removedLineCount += 1;
      continue;
    }

    const trimmedRight = line.replace(/\s+$/g, "");
    const isBlank = trimmedRight.trim().length === 0;

    if (isBlank) {
      if (previousLineWasBlank) {
        removedLineCount += 1;
        continue;
      }

      keptLines.push("");
      previousLineWasBlank = true;
      continue;
    }

    keptLines.push(trimmedRight);
    previousLineWasBlank = false;
  }

  const cleanedText = keptLines.join("\n").trim();

  return {
    cleanedText,
    removedLineCount,
    changed: cleanedText !== normalizedText.trim()
  };
}
