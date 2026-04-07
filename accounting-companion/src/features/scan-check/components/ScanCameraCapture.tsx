import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";

type ScanCameraCaptureProps = {
    onCapture: (file: File) => void | Promise<void>;
    onFeedback?: (
        message: string,
        tone?: "info" | "success" | "warning"
    ) => void;
};

function getMobileCapturePreference() {
    if (typeof window === "undefined") return false;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const narrowViewport = window.matchMedia?.("(max-width: 900px)")?.matches ?? false;
    const ua = navigator.userAgent.toLowerCase();
    const mobileUa = /android|iphone|ipad|ipod|mobile/.test(ua);
    return coarsePointer || narrowViewport || mobileUa;
}

export default function ScanCameraCapture({
    onCapture,
    onFeedback,
}: ScanCameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nativeCaptureInputRef = useRef<HTMLInputElement | null>(null);
    const pickerInputRef = useRef<HTMLInputElement | null>(null);
    const nativeInputId = useId();
    const pickerInputId = useId();
    const [status, setStatus] = useState<
        "idle" | "native-opening" | "requesting" | "live" | "unsupported" | "blocked"
    >("idle");

    const preferNativeCapture = useMemo(() => getMobileCapturePreference(), []);
    const canUseLiveCamera =
        typeof window !== "undefined" &&
        window.isSecureContext &&
        Boolean(navigator.mediaDevices?.getUserMedia);

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    function stopLiveCamera() {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setStatus("idle");
    }

    function openNativeCapture() {
        setStatus("native-opening");
        onFeedback?.("Opening camera capture.", "info");
        nativeCaptureInputRef.current?.click();
    }

    function openImagePicker(message?: string) {
        setStatus("idle");
        onFeedback?.(
            message ?? "Camera capture is not available here. Opened image picker instead.",
            "warning"
        );
        pickerInputRef.current?.click();
    }

    async function startLiveCamera() {
        if (!canUseLiveCamera) {
            setStatus("unsupported");
            openImagePicker();
            return;
        }

        try {
            setStatus("requesting");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setStatus("live");
            onFeedback?.("Camera opened. Capture a photo when ready.", "info");
        } catch {
            setStatus("blocked");
            onFeedback?.(
                "Camera access was denied or unavailable. You can still upload images manually.",
                "warning"
            );
            openImagePicker("Camera access was denied. Opened image picker instead.");
        }
    }

    async function startCamera() {
        if (preferNativeCapture) {
            openNativeCapture();
            return;
        }

        if (canUseLiveCamera) {
            await startLiveCamera();
            return;
        }

        setStatus("unsupported");
        openImagePicker();
    }

    async function ingestFile(file: File | null | undefined, source: "camera" | "picker") {
        if (!file) {
            setStatus("idle");
            onFeedback?.(
                source === "camera"
                    ? "No photo was captured. You can try again or upload an image."
                    : "No image was selected.",
                "info"
            );
            return;
        }

        await onCapture(file);
        setStatus("idle");
    }

    function handleNativeCaptureChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        void ingestFile(file, "camera");
        event.currentTarget.value = "";
    }

    function handlePickerChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        void ingestFile(file, "picker");
        event.currentTarget.value = "";
    }

    function captureFrame() {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) {
            onFeedback?.("Camera capture failed. Opened image picker instead.", "warning");
            stopLiveCamera();
            openImagePicker();
            return;
        }

        context.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
            if (!blob) {
                onFeedback?.("Camera capture failed. Opened image picker instead.", "warning");
                stopLiveCamera();
                openImagePicker();
                return;
            }

            const file = new File([blob], `capture-${Date.now()}.png`, {
                type: "image/png",
            });
            stopLiveCamera();
            await onCapture(file);
        }, "image/png");
    }

    return (
        <div className="app-subtle-surface min-w-0 rounded-[1.2rem] p-4">
            <input
                id={nativeInputId}
                ref={nativeCaptureInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handleNativeCaptureChange}
            />
            <input
                id={pickerInputId}
                ref={pickerInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePickerChange}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="app-card-title text-sm">Camera capture</p>
                    <p className="app-helper app-wrap-anywhere mt-1 text-xs leading-5">
                        On phones, AccCalc now prefers native camera capture first and falls back to the image picker when needed.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <button
                        type="button"
                        onClick={() => void startCamera()}
                        className="app-button-primary min-h-11 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        {status === "native-opening"
                            ? "Opening camera..."
                            : status === "live"
                              ? "Camera ready"
                              : "Start Camera"}
                    </button>
                    <button
                        type="button"
                        onClick={() => openImagePicker("Opened image picker.")}
                        className="app-button-secondary min-h-11 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Upload image
                    </button>
                </div>
            </div>

            {status === "live" ? (
                <div className="mt-4 space-y-3">
                    <div className="app-image-frame min-h-[14rem] w-full rounded-[1rem] p-1">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="max-h-[22rem] w-full rounded-[0.8rem] object-cover"
                        />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={captureFrame}
                            className="app-button-primary min-h-11 rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Capture photo
                        </button>
                        <button
                            type="button"
                            onClick={stopLiveCamera}
                            className="app-button-secondary min-h-11 rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Close camera
                        </button>
                    </div>
                </div>
            ) : null}

            {status === "requesting" ? (
                <p className="app-helper app-wrap-anywhere mt-3 text-xs">
                    Requesting camera access.
                </p>
            ) : null}

            {status === "blocked" ? (
                <p className="app-helper app-wrap-anywhere mt-3 text-xs">
                    Camera access was blocked. You can still use image upload.
                </p>
            ) : null}

            {status === "unsupported" ? (
                <p className="app-helper app-wrap-anywhere mt-3 text-xs">
                    This browser or context does not support reliable live camera capture here, so image upload remains available.
                </p>
            ) : null}
        </div>
    );
}
