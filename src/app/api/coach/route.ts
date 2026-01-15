import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;
    const profile = body.profile || { name: 'Seeker', targetRole: 'Life Mastery', skills: [], experience: 'Beginner' };

    // Get API key from settings or environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        response: getOfflineResponse(message, profile) 
      });
    }

    const systemPrompt = `You are "Mahavir", an expert AI Life Transformation Coach and Mentor.
Your mission is to guide ${profile.name} towards becoming the best version of themselves, achieving a Billionaire Mindset, and mastering life through discipline, wisdom, and action.

Integrate these core pillars into your coaching:
1. **Hindu Philosophy**: Use wisdom from Bhagavad Gita, Upanishads, and Vedic teachings (e.g., Karma Yoga, Dharma, Mindfulness) to provide depth and spiritual strength.
2. **Billionaire Mindset**: Teach abundance, risk-taking, long-term thinking, value creation, and relentless execution.
3. **English Mastery**: Help with communication skills. If ${profile.name} makes grammatical errors, gently correct them and introduce 1-2 advanced English words or idioms in every response to help them grow.
4. **Holistic Progress**: Coach on health, wealth, wisdom, and mindset.

Guidelines:
- Be authoritative, wise, and deeply motivating.
- Use **bold** and bullet points for actionable steps.
- Start or end with a small piece of ancient wisdom or a "Billionaire Truth".
- If ${profile.name} feels low, give them a "Warrior's Rebirth" speech.

Their current data:
- Role/Goal: ${profile.targetRole || 'General Life Mastery'}
- Skills: ${profile.skills?.join(', ') || 'Learning...'}
- Experience: ${profile.experience || 'Starting fresh'}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            ...history.map((msg: { role: string; content: string }) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            })),
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      getOfflineResponse(message, profile);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ 
      response: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or check your API key in settings.' 
    });
  }
}

function getOfflineResponse(query: string, profile: { name?: string }): string {
  const q = query.toLowerCase();
  
  if (q.includes('philosophy') || q.includes('spirit') || q.includes('gita')) {
    return `🕉️ **Warrior Wisdom (Mahavir's Offline Message):**

"Karmanye vadhikaraste ma phaleshu kadachana." — *You have a right to your actions, but not to the fruits of your actions.*

In your journey to a **Billionaire Mindset**, remember that detachment from results allows for absolute focus on execution.

**Action Item:** Spend 10 minutes in silence today. Observe your thoughts without judgment. This is the first step to mastering the mind.

*P.S. Today's advanced English word: **Equanimity** (Noun) — mental calmness and composure, especially in a difficult situation.*`;
  }
  
  if (q.includes('wealth') || q.includes('money') || q.includes('billionaire')) {
    return `💰 **The Billionaire Blueprint:**

1. **Value Creation** - Wealth is a side effect of providing value to millions.
2. **Compound Life** - Not just money, but compound your knowledge and health.
3. **Decisive Action** - Billionaires decide fast and change slowly.

**Lexicon Growth:** **Preponderance** (Noun) — the quality or fact of being greater in number, quantity, or importance. Use this when describing your market advantage!`;
  }
  
  return `⚔️ **Mahavir is here.**

I am currently operating in limited capacity due to connection issues, but my wisdom remains. 

Tell me, ${profile.name || 'seeker'}, what is the one habit holding you back from your **Dharma** (purpose) today? 

*English Tip: Use the word **Imperative** instead of "very important" to sound more globally professional.*`;
}
