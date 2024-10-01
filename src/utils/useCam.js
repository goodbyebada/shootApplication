import { useRef } from "react";

export default function useCam() {
  const videoRef = useRef(null); // 화면에 보여지는 영상
  const canvasRef = useRef(null); // 임시 저장

  // NOTE : 카메라 스트림 중지
  const stopMediaTracks = useCallback(() => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  // NOTE : 사진 촬영
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        blob &&
          addMedia([
            {
              type: "image",
              url: URL.createObjectURL(blob),
            },
          ]);
        // NOTE : 현재 zustand의 미디어에 추가되는 딜레이가 존재하여 setTimeout을 사용하여 해결
        setTimeout(() => {
          scrollToEnd();
        }, 100);
      },
      "image/jpeg",
      1
    );
  };
}
