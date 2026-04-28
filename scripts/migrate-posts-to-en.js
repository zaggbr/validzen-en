#!/usr/bin/env node
/**
 * ValidZen EN — PT→EN Post Migration Script
 * 
 * Usage:
 *   SUPABASE_SERVICE_KEY=your_service_role_key node scripts/migrate-posts-to-en.js
 *
 * What it does:
 *   1. Updates all 34 PT posts: sets locale='en', category to EN slug,
 *      translates title, excerpt, meta_title, meta_description
 *   2. Does NOT touch the 8 existing EN posts
 *   3. Uses PATCH /rest/v1/posts?id=eq.{id} for each post
 */

const SUPABASE_URL = "https://qugirvcaivozqssryajd.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error("❌  Set SUPABASE_SERVICE_KEY environment variable first.");
  console.error("    export SUPABASE_SERVICE_KEY=your_service_role_key");
  process.exit(1);
}

// ─── Category mapping PT → EN slug ──────────────────────────────────────────
const CATEGORY_MAP = {
  "ansiedade":  "anxiety",
  "burnout":    "burnout",
  "emocoes":    "emotions",
  "futuro":     "future",
  "identidade": "identity",
  "relacoes":   "relationships",
  "sentido":    "meaning",
  "sociedade":  "society",
  "Mental Health": "Mental Health", // already EN
};

// ─── Full translation table ──────────────────────────────────────────────────
// Each entry: { id, title, excerpt, meta_title, meta_description }
// (content field is kept as-is; only metadata is translated here.
//  Content translation requires a separate pass or manual edit in Supabase.)

const TRANSLATIONS = [
  // ── ANSIEDADE → anxiety ────────────────────────────────────────────────────
  {
    slug: "sindrome-do-panico-o-que-fazer",
    title: "Panic Disorder: What to Do During and After a Crisis",
    excerpt: "Panic disorder is characterized by recurrent, unexpected attacks of intense fear accompanied by physical symptoms that peak within minutes.",
    meta_title: "Panic Disorder: What It Is, What to Do During a Crisis and How to Treat It",
    meta_description: "Panic disorder affects 2–3% of the population. A crisis lasts 10 minutes but feels like an eternity. Learn what to do, what not to do — and how to prevent it.",
  },
  {
    slug: "fobia-social-sintomas-tratamento",
    title: "Social Phobia: When Shyness Becomes a Prison — What It Is, How to Recognize It and What Works",
    excerpt: "Social phobia, or social anxiety disorder, is an intense and persistent fear of social situations in which one may be judged, embarrassed, or humiliated.",
    meta_title: "Social Phobia: Symptoms, Causes and Science-Backed Treatment",
    meta_description: "Social phobia affects 7% of the world population. Understand the difference between shyness and the disorder, identify the symptoms and discover what really works.",
  },
  {
    slug: "ansiedade-tipos-causas-o-que-fazer",
    title: "Anxiety: The Definitive Guide — What It Is, The 7 Types, and What to Do When It Arrives",
    excerpt: "Anxiety is the most prevalent mental disorder on the planet — 359 million people affected — and the most treatable.",
    meta_title: "Anxiety: The 7 Types, Causes and What to Do Now | Science-Based Guide",
    meta_description: "359 million people have anxiety disorder. Learn the 7 types, understand the difference from stress, and discover what works — according to WHO and science.",
  },
  {
    slug: "insonia-por-que-nao-consigo-dormir",
    title: "Insomnia: Why Can't I Sleep? The Complete Science-Based Guide",
    excerpt: "Insomnia is defined as persistent difficulty falling or staying asleep that impairs daytime functioning — affecting 1 in 3 adults worldwide.",
    meta_title: "Insomnia: Why You Can't Sleep and What Science Says About It",
    meta_description: "1 in 3 adults has insomnia symptoms. Learn the biological, psychological and behavioral causes — and the evidence-based strategies that actually work.",
  },

  // ── BURNOUT ────────────────────────────────────────────────────────────────
  {
    slug: "perfeccionismo-procrastinacao-como-sair",
    title: "Perfectionism and Procrastination: The Invisible Double That Paralyzes — And How to Break Free",
    excerpt: "The perfectionist procrastinator is someone defined by approach-avoidance conflict: the desire to excel collides with the fear of failure.",
    meta_title: "Perfectionism and Procrastination: Why They Walk Together and How to Escape",
    meta_description: "20% of adults are chronic procrastinators. Perfectionism is a leading cause. Understand the neuroscience and discover practical strategies to move forward.",
  },
  {
    slug: "revenge-bedtime-procrastination-por-que-nao-durmo",
    title: "Revenge Bedtime Procrastination: Why You Stay Awake Late Even When Exhausted",
    excerpt: "Revenge Bedtime Procrastination is the act of voluntarily delaying sleep to reclaim personal time lost during the day.",
    meta_title: "Revenge Bedtime Procrastination: Why You Steal Your Own Sleep (and How to Stop)",
    meta_description: "Revenge Bedtime Procrastination is the habit of delaying sleep to have free time. Understand the psychology, the risks and how to break the cycle.",
  },
  {
    slug: "burnout-como-saber-sinais-tratamento",
    title: "Burnout Is Not Just Tiredness: How to Know If You've Crossed the Line",
    excerpt: "Burnout is a syndrome resulting from chronic workplace stress that has not been successfully managed, officially recognized by the WHO in ICD-11.",
    meta_title: "Burnout: Recognized Signs, WHO Criteria and Science-Based Recovery",
    meta_description: "Burnout affects 77% of professionals. Recognized by WHO in 2019. Learn to distinguish burnout from fatigue and discover what actually helps recovery.",
  },
  {
    slug: "produtividade-toxica-culpa-descansar",
    title: "Toxic Productivity: Why Resting Makes You Feel Guilty — And How to Get Off the Wheel",
    excerpt: "Toxic productivity is an obsessive compulsion to be productive, marked by the inability to rest without guilt, regardless of actual output.",
    meta_title: "Toxic Productivity: Why Rest Feels Like a Crime and How to Stop",
    meta_description: "Toxic productivity is an obsessive need to always be doing something. Learn to recognize the signs, understand the psychological causes and reclaim rest.",
  },

  // ── EMOCOES → emotions ────────────────────────────────────────────────────
  {
    slug: "luto-nao-reconhecido-disenfranchised-grief",
    title: "Disenfranchised Grief: The Loss That Nobody Validates — And Why It's the Hardest to Bear",
    excerpt: "Disenfranchised grief is the grief that society does not recognize as legitimate — the loss of a pet, a relationship that never was, a failed career.",
    meta_title: "Disenfranchised Grief: The Loss Nobody Acknowledges and How to Heal",
    meta_description: "Disenfranchised grief is grief that is not recognized as legitimate by the social environment. Learn about the types, the psychological impact and how to heal.",
  },
  {
    slug: "alexitimia-nao-sei-o-que-sinto",
    title: "Alexithymia: When You Feel Something but Don't Know What It Is",
    excerpt: "Alexithymia is the difficulty in identifying and describing emotional feelings — affecting about 10% of the general population.",
    meta_title: "Alexithymia: What It Is, Causes and How to Reconnect With Your Emotions",
    meta_description: "10% of people have alexithymia. Understand what it is, how it relates to autism and trauma, and discover strategies to reconnect with your inner world.",
  },
  {
    slug: "tdah-adultos-sintomas-diagnostico",
    title: "ADHD in Adults: Signs You Were Never Diagnosed — And What to Do Now",
    excerpt: "Adult ADHD is underdiagnosed worldwide — 75% of adults with ADHD were never properly identified during childhood.",
    meta_title: "ADHD in Adults: Overlooked Signs, Late Diagnosis and What Science Says",
    meta_description: "75% of adults with ADHD were never diagnosed as children. Understand the signs specific to adults, how to get evaluated and what actually helps.",
  },
  {
    slug: "comer-por-ansiedade-como-parar",
    title: "Do You Eat from Hunger or Emotion? The Science of Emotional Eating",
    excerpt: "Emotional eating is using food to manage emotions — not hunger — and it affects up to 75% of overeating episodes.",
    meta_title: "Emotional Eating: Why You Eat When You're Not Hungry and How to Stop",
    meta_description: "75% of overeating is emotional, not physical. Understand the neuroscience of emotional eating and discover practical strategies to break the cycle.",
  },
  {
    slug: "raiva-reprimida-como-expressar",
    title: "Repressed Anger: When You Swallow Your Rage — And How It Surfaces Later",
    excerpt: "Repressed anger is the chronic pattern of suppressing, minimizing or denying anger — which then finds indirect outlets through the body and behavior.",
    meta_title: "Repressed Anger: Signs, Health Consequences and How to Express It Safely",
    meta_description: "Suppressed anger is linked to depression, hypertension and autoimmune disease. Learn the signs, understand the causes and discover healthy ways to process it.",
  },
  {
    slug: "embotamento-emocional-emotional-blunting",
    title: "Emotional Blunting: When You Stop Feeling — And Can't Tell If It's the Medication, Depression, or Life",
    excerpt: "Emotional blunting is a reduction in the capacity to experience emotions — both positive and negative — affecting 40–60% of patients on antidepressants.",
    meta_title: "Emotional Blunting: Why You Feel Nothing Anymore (and What to Do)",
    meta_description: "40–60% of patients on SSRIs experience emotional blunting. Understand what it is, possible causes and how to reconnect with your emotions.",
  },
  {
    slug: "depressao-ou-tristeza-diferenca",
    title: "Depression or Sadness? How to Tell the Difference — And Why It Changes Everything",
    excerpt: "Sadness is a natural emotion; depression is a clinical diagnosis. Confusing the two can lead to neglecting a serious condition.",
    meta_title: "Depression or Sadness? The Difference That Could Save Your Life",
    meta_description: "1 in 6 people will have depression. Sadness is temporary and situational; depression is persistent and pervasive. Learn to identify — and when to seek help.",
  },

  // ── FUTURO → future ───────────────────────────────────────────────────────
  {
    slug: "fobo-medo-de-se-tornar-obsoleto-ia",
    title: "FOBO: The Fear of Becoming Obsolete in the Age of AI — And What to Do About It",
    excerpt: "FOBO (Fear of Becoming Obsolete) is the anxiety that your skills, role or relevance will be replaced by automation or AI.",
    meta_title: "FOBO: Fear of Becoming Obsolete in the AI Era — Signs and What to Do",
    meta_description: "40% of current jobs may be automated. FOBO is the fear of obsolescence. Understand the psychological mechanisms and how to build future-proof resilience.",
  },
  {
    slug: "identidade-algoritmica-autonomia",
    title: "Algorithmic Identity: Does the Algorithm Decide Who You Are?",
    excerpt: "Algorithmic identity is the process by which recommendation systems shape our preferences, opinions and self-image through continuous reinforcement.",
    meta_title: "Algorithmic Identity: How Recommendation Systems Shape Who You Think You Are",
    meta_description: "The average person spends 7 hours daily on screens. Algorithms learn to predict — and shape — our behavior. Understand the impact and reclaim your autonomy.",
  },

  // ── IDENTIDADE → identity ─────────────────────────────────────────────────
  {
    slug: "matrescencia-crise-identidade-maternidade",
    title: "Matrescence: The Identity Crisis of Motherhood Nobody Talks About",
    excerpt: "Matrescence is the profound psychological, physical and social transformation that occurs when a woman becomes a mother — as significant as adolescence.",
    meta_title: "Matrescence: The Real Identity Transformation of Motherhood",
    meta_description: "Matrescence describes the metamorphosis of becoming a mother. Coined by anthropologist Dana Raphael, the concept explains why motherhood reshapes identity.",
  },
  {
    slug: "vergonha-cronica-como-lidar",
    title: "Chronic Shame: When You Feel Like You ARE the Mistake",
    excerpt: "Chronic shame is the persistent belief that one is fundamentally defective, unworthy or unlovable — not that one did something wrong, but that one IS wrong.",
    meta_title: "Chronic Shame: Signs, Origins and How to Stop Feeling Like You Are the Problem",
    meta_description: "Chronic shame is different from guilt. It targets the self, not the behavior. Understand Brené Brown's research and how to break the cycle.",
  },
  {
    slug: "dismorfia-temporal-vida-atrasada",
    title: "Temporal Dysmorphia: The Feeling That Your Life Is Behind Schedule — And Why It's Lying to You",
    excerpt: "Temporal dysmorphia is the distorted perception that your life is out of a timeline that, in reality, does not exist.",
    meta_title: "Temporal Dysmorphia: Why You Feel Behind in Life (and the Science Behind It)",
    meta_description: "Temporal dysmorphia is the distorted perception that your life is off-schedule. Social pressure and social media amplify this feeling.",
  },
  {
    slug: "autoestima-baixa-como-melhorar",
    title: "Low Self-Esteem: The Science of How It Forms — And How to Actually Change It",
    excerpt: "Self-esteem is the overall evaluation we make of our own worth — and low self-esteem is one of the most pervasive psychological challenges of our time.",
    meta_title: "Low Self-Esteem: Causes, Signs and Evidence-Based Strategies to Build It",
    meta_description: "Low self-esteem affects 85% of people at some point. Learn how it forms, what science says about changing it, and practical daily steps.",
  },

  // ── RELACOES → relationships ──────────────────────────────────────────────
  {
    slug: "relacionamento-toxico-como-saber",
    title: "How to Know If My Relationship Is Toxic — The Signs, the Science and the Way Out",
    excerpt: "According to psychologist Lillian Glass, a toxic relationship is any bond between people who feel drained, disrespected or emotionally unstable.",
    meta_title: "Toxic Relationship: 12 Signs, WHO Data and How to Leave Safely",
    meta_description: "1 in 3 women has experienced intimate partner violence. Learn to identify the 12 signs of a toxic relationship and the protocol to leave safely.",
  },
  {
    slug: "fawning-people-pleasing-trauma",
    title: "Fawning: The Trauma Response That Disguises Itself as Kindness — And How to Recognize It",
    excerpt: "The fawn response describes the learned behavior of seeking safety by appeasing a perceived threat through submission and compliance.",
    meta_title: "Fawning: When Pleasing Others Is a Trauma Response (Not Kindness)",
    meta_description: "Fawning is the 4th F of trauma responses: please to survive. Coined by Pete Walker, the concept explains chronic people-pleasing.",
  },
  {
    slug: "fadiga-de-compaixao-sindrome-cuidador",
    title: "Compassion Fatigue: When Caring for Others Destroys You from the Inside",
    excerpt: "Compassion fatigue is the emotional and physical exhaustion that can affect anyone in a sustained caregiving role — professionals or family members.",
    meta_title: "Compassion Fatigue: Signs, Causes and How to Recover Your Empathy",
    meta_description: "Compassion fatigue affects up to 70% of caregivers. Learn how to identify it, understand the difference from burnout and discover recovery strategies.",
  },
  {
    slug: "parentificacao-crianca-adulta-cedo",
    title: "Parentification: When a Child Has to Be the Adult — And the Long-Term Effects",
    excerpt: "Parentification is a family dynamic in which a child assumes emotional or practical responsibilities that belong to the parent role.",
    meta_title: "Parentification: Signs You Were Parentified and How It Affects Adult Life",
    meta_description: "Parentification is a form of emotional role reversal. Children who were parentified often struggle with boundaries, guilt and self-worth in adulthood.",
  },

  // ── SENTIDO → meaning ─────────────────────────────────────────────────────
  {
    slug: "luto-civilizatorio-futuro",
    title: "Civilizational Grief: Are You Mourning the Future That Was Promised to You?",
    excerpt: "Civilizational grief is the collective mourning for a promised future that will not arrive — a world of stability, progress and security that seems to be dissolving.",
    meta_title: "Civilizational Grief: Mourning the Future We Were Promised",
    meta_description: "Civilizational grief is a collective response to the loss of the future we expected. Climate, political and economic crises fuel this silent mourning.",
  },
  {
    slug: "anemoia-nostalgia-passado",
    title: "Anemoia: The Nostalgia for a Time You Never Lived — And What It Reveals About the Present",
    excerpt: "Anemoia is the nostalgia for a time or place you never experienced — and it can reveal as much about your present anxieties as about the idealized past.",
    meta_title: "Anemoia: Why You Feel Nostalgic for a Time You Never Lived",
    meta_description: "Anemoia is the nostalgia for a time you never lived. Coined by John Koenig, this emotion reveals more about the present than about the past.",
  },
  {
    slug: "crise-de-significado-meaning-crisis",
    title: "The Meaning Crisis: When Nothing Makes Sense Anymore",
    excerpt: "The meaning crisis is a widespread loss of the sense of coherence, purpose and value that traditionally organized human life.",
    meta_title: "The Meaning Crisis: Why Life Feels Pointless and What to Do About It",
    meta_description: "The meaning crisis is the modern epidemic of meaninglessness. Philosopher John Vervaeke maps its causes — and the cognitive practices that help.",
  },
  {
    slug: "languishing-o-que-e-como-sair",
    title: "Languishing: Why You Feel Neither Good Nor Bad — The 'Meh' State of Mind",
    excerpt: "Languishing is a state of emotional and mental stagnation where you are not depressed, but you are not flourishing either.",
    meta_title: "Languishing: What It Is, Why It Happens and How to Move to Flourishing",
    meta_description: "Languishing was named the dominant emotion of 2021. Coined by sociologist Corey Keyes, it describes the 'meh' state between depression and flourishing.",
  },

  // ── SOCIEDADE → society ───────────────────────────────────────────────────
  {
    slug: "fadiga-democratica-cinismo-politico",
    title: "Democratic Fatigue: The Price the Mind Pays for Political Cynicism",
    excerpt: "Democratic fatigue is the psychological exhaustion resulting from constant exposure to political dysfunction, polarization and institutional disillusionment.",
    meta_title: "Democratic Fatigue: When Politics Makes You Sick — Signs and Recovery",
    meta_description: "Democratic fatigue causes real psychological harm. Understand how chronic political exposure leads to cynicism, apathy and what to do about it.",
  },
  {
    slug: "eco-ansiedade-mudanca-climatica",
    title: "Eco-Anxiety: The Fear Caused by Climate Change and How to Live With It",
    excerpt: "Eco-anxiety is the chronic fear of environmental doom — not a mental disorder, but a rational, healthy response to a genuine planetary threat.",
    meta_title: "Eco-Anxiety: Signs, Causes and How to Turn Fear into Action",
    meta_description: "68% of Americans report at least some eco-anxiety. The APA recognizes climate distress as a real concern. Learn to manage it without numbing yourself.",
  },
  {
    slug: "policrise-permacrisis-fadiga-de-crise",
    title: "Polycrisis: When Overlapping Crises Break the Mind's Ability to Cope",
    excerpt: "Polycrisis describes the simultaneous convergence of multiple global crises — economic, ecological, political — whose combined effect is greater than the sum of its parts.",
    meta_title: "Polycrisis and Permacrisis: Why Constant Crisis Is Exhausting Your Brain",
    meta_description: "Polycrisis is the new normal. Multiple simultaneous crises overwhelm the nervous system. Understand the science and strategies to build psychological resilience.",
  },
  {
    slug: "crise-reprodutiva-ter-filhos",
    title: "The Reproductive Dilemma: Why Having Children Has Become an Existential Question",
    excerpt: "33% of Americans without children cite climate as a reason. The US fertility rate has fallen to a historic low of 1.6. Understanding the dilemma.",
    meta_title: "The Reproductive Crisis: Is Having Children a Dilemma for Your Generation?",
    meta_description: "33% of Americans without children cite the climate as a reason. The US fertility rate fell to a historic low of 1.6. Understand the dilemma.",
  },
  {
    slug: "solidao-estrutural-epidemia",
    title: "Structural Loneliness: The Silent Epidemic That Kills More Than Smoking",
    excerpt: "Structural loneliness is a civilizational phenomenon — 871,000 deaths per year, approximately 100 deaths per hour.",
    meta_title: "Structural Loneliness: The Silent Epidemic — Data, Causes and How to Reconnect",
    meta_description: "1 in 6 people worldwide suffers from loneliness. WHO recognizes it as a public health crisis. Understand the data, types and what to do.",
  },
];

// ─── Helper: PATCH a single post ─────────────────────────────────────────────
async function patchPost(id, payload) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH failed for ${id}: ${res.status} ${text}`);
  }
  return res;
}

// ─── Helper: fetch all PT posts ───────────────────────────────────────────────
async function fetchPtPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?locale=eq.pt&select=id,slug,category`,
    {
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔄  Fetching all PT posts from Supabase…");
  const posts = await fetchPtPosts();
  console.log(`✅  Found ${posts.length} PT posts\n`);

  // Build a lookup: slug → {id, category}
  const slugMap = {};
  for (const p of posts) slugMap[p.slug] = p;

  let updated = 0;
  let skipped = 0;

  for (const t of TRANSLATIONS) {
    const post = slugMap[t.slug];
    if (!post) {
      console.warn(`⚠️   Not found in DB: ${t.slug}`);
      skipped++;
      continue;
    }

    const enCategory = CATEGORY_MAP[post.category] || post.category;
    const payload = {
      locale: "en",
      category: enCategory,
      title: t.title,
      excerpt: t.excerpt,
      meta_title: t.meta_title,
      meta_description: t.meta_description,
    };

    try {
      await patchPost(post.id, payload);
      console.log(`✅  Updated: ${t.slug}`);
      console.log(`      category: ${post.category} → ${enCategory}`);
      updated++;
    } catch (err) {
      console.error(`❌  Failed: ${t.slug} — ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🎉  Done! ${updated} posts updated, ${skipped} skipped.`);
  console.log(`\n⚠️   NOTE: The 'content' field still contains Portuguese.`);
  console.log(`    Full content translation requires a separate pass.`);
  console.log(`    The titles, excerpts and metadata are now in English.`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
