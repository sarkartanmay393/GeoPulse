# GeoPulse

<img src="/public/logo.jpeg" alt="GeoPulse" width="128" height="128">

GeoPulse provides real-time, AI data-driven insights into the geopolitical relationships between countries. By analyzing diplomatic, economic, military, political, cultural, and historical factors, GeoPulse offers a comprehensive view of global interactions, helping users understand and visualize the complexities of international relations. Ideal for geopolitical enthusiasts, policymakers, and financial analysts, GeoPulse is your go-to tool for staying informed about the global landscape.

## Features

- Get Score based on few pre-defined factors
- Read how the score is calculated
- Real-time news integration for up-to-date geopolitical analysis
- AI-powered insights using GPT-4 with current news context

<!-- ## Demo

![GeoPulse Demo](demo.gif) -->

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sarkartanmay393/GeoPulse.git
   cd GeoPulse
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```
   
3. Copy env:

   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:

   ```bash
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NEWS_API_KEY=your_newsapi_key  # Get from https://newsapi.org
   ```

   **Note**: The `NEWS_API_KEY` is optional. If not provided, the app will still work but won't fetch real-time news articles for analysis.

5. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/generate
Generates geopolitical analysis for two countries with real-time news integration.

**Request:**
```json
{
  "reportId": "uuid-of-country-pair"
}
```

### POST /api/news
Fetches recent news articles about two countries.

**Request:**
```json
{
  "country1": "United States",
  "country2": "China"
}
```

**Response:**
```json
{
  "articles": [...],
  "totalResults": 15
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

## Contact

For any inquiries, please contact [sarkartanmay393@pm.me]. 
