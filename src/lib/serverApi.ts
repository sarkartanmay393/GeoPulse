'use server';

import type { ITableRow, INewsArticle } from "./types";
import { createClient } from "./supabase/server";
import { cookies } from "next/headers";
import { increamentVersion } from "./utils";

export async function insertGeoPulse(row: ITableRow, id: string = "", update: boolean = false, version: number = 1.0) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    if (update) {
        const { error } = await supabase
            .from('geo_pulses')
            .insert({ ...row, version: increamentVersion(version) })
            .eq('id', id);

        if (error) {
            console.error('Error inserting row:', error.message);
            throw new Error('Failed to insert row');
        }

    } else {
        const { error } = await supabase
            .from('geo_pulses')
            .insert([{ ...row, version }]);

        if (error) {
            console.error('Error inserting row:', error.message);
            throw new Error('Failed to insert row');
        }
    }

    return true;
}

export async function fetchWikipediaHtml (countries: string[]) {
    const url = `https://en.wikipedia.org/w/rest.php/v1/page/${countries[0]}%E2%80%93${countries[1]}_relations/html`;
    const response = await fetch(url);
    if (response.status !== 200) {
        return '';
    }
    const html = await response.text();
    return html;
}

export async function fetchRecentReports(limit: number = 5): Promise<ITableRow[]> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Fetch the last 'limit' reports ordered by last_updated (which is when they were created/updated)
    const { data, error } = await supabase
        .from('geo_pulses')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Failed to fetch recent reports from database:', error.message);
        return [];
    }

    return data ?? [];
}

export async function fetchNewsArticles(country1: string, country2: string): Promise<INewsArticle[]> {
    const apiKey = process.env.NEWS_API_KEY;
    
    // If no API key is provided, return empty array (graceful degradation)
    if (!apiKey) {
        console.warn('NEWS_API_KEY not found. News articles will not be fetched.');
        return [];
    }

    try {
        // Build a query that searches for news about both countries
        const query = `("${country1}" AND "${country2}") OR ("${country1}-${country2} relations")`;
        
        // Calculate date 30 days ago for recent news
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        // Use NewsAPI's everything endpoint for more comprehensive results
        const url = new URL('https://newsapi.org/v2/everything');
        url.searchParams.append('q', query);
        url.searchParams.append('from', fromDate);
        url.searchParams.append('sortBy', 'relevancy');
        url.searchParams.append('pageSize', '15');
        url.searchParams.append('language', 'en');
        url.searchParams.append('apiKey', apiKey);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            console.error(`NewsAPI request failed with status ${response.status}`);
            return [];
        }

        const data = await response.json();
        
        return data.articles?.slice(0, 15) ?? [];
    } catch (error) {
        console.error('Error fetching news articles:', error);
        return [];
    }
}