import { NextApiRequest, NextApiResponse } from 'next';
import geoip from 'geoip-lite';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup((Array.isArray(ip) ? ip[0] : ip) ?? '');

    if (geo) {
      res.status(200).json({ country: geo.country, region: geo.region, city: geo.city });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}