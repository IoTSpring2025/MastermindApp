// ChatGPT integration for poker advice
import Constants from 'expo-constants';

// Interface for ChatGPT response
export interface PokerAdviceResponse {
  advice: string;
  recommendation: 'fold' | 'check' | 'call' | 'raise' | 'all-in' | 'unknown';
  confidence: number; // 0-100
  reasoning: string;
}

// Function to get poker advice from ChatGPT
export async function getPokerAdvice(
  playerCards: string[],
  communityCards: string[],
  gameStage: 'pre-flop' | 'flop' | 'turn' | 'river',
  potSize?: number,
  currentBet?: number
): Promise<PokerAdviceResponse> {
  try {
    const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey;
    
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      throw new Error("API key not configured");
    }

    const prompt = generatePokerPrompt(
      playerCards,
      communityCards,
      gameStage,
      potSize,
      currentBet
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are a poker strategy advisor. Provide concise advice about the best action to take based on the current game state. Format your response as JSON with fields: advice (brief statement), recommendation (fold/check/call/raise/all-in), confidence (0-100), reasoning (brief explanation)."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("ChatGPT API error:", data.error);
      return {
        advice: "Unable to get advice at this time.",
        recommendation: "unknown",
        confidence: 0,
        reasoning: "There was an error connecting to the AI advisor."
      };
    }

    try {
      const content = data.choices[0].message.content;
      const parsedContent = JSON.parse(content);
      
      return {
        advice: parsedContent.advice || "Consider your options carefully.",
        recommendation: (parsedContent.recommendation as any) || "unknown",
        confidence: parsedContent.confidence || 50,
        reasoning: parsedContent.reasoning || "Based on the current game state."
      };
    } catch (parseError) {
      console.error("Error parsing ChatGPT response:", parseError);
      return {
        advice: "Consider your options carefully.",
        recommendation: "unknown",
        confidence: 50,
        reasoning: "Unable to analyze this hand properly."
      };
    }
  } catch (error) {
    console.error("Error getting poker advice:", error);
    return {
      advice: "Unable to connect to advisor.",
      recommendation: "unknown",
      confidence: 0,
      reasoning: "Check your connection and try again."
    };
  }
}

// Helper function to generate the prompt for ChatGPT
function generatePokerPrompt(
  playerCards: string[],
  communityCards: string[],
  gameStage: 'pre-flop' | 'flop' | 'turn' | 'river',
  potSize?: number, 
  currentBet?: number
): string {
  // Format cards for better readability
  const formattedPlayerCards = playerCards.join(', ');
  const formattedCommunityCards = communityCards.length > 0 
    ? communityCards.join(', ') 
    : 'None yet';

  // Build the prompt
  let prompt = `Analyze this poker hand and give me advice:
- My cards: ${formattedPlayerCards}
- Community cards: ${formattedCommunityCards}
- Game stage: ${gameStage}`;

  // Add optional betting information if available
  if (potSize !== undefined) {
    prompt += `\n- Pot size: ${potSize}`;
  }
  if (currentBet !== undefined) {
    prompt += `\n- Current bet: ${currentBet}`;
  }

  prompt += "\n\nWhat should I do? Respond with a JSON object containing advice, recommendation (fold/check/call/raise/all-in), confidence (0-100), and reasoning.";

  return prompt;
}