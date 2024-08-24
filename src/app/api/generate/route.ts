import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { fetchWikipediaHtml } from '~/lib/api';
import { extractTextFromHtml } from '~/lib/utils';
// import { Browserbase, BrowserbaseAISDK } from '@browserbasehq/sdk'

export const maxDuration = 30;

// const browserbase = new Browserbase()
// const browserTool = BrowserbaseAISDK(browserbase, { textContent: true })

export async function POST(req: Request) {
  const { country1, country2 } = await req.json();

  const wikipediaHtml = await fetchWikipediaHtml([country1, country2]);
  const wikipediaText = extractTextFromHtml(wikipediaHtml);

  const formattedPrompt = `
      You are a geopolitical analyst. Given the two countries ${country1} and ${country2}, analyze their relationship based on the following six key factors using the most recent and latest data available from the internet:

      1. Diplomatic Relations: Assess the presence of embassies, consulates, and other diplomatic missions, the frequency of high-level diplomatic visits, and any significant treaties or agreements. Provide the number and locations of embassies in both countries, and include any notable diplomatic engagements. Pull the latest diplomatic events and treaties from current news sources.
         - Score: Provide a score out of 100, where 0 indicates very weak diplomatic relations and 100 indicates very strong relations.
         - Explanation: Briefly explain why this score was assigned, citing specific data such as the number of embassies, their locations, and the nature of diplomatic interactions. Ensure that all data is the most up-to-date by incorporating the latest diplomatic news from the internet.

      2. Economic Ties: Evaluate the trade volume, investment flows, and any economic agreements or sanctions in place. Mention key export-import statistics, major investment projects, and the overall economic interdependence between the two countries. Include the most recent trade agreements and economic developments as reported in current news articles.
         - Score: Provide a score out of 100, where 0 indicates minimal economic ties and 100 indicates very strong economic cooperation.
         - Explanation: Briefly explain why this score was assigned, including specific data like trade volumes, key industries involved, and major economic agreements. Use the latest trade data available and include recent economic news.

      3. Military Relations: Examine the level of defense cooperation, including military alliances, joint exercises, arms deals, and any military bases or deployments. Provide details on recent joint exercises or significant defense agreements from the latest news sources.
         - Score: Provide a score out of 100, where 0 indicates minimal military cooperation and 100 indicates very strong military relations.
         - Explanation: Briefly explain why this score was assigned, including details of joint military exercises, defense pacts, or arms sales, using the most recent developments from the internet.

      4. Political Alignments: Consider their alignment on global political issues, voting patterns in international organizations, and public statements by leaders. Mention any significant differences or alignments in their foreign policies. Include the most recent political statements and alignments as reported in the news.
         - Score: Provide a score out of 100, where 0 indicates divergent political stances and 100 indicates close political alignment.
         - Explanation: Briefly explain why this score was assigned, with references to specific voting patterns or public statements. Ensure the analysis reflects the latest political interactions from current news.

      5. Cultural and Social Ties: Assess people-to-people connections, cultural exchanges, educational partnerships, and public perception. Mention significant cultural events, student exchanges, and public opinion data. Include the latest cultural exchanges and public sentiment as captured by current surveys and news reports.
         - Score: Provide a score out of 100, where 0 indicates weak cultural ties and 100 indicates strong cultural connections.
         - Explanation: Briefly explain why this score was assigned, including details on cultural programs, educational exchanges, or public sentiment. Use recent cultural exchanges, surveys, and news articles.

      6. Historical Context: Analyze the historical relationship between the two countries, including past conflicts, cooperation, and any unresolved historical issues. Mention key historical events that continue to influence the relationship, and include any recent historical discussions or commemorations.
         - Score: Provide a score out of 100, where 0 indicates a problematic historical relationship and 100 indicates a strong, cooperative history.
         - Explanation: Briefly explain why this score was assigned, citing specific historical events or legacies.

      Overall Geopolitical Relationship Score: Calculate the average score across all six factors. Ensure that the overall score is consistent with the individual factor scores and reflects the general relationship between the two countries.
         - Score: Provide a final score out of 100, where 0 indicates a very weak overall relationship and 100 indicates a very strong relationship.
         - Explanation: Briefly summarize why this score was assigned, ensuring that it is an average and well-balanced reflection of the individual scores provided above.

      Scoring must be objective and based solely on the analysis and data provided, without being influenced by personal opinions or external factors.

      Use the text below to make the analysis more accurate.
      ${wikipediaText}
    `;

  const result = await generateObject({
    model: openai('gpt-4o-2024-08-06'),
    schema: z.object({
      diplomatic_relations: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      economic_ties: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      military_relations: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      political_alignments: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      cultural_social_ties: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      historical_context: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
      overall_score: z.object({
        score: z.number(),
        explanation: z.string(),
      }),
    }),
    prompt: formattedPrompt.slice(0, 15000),
  });

  return new Response(JSON.stringify(result.object), {
    headers: { 'Content-Type': 'application/json' },
  });
}
