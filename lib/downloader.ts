import { downloadFromInfo, getInfo } from "ytdl-core";

export const downloadVideo = (url: string): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const info = await getInfo(url);

    const ytVideo = downloadFromInfo(info, {
      filter: "audioandvideo",
      quality: "highest",
    });
    const data: Buffer[] = [];

    ytVideo.on("data", (chunk) => {
      data.push(chunk);
    });

    ytVideo.on("end", () => {
      resolve(Buffer.concat(data));
    });
  });
};
