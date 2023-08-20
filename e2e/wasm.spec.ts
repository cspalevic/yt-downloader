import { expect, test } from "@playwright/test";
import { existsSync } from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";

const YT_VIDEO_URL =
  "https://www.youtube.com/watch?v=cGc_NfiTxng&pp=ygUNZ2FuZ25hbSBzdHlsZQ%3D%3D";

const OUTPUT_PATHS = {
  FULL_VIDEO: "e2e-output/full.mp4",
  WITH_START_RANGE: "e2e-output/start-range.mp4",
  WITH_END_RANGE: "e2e-output/end-range.mp4",
  CUT_VIDEO: "e2e-output/cut.mp4",
};

test("Form errors", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('input[id="Start Range"]');
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(false);
});

test("Basic url download", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('input[id="Start Range"]');
  await page.getByLabel("URL").fill(YT_VIDEO_URL);
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(true);

  const download = await page.waitForEvent("download");
  await download.saveAs(OUTPUT_PATHS.FULL_VIDEO);
  expect(existsSync(OUTPUT_PATHS.FULL_VIDEO)).toBe(true);
  const videoDuration = await getVideoDurationInSeconds(
    OUTPUT_PATHS.FULL_VIDEO,
  );
  expect(Math.floor(videoDuration)).toBe(222);
});

test("Basic url + start range download", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('input[id="Start Range"]');
  await page.getByLabel("URL").fill(YT_VIDEO_URL);
  await page.getByLabel("Start Range").fill("00:10");
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(true);

  const download = await page.waitForEvent("download");
  await download.saveAs(OUTPUT_PATHS.WITH_START_RANGE);
  expect(existsSync(OUTPUT_PATHS.WITH_START_RANGE)).toBe(true);
  const videoDuration = await getVideoDurationInSeconds(
    OUTPUT_PATHS.WITH_START_RANGE,
  );
  expect(Math.floor(videoDuration)).toBe(212);
});

test("Basic url + end range download", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('input[id="End Range"]');
  await page.getByLabel("URL").fill(YT_VIDEO_URL);
  await page.getByLabel("End Range").fill("00:20");
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(true);

  const download = await page.waitForEvent("download");
  await download.saveAs(OUTPUT_PATHS.WITH_END_RANGE);
  expect(existsSync(OUTPUT_PATHS.WITH_END_RANGE)).toBe(true);
  const videoDuration = await getVideoDurationInSeconds(
    OUTPUT_PATHS.WITH_END_RANGE,
  );
  expect(Math.floor(videoDuration)).toBe(20);
});

test("Basic url + start range + end range download", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('input[id="End Range"]');
  await page.getByLabel("URL").fill(YT_VIDEO_URL);
  await page.getByLabel("Start Range").fill("00:10");
  await page.getByLabel("End Range").fill("00:40");
  await page.getByRole("button").click();
  const form = await page.getByRole("form");
  const formValidity = await form.evaluate((element: HTMLFormElement) =>
    element.checkValidity(),
  );
  expect(formValidity).toBe(true);

  const download = await page.waitForEvent("download");
  await download.saveAs(OUTPUT_PATHS.CUT_VIDEO);
  expect(existsSync(OUTPUT_PATHS.CUT_VIDEO)).toBe(true);
  const videoDuration = await getVideoDurationInSeconds(OUTPUT_PATHS.CUT_VIDEO);
  expect(Math.floor(videoDuration)).toBe(30);
});
