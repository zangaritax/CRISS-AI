const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: '🖇',
  desc: "Convert media to URL (uses pixeldrain.com API)",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    if (!mimeType) throw "Please reply to an image, video, or audio file";

    const mediaBuffer = await quotedMsg.download();
    const tempFile = path.join(os.tmpdir(), `upload_${Date.now()}`);
    fs.writeFileSync(tempFile, mediaBuffer);

    let ext = '';
    if (mimeType.includes('image/jpeg')) ext = '.jpg';
    else if (mimeType.includes('image/png')) ext = '.png';
    else if (mimeType.includes('video')) ext = '.mp4';
    else if (mimeType.includes('audio')) ext = '.mp3';

    const form = new FormData();
    form.append('file', fs.createReadStream(tempFile), `file${ext}`);

    const resp = await axios.post(
      "https://pixeldrain.com/api/file",
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(tempFile);

    if (!resp.data || !resp.data.id)
      throw "Error obtaining uploaded URL";

    const mediaUrl = `https://pixeldrain.com/u/${resp.data.id}`;
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Video';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    await reply(
      `*${mediaType} Uploaded Successfully*\n\n` +
      `*Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `*URL:* ${mediaUrl}\n\n` +
      `> Uploaded by CRISS AI 💜`
    );

  } catch (error) {
    console.error(error);
    await reply(`Error: ${error.message || error}`);
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
