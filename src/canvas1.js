import { useEffect, useRef, useState } from "react";
// import OCRcomponent from "./OCRcomponent";
// import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

export default function Canvas({ video }) {
  const [showInput, setShowInput] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");

  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  const toggleAboutInput = () => {
    setShowInput((prev) => !prev);
  };
  const SubmitMemo = () => {
    if (!inputRef) return;
    setMemo(inputRef.current.value);
    inputRef.current.value = "";
    setShowMemo(true);
  };

  useEffect(() => {
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    // canvas.toBlob(async (blob) => {
    //   if (blob) {
    //     const file = new File([blob], `${new Date().getTime()}.png`, {
    //       type: blob.type,
    //     });

    //     const imgurl = URL.createObjectURL(file);
    //     console.log(imgurl);
    //     setImageUrl(imgurl);
    //   }
    // });
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
    const file = dataURLtoFile(img.src, "tmp.png");
    const url = URL.createObjectURL(file);
    console.log(url);

    // Tesseract.js를 사용해 이미지에서 텍스트를 인식
    Tesseract.recognize(url, "eng+kor", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          // OCR 진행률을 업데이트
          // const progressValue = (m.progress * 100).toFixed(2);
          // setProgress(parseFloat(progressValue));
        }
      },
    }).then(({ data: { text } }) => {
      // 인식된 텍스트를 상태에 저장
      setText(text);
      console.log(text);
    });
  }, [canvasRef, video]);

  return (
    <>
      <div>
        <div onClick={toggleAboutInput}>
          <canvas ref={canvasRef}></canvas>
        </div>

        {showMemo ? <div>내 소감평: {memo}</div> : ""}

        <input ref={inputRef} className={showInput ? `` : "hide"}></input>
        <button onClick={SubmitMemo}>등록</button>
        {/* {!imageUrl && <OCRcomponent imageUrl={imageUrl} />} */}
        <p>Recognized Text: {text}</p>
      </div>
    </>
  );
}

// const convertURLtoFile = async (image, fileName) => {
//   const data = await image.blob();
//   const metadata = { type: `image/png` };
//   return new File([data], fileName, metadata);
// };

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
