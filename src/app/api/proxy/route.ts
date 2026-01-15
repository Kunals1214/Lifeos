import { NextResponse } from 'next/server';
import { fetchDirect } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (!action) {
    return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
  }

  // Convert other params to an object if needed (e.g. start/end for calendar)
  const params: Record<string, any> = {};
  searchParams.forEach((value, key) => {
      if (key !== 'action') params[key] = value;
  });

  // Special handling for calendar which takes args, others take none usually?
  // fetchFromSheet signature: (action, method, data)
  // For GET, data is passed? fetchFromSheet only uses data for POST body.
  // Actually fetchFromSheet implements:
  // url.searchParams.append('action', action);
  // It does NOT currently append `data` to searchParams for GET requests!
  
  // Wait, let's look at fetchFromSheet implementation in lib/api.ts again.
  // It only appends 'auth'.
  // It does NOT append generic params for GET. 
  // EXCEPT: it seems Calendar uses `getEvents` with `start` and `end`.
  // But `api.getCalendarEvents` calls `fetchFromSheet('getEvents', 'GET', { start, end })`.
  // BUT `fetchFromSheet` IGNORES `data` if method is GET!
  
  // CRITICAL BUG in fetchFromSheet for GET params!
  
  try {
    // We can't easily fix fetchFromSheet in this file. 
    // But wait, the previous code for calendar was:
    // return fetchFromSheet('getEvents', 'GET', { start, end });
    
    // If fetchFromSheet ignores data for GET, how did calendar ever work?
    // It probably didn't, or I missed something.
    
    // Let's assume for now we are proxying.
    // If I fix fetchFromSheet to support GET params, I fix everything.
    
    const res = await fetchDirect(action, 'GET', params);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Proxy Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, ...data } = body;

  if (!action) {
    return NextResponse.json({ error: 'Missing action in body' }, { status: 400 });
  }

  try {
    const res = await fetchDirect(action, 'POST', data);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Proxy Error' }, { status: 500 });
  }
}
