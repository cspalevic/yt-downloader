"use client";

import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { FormInput } from "@/components/FormInput";
import { Input } from "@/components/Input";
import { Spinner } from "@/components/Spinner";
import { exec, trySetup } from "@/lib/ffmpeg";
import { SupportedMimeTypes } from "@/types/mimeType";
import va from "@vercel/analytics";
import { MouseEventHandler, useEffect, useRef, useState } from "react";

export default function Main() {
  const [ffmpegSupport, setFfmpegSupport] = useState<
    "loading" | "supported" | "not-supported"
  >("loading");
  const [isVideoDownloading, setIsVideoDownloading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const urlInput = useRef<HTMLInputElement>(null);
  const typeInput = useRef<HTMLSelectElement>(null);
  const startRangeInput = useRef<HTMLInputElement>(null);
  const endRangeInput = useRef<HTMLInputElement>(null);
  const downloadAnchor = useRef<HTMLAnchorElement>(null);

  const tryDownload: MouseEventHandler<HTMLButtonElement> = async (event) => {
    if (!formRef.current?.checkValidity()) return;
    event.preventDefault();

    try {
      setIsVideoDownloading(true);
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          url: urlInput.current!.value,
        }),
      });
      let blob = await response.blob();
      if (
        ffmpegSupport === "supported" &&
        (startRangeInput.current?.value || endRangeInput.current?.value)
      ) {
        const arrayBuffer = await blob.arrayBuffer();
        const type =
          (typeInput.current?.value as SupportedMimeTypes) ??
          SupportedMimeTypes.mp4;
        const buffer = await exec(Buffer.from(arrayBuffer), {
          start: startRangeInput.current?.value ?? "",
          end: endRangeInput.current?.value ?? "",
          type,
        });
        blob = new Blob([buffer], {
          type,
        });
      }
      va.track("VideoDownload", { ffmpegSupport });
      downloadAnchor.current!.href = URL.createObjectURL(blob);
      downloadAnchor.current!.click();
    } catch (error) {
      // Do nothing (for now)
    } finally {
      setIsVideoDownloading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const isFfmpegLoaded = await trySetup();
      setFfmpegSupport(isFfmpegLoaded ? "supported" : "not-supported");
    })();
  }, []);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-5 p-2 w-[100%] sm:w-[550px]"
      role="form"
    >
      <div className="flex gap-5">
        <FormInput label="URL" htmlFor="url" className="flex-1">
          <Input
            ref={urlInput}
            id="url"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"
            required={true}
          />
        </FormInput>
        <FormInput
          label="Type"
          htmlFor="type"
          loading={ffmpegSupport === "loading"}
          hidden={ffmpegSupport === "not-supported"}
          loadingClassName="w-[80px]"
        >
          <Dropdown
            ref={typeInput}
            id="type"
            options={[
              { label: ".mp4", value: SupportedMimeTypes.mp4 },
              { label: ".gif", value: SupportedMimeTypes.gif },
            ]}
          />
        </FormInput>
      </div>
      <div className="flex gap-5 justify-between">
        <FormInput
          label="Start range"
          htmlFor="start"
          loading={ffmpegSupport === "loading"}
          hidden={ffmpegSupport === "not-supported"}
          loadingClassName="grow"
        >
          <Input
            ref={startRangeInput}
            id="start"
            placeholder="[HH:]MM:SS[.m...]"
          />
        </FormInput>
        <FormInput
          label="End range"
          htmlFor="end"
          loading={ffmpegSupport === "loading"}
          hidden={ffmpegSupport === "not-supported"}
          loadingClassName="grow"
        >
          <Input ref={endRangeInput} id="end" placeholder="[HH:]MM:SS[.m...]" />
        </FormInput>
      </div>
      <Button onClick={tryDownload}>
        {isVideoDownloading ? <Spinner /> : "Download"}
      </Button>
      <a ref={downloadAnchor} download={true} />
    </form>
  );
}
