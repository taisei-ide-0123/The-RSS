import OpenAI from "openai";

const OPEANAI_API_KEY = process.env["OPEANAI_API_KEY"];
const SLACK_CHANNEL_URL = process.env["SLACK_CHANNEL_URL"];

const openai = new OpenAI({
  apiKey: OPEANAI_API_KEY,
});

const makePrompt = (content) => {
  const prompt = `以下の文章を日本語で要約し、下記フォーマットとトーンに従ってマークダウン形式で要点を3つから5つほど列挙してください。また、タイトルは不要です。

  # Format #
  - *要約見出し1*: 要点1
  - *要約見出し2*: 要点2
  - *要約見出し3*: 要点3

  # Tone #
  常体

  ${content}`;

  return prompt;
};

const summarizeContent = async (prompt) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "text" },
    max_tokens: 3000,
    temperature: 1,
    top_p: 1,
  });

  return completion.choices[0].message.content;
};

const formatSummarization = (article, summarizedContent) => {
  const formattedSummarization = `*タイトル*:
${article.title}

*URL*:
${article.url}

*記事要約*:
${summarizedContent}`;

  return formattedSummarization;
};

const sendMessageToSlack = async (article, summarizedContent) => {
  const headers = { "Content-type": "application/json" };
  const data = { text: formatSummarization(article, summarizedContent) };

  await fetch(SLACK_CHANNEL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
};

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  const article = JSON.parse(event["Records"][0]["body"]);

  const prompt = makePrompt(article.content);
  const summarizedContent = await summarizeContent(prompt);

  await sendMessageToSlack(article, summarizedContent);
};
