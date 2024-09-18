import { createClient } from '@supabase/supabase-js';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { extractTextFromHtml, findCountryPairById } from '~/lib/utils';
import { fetchWikipediaHtml } from '~/lib/serverApi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const cacheDurationInDays = 30; // Cache expiry period (in days)

export async function POST(req: Request) {
  try {
    const { reportId } = await req.json();
    const [country1, country2] = findCountryPairById(reportId) ?? [];

    if (!reportId) {
      return new Response(JSON.stringify({ message: "reportId is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const countries = [country1, country2].sort();

    const { data: cachedData, error: fetchError } = await supabase
      .from('geo_pulses')
      .select('*')
      .eq('id', reportId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching data from Supabase:", fetchError.message);
      return new Response(JSON.stringify({ message: "Failed to fetch data from Supabase" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - cacheDurationInDays * 24 * 60 * 60 * 1000);

    const wikipediaHtml = await fetchWikipediaHtml([country1 ?? '', country2 ?? ''].sort());
    const wikipediaText = extractTextFromHtml(wikipediaHtml);

    if (cachedData && new Date(cachedData.last_updated) > oneMonthAgo) {
      return new Response(JSON.stringify({ ...cachedData, source: [wikipediaHtml.length > 0 ? 'wikipedia' : '', 'gpt-4o-mini'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      ${wikipediaText.slice(0, 15000)}
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

    const generatedData = result.object;

    const newEntry = {
      id: reportId,
      country1: countries[0],
      country2: countries[1],
      diplomatic_relations: generatedData.diplomatic_relations,
      economic_ties: generatedData.economic_ties,
      military_relations: generatedData.military_relations,
      political_alignments: generatedData.political_alignments,
      cultural_social_ties: generatedData.cultural_social_ties,
      historical_context: generatedData.historical_context,
      overall_score: generatedData.overall_score,
      last_updated: new Date().toISOString(),
      version: cachedData ? cachedData.version + 1 : 1,
      source: [wikipediaHtml.length > 0 ? 'wikipedia' : '', 'gpt-4o-mini'],
    };

    const { error: insertError } = await supabase
      .from('geo_pulses')
      .insert([newEntry]);

    if (insertError) {
      console.error("Error inserting new data into Supabase:", insertError.message);
      return new Response(JSON.stringify({ message: "Failed to store generated data in Supabase" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(newEntry), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return new Response(JSON.stringify({ message: "Error generating analysis", error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
