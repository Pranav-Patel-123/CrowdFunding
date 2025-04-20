// src/app/api/campaignMeta/route.js

import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect';
import CampaignMeta from '../../../../models/CampaignMeta';

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const doc = await CampaignMeta.create(body);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (err) {
    console.error('[/api/campaignMeta] error:', err);
    return NextResponse.json(
      { error: err.message || 'Database error' },
      { status: 500 }
    );
  }
}
