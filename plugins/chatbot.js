const { cmd } = require('../command');
const axios = require('axios');

const chatbotStates = {};

const OPENAI_API_KEY = "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";

async function askOpenAI(question) {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
    };
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "Jibu maswali yote kwa Kiswahili. Kuwa msaidizi wa kweli na utoe majibu sahihi, ya msaada na yenye lugha fasaha ya Kiswahili." },
            { role: "user", content: question }
        ],
        max_tokens: 400
    };
    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI error:", error.response?.data || error.message);
        return "Samahani, kuna tatizo na huduma ya AI kwa sasa!";
    }
}

// Enable/disable command
cmd({
    pattern: "chatbot",
    desc: "Washa au zima chatbot kwenye chat hii.",
    category: "ai",
    react: "🤖",
    filename: __filename,
    use: ".chatbot on/off"
}, async (conn, m, store, { from, reply, args }) => {
    const subcmd = args[0]?.toLowerCase();
    if (!subcmd) {
        return reply("Tumia `.chatbot on` kuwasha au `.chatbot off` kuzima chatbot kwenye chat hii.");
    }
    if (subcmd === "on") {
        chatbotStates[from] = true;
        return reply("✅ Chatbot imewashwa! Tuma ujumbe wowote na nitakujibu moja kwa moja kwa Kiswahili.");
    } else if (subcmd === "off") {
        chatbotStates[from] = false;
        return reply("❎ Chatbot imezimwa kwenye chat hii.");
    } else {
        return reply("Tumia `.chatbot on` au `.chatbot off`.");
    }
});

// Catch-all handler (must be LAST!)
// Matches any message, but only replies if chatbot is ON and message is NOT a command
cmd({
    pattern: /[\s\S]*/,
    dontAddCommandList: true,
    dontShowCommand: true,
    react: false,
    category: "ai",
    filename: __filename
}, async (conn, m, store, { from, reply, body, isCmd }) => {
    if (isCmd) return;
    if (!chatbotStates[from]) return;
    const aiResponse = await askOpenAI(body);
    await reply(aiResponse);
});
