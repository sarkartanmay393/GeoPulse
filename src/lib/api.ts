'use server';

import type { ITableRow } from "./types";
import { createClient } from "./supabase/server";
import { cookies } from "next/headers";

export async function insertGeoPulse(row: ITableRow, id: string = "", update: boolean = false) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    if (update) {
        const { error } = await supabase
            .from('geo_pulses')
            .update(row)
            .eq('id', id);

        if (error) {
            console.error('Error inserting row:', error.message);
            throw new Error('Failed to insert row');
        }

    } else {
        const { error } = await supabase
            .from('geo_pulses')
            .insert([row]);

        if (error) {
            console.error('Error inserting row:', error.message);
            throw new Error('Failed to insert row');
        }
    }

    return true;
}