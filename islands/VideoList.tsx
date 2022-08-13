/** @jsx h */
import { h, Fragment } from "preact";
import { useState, useEffect, useRef } from 'preact/hooks';
import { tw } from "@twind";
import metadata from '../data/metadata.json' assert { type: 'json' };

export default function VideoList() {
  const isMounted = useRef(false);
  const [activeVideo, setActiveVideo] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (isMounted.current) {
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          video: activeVideo
        })
      });
      const json = await response.json();
      setVideoSrc(json.mp4);
    } else {
      isMounted.current = true;
    }
  }, [activeVideo])
  
  return (
    <Fragment>
      <ul class={tw`w-1/2`}>
        {metadata.videos.map(video => (
          <li class={activeVideo === video.url ? tw`underline` : tw`cursor-pointer`} onClick={() => setActiveVideo(video.url)}>
            <a>{video.meta.title}</a>
          </li>
        ))}
      </ul>
      <video class={tw`w-1/2 h-screen flex flex-start`} autoPlay src={videoSrc} />
    </Fragment>
  );
}
