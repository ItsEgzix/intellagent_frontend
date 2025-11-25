import { NextResponse } from "next/server";

const API_URL =
  process.env.BACKEND_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/translations`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load translations list" },
        { status: response.status }
      );
    }

    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to fetch translations list:", error);
    return NextResponse.json(
      { error: "Failed to load translations list" },
      { status: 500 }
    );
  }
}
