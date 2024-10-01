import { useEffect, useRef, useState } from "react";

export default function Canvas({ video }) {
  const [showInput, setShowInput] = useState(false);
  const [memo, setMemo] = useState("");
  const canvasRef = useRef(null);
  const toggleAboutInput = () => {
    setShowInput((prev) => !prev);
  };
  const submitMemo = (e) => {
    console.log(e.target);
  };

  useEffect(() => {
    if (!canvasRef) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, [canvasRef, video]);
  return (
    <>
      <div onClick={toggleAboutInput}>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div>내 소감평: {}</div>
      <input className={showInput ? `` : "hide"}></input>
      <button onClick={(e) => submitMemo(e)}>등록</button>
    </>
  );
}
