Slingshot.fileRestrictions("uploadToAmazonS3", {
  allowedFileTypes: ["video/mp4", "video/quicktime", "video/ogg", "image/png", "image/jpeg"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});