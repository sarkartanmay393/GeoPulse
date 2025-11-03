import { createClient } from '@supabase/supabase-js';
import { generateCountryPairId } from '~/lib/utils';
import { ITableRow } from '~/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { countries, startDate, endDate } = await req.json();

    if (!countries || countries.length < 2) {
      return new Response(
        JSON.stringify({ message: "At least 2 countries are required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate all possible country pairs from the selected countries
    const countryPairs: string[] = [];
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const pairId = generateCountryPairId(countries[i], countries[j]);
        countryPairs.push(pairId);
      }
    }

    // Build the query
    let query = supabase
      .from('geo_pulses')
      .select('*')
      .in('id', countryPairs);

    // Filter by date range if provided
    if (startDate) {
      query = query.gte('last_updated', startDate);
    }
    if (endDate) {
      query = query.lte('last_updated', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching comparison data:", error.message);
      return new Response(
        JSON.stringify({ message: "Failed to fetch comparison data", cause: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Group by id and take the latest version for each
    const latestDataMap = new Map<string, ITableRow>();
    
    data?.forEach((current: ITableRow) => {
      const existing = latestDataMap.get(current.id);
      if (!existing || (current.version || 0) > (existing.version || 0)) {
        latestDataMap.set(current.id, current);
      }
    });
    
    const latestData = Array.from(latestDataMap.values());

    return new Response(JSON.stringify(latestData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error processing comparison request:", errorMessage);
    return new Response(
      JSON.stringify({ message: "Error processing request", error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
