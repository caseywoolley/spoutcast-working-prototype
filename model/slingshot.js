Slingshot.fileRestrictions("uploadToAmazonS3", {
  allowedFileTypes: ["video/mp4", "video/quicktime", "video/ogg"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});