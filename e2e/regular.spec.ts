import { expect, test } from "@playwright/test";
import { existsSync } from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";

const YT_VIDEO_URL =
  "https://www.youtube.com/watch?v=cGc_NfiTxng&pp=ygUNZ2FuZ25hbSBzdHlsZQ%3D%3D";

const OUTPUT_PATHS = {
  FULL_VIDEO: "full.mp4",
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

test("Basic url download", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "url" }).fill(YT_VIDEO_URL);
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
