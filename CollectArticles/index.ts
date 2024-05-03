import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";

interface Article {
  title: string;
  content: string;
}

const isToday = (date, now) => {
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const getTodaysArticles = async (articles: any[]) => {
  const now = new Date();

  const todaysArticles: Array<Article> = [];
  for (const article of articles) {
    const date = new Date(article.pubDate[0]);

    if (!isToday(date, now)) continue;

    const res = await fetch(article.link[0]);
    const text = await res.text();
    const $ = cheerio.load(text);

    todaysArticles.push({
      title: article.title[0] as string,
      content: $("article").text() as string,
    });
  }

  return todaysArticles;
};

export const handler = async (event: any) => {
  const res = await fetch("https://techcrunch.com/feed/");
  const text = await res.text();

  const feed = await parseStringPromise(text);
  const articles = feed.rss.channel[0].item;

  const todaysArticles = await getTodaysArticles(articles);
  console.log(todaysArticles);

  if (todaysArticles.length === 0) {
    console.log("No Artciles");
  }

  console.log("todaysArticles: ", JSON.stringify(todaysArticles));
};
