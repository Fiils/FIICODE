import JoLPlayer, { JoLPlayerRef } from "jol-player";
import React, { useRef, useState } from "react";


const VideoPlayer = ({ video }: { video: string }) => {
  const videoRef = useRef<JoLPlayerRef>(null!);
  const [theme, setTheme] = useState<string>("#ffb821");

  return (
      <JoLPlayer
        // ref={videoRef}
        option={{
          videoSrc: video,
          width: 500,
          height: 500,
          theme,
          language: "en",
          pausePlacement: "center",
        }}
      />
  );
}

export default VideoPlayer;