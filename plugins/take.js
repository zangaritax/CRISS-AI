import fs from 'fs/promises';

const takeCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['take', 't', 'steal'];

  if (validCommands.includes(cmd)) {
    // Check if the message is a sticker
    if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
      return m.reply(`Reply to a sticker to change its pack name!`);
    }

    try {
      // Download the sticker
      const stickerBuffer = await m.quoted.download();
      if (!stickerBuffer) throw new Error('Failed to download sticker.');

      // Define a new pack name
      const packname = "pushName";  // This can be dynamic or set based on other variables

      // Send the sticker with the new pack name
      await gss.sendSticker(m.from, stickerBuffer, m, { packname: packname });

      // Notify the user that the pack name has been changed
      await m.reply(`The sticker's pack name has been changed to: ${packname}`);

    } catch (error) {
      console.error("Error changing sticker pack name:", error);
      await m.reply('Error changing the sticker pack name.');
    }
  }
};
// codes by lord criss 
export default takeCommand;
