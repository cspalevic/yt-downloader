import { expect, test } from "@playwright/test";
import { existsSync } from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";
import { SupportedMimeTypes } from "../types/mimeType";

const YT_VIDEO_URL =
  "https://www.youtube.com/watch?v=cGc_NfiTxng&pp=ygUNZ2FuZ25hbSBzdHlsZQ%3D%3D";
const OUTPUT_DIR = "test-results/downloads";

const OutputTypeMap = {
  MP4: SupportedMimeTypes.mp4,
  GIF: SupportedMimeTypes.gif,
};

type OuputPaths = {
  name: keyof typeof OutputTypeMap;
  paths: {
    full: string;
    start: string;
    end: string;
    startAndEnd: string;
  };
};
const mp4OutputPaths: OuputPaths = {
  name: "MP4",
  paths: {
    full: `${OUTPUT_DIR}/full.mp4`,
    start: `${OUTPUT_DIR}/start.mp4`,
    end: `${OUTPUT_DIR}/end.mp4`,
    startAndEnd: `${OUTPUT_DIR}/start-end.mp4`,
  },
};
const gifOutputPaths: OuputPaths = {
  name: "GIF",
  paths: {
    full: `${OUTPUT_DIR}/full.gif`,
    start: `${OUTPUT_DIR}/start.gif`,
    end: `${OUTPUT_DIR}/end.gif`,
    startAndEnd: `${OUTPUT_DIR}/start-end.gif`,
  },
};

test("Form errors", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("#start");
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(false);
});

[mp4OutputPaths, gifOutputPaths].forEach(({ name, paths }) => {
  test(`${name} - Basic url download`, async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#start");
    await page.getByRole("textbox", { name: "url" }).fill(YT_VIDEO_URL);
    await page
      .getByRole("combobox", { name: "type" })
      .selectOption(OutputTypeMap[name]);
    await page.getByRole("button").click();
    const form = await page.getByRole("form");
    const formValidity = await form.evaluate((element: HTMLFormElement) =>
      element.checkValidity(),
    );
    expect(formValidity).toBe(true);

    const download = await page.waitForEvent("download");
    await download.saveAs(paths.full);
    expect(existsSync(paths.full)).toBe(true);
    const videoDuration = await getVideoDurationInSeconds(paths.full);
    expect(Math.floor(videoDuration)).toBe(222);
  });

  test(`${name} - Basic url + start range download`, async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#start");
    await page.getByRole("textbox", { name: "url" }).fill(YT_VIDEO_URL);
    await page
      .getByRole("combobox", { name: "type" })
      .selectOption(OutputTypeMap[name]);
    await page.getByRole("textbox", { name: "start" }).fill("02:10");
    await page.getByRole("button").click();
    const form = await page.getByRole("form");
    const formValidity = await form.evaluate((element: HTMLFormElement) =>
      element.checkValidity(),
    );
    expect(formValidity).toBe(true);

    const download = await page.waitForEvent("download");
    await download.saveAs(paths.start);
    expect(existsSync(paths.start)).toBe(true);
    const videoDuration = await getVideoDurationInSeconds(paths.start);
    expect(Math.floor(videoDuration)).toBe(92);
  });

  test(`${name} - Basic url + end range download`, async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#start");
    await page.getByRole("textbox", { name: "url" }).fill(YT_VIDEO_URL);
    await page
      .getByRole("combobox", { name: "type" })
      .selectOption(OutputTypeMap[name]);
    await page.getByRole("textbox", { name: "end" }).fill("00:20");
    await page.getByRole("button").click();
    const form = await page.getByRole("form");
    const formValidity = await form.evaluate((element: HTMLFormElement) =>
      element.checkValidity(),
    );
    expect(formValidity).toBe(true);

    const download = await page.waitForEvent("download");
    await download.saveAs(paths.end);
    expect(existsSync(paths.end)).toBe(true);
    const videoDuration = await getVideoDurationInSeconds(paths.end);
    expect(Math.floor(videoDuration)).toBe(20);
  });

  test(`${name} - Basic url + start range + end range download`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("#start");
    await page.getByRole("textbox", { name: "url" }).fill(YT_VIDEO_URL);
    await page
      .getByRole("combobox", { name: "type" })
      .selectOption(OutputTypeMap[name]);
    await page.getByRole("textbox", { name: "start" }).fill("00:10");
    await page.getByRole("textbox", { name: "end" }).fill("00:40");
    await page.getByRole("button").click();
    const form = await page.getByRole("form");
    const formValidity = await form.evaluate((element: HTMLFormElement) =>
      element.checkValidity(),
    );
    expect(formValidity).toBe(true);

    const download = await page.waitForEvent("download");
    await download.saveAs(paths.startAndEnd);
    expect(existsSync(paths.startAndEnd)).toBe(true);
    const videoDuration = await getVideoDurationInSeconds(paths.startAndEnd);
    expect(Math.floor(videoDuration)).toBe(30);
  });
});
