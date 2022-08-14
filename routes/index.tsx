/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import VideoList from '../islands/VideoList.tsx';

export default function Index() {
  return (
    <div class={tw`mx-auto max-h-screen overflow-hidden p-4`}>
      <div class={tw`w-full flex justify-between`}>
        <h1 class={tw`text-2xl font-bold mb-4`}>
          TikTok Recipes
        </h1>
        <a href="#">
          <h2>View source on GitHub</h2>
        </a>
      </div>
      <div class={tw`flex w-full`}>
        <VideoList />
      </div>
    </div>
  );
}
