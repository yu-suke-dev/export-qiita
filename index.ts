import fetch from 'node-fetch';

(async () => {
  fetch('https://github.com/')
    .then((res: any) => res.text())
    .then((body: any) => console.log(body));
})();
