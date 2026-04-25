[简体中文](./social-media-datasets.zh-CN.md) | English

# Working With Social Media Datasets In FrameLab

FrameLab can import CSV files, but it is **not a crawler** and it does **not scrape platforms for you**.

You need to prepare the dataset first, then import it into FrameLab.

## Recommended CSV Columns

These columns work well:

- `text`
- `platform`
- `date`
- `author`
- `url`

FrameLab looks for one main text column using these names:

- `text`
- `content`
- `body`
- `message`
- `transcript`

If more than one matching text column exists, FrameLab uses the first one.

## Start With A Pilot Sample

If you have a large dataset, do not start by importing thousands of rows and immediately generating AI suggestions.

A better workflow is:

1. start with a pilot sample
2. test your template
3. revise your codebook or labels
4. code a small subset manually
5. only then scale up carefully

For many class projects, even 50 to 200 posts can be enough for a good pilot.

## Clean Before You Import

Before importing a CSV:

- remove duplicates
- remove obvious spam or advertising rows that are not part of the research question
- remove empty rows
- check whether the text column really contains the text you want to code

## Use Search, Filter, And Sort

Once imported, FrameLab can help you work through larger datasets with:

- sample search
- coded / uncoded filters
- metadata-based search
- title and date sorting

This is useful when you want to review subsets without changing the underlying dataset.

## Batch Suggestions: Use Carefully

FrameLab supports batch suggestions for uncoded samples, with a default batch size limit of 10 samples per run.

Use batch suggestions carefully:

- test on a small subset first
- check whether the active template actually fits the dataset
- review every suggested field manually
- remember that real AI mode may incur cost

## Privacy And Ethics

Before importing social media data:

- avoid private or sensitive data
- avoid identifiable personal data unless your research design clearly justifies it
- follow course, institutional, and platform rules
- do not assume “publicly visible” automatically means “ethically risk-free”

## Recommended Outputs

For social media projects, these exports are especially useful:

- `CSV` for spreadsheet analysis
- `Markdown` for writing up findings
- `Codebook Markdown` for methods notes
- `JSON` for reopening the same project later
