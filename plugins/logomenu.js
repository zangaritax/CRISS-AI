import { MessageType } from '@adiwajshing/baileys';
import config from '../../config.cjs';

const LogoMenu = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  // Prepare a list of logos and their commands
  const logoCommands = [
    { name: 'Logo 1', command: 'logo' },
    { name: 'Logo 2', command: 'logo1' },
    { name: 'Logo 3', command: 'logo2' },
    { name: 'Logo 4', command: 'logo3' },
    { name: 'Logo 5', command: 'logo4' },
    { name: 'Logo 6', command: 'logo5' },
    { name: 'Logo 7', command: 'logo6' },
    { name: 'Logo 8', command: 'logo7' },
    { name: 'Logo 9', command: 'logo8' },
    { name: 'Logo 10', command: 'logo9' },
    { name: 'Logo 11', command: 'logo10' },
    { name: 'Logo 12', command: 'logo11' },
    { name: 'Logo 13', command: 'logo12' },
    { name: 'Logo 14', command: 'logo13' },
    { name: 'Logo 15', command: 'logo14' },
    { name: 'Logo 16', command: 'logo15' },
    { name: 'Logo 17', command: 'logo16' },
    { name: 'Logo 18', command: 'logo17' },
    { name: 'Logo 19', command: 'logo18' },
  ];

  // Construct the logo menu message
  let menuText = `Hello ${pushName}! Here is the list of logo styles you can choose from:\n\n`;

  logoCommands.forEach((logo, index) => {
    menuText += `${index + 1}. ${logo.name} - Use command: ${prefix}${logo.command} <YourText>\n`;
  });

  menuText += `\nPlease type the command with your desired text to generate the logo.`;

  // Image URL to include in the message
  const imageUrl = 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/elements.jpg';

  // Send the message with logo options and the image
  const messagePayload = {
    text: menuText,
    image: { url: imageUrl },
    caption: 'Select the logo you want to create by using the commands above!',
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363315182578784@newsletter',
        newsletterName: 'Sarkar-MD',
        serverMessageId: -1,
      },
      externalAdReply: {
        title: '✨ Sarkar-MD ✨',
        body: pushName,
        thumbnailUrl:
          'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp',
        sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD',
        mediaType: 1,
        renderLargerThumbnail: false,
      },
    },
  };

  // Check if the message is a valid command
  if (m.text.toLowerCase() === `${prefix}logomenu` || m.text.toLowerCase() === `${prefix}logom`) {
    // Send the menu to the user
    await sock.sendMessage(m.from, messagePayload, { quoted: m });
  }
};

export default LogoMenu;
