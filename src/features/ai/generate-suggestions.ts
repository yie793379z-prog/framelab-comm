import { getLocalizedText } from "@/i18n/utils";
import type { Locale, LocalizedText } from "@/i18n/types";
import type { CodingFieldValue } from "@/types/coding";
import type { TemplateField, TemplateFieldOption } from "@/types/template";
import type { GenerateSuggestionsInput, SuggestedCodingValues } from "@/features/ai/types";

type TopicProfile = {
  label: LocalizedText;
  keywords: string[];
};

type SuggestionContext = {
  normalizedText: string;
  originalText: string;
  wordCount: number;
  sentenceCount: number;
  firstSentence: string;
  topic: string;
  locale: Locale;
};

const TOPIC_PROFILES: TopicProfile[] = [
  { label: { en: "a crisis response issue", "zh-CN": "一个危机回应议题" }, keywords: ["crisis", "apology", "incident", "response", "statement", "safety"] },
  { label: { en: "a policy or governance issue", "zh-CN": "一个政策或治理议题" }, keywords: ["policy", "government", "law", "regulation", "minister", "public"] },
  { label: { en: "an economic or business issue", "zh-CN": "一个经济或商业议题" }, keywords: ["market", "company", "business", "price", "cost", "investment"] },
  { label: { en: "a health communication issue", "zh-CN": "一个健康传播议题" }, keywords: ["health", "hospital", "medical", "patient", "care", "pandemic"] },
  { label: { en: "an education issue", "zh-CN": "一个教育议题" }, keywords: ["school", "university", "student", "teacher", "campus", "classroom"] },
  { label: { en: "a platform or social media issue", "zh-CN": "一个平台或社交媒体议题" }, keywords: ["platform", "social", "post", "hashtag", "creator", "viral"] },
  { label: { en: "an identity or community issue", "zh-CN": "一个身份或社群议题" }, keywords: ["community", "identity", "representation", "gender", "culture", "race"] },
  { label: { en: "an environmental issue", "zh-CN": "一个环境议题" }, keywords: ["climate", "environment", "carbon", "pollution", "sustainability", "green"] }
];

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeText(text: string) {
  return text.toLowerCase();
}

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
}

function extractFirstSentence(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const sentence = cleaned.match(/[^.!?]+[.!?]?/)?.[0]?.trim() ?? "";
  return sentence.length > 160 ? `${sentence.slice(0, 157)}...` : sentence;
}

function detectTopic(text: string, locale: Locale) {
  let bestMatch = locale === "zh-CN" ? "一个公共传播议题" : "a public communication issue";
  let bestScore = 0;

  for (const profile of TOPIC_PROFILES) {
    const score = countMatches(text, profile.keywords);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = getLocalizedText(profile.label, locale);
    }
  }

  return bestMatch;
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function chooseBestOption(options: TemplateFieldOption[] | undefined, matcher: (option: TemplateFieldOption) => boolean) {
  return options?.find(matcher)?.value ?? options?.[0]?.value ?? "";
}

function inferPrimaryFrame(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["conflict", "clash", "protest", "battle", "dispute", "tension", "debate"])) {
    return chooseBestOption(options, (option) => option.value === "conflict");
  }

  if (includesAny(context.normalizedText, ["cost", "price", "budget", "market", "economic", "jobs", "investment"])) {
    return chooseBestOption(options, (option) => option.value === "economic");
  }

  if (includesAny(context.normalizedText, ["family", "community", "victim", "lived", "personal", "people", "resident"])) {
    return chooseBestOption(options, (option) => option.value === "human-interest");
  }

  if (includesAny(context.normalizedText, ["moral", "ethic", "value", "right", "wrong", "faith"])) {
    return chooseBestOption(options, (option) => option.value === "morality");
  }

  return chooseBestOption(options, (option) => option.value === "responsibility");
}

function inferPostFormat(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["video", "watch", "clip", "reel", "livestream"])) {
    return chooseBestOption(options, (option) => option.value === "video");
  }

  if (includesAny(context.normalizedText, ["image", "photo", "pictured", "graphic", "visual"])) {
    return chooseBestOption(options, (option) => option.value === "image");
  }

  if (includesAny(context.normalizedText, ["thread", "swipe", "slide 1", "slide 2", "carousel"])) {
    return chooseBestOption(options, (option) => option.value === "carousel");
  }

  return chooseBestOption(options, (option) => option.value === "text");
}

function inferTone(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["join", "act now", "demand", "justice", "support", "sign"])) {
    return chooseBestOption(options, (option) => option.value === "activist");
  }

  if (includesAny(context.normalizedText, ["launch", "sale", "offer", "subscribe", "register", "buy"])) {
    return chooseBestOption(options, (option) => option.value === "promotional");
  }

  if (includesAny(context.normalizedText, [" i ", " my ", " our ", " we "])) {
    return chooseBestOption(options, (option) => option.value === "personal");
  }

  return chooseBestOption(options, (option) => option.value === "informational");
}

function inferTopicArea(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["platform", "social media", "post", "app", "creator", "algorithm"])) {
    return chooseBestOption(options, (option) => option.value === "platform-use");
  }

  if (includesAny(context.normalizedText, ["identity", "representation", "self", "community", "culture", "gender"])) {
    return chooseBestOption(options, (option) => option.value === "identity");
  }

  if (includesAny(context.normalizedText, ["organization", "institution", "editor", "policy", "official", "campus"])) {
    return chooseBestOption(options, (option) => option.value === "institutional-context");
  }

  return chooseBestOption(options, (option) => option.value === "media-practice");
}

function inferResponsePosture(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["false", "deny", "baseless", "unfounded", "not responsible"])) {
    return chooseBestOption(options, (option) => option.value === "deny");
  }

  if (includesAny(context.normalizedText, ["limited", "isolated", "misunderstanding", "small number", "partly"])) {
    return chooseBestOption(options, (option) => option.value === "diminish");
  }

  if (includesAny(context.normalizedText, ["sorry", "apologize", "apology", "take responsibility", "regret"])) {
    return chooseBestOption(options, (option) => option.value === "rebuild");
  }

  return chooseBestOption(options, (option) => option.value === "bolster");
}

function inferResponsibilityLevel(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  if (includesAny(context.normalizedText, ["sorry", "apologize", "take responsibility", "accept responsibility"])) {
    return chooseBestOption(options, (option) => option.value === "high");
  }

  if (includesAny(context.normalizedText, ["deny", "false", "unfounded", "not responsible"])) {
    return chooseBestOption(options, (option) => option.value === "low");
  }

  return chooseBestOption(options, (option) => option.value === "mixed");
}

function inferEngagementCues(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  const values: string[] = [];

  if (context.originalText.includes("?")) {
    values.push(chooseBestOption(options, (option) => option.value === "question"));
  }

  if (context.originalText.includes("#")) {
    values.push(chooseBestOption(options, (option) => option.value === "hashtag"));
  }

  if (includesAny(context.normalizedText, ["join", "share", "follow", "learn more", "sign up", "register", "read more"])) {
    values.push(chooseBestOption(options, (option) => option.value === "cta"));
  }

  if (context.originalText.includes("@") || includesAny(context.normalizedText, ["tag a friend", "mention"])) {
    values.push(chooseBestOption(options, (option) => option.value === "tagging"));
  }

  return Array.from(new Set(values.filter(Boolean)));
}

function inferReputationRepairSignals(context: SuggestionContext, options: TemplateFieldOption[] | undefined) {
  const values: string[] = [];

  if (includesAny(context.normalizedText, ["sorry", "apologize", "apology", "regret"])) {
    values.push(chooseBestOption(options, (option) => option.value === "apology"));
  }

  if (includesAny(context.normalizedText, ["corrective", "review", "investigate", "fix", "improve", "address"])) {
    values.push(chooseBestOption(options, (option) => option.value === "corrective-action"));
  }

  if (includesAny(context.normalizedText, ["victim", "community", "support", "affected", "stakeholder"])) {
    values.push(chooseBestOption(options, (option) => option.value === "victim-focus"));
  }

  if (includesAny(context.normalizedText, ["prevent", "future", "training", "protocol", "safeguard"])) {
    values.push(chooseBestOption(options, (option) => option.value === "future-prevention"));
  }

  if (!values.length) {
    values.push(chooseBestOption(options, (option) => option.value === "corrective-action"));
  }

  return Array.from(new Set(values.filter(Boolean)));
}

function inferSpeakerRole(context: SuggestionContext) {
  if (includesAny(context.normalizedText, ["student", "undergraduate", "graduate"])) {
    return context.locale === "zh-CN"
      ? "受访者以学生或学习者视角讨论这一议题。"
      : "Student participant discussing the issue from a learner perspective.";
  }

  if (includesAny(context.normalizedText, ["editor", "journalist", "reporter", "newsroom"])) {
    return context.locale === "zh-CN"
      ? "受访者以媒体从业者身份讨论专业流程与编辑判断。"
      : "Media practitioner reflecting on professional routines and editorial judgment.";
  }

  if (includesAny(context.normalizedText, ["spokesperson", "official", "minister", "agency"])) {
    return context.locale === "zh-CN"
      ? "受访者以机构发言人或官方身份回应这一议题。"
      : "Institutional spokesperson addressing the issue from an official role.";
  }

  if (includesAny(context.normalizedText, ["creator", "influencer", "content"])) {
    return context.locale === "zh-CN"
      ? "受访者以内容创作者视角讨论这一议题。"
      : "Platform content producer speaking from a creator perspective.";
  }

  return context.locale === "zh-CN" ? `受访者围绕${context.topic}进行讨论。` : `Participant discussing ${context.topic}.`;
}

function inferProblemDefinition(context: SuggestionContext) {
  return context.locale === "zh-CN"
    ? `该样本将${context.topic}呈现为一个值得关注并需要回应的问题。`
    : `The sample frames ${context.topic} as a salient issue that requires attention or response.`;
}

function inferSuggestedRemedy(context: SuggestionContext) {
  if (includesAny(context.normalizedText, ["policy", "regulation", "government", "authority"])) {
    return context.locale === "zh-CN"
      ? "文本暗示的解决路径是更明确的制度行动、更清晰的规则或更强的公共问责。"
      : "The implied remedy is stronger institutional action, clearer rules, or public accountability.";
  }

  if (includesAny(context.normalizedText, ["apology", "incident", "response", "safety"])) {
    return context.locale === "zh-CN"
      ? "文本暗示的解决路径是纠正性行动、更清晰的沟通以及可见的后续落实。"
      : "The implied remedy is corrective action, clearer communication, and visible follow-through.";
  }

  return context.locale === "zh-CN"
    ? "文本指向更明确的行动、协调或支持作为下一步。"
    : "The text points toward clearer action, coordination, or support as the next step.";
}

function inferNotableQuote(context: SuggestionContext) {
  return context.firstSentence || (context.locale === "zh-CN" ? "当前样本中未识别出明显的代表性引文。" : "No standout quote detected from the current sample.");
}

function generateTextSuggestion(field: TemplateField, context: SuggestionContext) {
  if (field.id === "problem-definition") {
    return inferProblemDefinition(context);
  }

  if (field.id === "suggested-remedy") {
    return inferSuggestedRemedy(context);
  }

  if (field.id === "speaker-role") {
    return inferSpeakerRole(context);
  }

  if (field.id === "notable-quote") {
    return inferNotableQuote(context);
  }

  return context.locale === "zh-CN"
    ? `初步编码备注：该样本似乎聚焦于${context.topic}。`
    : `Initial coding note: the sample appears to focus on ${context.topic}.`;
}

function generateNumberSuggestion(context: SuggestionContext) {
  return Math.max(1, Math.min(5, Math.round(context.wordCount / 45)));
}

function generateBooleanSuggestion(context: SuggestionContext) {
  return context.originalText.includes("?") || includesAny(context.normalizedText, ["should", "must", "need to"]);
}

function generateSingleSelectSuggestion(field: TemplateField, templateId: string, context: SuggestionContext) {
  if (templateId === "news-framing-analysis" && field.id === "primary-frame") {
    return inferPrimaryFrame(context, field.options);
  }

  if (templateId === "social-media-content-analysis" && field.id === "post-format") {
    return inferPostFormat(context, field.options);
  }

  if (templateId === "social-media-content-analysis" && field.id === "tone") {
    return inferTone(context, field.options);
  }

  if (templateId === "interview-pre-coding" && field.id === "topic-area") {
    return inferTopicArea(context, field.options);
  }

  if (templateId === "crisis-communication-scan" && field.id === "response-posture") {
    return inferResponsePosture(context, field.options);
  }

  if (templateId === "crisis-communication-scan" && field.id === "responsibility-level") {
    return inferResponsibilityLevel(context, field.options);
  }

  return field.options?.[0]?.value ?? "";
}

function generateMultiSelectSuggestion(field: TemplateField, templateId: string, context: SuggestionContext) {
  if (templateId === "social-media-content-analysis" && field.id === "engagement-cues") {
    return inferEngagementCues(context, field.options);
  }

  if (templateId === "crisis-communication-scan" && field.id === "reputation-repair-signals") {
    return inferReputationRepairSignals(context, field.options);
  }

  return field.options?.[0] ? [field.options[0].value] : [];
}

function buildSuggestionContext(text: string, locale: Locale): SuggestionContext {
  const normalizedText = normalizeText(text);
  const cleanedText = text.trim();

  return {
    normalizedText,
    originalText: cleanedText,
    wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
    sentenceCount: cleanedText.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean).length || 1,
    firstSentence: extractFirstSentence(cleanedText),
    topic: detectTopic(normalizedText, locale),
    locale
  };
}

function generateFieldSuggestion(field: TemplateField, templateId: string, context: SuggestionContext): CodingFieldValue {
  if (field.type === "text") {
    return generateTextSuggestion(field, context);
  }

  if (field.type === "number") {
    return generateNumberSuggestion(context);
  }

  if (field.type === "boolean") {
    return generateBooleanSuggestion(context);
  }

  if (field.type === "single-select") {
    return generateSingleSelectSuggestion(field, templateId, context);
  }

  if (field.type === "multi-select") {
    return generateMultiSelectSuggestion(field, templateId, context);
  }

  return null;
}

export async function generateSuggestions({
  sample,
  template,
  currentValues,
  locale
}: GenerateSuggestionsInput): Promise<SuggestedCodingValues> {
  const context = buildSuggestionContext(sample.text, locale);
  const suggestions: SuggestedCodingValues = {};

  for (const field of template.fields) {
    if (!isEmptyCodingValue(currentValues[field.id])) {
      continue;
    }

    suggestions[field.id] = generateFieldSuggestion(field, template.id, context);
  }

  await delay(700);

  return suggestions;
}
