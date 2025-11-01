'use server';

import type { ITableRow } from "./types";
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
        console.error('Error fetching recent reports:', error.message);
        return [];
    }

    return data ?? [];
}