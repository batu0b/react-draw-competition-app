export const canvasToUri = (ref) => {
  const canvas = ref.current;
  const canvasURI = canvas.toDataURL("image/png", 0.5);
  return canvasURI;
};

export const clearCanvas = (ref) => {
  const canvas = ref.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
