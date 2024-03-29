/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import VideoList from "../islands/VideoList.tsx";
import HeadElement from "../components/HeadElement.tsx";

export default function Index(ctx: PageProps) {
  return (
    <div class={tw`mx-auto max-h-screen overflow-hidden p-4`}>
      <HeadElement
        description="Indexing recipes I've liked on TikTok for easier access"
        title="TikTok Recipes"
        url={ctx.url}
      />
      <div class={tw`w-full flex justify-between`}>
        <h1 class={tw`text-3xl font-bold mb-4 ml-1`}>TikTok Recipes 👨‍🍳</h1>
        <a href="https://github.com/brycedorn/tiktok-recipes" target="_blank">
          <span>View source on GitHub</span>
        </a>
      </div>
      <div class={tw`flex w-full`}>
        <VideoList />
      </div>
    </div>
  );
}
