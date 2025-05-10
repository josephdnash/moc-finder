import { NextRequest, NextResponse } from 'next/server';

// This function will handle GET requests to /api/rebrickable-proxy
export async function GET(request: NextRequest) {
  // 1. Get the LEGO set number from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const setNum = searchParams.get('set_num');

  if (!setNum) {
    return NextResponse.json({ error: 'Set number is required' }, { status: 400 });
  }

  // 2. Get the API key from environment variables
  const apiKey = process.env.REBRICKABLE_API_KEY;

  if (!apiKey) {
    console.error('Rebrickable API key is not configured.');
    return NextResponse.json({ error: 'Internal server error: API key missing' }, { status: 500 });
  }

  // 3. Construct the Rebrickable API URL
  // Example: GET https://rebrickable.com/api/v3/lego/sets/{set_num}/alternates/?key={api_key}
  // We'll also request parts data for each MOC for future use (though M0 might just display count/name)
  const rebrickableUrl = `https://rebrickable.com/api/v3/lego/sets/${setNum}/alternates/?key=${apiKey}&page_size=1000`; // Increased page_size to get more results if available

  try {
    // 4. Fetch data from Rebrickable API
    const rebrickableResponse = await fetch(rebrickableUrl, {
      headers: {
        'Accept': 'application/json', // Standard header for JSON APIs
      },
    });

    // 5. Check if the Rebrickable API call was successful
    if (!rebrickableResponse.ok) {
      // Log the error response from Rebrickable for debugging
      const errorData = await rebrickableResponse.text(); // Use .text() in case it's not JSON
      console.error(`Rebrickable API error: ${rebrickableResponse.status} ${rebrickableResponse.statusText}`, errorData);
      return NextResponse.json(
        { error: `Error fetching data from Rebrickable: ${rebrickableResponse.statusText}`, details: errorData },
        { status: rebrickableResponse.status }
      );
    }

    const data = await rebrickableResponse.json();

    // 6. Return the data to our frontend
    // The data structure from Rebrickable for alternates is:
    // { count: N, next: null/url, previous: null/url, results: [ {set_num, name, year, num_parts, moc_img_url, moc_url, designer_name, designer_url}, ... ] }
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in API route calling Rebrickable:', error);
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
