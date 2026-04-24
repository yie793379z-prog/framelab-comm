import type { AnalysisTemplate } from "@/types/template";

export const analysisTemplates: AnalysisTemplate[] = [
  {
    id: "news-framing-analysis",
    name: "News Framing Analysis",
    shortDescription: "Code news texts for dominant issue frames, problem definitions, and proposed remedies.",
    researchUseCase: "Introductory framing analysis for news articles, explainers, and opinion pieces.",
    fields: [
      {
        id: "primary-frame",
        label: "Primary Frame",
        description: "Select the dominant interpretive frame in the sample.",
        type: "single-select",
        options: [
          { value: "conflict", label: "Conflict" },
          { value: "responsibility", label: "Responsibility" },
          { value: "economic", label: "Economic consequences" },
          { value: "human-interest", label: "Human interest" },
          { value: "morality", label: "Morality" }
        ]
      },
      {
        id: "problem-definition",
        label: "Problem Definition",
        description: "Capture how the issue is defined in the text.",
        type: "text",
        placeholder: "What is presented as the core issue?"
      },
      {
        id: "suggested-remedy",
        label: "Suggested Remedy",
        description: "Note the remedy, response, or action implied in the sample.",
        type: "text",
        placeholder: "What solution or response is emphasized?"
      }
    ]
  },
  {
    id: "social-media-content-analysis",
    name: "Social Media Content Analysis",
    shortDescription: "Classify social posts by format, tone, issue emphasis, and engagement cues.",
    researchUseCase: "Small platform studies involving short posts, captions, campaign content, or advocacy messaging.",
    fields: [
      {
        id: "post-format",
        label: "Post Format",
        description: "Identify the main post format.",
        type: "single-select",
        options: [
          { value: "text", label: "Text only" },
          { value: "image", label: "Image-led" },
          { value: "video", label: "Video-led" },
          { value: "carousel", label: "Carousel / thread" }
        ]
      },
      {
        id: "tone",
        label: "Tone",
        description: "Mark the prevailing communication tone.",
        type: "single-select",
        options: [
          { value: "informational", label: "Informational" },
          { value: "promotional", label: "Promotional" },
          { value: "activist", label: "Activist / persuasive" },
          { value: "personal", label: "Personal / relational" }
        ]
      },
      {
        id: "engagement-cues",
        label: "Engagement Cues",
        description: "Track prompts aimed at driving user action.",
        type: "multi-select",
        options: [
          { value: "question", label: "Question prompt" },
          { value: "hashtag", label: "Hashtag strategy" },
          { value: "cta", label: "Direct call to action" },
          { value: "tagging", label: "Tagging / mentions" }
        ]
      }
    ]
  },
  {
    id: "interview-pre-coding",
    name: "Interview Pre-coding",
    shortDescription: "Create an initial coding pass for interview excerpts before deeper manual thematic analysis.",
    researchUseCase: "Thesis preparation, pilot interview review, and early-stage qualitative organization.",
    fields: [
      {
        id: "speaker-role",
        label: "Speaker Role",
        description: "Identify the participant role or position relevant to the project.",
        type: "text",
        placeholder: "Student, editor, campaign staffer, etc."
      },
      {
        id: "topic-area",
        label: "Topic Area",
        description: "Assign a broad topical cluster.",
        type: "single-select",
        options: [
          { value: "media-practice", label: "Media practice" },
          { value: "platform-use", label: "Platform use" },
          { value: "identity", label: "Identity / self-presentation" },
          { value: "institutional-context", label: "Institutional context" }
        ]
      },
      {
        id: "notable-quote",
        label: "Notable Quote",
        description: "Capture a key phrase or sentence worth revisiting.",
        type: "text",
        placeholder: "Paste a notable excerpt from the sample."
      }
    ]
  },
  {
    id: "crisis-communication-scan",
    name: "Crisis Communication Scan",
    shortDescription: "Review statements for response posture, attribution, and reputation management signals.",
    researchUseCase: "Introductory crisis response analysis for press releases, public statements, or spokesperson messaging.",
    fields: [
      {
        id: "response-posture",
        label: "Response Posture",
        description: "Identify the broad crisis response strategy.",
        type: "single-select",
        options: [
          { value: "deny", label: "Deny" },
          { value: "diminish", label: "Diminish" },
          { value: "rebuild", label: "Rebuild" },
          { value: "bolster", label: "Bolster" }
        ]
      },
      {
        id: "responsibility-level",
        label: "Responsibility Level",
        description: "Estimate how much responsibility the organization appears to accept.",
        type: "single-select",
        options: [
          { value: "low", label: "Low" },
          { value: "mixed", label: "Mixed / partial" },
          { value: "high", label: "High" }
        ]
      },
      {
        id: "reputation-repair-signals",
        label: "Reputation Repair Signals",
        description: "Track visible attempts to reassure, apologize, or promise corrective action.",
        type: "multi-select",
        options: [
          { value: "apology", label: "Apology" },
          { value: "corrective-action", label: "Corrective action" },
          { value: "victim-focus", label: "Victim / stakeholder concern" },
          { value: "future-prevention", label: "Future prevention" }
        ]
      }
    ]
  }
];
