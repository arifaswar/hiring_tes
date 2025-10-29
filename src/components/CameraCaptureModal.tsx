import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import type { CameraCaptureModalProps } from "../type/type";


export default function CameraCaptureModal({ onClose, onCapture }: CameraCaptureModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const [step, setStep] = useState(1); // 1: pose1, 2: pose2, 3: pose3
  const [countdown, setCountdown] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState("Detecting hand...");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user", // bisa diganti "environment" untuk kamera belakang
  };

  // Cek izin kamera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setCameraReady(true);
        setStatus("Detecting hand...");
      })
      .catch(() => {
        setCameraError("Cannot access camera. Please enable permission.");
      });
  }, []);

  // Simulasi deteksi pose
  useEffect(() => {
    if (!cameraReady || photo) return;
    const timer = setTimeout(() => {
      if (step < 3) {
        setStatus(`Pose ${step} detected`);
        setStep((prev) => prev + 1);
      } else {
        setStatus("Final pose detected, starting countdown...");
        startCountdown();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [step, cameraReady]);

  const startCountdown = () => {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count >= 0) setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        capturePhoto();
      }
    }, 1000);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setCountdown(null);
      setStatus("Photo captured successfully!");
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setStep(1);
    setStatus("Restarting detection...");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Raise Your Hand to Capture</h2>
            <p className="text-sm text-gray-500">
              We'll take the photo once your hand pose is detected.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
        </div>

      {/* Webcam Area */}
        <div className="relative border border-gray-300 rounded-md overflow-hidden">
          {cameraError ? (
            <div className="flex items-center justify-center h-[340px] text-red-500 text-sm">
              {cameraError}
            </div>
          ) : !cameraReady ? (
            <div className="flex items-center justify-center h-[340px] text-gray-500 text-sm">
              Loading camera...
            </div>
          ) : !photo ? (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-[340px] object-cover"
                mirrored
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <p className="text-5xl font-bold text-white">
                    {countdown > 0 ? countdown : "0"}
                  </p>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/50 px-2 py-1 text-white text-xs rounded">
                {status}
              </div>
            </>
          ) : (
            <img
              src={photo}
              alt="Captured"
              className="w-full h-[340px] object-cover"
            />
          )}
        </div>

        {/* Pose instructions */}
        <p className="text-sm text-gray-600 text-center mt-4">
          To take a picture, follow the hand poses in the order shown below. The system will
          automatically capture the image once the final pose is detected.
        </p>
        <div className="flex justify-center items-center gap-3 mt-3">
          {[1, 2, 3].map((pose) => (
            <div
              key={pose}
              className={`border rounded-md px-3 py-2 flex flex-col items-center ${
                pose === step ? "border-[#00B2A9]" : "border-gray-300"
              }`}
            >
              <img
                src={`https://cdn-icons-png.flaticon.com/512/10041/10041596.png`}
                className="w-8 h-8 opacity-80"
                alt={`Pose ${pose}`}
              />
              <p className="text-xs mt-1">Pose {pose}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          {photo ? (
            <>
              <button
                onClick={retakePhoto}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Retake photo
              </button>
              <button
                onClick={() => onCapture(photo)}
                className="bg-[#00B2A9] text-white px-5 py-2 rounded-md hover:brightness-95"
              >
                Submit
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">Waiting for hand pose...</p>
          )}
        </div>
      </div>
    </div>
  );
}
