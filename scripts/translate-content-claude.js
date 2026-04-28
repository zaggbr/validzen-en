#!/usr/bin/env node
/**
 * ValidZen EN — Content Translation via Claude (Anthropic)
 *
 * Translates the 'content' field of all posts from Portuguese to English.
 * Uses Claude claude-3-5-haiku-20241022 for speed and cost efficiency.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/translate-content-claude.js
 *
 * Options (env vars):
 *   DRY_RUN=1       — Print translations without saving to DB
 *   SLUG=some-slug  — Translate only one specific post (for testing)
 */

const SUPABASE_URL = "https://qugirvcaivozqssryajd.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_SLUG = process.env.SLUG || null;

if (!SERVICE_KEY || !ANTHROPIC_KEY) {
  console.error("❌  Missing env vars. Set both:");
  console.error("    export SUPABASE_SERVICE_KEY=eyJ...");
  console.error("    export ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

// ─── Anthropic: translate a markdown article ──────────────────────────────────
async function translateContent(ptContent) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a professional translator specializing in mental health and psychology content. 
Translate the following Portuguese article to English.

CRITICAL RULES:
- Preserve ALL markdown formatting exactly (## headings, **bold**, *italic*, | tables |, > blockquotes, - lists)
- Translate ALL text content, including table cells, list items, headings, and blockquotes
- Keep scientific/clinical terms accurate (DSM, ICD, WHO standards)
- Maintain the same tone: informative, empathetic, evidence-based
- Do NOT add any commentary, preamble or explanation — return ONLY the translated content
- Do NOT wrap in code blocks — return raw markdown

PORTUGUESE CONTENT TO TRANSLATE:
${ptContent}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const result = await response.json();
  return result.content[0].text;
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────
async function fetchPostsToTranslate() {
  const url = ONLY_SLUG
    ? `${SUPABASE_URL}/rest/v1/posts?select=id,slug,content,title&locale=eq.en&slug=eq.${ONLY_SLUG}`
    : `${SUPABASE_URL}/rest/v1/posts?select=id,slug,content,title&locale=eq.en&order=category`;

  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${await res.text()}`);
  const posts = await res.json();

  // Only translate posts where content still looks Portuguese
  // (heuristic: contains common Portuguese words)
  return posts.filter((p) => {
    const c = (p.content || "").toLowerCase();
    return (
      c.includes(" que ") ||
      c.includes(" para ") ||
      c.includes(" não ") ||
      c.includes(" você ") ||
      c.includes(" esse ") ||
      c.includes(" isso ") ||
      c.includes(" uma ") ||
      c.includes("é ") ||
      c.includes("ão") ||
      c.includes("ção")
    );
  });
}

async function updatePostContent(id, content) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`PATCH failed: ${res.status} ${await res.text()}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍  Fetching posts with Portuguese content…");
  const posts = await fetchPostsToTranslate();
  console.log(`📚  Found ${posts.length} posts to translate\n`);

  if (DRY_RUN) console.log("⚠️   DRY RUN — will not save to DB\n");

  let success = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const num = `[${i + 1}/${posts.length}]`;
    const contentLen = (post.content || "").length;
    console.log(`\n${num} Translating: ${post.slug}`);
    console.log(`    Title: ${post.title}`);
    console.log(`    Content length: ${contentLen} chars`);

    if (!post.content || contentLen < 50) {
      console.log("    ⏭️  Skipping — content too short or empty");
      continue;
    }

    try {
      const translated = await translateContent(post.content);
      console.log(`    ✅  Translated (${translated.length} chars)`);

      if (!DRY_RUN) {
        await updatePostContent(post.id, translated);
        console.log(`    💾  Saved to Supabase`);
      } else {
        console.log(`    🖨️  [DRY RUN] First 200 chars:`);
        console.log(`    ${translated.substring(0, 200).replace(/\n/g, " ")}…`);
      }

      success++;
    } catch (err) {
      console.error(`    ❌  Failed: ${err.message}`);
      failed++;
    }

    // Respect Anthropic rate limits (5 req/min on free tier, 60+ on paid)
    if (i < posts.length - 1) {
      const delay = 1500; // 1.5s between requests — safe for all tiers
      process.stdout.write(`    ⏱️  Waiting ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
      process.stdout.write(" done\n");
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`🎉  Complete! ${success} translated, ${failed} failed`);
  if (failed > 0) console.log(`⚠️   Re-run with SLUG=failed-slug to retry individual posts`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
