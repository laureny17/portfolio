/**
 * Extracts the first frame from a video and returns it as a data URL
 * @param videoSrc URL of the video
 * @returns Promise that resolves to a data URL of the first frame
 */
export const extractFirstFrame = (videoSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a video element
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // Avoid CORS issues
    video.muted = true;
    video.autoplay = false;
    video.preload = "metadata";

    // Set up event listeners
    video.onloadeddata = () => {
      // Pause the video at the first frame
      video.currentTime = 0;
      video.pause();

      // Create a canvas to draw the frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the frame on the canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataUrl);
        } catch (e) {
          reject(new Error("Failed to convert canvas to data URL"));
        }
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };

    // Handle errors
    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };

    // Set the source and load the video
    video.src = videoSrc;
    video.load();
  });
};

/**
 * Cache for storing extracted frames
 */
const frameCache: Record<string, string> = {};

/**
 * Gets the first frame of a video, using cache if available
 * @param videoSrc URL of the video
 * @returns Promise that resolves to a data URL of the first frame
 */
export const getVideoFirstFrame = async (videoSrc: string): Promise<string> => {
  // Check if we already have this frame in cache
  if (frameCache[videoSrc]) {
    return frameCache[videoSrc];
  }

  try {
    // Extract the frame
    const frame = await extractFirstFrame(videoSrc);

    // Cache the result
    frameCache[videoSrc] = frame;

    return frame;
  } catch (error) {
    console.error("Error extracting video frame:", error);
    // Return a placeholder if extraction fails
    return "/placeholder.svg?height=200&width=300";
  }
};
