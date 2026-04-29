#!/usr/bin/env node
/**
 * fix-en-categories.js
 * 
 * Fixes the 'category' field of English posts to match the slugs in the 'categories' table.
 * 
 * Usage:
 *   SUPABASE_SERVICE_KEY=... node scripts/fix-en-categories.js
 */

const SUPABASE_URL = "https://qugirvcaivozqssryajd.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error("❌  Missing SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const CATEGORY_MAP = {
  "anxiety": "ansiedade",
  "emotions": "emocoes",
  "future": "futuro",
  "identity": "identidade",
  "meaning": "sentido",
  "relationships": "relacoes",
  "society": "sociedade",
  "burnout": "burnout"
};

const MENTAL_HEALTH_MAP = {
  "fobo-fear-obsolete-ia": "futuro",
  "languishing-nothing": "sentido",
  "sleep-procrastination": "burnout",
  "meaning-crisis": "sentido",
  "structural-loneliness": "sociedade",
  "algorithmic-identity": "futuro",
  "eco-anxiety": "sociedade",
  "political-fatigue": "sociedade"
};

async function run() {
  console.log("🔍 Fetching English posts...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?locale=eq.en&select=id,slug,category`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  const posts = await res.json();
  console.log(`✅ Found ${posts.length} posts.\n`);

  for (const post of posts) {
    let newCategory = CATEGORY_MAP[post.category];
    
    // Special handling for 'Mental Health' or missing mappings
    if (!newCategory && MENTAL_HEALTH_MAP[post.slug]) {
      newCategory = MENTAL_HEALTH_MAP[post.slug];
    }

    if (newCategory && newCategory !== post.category) {
      console.log(`Updating ${post.slug}: ${post.category} -> ${newCategory}`);
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ category: newCategory })
      });
      if (!updateRes.ok) console.error(`  ❌ Failed: ${await updateRes.text()}`);
    } else if (!newCategory && !CATEGORY_MAP[post.category]) {
        // If it's already a PT slug, skip it
        const ptSlugs = Object.values(CATEGORY_MAP);
        if (!ptSlugs.includes(post.category)) {
            console.log(`⚠️  No mapping for: ${post.slug} (cat: ${post.category})`);
        }
    }
  }
  console.log("\n✨ Done!");
}

run().catch(console.error);
