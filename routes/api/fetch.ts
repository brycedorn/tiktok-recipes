import { cheerio } from "cheerio";

export const handler = async (request: Request): Promise<Response> => {
  const { video } = await request.json();
  const response = await fetch(`https://tiktok.com/${video}`);
  const html = await response.text();

  const $ = cheerio.load(html);
  const appContext = $("#SIGI_STATE").text();
  const json = JSON.parse(appContext);
  const key = Object.keys(json.ItemModule)[0];
  const data = json.ItemModule[key];

  return new Response(JSON.stringify({ ...data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};