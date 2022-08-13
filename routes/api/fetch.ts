import { cheerio } from "cheerio";

function sanitize(s: string) {
  return s
    .replace('url\"\:\"', '')
    .replace('u002f/u002F', '')
    .replaceAll('u002F', '')
    .replace('\"','')
    .replaceAll('\\','\/');
}

export const handler = async (req: Request): Promise<Response> => {
  const request = await req.json();

  const { video } = request;

  const body = await fetch(`https://tiktok.com/${video}`);

  const html = await body.text();

  const $ = cheerio.load(html);

  const test = $("html").text();

  const mp4s = test.match(/url\":\"([^"]+)"/g);

  const mp4 = sanitize(mp4s[2]);

  return new Response(JSON.stringify({ mp4 }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
};