import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Use Microlink API to capture a screenshot
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&viewport.deviceScaleFactor=1`;

    const res = await fetch(screenshotUrl, {
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Screenshot service returned ${res.status}`);
    }

    // Microlink with embed returns the image directly
    const contentType = res.headers.get("content-type");
    if (contentType?.startsWith("image/")) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // If it returned JSON instead of image, extract the screenshot URL
    const data = await res.json();
    const imgUrl = data?.data?.screenshot?.url;
    if (!imgUrl) {
      throw new Error("No screenshot URL in response");
    }

    // Fetch the actual image
    const imgRes = await fetch(imgUrl, { signal: AbortSignal.timeout(10000) });
    const imgBuffer = await imgRes.arrayBuffer();
    return new NextResponse(imgBuffer, {
      headers: {
        "Content-Type": imgRes.headers.get("content-type") || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Screenshot error:", err);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 502 }
    );
  }
}
