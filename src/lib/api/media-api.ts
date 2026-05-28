import { API_BASE_URL } from "./config";

export type MediaUploadResponse = {
  id: string;
  publicUrl: string;
};

export type UploadProgressCallback = (percent: number) => void;

export function uploadMedia(file: File): Promise<MediaUploadResponse> {
  return uploadMediaWithProgress(file);
}

export function uploadMediaWithProgress(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<MediaUploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as MediaUploadResponse;
          resolve({
            id: data.id,
            publicUrl: `${API_BASE_URL}${data.publicUrl}`,
          });
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        let errorMessage = `Upload failed: ${xhr.status}`;
        try {
          const data = JSON.parse(xhr.responseText) as { error?: string };
          if (data.error) errorMessage = data.error;
        } catch {
          if (xhr.responseText) errorMessage = xhr.responseText;
        }
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", `${API_BASE_URL}/api/media/upload`);
    xhr.send(formData);
  });
}
