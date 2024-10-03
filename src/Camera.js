import { useRef, useEffect, useState } from "react";
import Canvas from "./canvas1";
export default function Camera() {
  const videoRef = useRef(null);
  const selectRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoList, setVideoList] = useState([]);

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter((device) => device.kind === "videoinput");
      // const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;

        selectRef.current.appendChild(option);
        // if (currentCamera.label === camera.label) {
        //   option.selected = true;
        // }
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (selectRef) {
      getCameras();
    }
  }, []);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
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
  };

  return (
    <div>
      <h1>FOR DEVICE TEST</h1>
      <select ref={selectRef}></select>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={capturePhoto}>사진 찍기</button>
      <div className="canvas-wrapper">
        {videoList.map((video, key) => {
          return <Canvas key={key} video={video} />;
        })}
      </div>
    </div>
  );
}
