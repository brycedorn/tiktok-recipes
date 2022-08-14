/** @jsx h */
import { h, Fragment } from "preact";
import { useState, useEffect, useRef } from 'preact/hooks';
import { tw } from "@twind";
import metadata from '../data/metadata.json' assert { type: 'json' };

function shuffle(array) {
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
}

type VideoDataType = {
  video: { 
    playAddr: string;
    cover: string;
  }
}

export default function VideoList() {
  const isMounted = useRef(false);
  const [activeVideo, setActiveVideo] = useState<VideoMetaType>();
  const [data, setData] = useState<VideoDataType>();
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const fetchAndUpdate = async () => {
    const response = await fetch('/api/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        video: activeVideo?.url
      })
    });
    const newData = await response.json();
    setData(newData);
    setLoading(false);
  }

  function playVideo() {
    setVideoLoading(true);
  }

  function searchFilter(video) {
    return video.meta.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
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
  }, [activeVideo])
  
  return (
    <Fragment>
      <div class={tw`w-1/2`}>
        <input type="text" class={tw`block w-full border rounded p-2 mb-4`} onInput={e => setSearchText(e.target.value)} value={searchText} placeholder="Search" />
        <ul class={tw`overflow-y-scroll overflow-x-hidden h-[85vh]`}>
          {shuffledVideos.filter(searchFilter).map(video => (
            <li class={tw`p-2 my-2 cursor-pointer border rounded flex flex-nowrap ${activeVideo?.url === video.url && 'bg-gray-100'}`} onClick={() => setActiveVideo(video)}>
              <a>{video.meta.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div class={tw`w-1/2 flex justify-center items-center`}>
        {loading && "Loading..."}
        {(videoLoading || videoPlaying) && (
          <video controls class={videoPlaying ? tw`max-h-[80vh] rounded` : tw`hidden`} autoPlay src={data?.video?.playAddr} onLoadedData={() => setVideoPlaying(true)} />
        )}
        {!loading && !videoPlaying && (
          <img class={tw`max-h-[80vh] cursor-pointer rounded w-auto ${videoLoading && 'opacity-80'}`} src={data?.video?.cover} width={activeVideo?.meta?.thumbnail_width} height={activeVideo?.meta?.thumbnail_height} onClick={playVideo} />
        )}
      </div>
    </Fragment>
  );
}
