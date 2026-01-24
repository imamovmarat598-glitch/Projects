const https = require('https');
const BASE_URL = 'https://cuhelibbeerank.beget.app';
const WORKFLOW_ID = 'q3AbMtyUcI7ANJZD';

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const doReq = (attempt) => {
      const req = https.request(options, (res) => {
        let d = '';
        res.on('data', chunk => d += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: d, cookies: res.headers['set-cookie'] || [] }));
      });
      req.on('error', (err) => {
        console.log('  retry', attempt + 1, err.code || err.message);
        if (attempt < 4) { setTimeout(() => doReq(attempt + 1), 3000); }
        else reject(err);
      });
      if (body) req.write(body);
      req.end();
    };
    doReq(0);
  });
}

// EXPANDED sources list - 140+
const ALL_SOURCES = [
  // Federal agencies (9)
  { name: 'МВД РФ', url: 'https://xn--b1aew.xn--p1ai/news/rss' },
  { name: 'Росгвардия', url: 'https://rosgvard.ru/ru/rss' },
  { name: 'Генпрокуратура', url: 'https://genproc.gov.ru/rss/' },
  { name: 'СК РФ', url: 'https://sledcom.ru/rss_news' },
  { name: 'ТАСС', url: 'https://tass.ru/rss/v2.xml' },
  { name: 'РИА Новости', url: 'https://ria.ru/export/rss2/incidents/index.xml' },
  { name: 'Интерфакс', url: 'https://www.interfax.ru/rss.asp' },
  { name: 'Lenta.ru', url: 'https://lenta.ru/rss/news/russia' },
  { name: 'Газета.ру', url: 'https://www.gazeta.ru/export/rss/incidents.xml' },
  // Major media (17)
  { name: 'МК', url: 'https://www.mk.ru/rss/index.xml' },
  { name: 'Коммерсант', url: 'https://www.kommersant.ru/RSS/news.xml' },
  { name: 'РБК', url: 'https://rssexport.rbc.ru/rbcnews/news/30/full.rss' },
  { name: 'Известия', url: 'https://iz.ru/xml/rss/all.xml' },
  { name: 'КП', url: 'https://www.kp.ru/rss/allsections.xml' },
  { name: 'Российская Газета', url: 'https://rg.ru/tema/bezopasnost/rss.xml' },
  { name: 'НТВ', url: 'https://www.ntv.ru/exp/newsrss.jsp' },
  { name: 'Вести', url: 'https://www.vesti.ru/vesti.rss' },
  { name: 'АиФ', url: 'https://aif.ru/rss/incidents.php' },
  { name: 'Life.ru', url: 'https://life.ru/xml/feed.xml' },
  { name: 'Regnum', url: 'https://regnum.ru/rss/incidents' },
  { name: 'Росбалт', url: 'https://www.rosbalt.ru/feed/' },
  { name: 'ФедералПресс', url: 'https://fedpress.ru/feed' },
  { name: 'Новые Известия', url: 'https://newizv.ru/rss' },
  { name: 'Daily Storm', url: 'https://dailystorm.ru/rss' },
  { name: 'RT', url: 'https://russian.rt.com/rss' },
  { name: 'Царьград', url: 'https://tsargrad.tv/rss/all' },
  // Moscow & SPb (8)
  { name: 'Фонтанка', url: 'https://www.fontanka.ru/fontanka.rss' },
  { name: 'Вечерняя Москва', url: 'https://vm.ru/rss/news.xml' },
  { name: 'Москва 24', url: 'https://www.m24.ru/rss.xml' },
  { name: 'Мойка78', url: 'https://m.78.ru/rss/' },
  { name: 'СПб дневник', url: 'https://spbdnevnik.ru/rss' },
  { name: '360 ТВ', url: 'https://360tv.ru/rss/' },
  { name: 'Мослента', url: 'https://moslenta.ru/rss.xml' },
  { name: 'Петербург2', url: 'https://peterburg2.ru/rss/news' },
  // Regional: network NN.ru (40+)
  { name: '14.ru Якутск', url: 'https://14.ru/rss/' },
  { name: '26.ru Ставрополь', url: 'https://26.ru/rss/' },
  { name: '29.ru Архангельск', url: 'https://29.ru/rss/' },
  { name: '35.ru Вологда', url: 'https://35.ru/rss/' },
  { name: '43.ru Киров', url: 'https://43.ru/rss/' },
  { name: '45.ru Курган', url: 'https://45.ru/rss/' },
  { name: '48.ru Липецк', url: 'https://48.ru/rss/' },
  { name: '51.ru Мурманск', url: 'https://51.ru/rss/' },
  { name: '53.ru Новгород', url: 'https://53.ru/rss/' },
  { name: '56.ru Оренбург', url: 'https://56.ru/rss/' },
  { name: '59.ru Пермь', url: 'https://59.ru/rss/' },
  { name: '60.ru Псков', url: 'https://60.ru/rss/' },
  { name: '62.ru Рязань', url: 'https://62.ru/rss/' },
  { name: '63.ru Самара', url: 'https://63.ru/rss/' },
  { name: '68.ru Тамбов', url: 'https://68.ru/rss/' },
  { name: '71.ru Тула', url: 'https://71.ru/rss/' },
  { name: '72.ru Тюмень', url: 'https://72.ru/rss/' },
  { name: '74.ru Челябинск', url: 'https://74.ru/rss/' },
  { name: '76.ru Ярославль', url: 'https://76.ru/rss/' },
  { name: '86.ru ХМАО', url: 'https://86.ru/rss/' },
  { name: '89.ru ЯНАО', url: 'https://89.ru/rss/' },
  { name: '93.ru Краснодар', url: 'https://93.ru/rss/' },
  { name: '116.ru Казань', url: 'https://116.ru/rss/' },
  { name: '161.ru Ростов', url: 'https://161.ru/rss/' },
  { name: '164.ru Саратов', url: 'https://164.ru/rss/' },
  { name: 'V1.ru Волгоград', url: 'https://v1.ru/rss/' },
  { name: 'E1.ru Екатеринбург', url: 'https://www.e1.ru/export/rss/news.xml' },
  { name: 'НГС Новосибирск', url: 'https://news.ngs.ru/rss/' },
  { name: 'НГС24 Красноярск', url: 'https://ngs24.ru/rss/' },
  { name: 'НГС42 Кемерово', url: 'https://ngs42.ru/rss/' },
  { name: 'НГС55 Омск', url: 'https://ngs55.ru/rss/' },
  { name: 'НГС70 Томск', url: 'https://ngs70.ru/rss/' },
  // More regional (20)
  { name: 'Ura.ru', url: 'https://ura.news/rss' },
  { name: 'IRK.ru Иркутск', url: 'https://irk.ru/news/rss/' },
  { name: 'Newslab Красноярск', url: 'https://newslab.ru/rss/' },
  { name: 'DonNews Ростов', url: 'https://www.donnews.ru/rss/' },
  { name: 'Znak.com', url: 'https://www.znak.com/rss' },
  { name: 'Кавказский Узел', url: 'https://www.kavkaz-uzel.eu/articles.rss' },
  { name: 'РИА Крым', url: 'https://crimea.ria.ru/export/rss2/index.xml' },
  { name: 'Башинформ', url: 'https://bash.news/rss/' },
  { name: 'Примгазета Владивосток', url: 'https://primgazeta.ru/feed/' },
  { name: 'Блокнот Волгоград', url: 'https://bloknot-volgograd.ru/rss/' },
  { name: 'КП Кубань', url: 'https://www.kuban.kp.ru/rss/' },
  { name: 'Тюменская линия', url: 'https://t-l.ru/rss/' },
  { name: 'Сибкрай', url: 'https://sibkray.ru/rss/' },
  { name: 'ТВК Красноярск', url: 'https://tvk6.ru/rss/' },
  { name: 'Амур.инфо', url: 'https://www.amur.info/rss/' },
  { name: 'КП Новосибирск', url: 'https://www.nsk.kp.ru/rss/' },
  { name: 'КП Урал', url: 'https://www.ural.kp.ru/rss/' },
  { name: 'КП Самара', url: 'https://www.samara.kp.ru/rss/' },
  { name: 'КП Ростов', url: 'https://www.rostov.kp.ru/rss/' },
  { name: 'КП Казань', url: 'https://www.kazan.kp.ru/rss/' },
  // Google News (6)
  { name: 'Google: наркотики', url: 'https://news.google.com/rss/search?q=%D0%B8%D0%B7%D1%8A%D1%8F%D1%82%D0%B8%D0%B5+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%BE%D0%B2+OR+%D0%B7%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: контрабанда', url: 'https://news.google.com/rss/search?q=%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%B0%D0%B1%D0%B0%D0%BD%D0%B4%D0%B0&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: МВД ФСБ', url: 'https://news.google.com/rss/search?q=%D0%9C%D0%92%D0%94+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+OR+%D0%A4%D0%A1%D0%91+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: регионы', url: 'https://news.google.com/rss/search?q=%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8C+OR+%D0%A3%D1%80%D0%B0%D0%BB+OR+%D0%9A%D0%B0%D0%B2%D0%BA%D0%B0%D0%B7&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: drugs CIS', url: 'https://news.google.com/rss/search?q=drug+seizure+Russia+OR+narcotics+CIS&hl=en&gl=US&ceid=US:en' },
  { name: 'Google: закладки', url: 'https://news.google.com/rss/search?q=%D0%B7%D0%B0%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+OR+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BB%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B8%D1%8F&hl=ru&gl=RU&ceid=RU:ru' },
  // CIS countries (26)
  { name: 'Tengrinews KZ', url: 'https://tengrinews.kz/rss/' },
  { name: 'Zakon.kz', url: 'https://www.zakon.kz/rss/' },
  { name: 'Nur.kz', url: 'https://www.nur.kz/rss' },
  { name: 'Inform.kz', url: 'https://www.inform.kz/ru/rss/' },
  { name: 'Sputnik KZ', url: 'https://ru.sputnik.kz/export/rss2/index.xml' },
  { name: 'БЕЛТА BY', url: 'https://www.belta.by/rss/' },
  { name: 'Onliner BY', url: 'https://tech.onliner.by/feed' },
  { name: 'МВД BY', url: 'https://mvd.gov.by/ru/rss' },
  { name: 'Sputnik BY', url: 'https://sputnik.by/export/rss2/index.xml' },
  { name: 'Правда UA', url: 'https://www.pravda.com.ua/rss/' },
  { name: 'УНИАН', url: 'https://www.unian.net/rss/news.xml' },
  { name: 'Цензор UA', url: 'https://censor.net/includes/news_ru.xml' },
  { name: 'Газета.uz', url: 'https://www.gazeta.uz/ru/rss/' },
  { name: 'Kun.uz', url: 'https://kun.uz/ru/rss' },
  { name: 'UzDaily', url: 'https://www.uzdaily.uz/ru/rss' },
  { name: '24.kg KG', url: 'https://24.kg/rss/' },
  { name: 'Kloop KG', url: 'https://kloop.kg/feed/' },
  { name: 'Sputnik KG', url: 'https://ru.sputnik.kg/export/rss2/index.xml' },
  { name: 'ArmInfo AM', url: 'https://arminfo.am/rus/rss/' },
  { name: 'Sputnik AM', url: 'https://ru.armeniasputnik.am/export/rss2/index.xml' },
  { name: 'APA AZ', url: 'https://apa.az/ru.rss' },
  { name: 'Trend AZ', url: 'https://www.trend.az/feeds/news.rss' },
  { name: 'IPN MD', url: 'https://www.ipn.md/ru/rss/' },
  { name: 'Asia-Plus TJ', url: 'https://asiaplustj.info/rss' },
  { name: 'Sputnik TJ', url: 'https://ru.sputnik-tj.com/export/rss2/index.xml' },
  { name: 'Sputnik UZ', url: 'https://uz.sputniknews.ru/export/rss2/index.xml' },
];

async function main() {
  console.log('Adding', ALL_SOURCES.length, 'sources...');

  const loginBody = JSON.stringify({ emailOrLdapLoginId: 'Imamovmarat598@gmail.com', password: 'M@maiko17081988!' });
  const loginRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: '/rest/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Referer': BASE_URL + '/signin', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);
  const cookieHeader = loginRes.cookies.map(c => c.split(';')[0]).join('; ');

  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/deactivate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': 2 } }, '{}');

  const getRes = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
  const wf = JSON.parse(getRes.data).data;

  // Update Fetch All RSS node with new sources
  const sourcesJSON = JSON.stringify(ALL_SOURCES);
  const fetchCode = `// All RSS sources (${ALL_SOURCES.length})
const sources = ${sourcesJSON};

const allNews = [];
const batchSize = 15;

for (let i = 0; i < sources.length; i += batchSize) {
  const batch = sources.slice(i, i + batchSize);
  const promises = batch.map(async (src) => {
    try {
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url: src.url,
        timeout: 8000,
        returnFullResponse: false,
        encoding: 'utf-8',
      });
      const text = typeof response === 'string' ? response : JSON.stringify(response);
      const items = [];
      const itemRegex = /<item[^>]*>([\\s\\S]*?)<\\/item>/gi;
      let match;
      while ((match = itemRegex.exec(text)) !== null && items.length < 20) {
        const xml = match[1];
        let title = '';
        const titleM = xml.match(/<title[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/title>/s);
        if (titleM) title = titleM[1].replace(/<[^>]+>/g, '').trim();
        let link = '';
        const linkM = xml.match(/<link[^>]*>(.*?)<\\/link>/);
        if (linkM) link = linkM[1].replace(/<[^>]+>/g, '').trim();
        if (!link) {
          const linkM2 = xml.match(/<link[^>]*href="([^"]+)"/);
          if (linkM2) link = linkM2[1];
        }
        let pubDate = '';
        const dateM = xml.match(/<pubDate>(.*?)<\\/pubDate>/);
        if (dateM) pubDate = dateM[1].trim();
        let desc = '';
        const descM = xml.match(/<description[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/description>/s);
        if (descM) desc = descM[1].replace(/<[^>]+>/g, '').trim().substring(0, 250);
        if (title && title.length > 5) {
          items.push({ title, link, pubDate, description: desc, source: src.name });
        }
      }
      return items;
    } catch (e) {
      return [];
    }
  });
  const results = await Promise.all(promises);
  for (const items of results) {
    for (const item of items) {
      allNews.push({ json: item });
    }
  }
}

if (allNews.length === 0) {
  return [{ json: { title: 'No news', link: '', pubDate: '', description: '', source: '' } }];
}
return allNews;`;

  const updatedNodes = wf.nodes.map(n => {
    if (n.id === 'code-fetch') {
      return { ...n, parameters: { ...n.parameters, jsCode: fetchCode } };
    }
    return n;
  });

  const updateData = { name: 'Drug Monitor v11 (' + ALL_SOURCES.length + ' sources)', nodes: updatedNodes, connections: wf.connections, settings: wf.settings, versionId: wf.versionId };
  const updateBody = JSON.stringify(updateData);
  console.log('Size:', (Buffer.byteLength(updateBody) / 1024).toFixed(1), 'KB');

  const updRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(updateBody) }
  }, updateBody);

  if (updRes.status !== 200) {
    console.error('FAILED:', updRes.data.substring(0, 300));
    return;
  }

  const updWf = JSON.parse(updRes.data).data;
  const actBody = JSON.stringify({ versionId: updWf.versionId });
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/activate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(actBody) } }, actBody);

  console.log('Done:', updWf.name, '| Sources:', ALL_SOURCES.length);
  console.log('Active, cron 7:00/19:00 MSK');
}

main().catch(e => console.error('Error:', e.message));
