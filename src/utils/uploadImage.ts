export const checkImage = (
  file: File,
  size: number = 5,
  types: Array<string> = ["image/png", "image/jpeg", "image/webp", "image/gif"]
) => {
  let errMsg;
  if (!file) return (errMsg = "File does not exits");
  if (file.size > 1024 * 1024 * size)
    return (errMsg = `The largest image size is ${size} mb`);

  if (!types.includes(file.type))
    return (errMsg = "The image type is png/jpeg/webp/gif");

  return errMsg;
};

export const uploadImage = async (image: File, folder: string = "KuChuoi") => {
  try {
    const formData = new FormData();

    formData.append("file", image);

    formData.append("upload_preset", folder);

    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_NAME as string
    );

    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API as string, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return {
      width: data.width,
      height: data.height,
      url: data.secure_url,
      size: data.bytes,
      type: data.format,
      name: data.public_id,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
