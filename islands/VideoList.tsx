/** @jsx h */
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { tw } from "@twind";
import metadata from "../data/metadata.json" assert { type: "json" };

function shuffle(array: VideoMetaType[]) {
  let i = array.length;
  while (--i > 0) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[randomIndex], array[i]] = [array[i], array[randomIndex]];
  }
  return array;
}

const shuffledVideos = shuffle(metadata.videos);

type VideoMetaType = {
  meta: {
    version: string;
    type: string;
    title: string;
    author_url: string;
    author_name: string;
    width: string;
    height: string;
    html: string;
    thumbnail_width: number;
    thumbnail_height: number;
    thumbnail_url: string;
    provider_url: string;
    provider_name: string;
  };
  url: string;
};

type VideoDataType = {
  video: {
    playAddr: string;
    cover: string;
  };
};

export default function VideoList() {
  const isMounted = useRef(false);
  const [activeVideo, setActiveVideo] = useState<VideoMetaType>();
  const [data, setData] = useState<VideoDataType>();
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchAndUpdate = async () => {
    const response = await fetch("/api/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video: activeVideo?.url,
      }),
    });
    const newData = await response.json();
    setData(newData);
    setLoading(false);
  };

  function playVideo() {
    setVideoLoading(true);
  }

  function onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    setSearchText(target.value);
  }

  function searchFilter(video: VideoMetaType) {
    return video.meta.title.toLowerCase().indexOf(searchText.toLowerCase()) !==
      -1;
  }

  useEffect(() => {
    if (isMounted.current) {
      setLoading(true);
      setVideoLoading(false);
      setVideoPlaying(false);
      fetchAndUpdate();
    } else {
      isMounted.current = true;
    }
  }, [activeVideo]);

  return (
    <Fragment>
      <div class={tw`w-1/2`}>
        <input
          type="text"
          class={tw`block w-full border rounded p-2 mb-4`}
          onInput={onInputChange}
          value={searchText}
          placeholder="Search"
        />
        <ul class={tw`overflow-y-scroll overflow-x-hidden h-[85vh]`}>
          {shuffledVideos.filter(searchFilter).map((video) => (
            <li
              class={tw`p-2 my-2 cursor-pointer border rounded flex ${
                activeVideo?.url === video.url && "bg-gray-100"
              }`}
              onClick={() => setActiveVideo(video)}
            >
              <a>{video.meta.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div class={tw`w-1/2 flex justify-center items-center`}>
        {(loading || !activeVideo) && (
          <div
            class={tw`p-2 my-2 h-[80vh] w-4/5 lg:w-1/2 border-2 border-dashed rounded flex justify-center items-center text-gray-400`}
          >
            {loading ? "Loading..." : "Select a video"}
          </div>
        )}
        {(videoLoading || videoPlaying) && (
          <video
            controls
            class={videoPlaying ? tw`max-h-[80vh] rounded` : tw`hidden`}
            autoPlay
            src={data?.video?.playAddr}
            onLoadedData={() => setVideoPlaying(true)}
          />
        )}
        {activeVideo && !loading && !videoPlaying && (
          <Fragment>
            <span
              class={tw`absolute text-9xl cursor-pointer text-white`}
              onClick={playVideo}
            >
              ▶️
            </span>
            <img
              class={tw`max-h-[80vh] cursor-pointer rounded w-auto ${
                videoLoading && "opacity-80"
              }`}
              src={data?.video?.cover}
              width={activeVideo?.meta?.thumbnail_width}
              height={activeVideo?.meta?.thumbnail_height}
              onClick={playVideo}
            />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
