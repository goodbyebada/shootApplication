import { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";

export default function Canvas({ video }) {
  const [showInput, setShowInput] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memo, setMemo] = useState("");
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
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 비디오로부터 이미지를 캔버스에 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // dataURL을 Blob으로 변환
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        console.log("blob:");
        console.log(blob);
        console.log("url:");
        console.log(url);

        // Tesseract.js로 OCR 실행
        Tesseract.recognize(blob, "eng+kor", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              // 진행률 업데이트 가능
              console.log(`Progress: ${(m.progress * 100).toFixed(2)}%`);
            }
          },
        })
          .then(({ data: { text } }) => {
            setText(text);
            console.log("Recognized Text:", text);
          })
          .catch((error) => {
            console.error("Error recognizing text:", error);
          });
      }
    }, "image/png"); // Blob 생성 형식을 PNG로 설정
  }, [video]);

  return (
    <div>
      <div onClick={toggleAboutInput}>
        <canvas ref={canvasRef} width={640} height={480}></canvas>
      </div>

      {showMemo && <div>내 소감평: {memo}</div>}

      <input ref={inputRef} className={showInput ? `` : "hide"}></input>
      <button onClick={SubmitMemo}>등록</button>

      <p>Recognized Text: {text}</p>
    </div>
  );
}
