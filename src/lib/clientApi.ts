'use client';

import { createClient } from "./supabase/client";
import { TWrongReport } from "./types";

export async function insertWrongReport(row: TWrongReport) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('report-wrong-reports')
        .insert([row]).select('id');

    if (error) {
        console.error('Error inserting row:', error.message);
        throw new Error('Failed to insert row');
    }

    const { error: deleteError } = await supabase.from('geo_pulses').delete().eq('id', row.pulse_id);

    if (deleteError) {
        console.error('Error deleting row:', deleteError.message);
        throw new Error('Failed to delete row');
    }

    const { error: reportUpdateError } = await supabase
        .from('report-wrong-reports')
        .update({ report_corrected: true })
        .eq('id', data?.[0]?.id);

    if (reportUpdateError) {
        console.error('Error updating row:', reportUpdateError.message);
        throw new Error('Failed to update row');
    }

    return true;
}