import { useRef, useEffect, useState } from "react";
import Canvas from "./canvas1";
export default function Camera() {
  const videoRef = useRef(null);

  const selectRef = useRef(null);
  let myStream;

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoList, setVideoList] = useState([]);
  const [camType, setCamType] = useState("");
  const [camList, setCamList] = useState([]);
  const [selectedCam, setSelectedCam] = useState("");
  const [debug, setDebug] = useState("start");

  /**
   * 카메라 정보를 가져온다.
   */
  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter((device) => device.kind === "videoinput");
      setCamList(cameras);

      const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        console.log(camera);
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

  async function getMedia(camerasSelect) {
    let deviceID;
    if (camerasSelect) {
      console.log(camerasSelect);
      deviceID = camerasSelect.value;
      setSelectedCam(camerasSelect.innerText);
      setDebug(debug + "\n" + deviceID);
    }
    if (camerasSelect && !deviceID) {
      return;
    }

    const initialConstrains = {
      video: { facingMode: "environment" },
    };

    const cameraConstrains = {
      video: { deviceID: { exact: deviceID } },
    }; //해당 deviceid 카메라 요청 코드

    try {
      myStream = await navigator.mediaDevices.getUserMedia(
        deviceID ? cameraConstrains : initialConstrains
      ); //사용자에게 미디어 입력장치 사용권한을 요청
      setDebug(debug + "\n" + "myStream:" + myStream);

      if (videoRef.current) {
        setDebug(debug + "\n" + "drawVideo");
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
    await getMedia(camerasSelect);
  };

  return (
    <div>
      <p>debug : {debug}</p>
      <p>선택된 카메라:{selectedCam} </p>
      <p>보이고 있는 카메라: {camType}</p>

      <select
        ref={selectRef}
        onChange={() => {
          if (selectRef) {
            const options = selectRef.current.options;
            setDebug(debug + "\n" + "onChange");
            ClickEvent(options[options.selectedIndex]);
          }
        }}
      >
        <option value="null">test</option>
      </select>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={capturePhoto}>사진 찍기</button>
      <div>
        <h3>모든 카메라</h3>
        {camList.map((camera, key) => (
          <span>
            <li key={key}>{camera.label}</li>
          </span>
        ))}
      </div>
      <div className="canvas-wrapper">
        {videoList.map((video, key) => {
          return <Canvas key={key} video={video} />;
        })}
      </div>
    </div>
  );
}
