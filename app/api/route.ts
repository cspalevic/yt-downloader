import { downloadVideo } from "@/lib/downloader";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  const data = await downloadVideo(url);

  return new Response(data, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": data.byteLength.toString(),
      "Content-Disposition": "attachment; output.mp4",
    },
  });
}
