import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const { locale } = await params;

    // Path to the messages directory
    const messagesPath = path.join(process.cwd(), "messages", `${locale}.json`);

    // Check if file exists
    if (!fs.existsSync(messagesPath)) {
      return NextResponse.json(
        { error: `Language file for ${locale} not found` },
        { status: 404 }
      );
    }

    // Read and return the file
    const fileContent = fs.readFileSync(messagesPath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    const { locale } = await params;
    console.error(`Error loading language file for ${locale}:`, error);
    return NextResponse.json(
      { error: "Failed to load language file" },
      { status: 500 }
    );
  }
}
