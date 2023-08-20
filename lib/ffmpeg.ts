import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const FFMPEG_SOURCE_URL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

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

export const cutVideo = async (
  video: Buffer,
  { start, end }: { start?: string; end?: string },
): Promise<Buffer> => {
  await ffmpegInstance.writeFile("video.mp4", video);
  const params: string[] = ["-i", "video.mp4", "-c", "copy", "output.mp4"];
  if (end) {
    params.splice(0, 0, "-to", end);
  }
  if (start) {
    params.splice(0, 0, "-ss", start);
  }
  await ffmpegInstance.exec(params);
  const output = await ffmpegInstance.readFile("output.mp4");
  return Buffer.from(output);
};
