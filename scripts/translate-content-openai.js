#!/usr/bin/env node
/**
 * ValidZen EN — Content Translation via OpenAI
 *
 * Translates the 'content' field of all posts from Portuguese to English.
 * Uses GPT-4o-mini for speed and cost efficiency.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-proj-... \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/translate-content-openai.js
 */

const SUPABASE_URL = "https://qugirvcaivozqssryajd.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_SLUG = process.env.SLUG || null;

if (!SERVICE_KEY || !OPENAI_KEY) {
  console.error("❌  Missing env vars. Set both:");
  console.error("    export SUPABASE_SERVICE_KEY=eyJ...");
  console.error("    export OPENAI_API_KEY=sk-proj-...");
  process.exit(1);
}

async function translateContent(ptContent) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional translator specializing in mental health and psychology content. Translate the following Portuguese article to English. Preserve all markdown formatting, tables, and HTML tags exactly. Return ONLY the translated markdown content without any preamble or commentary."
        },
        {
          role: "user",
          content: ptContent,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}

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

  return posts.filter((p) => {
    const c = (p.content || "").toLowerCase();
    // Detection heuristic for Portuguese
    return (
      c.includes(" que ") ||
      c.includes(" para ") ||
      c.includes(" não ") ||
      c.includes(" você ") ||
      c.includes("é ") ||
      c.includes("ão")
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

async function main() {
  console.log("🔍  Fetching posts with Portuguese content...");
  const posts = await fetchPostsToTranslate();
  console.log(`📚  Found ${posts.length} posts to translate\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] Translating: ${post.slug}...`);

    try {
      const translated = await translateContent(post.content);
      if (!DRY_RUN) {
        await updatePostContent(post.id, translated);
        console.log(`    ✅  Saved to Supabase`);
      } else {
        console.log(`    ✅  Translated (Dry Run)`);
      }
      success++;
    } catch (err) {
      console.error(`    ❌  Failed: ${err.message}`);
      failed++;
    }

    // Small delay to be nice to APIs
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎉  Complete! ${success} translated, ${failed} failed`);
}

main().catch(console.error);
