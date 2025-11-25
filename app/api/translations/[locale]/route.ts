import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.BACKEND_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;

  if (!locale) {
    return NextResponse.json({ error: "Locale is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/translations/${locale}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      // Return 404 as 404, not 400
      const status = response.status === 404 ? 404 : response.status;
      return NextResponse.json(
        payload ?? { error: "Unable to load translation" },
        { status }
      );
    }

    const payload = await response.json();
    // Return just the data field if it exists, otherwise return the whole payload
    return NextResponse.json(payload.data ?? payload);
  } catch (error) {
    console.error("Failed to proxy translation request:", error);
    return NextResponse.json(
      { error: "Failed to load translation" },
      { status: 500 }
    );
  }
}
