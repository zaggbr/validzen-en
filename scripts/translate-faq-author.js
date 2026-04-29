import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = 'https://qugirvcaivozqssryajd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function translateText(text, context = '') {
  if (!text || text.trim() === '') return text;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator specialized in psychology and mental wellbeing. Translate the following Portuguese text to English. Maintain a premium, clinical, yet empathetic tone. ${context}`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

async function translateFAQ(faq) {
  if (!faq || !Array.isArray(faq)) return faq;
  
  const translatedFaq = [];
  for (const item of faq) {
    const question = await translateText(item.question, 'This is a FAQ question for a psychology blog.');
    const answer = await translateText(item.answer, 'This is a FAQ answer for a psychology blog.');
    translatedFaq.push({ question, answer });
  }
  return translatedFaq;
}

async function main() {
  console.log('🚀 Starting FAQ and Author translation migration...');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, faq, author_bio, author_credentials')
    .eq('locale', 'en');

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  console.log(`Found ${posts.length} posts to process.`);

  for (const post of posts) {
    console.log(`\nProcessing: ${post.slug}`);
    const updates = {};

    if (post.faq && post.faq.length > 0) {
      console.log('  Translating FAQ...');
      updates.faq = await translateFAQ(post.faq);
    }

    if (post.author_bio && post.author_bio.length > 0) {
        console.log('  Translating Bio...');
        updates.author_bio = await translateText(post.author_bio, 'This is an author bio for a psychologist or wellbeing expert.');
    }

    if (post.author_credentials && post.author_credentials.length > 0) {
        console.log('  Translating Credentials...');
        updates.author_credentials = await translateText(post.author_credentials, 'These are professional credentials like "Clinical Psychologist" or "Mental Health Expert".');
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', post.id);

      if (updateError) {
        console.error(`  Failed to update ${post.slug}:`, updateError);
      } else {
        console.log(`  ✅ Successfully updated ${post.slug}`);
      }
    } else {
      console.log('  No updates needed.');
    }
  }

  console.log('\n✨ Migration complete!');
}

main();
