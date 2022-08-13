/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import VideoList from '../islands/VideoList.tsx';

export default function Index() {
  return (
    <div class={tw`p-4 mx-auto`}>
      <h1 class={tw`text-2xl font-bold mb-4`}>TikTok Recipes</h1>
      <div class={tw`flex w-full`}>
        <VideoList />
      </div>
    </div>
  );
}
