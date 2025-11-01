import { fetchNewsArticles } from '~/lib/serverApi';

export async function POST(req: Request) {
  try {
    const { country1, country2 } = await req.json();

    if (!country1 || !country2) {
      return new Response(
        JSON.stringify({ message: "Both country1 and country2 are required" }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const articles = await fetchNewsArticles(country1, country2);

    return new Response(
      JSON.stringify({ 
        articles,
        totalResults: articles.length 
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error("Error fetching news articles:", error.message);
    return new Response(
      JSON.stringify({ 
        message: "Error fetching news articles", 
        error: error.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
