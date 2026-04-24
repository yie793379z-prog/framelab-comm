import type { AnalysisTemplate } from "@/types/template";

export const analysisTemplates: AnalysisTemplate[] = [
  {
    id: "news-framing-analysis",
    name: {
      en: "News Framing Analysis",
      "zh-CN": "新闻框架分析"
    },
    shortDescription: {
      en: "Code news texts for dominant issue frames, problem definitions, and proposed remedies.",
      "zh-CN": "对新闻文本中的主导议题框架、问题界定和应对方案进行编码。"
    },
    researchUseCase: {
      en: "Introductory framing analysis for news articles, explainers, and opinion pieces.",
      "zh-CN": "适用于新闻报道、解释性文章和评论文本的入门式框架分析。"
    },
    fields: [
      {
        id: "primary-frame",
        label: {
          en: "Primary Frame",
          "zh-CN": "主导框架"
        },
        description: {
          en: "Select the dominant interpretive frame in the sample.",
          "zh-CN": "选择该样本中最主要的解释性框架。"
        },
        type: "single-select",
        options: [
          { value: "conflict", label: { en: "Conflict", "zh-CN": "冲突" } },
          { value: "responsibility", label: { en: "Responsibility", "zh-CN": "责任归因" } },
          { value: "economic", label: { en: "Economic consequences", "zh-CN": "经济后果" } },
          { value: "human-interest", label: { en: "Human interest", "zh-CN": "人情味/人物故事" } },
          { value: "morality", label: { en: "Morality", "zh-CN": "道德评价" } }
        ]
      },
      {
        id: "problem-definition",
        label: {
          en: "Problem Definition",
          "zh-CN": "问题界定"
        },
        description: {
          en: "Capture how the issue is defined in the text.",
          "zh-CN": "记录文本如何界定这个问题。"
        },
        type: "text",
        placeholder: {
          en: "What is presented as the core issue?",
          "zh-CN": "文本将什么呈现为核心问题？"
        }
      },
      {
        id: "suggested-remedy",
        label: {
          en: "Suggested Remedy",
          "zh-CN": "建议的解决路径"
        },
        description: {
          en: "Note the remedy, response, or action implied in the sample.",
          "zh-CN": "记录样本中暗示的解决办法、回应方式或行动方向。"
        },
        type: "text",
        placeholder: {
          en: "What solution or response is emphasized?",
          "zh-CN": "文本强调了什么解决方案或回应方式？"
        }
      }
    ]
  },
  {
    id: "social-media-content-analysis",
    name: {
      en: "Social Media Content Analysis",
      "zh-CN": "社交媒体内容分析"
    },
    shortDescription: {
      en: "Classify social posts by format, tone, issue emphasis, and engagement cues.",
      "zh-CN": "根据帖子形式、语气、议题重点和互动线索对社交媒体内容进行分类。"
    },
    researchUseCase: {
      en: "Small platform studies involving short posts, captions, campaign content, or advocacy messaging.",
      "zh-CN": "适用于短帖、配文、宣传内容或倡导传播文本的小型平台研究。"
    },
    fields: [
      {
        id: "post-format",
        label: {
          en: "Post Format",
          "zh-CN": "帖子形式"
        },
        description: {
          en: "Identify the main post format.",
          "zh-CN": "识别内容的主要发布形式。"
        },
        type: "single-select",
        options: [
          { value: "text", label: { en: "Text only", "zh-CN": "纯文本" } },
          { value: "image", label: { en: "Image-led", "zh-CN": "图片主导" } },
          { value: "video", label: { en: "Video-led", "zh-CN": "视频主导" } },
          { value: "carousel", label: { en: "Carousel / thread", "zh-CN": "轮播 / 串帖" } }
        ]
      },
      {
        id: "tone",
        label: {
          en: "Tone",
          "zh-CN": "传播语气"
        },
        description: {
          en: "Mark the prevailing communication tone.",
          "zh-CN": "标记文本的主要传播语气。"
        },
        type: "single-select",
        options: [
          { value: "informational", label: { en: "Informational", "zh-CN": "信息型" } },
          { value: "promotional", label: { en: "Promotional", "zh-CN": "宣传型" } },
          { value: "activist", label: { en: "Activist / persuasive", "zh-CN": "倡导 / 说服型" } },
          { value: "personal", label: { en: "Personal / relational", "zh-CN": "个人 / 关系型" } }
        ]
      },
      {
        id: "engagement-cues",
        label: {
          en: "Engagement Cues",
          "zh-CN": "互动线索"
        },
        description: {
          en: "Track prompts aimed at driving user action.",
          "zh-CN": "记录用于引导用户互动或行动的提示方式。"
        },
        type: "multi-select",
        options: [
          { value: "question", label: { en: "Question prompt", "zh-CN": "提问式引导" } },
          { value: "hashtag", label: { en: "Hashtag strategy", "zh-CN": "话题标签策略" } },
          { value: "cta", label: { en: "Direct call to action", "zh-CN": "直接行动号召" } },
          { value: "tagging", label: { en: "Tagging / mentions", "zh-CN": "@提及 / 点名" } }
        ]
      }
    ]
  },
  {
    id: "interview-pre-coding",
    name: {
      en: "Interview Pre-coding",
      "zh-CN": "访谈预编码"
    },
    shortDescription: {
      en: "Create an initial coding pass for interview excerpts before deeper manual thematic analysis.",
      "zh-CN": "在深入人工主题分析前，对访谈片段进行初步编码整理。"
    },
    researchUseCase: {
      en: "Thesis preparation, pilot interview review, and early-stage qualitative organization.",
      "zh-CN": "适用于论文准备、访谈试点回顾和早期定性材料整理。"
    },
    fields: [
      {
        id: "speaker-role",
        label: {
          en: "Speaker Role",
          "zh-CN": "说话者角色"
        },
        description: {
          en: "Identify the participant role or position relevant to the project.",
          "zh-CN": "标记受访者与研究相关的角色或身份位置。"
        },
        type: "text",
        placeholder: {
          en: "Student, editor, campaign staffer, etc.",
          "zh-CN": "如学生、编辑、竞选团队成员等。"
        }
      },
      {
        id: "topic-area",
        label: {
          en: "Topic Area",
          "zh-CN": "主题领域"
        },
        description: {
          en: "Assign a broad topical cluster.",
          "zh-CN": "为内容指定一个较宽泛的主题类别。"
        },
        type: "single-select",
        options: [
          { value: "media-practice", label: { en: "Media practice", "zh-CN": "媒体实践" } },
          { value: "platform-use", label: { en: "Platform use", "zh-CN": "平台使用" } },
          { value: "identity", label: { en: "Identity / self-presentation", "zh-CN": "身份 / 自我呈现" } },
          { value: "institutional-context", label: { en: "Institutional context", "zh-CN": "制度 / 机构情境" } }
        ]
      },
      {
        id: "notable-quote",
        label: {
          en: "Notable Quote",
          "zh-CN": "关键引文"
        },
        description: {
          en: "Capture a key phrase or sentence worth revisiting.",
          "zh-CN": "记录一个值得后续回看的关键句或片段。"
        },
        type: "text",
        placeholder: {
          en: "Paste a notable excerpt from the sample.",
          "zh-CN": "粘贴样本中的代表性引文。"
        }
      }
    ]
  },
  {
    id: "crisis-communication-scan",
    name: {
      en: "Crisis Communication Scan",
      "zh-CN": "危机传播扫描"
    },
    shortDescription: {
      en: "Review statements for response posture, attribution, and reputation management signals.",
      "zh-CN": "分析声明文本中的回应姿态、责任归因和声誉修复信号。"
    },
    researchUseCase: {
      en: "Introductory crisis response analysis for press releases, public statements, or spokesperson messaging.",
      "zh-CN": "适用于新闻稿、公开声明或发言人回应的入门式危机传播分析。"
    },
    fields: [
      {
        id: "response-posture",
        label: {
          en: "Response Posture",
          "zh-CN": "回应姿态"
        },
        description: {
          en: "Identify the broad crisis response strategy.",
          "zh-CN": "识别文本采用的总体危机回应策略。"
        },
        type: "single-select",
        options: [
          { value: "deny", label: { en: "Deny", "zh-CN": "否认" } },
          { value: "diminish", label: { en: "Diminish", "zh-CN": "淡化" } },
          { value: "rebuild", label: { en: "Rebuild", "zh-CN": "重建" } },
          { value: "bolster", label: { en: "Bolster", "zh-CN": "强化/增补" } }
        ]
      },
      {
        id: "responsibility-level",
        label: {
          en: "Responsibility Level",
          "zh-CN": "责任承担程度"
        },
        description: {
          en: "Estimate how much responsibility the organization appears to accept.",
          "zh-CN": "估计组织在文本中表现出的责任承担程度。"
        },
        type: "single-select",
        options: [
          { value: "low", label: { en: "Low", "zh-CN": "低" } },
          { value: "mixed", label: { en: "Mixed / partial", "zh-CN": "混合 / 部分承担" } },
          { value: "high", label: { en: "High", "zh-CN": "高" } }
        ]
      },
      {
        id: "reputation-repair-signals",
        label: {
          en: "Reputation Repair Signals",
          "zh-CN": "声誉修复信号"
        },
        description: {
          en: "Track visible attempts to reassure, apologize, or promise corrective action.",
          "zh-CN": "记录文本中可见的安抚、道歉或承诺纠正行动等修复性表达。"
        },
        type: "multi-select",
        options: [
          { value: "apology", label: { en: "Apology", "zh-CN": "道歉" } },
          { value: "corrective-action", label: { en: "Corrective action", "zh-CN": "纠正行动" } },
          { value: "victim-focus", label: { en: "Victim / stakeholder concern", "zh-CN": "受害者 / 利害关系人关切" } },
          { value: "future-prevention", label: { en: "Future prevention", "zh-CN": "未来预防" } }
        ]
      }
    ]
  }
];
