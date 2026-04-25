# Examples

This folder contains fictional example materials for trying FrameLab quickly. The files are short on purpose, but varied enough for classroom demos, onboarding, and small communication analysis exercises.

## Files

### [news_sample.csv](./news_sample.csv)

Best template:

- `News Framing Analysis`

What it contains:

- short fictional news items in English and Chinese
- issue framing variation around transport, student life, public policy, and labor concerns

What to try:

- compare `Primary Frame` across samples
- write short `Problem Definition` notes for each item
- test whether AI suggestions pick plausible remedies without replacing your judgment

How to import right now:

- import the CSV directly into FrameLab
- FrameLab will use the `text` column automatically
- you can still copy individual cells and paste them with blank lines if you prefer

### [social_posts.csv](./social_posts.csv)

Best template:

- `Social Media Content Analysis`

What it contains:

- fictional posts from student groups, city departments, NGOs, creators, and brands
- variation in tone, format cues, hashtags, questions, and calls to action

What to try:

- compare `Tone` across institutional and creator posts
- track `Engagement Cues` such as hashtags, questions, and direct calls to action
- switch UI language and confirm exported CSV labels follow the selected language

How to import right now:

- import the CSV directly into FrameLab
- FrameLab will use the `text` column automatically
- you can still paste selected post text manually if you want a smaller subset

### [interview_sample.txt](./interview_sample.txt)

Best template:

- `Interview Pre-coding`

What it contains:

- fictional interview excerpts from students, editors, and community media participants
- both English and Chinese excerpts
- good starter material for pre-coding roles, topic areas, and notable quotes

What to try:

- identify how speaker role affects interpretation
- compare `Topic Area` across student and newsroom perspectives
- edit the AI-generated `Notable Quote` if the mock suggestion is too broad

How to import right now:

- copy the full file contents
- paste directly into FrameLab
- each paragraph block is already separated for multi-sample import

### [crisis_comm_sample.txt](./crisis_comm_sample.txt)

Best template:

- `Crisis Communication Scan`

What it contains:

- fictional public statements about outages, event management, and delivery safety
- variation in apology, denial, partial responsibility, and corrective action

What to try:

- compare `Response Posture` across statements
- track `Responsibility Level`
- review which `Reputation Repair Signals` appear explicitly and which are missing

How to import right now:

- copy the full file contents
- paste directly into FrameLab
- the statements are already separated by blank lines

## Quick Demo Path

1. Start with `news_sample.csv` or `interview_sample.txt`.
2. Import the file directly, or paste 3 to 4 items into the workspace.
3. Select the suggested template for that file type.
4. Code one sample manually first.
5. Use `Generate Suggestions` on the next sample.
6. Export the result as Markdown for class discussion or lab notes.

## Note on Import Format

FrameLab now supports local browser import for:

1. pasted text
2. `.txt`
3. `.md`
4. `.csv`

CSV import recognizes these text column names:

- `text`
- `content`
- `body`
- `message`
- `transcript`

If more than one recognized column is present, FrameLab uses the first matching column. All parsing happens locally in the browser.
