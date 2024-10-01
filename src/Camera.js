import { useRef, useEffect, useState } from "react";
import Canvas from "./Canvas";
export default function Camera() {
  const videoRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = isCameraOn ? stream : null;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initCamera();

    return () => {
      // 컴포넌트가 언마운트되면 미디어 스트림 해제
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  // NOTE : 사진 촬영
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoList((prev) => [...prev, video]);

    // canvas.toBlob(async (blob) => {
    //   if (blob) {
    //     const file = new File([blob], `${new Date().getTime()}.png`, {
    //       type: blob.type,
    //     });

    //     const img = document.createElement("myImg");
    //     img.src = URL.createObjectURL(file);
    //     img.onload = function () {
    //       window.URL.revokeObjectURL(this.src);
    //     };
    //     return file;
    //   }
    // });
  };

  return (
    <div>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={capturePhoto}>사진 찍기</button>
      {videoList.map((video, key) => {
        return <Canvas key={key} video={video} />;
      })}
    </div>
  );
}
