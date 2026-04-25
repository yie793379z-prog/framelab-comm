[English](./README.md) | 简体中文

# 示例数据使用指南

这个文件夹里的示例材料都是**虚构**的，专门用来帮助你快速试用 FrameLab。它们很短，但足够完成课堂演示、方法练习和小型研究流程。

如果你是第一次用，建议先从 `news_sample.csv` 或 `interview_sample.txt` 开始。

## 你会在这里看到什么

- `news_sample.csv`：适合新闻框架分析
- `social_posts.csv`：适合社交媒体内容分析
- `interview_sample.txt`：适合访谈预编码
- `crisis_comm_sample.txt`：适合危机传播扫描

## 通用操作步骤

无论你使用哪个示例文件，都可以先记住这条最简单的流程：

1. 打开 FrameLab。
2. 进入 `Workspace / 工作区`。
3. 在导入区点击“选择文件”，或直接粘贴文本。
4. 确认样本数量看起来合理。
5. 点击“载入工作区”。
6. 选择对应模板。
7. 在左侧样本列表中点开一个样本。
8. 先手动编码一个样本，再尝试 AI 建议。
9. 去导出区导出 `CSV`、`Markdown`、`Codebook` 或 `JSON`。

## 1. news_sample.csv

适合模板：

- `News Framing Analysis / 新闻框架分析`

这个文件里有什么：

- 几条虚构新闻文本
- 既有英文也有中文
- 可以练习“主导框架”“问题界定”“建议的解决路径”

怎么导入：

1. 打开工作区。
2. 点击“选择文件”。
3. 选择 `examples/news_sample.csv`。
4. FrameLab 会自动识别 `text` 列。
5. 看到“检测到 X 条样本”后，点击“载入工作区”。

接下来点什么：

1. 选择模板 `News Framing Analysis`。
2. 点开第 1 条样本。
3. 先手动选择 `Primary Frame`。
4. 再补充 `Problem Definition` 和 `Suggested Remedy`。
5. 如果想试 AI，点“生成建议”，再人工修改。

你应该会看到什么结果：

- `Coding Summary / 编码摘要` 里会看到不同框架的分布
- `Live Preview / 实时预览` 里会显示当前样本的编码值
- 如果几条新闻的框架不同，摘要面板的计数会跟着变化

## 2. social_posts.csv

适合模板：

- `Social Media Content Analysis / 社交媒体内容分析`

这个文件里有什么：

- 虚构的微博、Instagram、RedNote 等平台帖文
- 帖子语气、形式和互动线索有变化

怎么导入：

1. 在导入区选择 `examples/social_posts.csv`。
2. 等待系统识别 `text` 列。
3. 点击“载入工作区”。

接下来点什么：

1. 选择 `Social Media Content Analysis` 模板。
2. 点开几条不同平台的样本。
3. 对比 `Tone`、`Post Format`、`Engagement Cues`。
4. 如果样本较多，可以用样本列表上方的搜索、筛选、排序。
5. 如果想批量试用建议，可以使用“批量建议”，但先从少量样本开始。

你应该会看到什么结果：

- `Tone` 和 `Engagement Cues` 会在编码摘要里显示分布
- 批量建议只会填空字段，不会覆盖你已手动改过的值

## 3. interview_sample.txt

适合模板：

- `Interview Pre-coding / 访谈预编码`

这个文件里有什么：

- 虚构的访谈片段
- 有学生、编辑、社区媒体参与者等不同角色

怎么导入：

1. 选择 `examples/interview_sample.txt`。
2. 该文件已经按空行分隔好片段。
3. 看到样本数量后，点击“载入工作区”。

接下来点什么：

1. 选择 `Interview Pre-coding` 模板。
2. 点开一个样本。
3. 先手动填写 `Speaker Role`。
4. 再判断 `Topic Area`。
5. 最后再看 `Notable Quote` 是否值得保留、是否需要改写。

你应该会看到什么结果：

- 不同角色、不同主题领域会逐渐形成分布
- 访谈预编码更适合“先粗分、后细读”，不要把 AI 建议当定稿

## 4. crisis_comm_sample.txt

适合模板：

- `Crisis Communication Scan / 危机传播扫描`

这个文件里有什么：

- 虚构的公开回应、声明文本
- 有道歉、否认、部分承担责任、承诺整改等不同策略

怎么导入：

1. 选择 `examples/crisis_comm_sample.txt`。
2. 看到样本数量后，点击“载入工作区”。

接下来点什么：

1. 选择 `Crisis Communication Scan` 模板。
2. 逐条查看 `Response Posture`。
3. 对比 `Responsibility Level`。
4. 观察 `Reputation Repair Signals` 哪些出现、哪些缺失。

你应该会看到什么结果：

- 摘要面板会显示不同回应姿态和修复信号的分布
- 这类文本很适合课堂上对比不同组织如何回应同类问题

## 如何导出结果

当你至少完成了一部分编码后，可以去页面下方的导出区。

### 导出 CSV

适合做什么：

- 继续在 Excel、WPS、Google Sheets 里整理数据
- 交给老师或同学查看编码表格

怎么做：

1. 在导出区点击“导出 CSV”。
2. 下载文件 `framelab-coded-data.csv`。

### 导出 Markdown 报告

适合做什么：

- 课堂汇报
- 研究备忘
- 早期论文材料整理

怎么做：

1. 如果你愿意，可以先在“项目信息”里填写标题、研究问题、课程背景。
2. 点击“导出 Markdown”。
3. 下载 `framelab-analysis-report.md`。

### 导出 Codebook

适合做什么：

- 方法课作业中的“编码手册”说明
- 给老师展示你使用了什么模板和字段

怎么做：

1. 确保当前已经选择模板。
2. 点击“导出编码手册”。
3. 下载 `framelab-codebook.md`。

### 导出 JSON 项目

适合做什么：

- 以后继续打开同一个项目
- 换一台电脑时继续工作

怎么做：

1. 点击“导出 JSON”。
2. 下载 `framelab-project.json`。

## 如何恢复 JSON 项目

如果你之前已经导出过 `framelab-project.json`：

1. 打开 FrameLab 工作区。
2. 滚动到导出区。
3. 在“载入项目 JSON”部分点击“选择 JSON 文件”。
4. 选择之前导出的 `framelab-project.json`。
5. 确认替换当前工作区。

恢复后你应该看到：

- 样本回来了
- 当前模板回来了
- 编码结果回来了
- 项目信息和自定义编码表也会一起恢复

## 建议第一次怎么试

如果你只想用 10 分钟快速感受完整流程，可以这样做：

1. 导入 `news_sample.csv`
2. 选择 `News Framing Analysis`
3. 手动编码 1 条
4. 再对第 2 条使用“生成建议”
5. 看“编码摘要”
6. 导出 `Markdown` 和 `Codebook`
7. 再导出 `JSON`
8. 重新载入 `JSON`，确认项目能恢复

这样你就基本走完了 FrameLab 的完整主流程。
