import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import ULID from "ulid";

const sqsClient = new SQSClient();

const QUEUE_URL = process.env["QUEUE_URL"];

const isToday = (date, now) => {
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const getTodaysArticles = async (articles) => {
  const now = new Date();

  const todaysArticles = [];
  for (const article of articles) {
    const date = new Date(article.pubDate[0]);

    if (!isToday(date, now)) continue;

    const res = await fetch(article.link[0]);
    const text = await res.text();
    const $ = cheerio.load(text);

    todaysArticles.push({
      title: article.title[0],
      content: $("article").text(),
      url: article.link[0],
    });
  }

  return todaysArticles;
};

const sendMessageToQueue = async (body) => {
  const sendCommand = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(body),
    MessageGroupId: ULID.ulid(),
    MessageDeduplicationId: ULID.ulid(),
  });

  await sqsClient.send(sendCommand);
};

export const handler = async (event) => {
  const res = await fetch("https://techcrunch.com/feed/");
  const text = await res.text();

  const feed = await parseStringPromise(text);
  const articles = feed.rss.channel[0].item;

  const todaysArticles = await getTodaysArticles(articles);

  if (todaysArticles.length === 0) {
    console.log("No Artciles");
  }

  console.log("todaysArticles: ", JSON.stringify(todaysArticles));

  for (const todaysArticle of todaysArticles) {
    await sendMessageToQueue(todaysArticle);
  }
};
