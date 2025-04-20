// src/app/api/campaignMeta/[campaignId]/route.js

import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/dbConnect';
import CampaignMeta from '../../../../../models/CampaignMeta';

export async function GET(request, { params }) {
  const { campaignId } = params;  // no await needed in stable Next.js

  try {
    await connectDB();
    const doc = await CampaignMeta.findOne({ campaignId }).lean();
    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'No metadata found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: doc }, { status: 200 });
  } catch (err) {
    console.error('[/api/campaignMeta/[campaignId]] GET error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
