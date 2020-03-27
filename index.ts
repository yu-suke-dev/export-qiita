// eslint-disable-next-line no-unused-vars
import fetch, { Response } from 'node-fetch';
import axios from 'axios';
import { promises as fsPromises } from 'fs';

(async () => {
  const userId = 'yusuke_dev';
  const URL = `https://qiita.com/api/v2//users/${userId}/items?per_page=100`;

  const result: Response = await fetch(URL);

  if (result.status !== 200) throw new Error(`${result.status}以外のレスポンスです。`);

  const articles = await result.json();

  await fsPromises.mkdir('./output');

  Promise.all(
    articles.map(async (article: any, index: number) => {
      const result: Response = await fetch(`${article.url}.md`);
      const text = await result.text();

      await fsPromises.mkdir(`./output/${index}`);
      await fsPromises.mkdir(`./output/${index}/img`);

      const images = text.match(/<img(.|\s)*?>/gi);
      const mdImages = text.match(/!\[.*\]\((.*)\)/gi);

      await fsPromises.writeFile(`./output/${index}/text.md`, text);

      images &&
        (await Promise.all(
          images.map(async (image) => {
            const url = image.match(/src=["|'](.*?)["|']/)![1];
            const fileName = url.match(/[^/]+$/i)![0];
            const response: any = await axios.get(url, { responseType: 'arraybuffer' });
            await fsPromises.writeFile(`./output/${index}/img/${String(fileName)}`, Buffer.from(response.data));
          }),
        ));
      mdImages &&
        (await Promise.all(
          mdImages.map(async (mdImage) => {
            const url = mdImage.match(/!\[.*\]\((.*)\)/)![1];
            const fileName = url.match(/[^/]+$/i)![0];
            const response: any = await axios.get(url, { responseType: 'arraybuffer' });
            await fsPromises.writeFile(`./output/${index}/img/${String(fileName)}`, Buffer.from(response.data));
          }),
        ));
    }),
  );
})();
