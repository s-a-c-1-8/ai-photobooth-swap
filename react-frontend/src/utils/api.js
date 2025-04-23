export const uploadCapturedImage = async (base64Image, gender, character) => {
  const formData = new FormData();

  // Convert base64 → blob
  const sourceBlob = dataURLToBlob(base64Image);

  // Add source image
  formData.append(
    "sourceImage",
    new File([sourceBlob], "sourceImage.jpeg", { type: "image/jpeg" })
  );

  formData.append("gender", gender);
  formData.append("character", character);

  // Send to backend
  const response = await fetch("http://localhost:8000/api/swap-face/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Image processing failed");

  const result = await response.json(); // ✅ Parse JSON here
  return result; // 👉 This will now be { url: "..." }
};
// Helper to convert Base64 Data URL to Blob
const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};
