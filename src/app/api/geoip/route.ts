import { NextRequest, NextResponse } from 'next/server';
import geoip from 'geoip-lite';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get IP from various headers (handles proxies and load balancers)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    
    // Parse the IP address
    let ip = forwardedFor?.split(',')[0]?.trim() || realIp || '0.0.0.0';
    
    // For local development, use a default IP for testing
    if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') {
      // Default to a US IP for testing (you can change this)
      ip = '8.8.8.8';
    }
    
    const geo = geoip.lookup(ip);

    if (geo) {
      return NextResponse.json({ 
        country: geo.country, 
        region: geo.region, 
        city: geo.city 
      });
    } else {
      return NextResponse.json({ 
        error: 'Location not found' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error in geoip API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
