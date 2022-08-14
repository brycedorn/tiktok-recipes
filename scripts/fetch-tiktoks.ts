async function writeFile(path: string, text: string): Promise<void> {
  return await Deno.writeTextFile(path, text);
}

const oembedURL = "https://www.tiktok.com/oembed?url=https://www.tiktok.com/";
const outputFilename = "data/metadata.json";
const inputFilename = "data/tiktoks.txt";
const RATE_LIMIT_SIZE = 10;
const DELAY_MS = 100;

function wait(delay: number) {
  return new Promise<void>((resolve, _reject) =>
    setTimeout(() => {
      console.log("Delayed", delay, "ms");
      resolve();
    }, delay)
  );
}

async function fetchData(video: string) {
  const url = `${oembedURL}/${video}`;
  const resp = await fetch(url);

  console.log(resp);

  if (resp.status !== 200) {
    console.log(`${resp.status} ${resp.statusText}:\n${resp.body}`);
    console.log(JSON.stringify(resp.body));
    return;
  }

  const json = await resp.json();

  return {
    meta: json,
    url: video,
  };
}

async function loadExistingData() {
  try {
    const data = await Deno.readTextFile(outputFilename);
    return JSON.parse(data);
  } catch (e) {
    throw e;
  }
}

async function fetchAndSaveMetadata(videoURLs: string[], head = false) {
  const existingMetadata = head ? {} : await loadExistingData();
  const startIdx = existingMetadata.videos ? existingMetadata.videos.length : 0;
  const endIdx = Math.min(videoURLs.length, startIdx + RATE_LIMIT_SIZE);

  console.log(
    `Fetching metadata for ${startIdx} - ${endIdx} of ${videoURLs.length} videos`,
  );
  const promises = videoURLs.filter((_url, i) => i >= startIdx && i < endIdx)
    .map((url, i) => fetchData(url));
  const metadata = await Promise.all(promises);

  const videos = [...metadata, ...(existingMetadata.videos || [])];

  await writeFile(outputFilename, JSON.stringify({ videos }));

  console.log("Complete, new length:", videos.length);

  await wait(DELAY_MS);

  if (startIdx < endIdx) {
    fetchAndSaveMetadata(videoURLs);
  }
}

const data = await Deno.readTextFile(inputFilename);

await fetchAndSaveMetadata(data.split("\n"), true);

export {};
