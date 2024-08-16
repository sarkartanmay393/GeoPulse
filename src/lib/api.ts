'use server';

import { IGeopoliticalAnalysis, ITableRow, TWrongReport } from "./types";
import { createClient } from "./supabase/server";
import { cookies } from "next/headers";
import { geopoliticalAnalysisToTableRow } from "./utils";

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

export async function insertWrongReport(row: TWrongReport) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .from('report-wrong-reports')
        .insert([row]).select('id');

    if (error) {
        console.error('Error inserting row:', error.message);
        throw new Error('Failed to insert row');
    }

    return { reportId: data?.[0]?.id };
}

export async function correctWrongReport(reportId: any) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data } = await supabase
        .from('report-wrong-reports')
        .select('*')
        .eq('id', reportId).maybeSingle();

    if (!data) {
        throw new Error('Report not found');
    }

    if (data.report_corrected) {
        throw new Error('Report already corrected');
    }

    const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            country1: data.country1,
            country2: data.country2,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to generate data");
    }

    const generatedData: IGeopoliticalAnalysis = await response.json();
    const geoPulseTableFormat = geopoliticalAnalysisToTableRow(generatedData, data.pulse_id, [data.country1, data.country2]);

    await insertGeoPulse(geoPulseTableFormat, data.pulse_id, true);

    const { error } = await supabase
        .from('report-wrong-reports')
        .update({ report_corrected: true })
        .eq('id', reportId);

    if (error) {
        console.error('Error updating row:', error.message);
        throw new Error('Failed to update row');
    }

    return true;
}