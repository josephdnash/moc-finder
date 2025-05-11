// src/app/api/rebrickable-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("--- MINIMAL API ROUTE WAS HIT ---");
  const setNum = request.nextUrl.searchParams.get('set_num');
  
  return NextResponse.json({ 
    message: "Minimal proxy reporting for duty!", 
    set_num_received: setNum 
  });
}
