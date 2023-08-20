"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import va from "@vercel/analytics";
import { cutVideo, trySetup } from "@/lib/ffmpeg";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { InputShimmer } from "@/components/Shimmer";
import { Spinner } from "@/components/Spinner";

export default function Main() {
  const [isVideoDownloading, setIsVideoDownloading] = useState(false);
  const [isRangeSupported, setIsRangeSupported] = useState<boolean | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const urlInput = useRef<HTMLInputElement>(null);
  const startRangeInput = useRef<HTMLInputElement>(null);
  const endRangeInput = useRef<HTMLInputElement>(null);
  const downloadAnchor = useRef<HTMLAnchorElement>(null);

  const tryDownload: MouseEventHandler<HTMLButtonElement> = async (event) => {
    if (!formRef.current?.checkValidity()) return;
    event.preventDefault();

    setIsVideoDownloading(true);
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        url: urlInput.current!.value,
      }),
    });
    let blob = await response.blob();
    if (
      isRangeSupported &&
      (startRangeInput.current!.value || endRangeInput.current!.value)
    ) {
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = await cutVideo(Buffer.from(arrayBuffer), {
        start: startRangeInput.current!.value,
        end: endRangeInput.current!.value,
      });
      blob = new Blob([buffer], { type: "video/mp4" });
    }
    setIsVideoDownloading(false);
    va.track("VideoDownload", { isRangeSupported });
    downloadAnchor.current!.href = URL.createObjectURL(blob);
    downloadAnchor.current!.click();
  };

  useEffect(() => {
    (async () => {
      const isFfmpegLoaded = await trySetup();
      setIsRangeSupported(isFfmpegLoaded);
    })();
  }, []);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-5 p-2 w-[100%] sm:w-[550px]"
    >
      <Input
        ref={urlInput}
        label="URL"
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"
        required={true}
      />
      {isRangeSupported === null && (
        <div className="flex gap-5">
          <InputShimmer />
          <InputShimmer />
        </div>
      )}
      {isRangeSupported && (
        <div className="flex gap-5 justify-between">
          <Input
            ref={startRangeInput}
            label="Start Range"
            placeholder="[HH:]MM:SS[.m...]"
          />
          <Input
            ref={endRangeInput}
            label="End Range"
            placeholder="[HH:]MM:SS[.m...]"
          />
        </div>
      )}
      <Button onClick={tryDownload}>
        {isVideoDownloading ? <Spinner /> : "Download"}
      </Button>
      <a ref={downloadAnchor} download={true} />
    </form>
  );
}
