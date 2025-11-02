import { NextRequest, NextResponse } from 'next/server';
import { fetchCountrySpecificReports } from '~/lib/serverApi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get('countryCode');

    if (!countryCode) {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      );
    }

    const reports = await fetchCountrySpecificReports(countryCode, 5);

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching country-specific reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
