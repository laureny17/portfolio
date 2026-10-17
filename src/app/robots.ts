import type { MetadataRoute } from "next";

// Opt out of AI *training* and bulk dataset/image scrapers only. Search engines
// and on-demand AI fetchers (ChatGPT-User, Claude-User, Perplexity-User, ...)
// stay allowed so recruiters' agents and AI search can still read the site.
// Source: https://github.com/ai-robots-txt/ai.robots.txt (checked 2026-10-17)
const trainingCrawlers = [
  // OpenAI, Anthropic, Google, Apple, Meta, Amazon
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Amazonbot",
  // Other model builders
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "cohere-training-data-crawler",
  "MistralAI-Training",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "DeepSeekBot",
  "PanguBot",
  "Diffbot",
  "Webzio-Extended",
  "omgili",
  "omgilibot",
  "Timpibot",
  "ICC-Crawler",
  "Cotoyogi",
  "SBIntuitionsBot",
  "Kangaroo Bot",
  // Image dataset scrapers
  "img2dataset",
  "LAIONDownloader",
  "laion-huggingface-processor",
  "ImagesiftBot",
  "imageSpider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: trainingCrawlers, disallow: "/" },
      { userAgent: "*", allow: "/" },
    ],
  };
}
