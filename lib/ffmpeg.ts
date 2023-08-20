import { SupportedMimeTypes } from "@/types/mimeType";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const FFMPEG_SOURCE_URL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
const mimeTypeFileOutputMap = {
  [SupportedMimeTypes.gif]: "o.gif",
  [SupportedMimeTypes.mp4]: "o.mp4",
};

let ffmpegInstance: FFmpeg;

export const trySetup = async (): Promise<boolean> => {
  try {
    ffmpegInstance = new FFmpeg();
    ffmpegInstance.load({
      coreURL: await toBlobURL(
        `${FFMPEG_SOURCE_URL}/ffmpeg-core.js`,
        "text/javascript",
      ),
      wasmURL: await toBlobURL(
        `${FFMPEG_SOURCE_URL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });
    return true;
  } catch (error) {
    console.log("Error loading FFmpeg", error);
    return false;
  }
};

export const exec = async (
  video: Buffer,
  options: { start?: string; end?: string; type?: SupportedMimeTypes },
): Promise<Buffer> => {
  const { start, end, type = SupportedMimeTypes.mp4 } = options;
  await ffmpegInstance.writeFile("video.mp4", video);
  const params: string[] = [];
  if (start) {
    params.push("-ss", start);
  }
  if (end) {
    params.push("-to", end);
  }
  const outputFile = mimeTypeFileOutputMap[type];
  params.push("-i", "video.mp4", outputFile);
  await ffmpegInstance.exec(params);
  const output = await ffmpegInstance.readFile(outputFile);
  return Buffer.from(output);
};
