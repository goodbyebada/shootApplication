import { useRef, useEffect, useState } from "react";
import Canvas from "./canvas1";
export default function Camera() {
  const videoRef = useRef(null);

  const selectRef = useRef(null);
  let myStream;

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoList, setVideoList] = useState([]);
  const [camList, setCamList] = useState([{ id: "fnf", label: "sdfs" }]);
  const [camType, setCamType] = useState("");

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter((device) => device.kind === "videoinput");
      const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;

        selectRef.current.appendChild(option);
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function getMedia(deviceID) {
    const initialConstrains = {
      video: { facingMode: "environment" },
    };

    const cameraConstrains = {
      video: { deviceID: { exact: deviceID } },
    }; //해당 deviceid 카메라 요청 코드

    if (!!deviceID) {
      setCamType("TEST_TYPE");
      return;
    }

    try {
      myStream = await navigator.mediaDevices.getUserMedia(
        deviceID ? cameraConstrains : initialConstrains
      ); //사용자에게 미디어 입력장치 사용권한을 요청

      if (videoRef.current) {
        videoRef.current.srcObject = isCameraOn ? myStream : null;
      }
      if (!deviceID) {
        await getCameras(); //카메라들정보 가져옴
      }

      const nowCamType = myStream.getVideoTracks()[0].label;
      setCamType(nowCamType);
    } catch (err) {
      console.log(err); /* 오류 처리 */
    }
  }

  useEffect(() => {
    getMedia();

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

  const ClickEvent = async (camerasSelect) => {
    await getMedia(camerasSelect.value);
  };

  return (
    <div>
      <h1>FOR DEVICE TEST</h1>
      <h2>{camType}</h2>
      <select
        ref={selectRef}
        onChange={() => {
          if (selectRef) {
            const options = selectRef.current.options;
            ClickEvent(options[options.selectedIndex]);
          }
        }}
      >
        <option>test</option>
      </select>
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
