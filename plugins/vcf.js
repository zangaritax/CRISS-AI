import fs from "fs";
import path from "path";
import config from "../../config.cjs"; // Import the config file to get the PREFIX

const vcfCompiler = async (m, gss, sock) => {
  try {
    const cmd = m.body.toLowerCase().trim();

    // Ensure the command starts with the correct prefix
    if (!cmd.startsWith(config.PREFIX)) return;

    const command = cmd.slice(config.PREFIX.length).trim(); // Remove the prefix to get the actual command

    if (command !== "vcf") return;

    if (!m.isGroup) {
      return m.reply("*THIS COMMAND CAN ONLY BE USED IN GROUPS!*");
    }

    m.reply("*CRISS AI IS COMPUTING YOUR CONTACTS*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;

    if (!participants.length) {
      return m.reply("*⚠️ No contacts found in this group*");
    }

    let vcfContent = `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Group Contacts\nEND:VCARD\n`;

    participants.forEach((member) => {
      const number = member.id.split("@")[0];
      const name = member.notify || member.name || `Unknown ${number}`;
      
      vcfContent += `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:+${number}
END:VCARD`;
    });

    const vcfPath = path.join("/tmp", `GroupContacts-${m.from}.vcf`);
    fs.writeFileSync(vcfPath, vcfContent, "utf8");

    await gss.sendMessage(m.from, { document: { url: vcfPath }, mimetype: "text/x-vcard", fileName: "Wa_Group_Contacts~By Lord joel" });

    // Send the newsletter message after generating the VCF file
    const responseText = "*✅ Contact list compiled successfully! Download and import it into your phone or Gmail.*";

    await Matrix.sendMessage(m.from, {
    image: fs.readFileSync('./media/khan.jpg'),
    caption: str,
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363378608564635@newsletter',
        newsletterName: "CRISS AI SUPPORT",
        serverMessageId: 143
      }
    }
  }, {
    quoted: m }
    );

    m.reply("*✅ Contact list compiled successfully! Download and import it into your phone or Gmail.*");
  } catch (error) {
    console.error("Error in VCF Compilation:", error);
    m.reply("*⚠️ An error occurred while compiling contacts.*");
  }
};

export default vcfCompiler;
