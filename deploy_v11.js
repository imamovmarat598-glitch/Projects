const https = require('https');

const BASE_URL = 'https://cuhelibbeerank.beget.app';
const WORKFLOW_ID = 'q3AbMtyUcI7ANJZD';
const TELEGRAM_TOKEN = '8534648363:AAFFzo6uo0rke4-llBss6k5_gL4VCngSIEM';
const CHAT_ID = '-1001121854465';

function makeRequest(options, body, retries = 2) {
  return new Promise((resolve, reject) => {
    const doRequest = (attempt) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data, cookies: res.headers['set-cookie'] || [] }));
      });
      req.on('error', (err) => {
        if (attempt < retries) {
          setTimeout(() => doRequest(attempt + 1), 3000);
        } else reject(err);
      });
      if (body) req.write(body);
      req.end();
    };
    doRequest(0);
  });
}

// === ALL RSS SOURCES (100+) ===
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
  // Major media (16)
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
  { name: 'RT на русском', url: 'https://russian.rt.com/rss' },
  // Moscow & SPb (8)
  { name: 'Фонтанка', url: 'https://www.fontanka.ru/fontanka.rss' },
  { name: 'Вечерняя Москва', url: 'https://vm.ru/rss/news.xml' },
  { name: 'Москва 24', url: 'https://www.m24.ru/rss.xml' },
  { name: 'Мойка78', url: 'https://m.78.ru/rss/' },
  { name: 'СПб дневник', url: 'https://spbdnevnik.ru/rss' },
  { name: '360 ТВ', url: 'https://360tv.ru/rss/' },
  { name: 'Мослента', url: 'https://moslenta.ru/rss.xml' },
  { name: 'Петербург2', url: 'https://peterburg2.ru/rss/news' },
  // Regional Russia (30)
  { name: '29.ru', url: 'https://29.ru/rss/' },
  { name: '35.ru', url: 'https://35.ru/rss/' },
  { name: '45.ru', url: 'https://45.ru/rss/' },
  { name: '48.ru', url: 'https://48.ru/rss/' },
  { name: '51.ru', url: 'https://51.ru/rss/' },
  { name: '53.ru', url: 'https://53.ru/rss/' },
  { name: '56.ru', url: 'https://56.ru/rss/' },
  { name: '59.ru', url: 'https://59.ru/rss/' },
  { name: '60.ru', url: 'https://60.ru/rss/' },
  { name: '62.ru', url: 'https://62.ru/rss/' },
  { name: '63.ru', url: 'https://63.ru/rss/' },
  { name: '68.ru', url: 'https://68.ru/rss/' },
  { name: '71.ru', url: 'https://71.ru/rss/' },
  { name: '72.ru', url: 'https://72.ru/rss/' },
  { name: '74.ru', url: 'https://74.ru/rss/' },
  { name: '76.ru', url: 'https://76.ru/rss/' },
  { name: '86.ru', url: 'https://86.ru/rss/' },
  { name: '89.ru', url: 'https://89.ru/rss/' },
  { name: '93.ru', url: 'https://93.ru/rss/' },
  { name: '116.ru', url: 'https://116.ru/rss/' },
  { name: '161.ru', url: 'https://161.ru/rss/' },
  { name: 'V1.ru', url: 'https://v1.ru/rss/' },
  { name: 'E1.ru', url: 'https://www.e1.ru/export/rss/news.xml' },
  { name: 'НГС', url: 'https://news.ngs.ru/rss/' },
  { name: 'НГС24', url: 'https://ngs24.ru/rss/' },
  { name: 'Ura.ru', url: 'https://ura.news/rss' },
  { name: 'IRK.ru', url: 'https://irk.ru/news/rss/' },
  { name: 'Newslab', url: 'https://newslab.ru/rss/' },
  { name: 'DonNews', url: 'https://www.donnews.ru/rss/' },
  { name: 'Znak.com', url: 'https://www.znak.com/rss' },
  // More regional (12)
  { name: 'Кавказский Узел', url: 'https://www.kavkaz-uzel.eu/articles.rss' },
  { name: 'РИА Крым', url: 'https://crimea.ria.ru/export/rss2/index.xml' },
  { name: 'Башинформ', url: 'https://bash.news/rss/' },
  { name: 'Примгазета', url: 'https://primgazeta.ru/feed/' },
  { name: 'Блокнот', url: 'https://bloknot-volgograd.ru/rss/' },
  { name: 'КП Кубань', url: 'https://www.kuban.kp.ru/rss/' },
  { name: 'Тюменская линия', url: 'https://t-l.ru/rss/' },
  { name: 'ОТВ Челябинск', url: 'https://www.1obl.ru/rss/' },
  { name: 'Сибкрай', url: 'https://sibkray.ru/rss/' },
  { name: 'НИА Красноярск', url: 'https://24rus.ru/rss.php' },
  { name: 'ТВК Красноярск', url: 'https://tvk6.ru/rss/' },
  { name: 'Амур.инфо', url: 'https://www.amur.info/rss/' },
  // Google News (6)
  { name: 'Google: изъятие наркотиков', url: 'https://news.google.com/rss/search?q=%D0%B8%D0%B7%D1%8A%D1%8F%D1%82%D0%B8%D0%B5+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%BE%D0%B2+OR+%D0%B7%D0%B0%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: контрабанда', url: 'https://news.google.com/rss/search?q=%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%B0%D0%B1%D0%B0%D0%BD%D0%B4%D0%B0&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: МВД ФСБ', url: 'https://news.google.com/rss/search?q=%D0%9C%D0%92%D0%94+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+OR+%D0%A4%D0%A1%D0%91+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: регионы', url: 'https://news.google.com/rss/search?q=%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8C+OR+%D0%A3%D1%80%D0%B0%D0%BB+OR+%D0%9A%D0%B0%D0%B2%D0%BA%D0%B0%D0%B7&hl=ru&gl=RU&ceid=RU:ru' },
  { name: 'Google: drugs CIS', url: 'https://news.google.com/rss/search?q=drug+seizure+Russia+OR+narcotics+CIS+countries&hl=en&gl=US&ceid=US:en' },
  { name: 'Google: закладки', url: 'https://news.google.com/rss/search?q=%D0%B7%D0%B0%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8+OR+%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BB%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B8%D1%8F&hl=ru&gl=RU&ceid=RU:ru' },
  // CIS countries (24)
  { name: 'Tengrinews KZ', url: 'https://tengrinews.kz/rss/' },
  { name: 'Zakon.kz', url: 'https://www.zakon.kz/rss/' },
  { name: 'Nur.kz', url: 'https://www.nur.kz/rss' },
  { name: 'Inform.kz', url: 'https://www.inform.kz/ru/rss/' },
  { name: 'БЕЛТА BY', url: 'https://www.belta.by/rss/' },
  { name: 'Onliner BY', url: 'https://tech.onliner.by/feed' },
  { name: 'МВД BY', url: 'https://mvd.gov.by/ru/rss' },
  { name: 'Правда UA', url: 'https://www.pravda.com.ua/rss/' },
  { name: 'УНИАН', url: 'https://www.unian.net/rss/news.xml' },
  { name: 'Цензор UA', url: 'https://censor.net/includes/news_ru.xml' },
  { name: 'Газета.uz', url: 'https://www.gazeta.uz/ru/rss/' },
  { name: 'Kun.uz', url: 'https://kun.uz/ru/rss' },
  { name: 'UzDaily', url: 'https://www.uzdaily.uz/ru/rss' },
  { name: '24.kg KG', url: 'https://24.kg/rss/' },
  { name: 'Kloop KG', url: 'https://kloop.kg/feed/' },
  { name: 'ArmInfo AM', url: 'https://arminfo.am/rus/rss/' },
  { name: 'Sputnik AM', url: 'https://ru.armeniasputnik.am/export/rss2/index.xml' },
  { name: 'APA AZ', url: 'https://apa.az/ru.rss' },
  { name: 'Trend AZ', url: 'https://www.trend.az/feeds/news.rss' },
  { name: 'IPN MD', url: 'https://www.ipn.md/ru/rss/' },
  { name: 'Asia-Plus TJ', url: 'https://asiaplustj.info/rss' },
  { name: 'Sputnik KZ', url: 'https://ru.sputnik.kz/export/rss2/index.xml' },
  { name: 'Sputnik BY', url: 'https://sputnik.by/export/rss2/index.xml' },
  { name: 'Sputnik KG', url: 'https://ru.sputnik.kg/export/rss2/index.xml' },
];

// AI System Prompt with LINKS requirement
const SYSTEM_PROMPT = `Ты эксперт-аналитик по наркоситуации. Создай ЕДИНУЮ сводку из предоставленных новостей.

ОТБОР - включать ТОЛЬКО новости о:
- Изъятии наркотиков (героин, кокаин, мефедрон, амфетамин, метамфетамин, гашиш, марихуана, синтетика, фентанил)
- Задержании наркокурьеров/наркоторговцев
- Обнаружении нарколабораторий
- Пресечении каналов наркотрафика
- Приговорах по наркостатьям
- Операциях спецслужб против наркогруппировок
- Ликвидации тайников/закладок

ИСКЛЮЧИТЬ: легализацию, медицинскую марихуану, реабилитацию, аналитику, мнения, повторы.

ОПРЕДЕЛЕНИЕ СТРАНЫ (по тексту новости, НЕ по источнику):
- Российские города/регионы/ведомства (МВД, ФСБ, Росгвардия, СК) = РОССИЯ
- Алматы, Нур-Султан, Астана, МВД РК = КАЗАХСТАН
- Минск, Гомель, МВД BY = БЕЛАРУСЬ
- Киев, Одесса, СБУ = УКРАИНА
- Ташкент, МВД UZ = УЗБЕКИСТАН
- Бишкек, ГКНБ = КИРГИЗИЯ
- Душанбе, АККН = ТАДЖИКИСТАН
- Баку, МВД AZ = АЗЕРБАЙДЖАН
- Ереван = АРМЕНИЯ
- Кишинёв = МОЛДОВА

ФОРМАТ (Telegram HTML, ВСЁ В ОДНОМ СООБЩЕНИИ):

<b>СВОДКА SKYNET</b>
<i>[ДАТА]</i>

<b>РОССИЯ</b>

• <b>Регион:</b> Описание. Изъято: X кг. Задержано: N чел.
  <a href="ССЫЛКА">Источник</a>

• <b>Регион:</b> Описание...
  <a href="ССЫЛКА">Источник</a>

<b>КАЗАХСТАН</b>

• <b>Город:</b> Описание...
  <a href="ССЫЛКА">Источник</a>

━━━━━━━━━━━━━━━
<i>Итого: X событий | Y стран</i>

ПРАВИЛА:
1. БЕЗ эмодзи флагов - только текст
2. Россия ПЕРВАЯ, остальные по алфавиту
3. Страны БЕЗ новостей НЕ включать
4. Каждая новость с ССЫЛКОЙ на источник (тег <a href="URL">Название</a>)
5. 1-2 строки на новость
6. Указывать вещество, вес, задержанных
7. URL берётся из поля link новости

Если новостей НЕТ:
<b>СВОДКА SKYNET</b>
<i>[ДАТА]</i>
За отчётный период релевантных событий не зафиксировано.`;

async function main() {
  console.log('=== Deploy v11: Single Code node for RSS (fixes fan-in) ===');
  console.log('Sources:', ALL_SOURCES.length, '\n');

  // Login
  console.log('1. Logging in...');
  const loginBody = JSON.stringify({ emailOrLdapLoginId: 'Imamovmarat598@gmail.com', password: 'M@maiko17081988!' });
  const loginRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: '/rest/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Referer': BASE_URL + '/signin', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);
  if (loginRes.status !== 200) { console.error('Login failed'); return; }
  const cookieHeader = loginRes.cookies.map(c => c.split(';')[0]).join('; ');
  console.log('   OK');

  // Deactivate
  console.log('2. Deactivating...');
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/deactivate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': 2 } }, '{}');

  // Get version
  console.log('3. Getting version...');
  const getRes = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
  const wf = JSON.parse(getRes.data).data;
  console.log('   Version:', wf.versionId);

  // Build the sources JSON string for the Code node
  const sourcesJSON = JSON.stringify(ALL_SOURCES);

  // === BUILD WORKFLOW ===
  // Architecture: Schedule Trigger → Fetch All RSS (Code) → Filter & Dedup (Code) → Prepare AI (Code) → OpenAI (HTTP) → Format TG (Code) → Send Telegram (HTTP)
  // This eliminates the fan-in problem completely

  const nodes = [
    // Schedule Trigger
    {
      parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 4,16 * * *' }] } },
      id: 'schedule-trigger', name: 'Schedule Trigger',
      type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2,
      position: [0, 400]
    },
    // Fetch All RSS - Single Code node that fetches ALL feeds
    {
      parameters: {
        jsCode: `// All RSS sources
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
return allNews;`
      },
      id: 'code-fetch', name: 'Fetch All RSS',
      type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [300, 400]
    },
    // Filter & Deduplicate
    {
      parameters: {
        jsCode: `const staticData = $getWorkflowStaticData('global');
if (!staticData.publishedNews) staticData.publishedNews = [];

// Clean old entries (5 days)
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
staticData.publishedNews = staticData.publishedNews.filter(h => new Date(h.date) > fiveDaysAgo);

const now = new Date();
const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
const seenTitles = new Set();
const filtered = [];

for (const item of $input.all()) {
  const title = (item.json.title || '').toLowerCase().trim();
  if (!title || title === 'no news' || title.length < 10) continue;

  // Deduplicate by title prefix
  const titleKey = title.substring(0, 60);
  if (seenTitles.has(titleKey)) continue;
  seenTitles.add(titleKey);

  // Filter by date (12 hours)
  if (item.json.pubDate) {
    const pubDate = new Date(item.json.pubDate);
    if (!isNaN(pubDate.getTime()) && pubDate < twelveHoursAgo) continue;
  }

  // Check against 5-day history
  const isDuplicate = staticData.publishedNews.some(h =>
    h.title === titleKey || (titleKey.length > 35 && h.title && h.title.substring(0, 35) === titleKey.substring(0, 35))
  );
  if (isDuplicate) continue;

  filtered.push(item);
}

// Save to history ONLY if we have items (prevent empty saves)
if (filtered.length > 0) {
  for (const item of filtered) {
    const t = (item.json.title || '').toLowerCase().trim().substring(0, 60);
    staticData.publishedNews.push({ title: t, date: now.toISOString() });
  }
}

// Limit to 70 items for AI processing
const limited = filtered.slice(0, 70);
return limited.length > 0 ? limited : [{ json: { title: 'No relevant news', link: '', description: '', source: '' } }];`
      },
      id: 'code-filter', name: 'Filter Dedup',
      type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [600, 400]
    },
    // Prepare AI Request
    {
      parameters: {
        jsCode: `const newsItems = $input.all().map(item => ({
  title: item.json.title || '',
  link: item.json.link || '',
  description: (item.json.description || '').substring(0, 200),
  source: item.json.source || ''
})).filter(n => n.title && n.title !== 'No relevant news' && n.title !== 'No news');

if (newsItems.length === 0) {
  const moscowTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fallbackMsg = '<b>СВОДКА SKYNET</b>\\n<i>' + moscowTime + ' (МСК)</i>\\n\\nЗа отчётный период релевантных событий не зафиксировано.';
  const tgBody = { chat_id: '${CHAT_ID}', text: fallbackMsg, parse_mode: 'HTML', disable_web_page_preview: true };
  return [{ json: { skipAI: true, tgRequestBody: JSON.stringify(tgBody) } }];
}

const moscowTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const systemPrompt = ${JSON.stringify(SYSTEM_PROMPT)}.replace('[ДАТА]', moscowTime + ' (МСК)');

// Build news list with links
const newsList = newsItems.map((n, i) => (i+1) + '. ' + n.title + ' | ' + n.source + ' | ' + n.link).join('\\n');
const truncated = newsList.length > 13000 ? newsList.substring(0, 13000) + '\\n...(обрезано)' : newsList;

const requestBody = {
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Проанализируй ' + newsItems.length + ' новостей и создай сводку. Используй ссылки (link) из данных для тега <a href>.\\n\\n' + truncated }
  ],
  max_tokens: 4000,
  temperature: 0.1
};

return [{ json: { skipAI: false, requestBody: JSON.stringify(requestBody) } }];`
      },
      id: 'code-prepare', name: 'Prepare AI',
      type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [900, 400]
    },
    // IF node - check if we should skip AI
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '' },
          combinator: 'and',
          conditions: [
            { leftValue: '={{ $json.skipAI }}', rightValue: 'false', operator: { type: 'string', operation: 'equals' } }
          ]
        }
      },
      id: 'if-skip', name: 'Need AI?',
      type: 'n8n-nodes-base.if', typeVersion: 2,
      position: [1150, 400]
    },
    // OpenAI HTTP Request
    {
      parameters: {
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpHeaderAuth',
        sendHeaders: false,
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/json',
        specifyBody: 'string',
        body: '={{ $json.requestBody }}',
        options: { timeout: 120000 }
      },
      id: 'openai-request', name: 'OpenAI API',
      type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
      position: [1400, 300],
      credentials: { httpHeaderAuth: { id: '4dtbcKtQel8QA9i8', name: 'OpenAI API Header' } },
      onError: 'continueRegularOutput',
      retryOnFail: true,
      maxTries: 3,
      waitBetweenTries: 20000
    },
    // Format TG from AI response
    {
      parameters: {
        jsCode: `const response = $input.first().json;
let message = '';

if (response.choices && response.choices[0] && response.choices[0].message) {
  message = response.choices[0].message.content;
} else if (response.error) {
  const moscowTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  message = '<b>СВОДКА SKYNET</b>\\n<i>' + moscowTime + ' (МСК)</i>\\n\\nОшибка обработки: ' + (response.error.message || 'API error');
} else {
  const moscowTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  message = '<b>СВОДКА SKYNET</b>\\n<i>' + moscowTime + ' (МСК)</i>\\n\\nНет данных от AI.';
}

// Clean extra newlines
message = message.replace(/\\n{3,}/g, '\\n\\n').trim();
// Telegram 4096 char limit
if (message.length > 4090) {
  message = message.substring(0, 4080) + '\\n<i>...сокращено</i>';
}

const tgBody = {
  chat_id: '${CHAT_ID}',
  text: message,
  parse_mode: 'HTML',
  disable_web_page_preview: true
};
return [{ json: { tgRequestBody: JSON.stringify(tgBody) } }];`
      },
      id: 'code-format', name: 'Format TG',
      type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [1650, 300]
    },
    // Send Telegram (for AI path)
    {
      parameters: {
        method: 'POST',
        url: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        sendHeaders: false,
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/json',
        specifyBody: 'string',
        body: '={{ $json.tgRequestBody }}',
        options: { timeout: 30000 }
      },
      id: 'telegram-send', name: 'Send Telegram',
      type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
      position: [1900, 300],
      onError: 'continueRegularOutput'
    },
    // Send Telegram (for skip AI path - no news)
    {
      parameters: {
        method: 'POST',
        url: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        sendHeaders: false,
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/json',
        specifyBody: 'string',
        body: '={{ $json.tgRequestBody }}',
        options: { timeout: 30000 }
      },
      id: 'telegram-skip', name: 'Send No News',
      type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
      position: [1400, 550],
      onError: 'continueRegularOutput'
    }
  ];

  // Build connections
  const connections = {
    'Schedule Trigger': { main: [[{ node: 'Fetch All RSS', type: 'main', index: 0 }]] },
    'Fetch All RSS': { main: [[{ node: 'Filter Dedup', type: 'main', index: 0 }]] },
    'Filter Dedup': { main: [[{ node: 'Prepare AI', type: 'main', index: 0 }]] },
    'Prepare AI': { main: [[{ node: 'Need AI?', type: 'main', index: 0 }]] },
    'Need AI?': { main: [
      [{ node: 'OpenAI API', type: 'main', index: 0 }],  // true branch (need AI)
      [{ node: 'Send No News', type: 'main', index: 0 }]  // false branch (skip AI)
    ]},
    'OpenAI API': { main: [[{ node: 'Format TG', type: 'main', index: 0 }]] },
    'Format TG': { main: [[{ node: 'Send Telegram', type: 'main', index: 0 }]] }
  };

  const workflow = {
    name: 'Drug Monitor v11 (' + ALL_SOURCES.length + ' sources)',
    nodes,
    connections,
    settings: { executionOrder: 'v1', saveManualExecutions: true, callerPolicy: 'workflowsFromSameOwner' },
    staticData: null, // Reset static data to clear old dedup history
    versionId: wf.versionId
  };

  // Upload
  console.log('4. Uploading (' + nodes.length + ' nodes)...');
  const updateBody = JSON.stringify(workflow);
  console.log('   Size:', (Buffer.byteLength(updateBody) / 1024).toFixed(1) + ' KB');

  const updRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(updateBody) }
  }, updateBody, 3);

  if (updRes.status !== 200) {
    console.error('Upload FAILED:', updRes.status);
    console.error(updRes.data.substring(0, 500));
    return;
  }
  const updWf = JSON.parse(updRes.data).data;
  console.log('   OK:', updWf.name, '| Nodes:', updWf.nodes.length);

  // Set 3-min trigger for test, activate
  console.log('5. Setting test trigger (3 min)...');
  const gr2 = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
  const wf2 = JSON.parse(gr2.data).data;
  const testNodes = wf2.nodes.map(n => n.id === 'schedule-trigger'
    ? { ...n, parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: 3 }] } } }
    : n
  );
  const testBody = JSON.stringify({ name: wf2.name, nodes: testNodes, connections: wf2.connections, settings: wf2.settings, versionId: wf2.versionId });
  const testUpd = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(testBody) } }, testBody, 3);
  const testWf = JSON.parse(testUpd.data).data;
  const actBody = JSON.stringify({ versionId: testWf.versionId });
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/activate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(actBody) } }, actBody);
  console.log('   Activated. Waiting for execution (4 min)...');
  await new Promise(r => setTimeout(r, 240000));

  // Check execution
  console.log('6. Checking execution...');
  const execRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443,
    path: '/rest/executions?workflowId=' + WORKFLOW_ID + '&limit=3',
    method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader }
  }, null);
  let execs = JSON.parse(execRes.data).data?.results || [];
  for (const e of execs) {
    console.log('   #' + e.id + ' | ' + e.status + ' | ' + new Date(e.startedAt).toLocaleString());
  }

  // If still running, wait more
  if (execs[0] && execs[0].status === 'running') {
    console.log('   Still running, waiting 3 more min...');
    await new Promise(r => setTimeout(r, 180000));
    const r2 = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: '/rest/executions?workflowId=' + WORKFLOW_ID + '&limit=3', method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
    execs = JSON.parse(r2.data).data?.results || [];
    for (const e of execs) {
      console.log('   #' + e.id + ' | ' + e.status);
    }
  }

  // Deactivate immediately to prevent second trigger
  console.log('7. Deactivating...');
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/deactivate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': 2 } }, '{}');

  // Check execution details
  const latest = execs.find(e => e.status === 'success' || e.status === 'error');
  if (latest) {
    console.log('8. Checking execution #' + latest.id + '...');
    const detRes = await makeRequest({
      hostname: 'cuhelibbeerank.beget.app', port: 443,
      path: '/rest/executions/' + latest.id,
      method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader }
    }, null);
    const execData = JSON.parse(detRes.data);
    const raw = execData.data?.data || '';
    console.log('   Size:', (raw.length / 1024).toFixed(0) + ' KB');
    console.log('   Status:', latest.status);

    // Search for key indicators
    const hasChoices = raw.includes('"choices"');
    const hasMsgId = raw.includes('"message_id"');
    const hasSkynet = raw.includes('SKYNET');
    const hasError = raw.includes('NodeApiError');
    console.log('   OpenAI choices:', hasChoices);
    console.log('   Telegram message_id:', hasMsgId);
    console.log('   SKYNET in data:', hasSkynet);
    console.log('   NodeApiError:', hasError);

    if (hasError) {
      // Find error context
      const errIdx = raw.indexOf('NodeApiError');
      if (errIdx > -1) console.log('   Error:', raw.substring(errIdx, errIdx + 200));
    }
  }

  // Check Telegram
  console.log('9. Checking Telegram...');
  const tgRes = await makeRequest({
    hostname: 'api.telegram.org', port: 443,
    path: '/bot' + TELEGRAM_TOKEN + '/getUpdates?offset=-5&limit=5',
    method: 'GET', headers: { 'Accept': 'application/json' }
  }, null);
  const tgUpdates = JSON.parse(tgRes.data);
  if (tgUpdates.result) {
    for (const u of tgUpdates.result) {
      if (u.channel_post) {
        const p = u.channel_post;
        const d = new Date(p.date * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
        console.log('   POST (' + d + ', ' + ((p.text || '').length) + ' chars, ID:' + p.message_id + ')');
        if (p.text) console.log(p.text.substring(0, 1000));
      }
    }
  }

  // Restore cron and activate
  console.log('10. Restoring cron (7:00/19:00 MSK)...');
  const gr3 = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
  const wf3 = JSON.parse(gr3.data).data;
  const cronNodes = wf3.nodes.map(n => n.id === 'schedule-trigger'
    ? { ...n, parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 4,16 * * *' }] } } }
    : n
  );
  const cronBody = JSON.stringify({ name: 'Drug Monitor v11 (' + ALL_SOURCES.length + ' sources)', nodes: cronNodes, connections: wf3.connections, settings: wf3.settings, versionId: wf3.versionId });
  const cronUpd = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(cronBody) } }, cronBody, 3);
  const cronWf = JSON.parse(cronUpd.data).data;
  const cronAct = JSON.stringify({ versionId: cronWf.versionId });
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/activate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(cronAct) } }, cronAct);

  console.log('\n=== DONE ===');
  console.log('Architecture: Trigger -> Code(fetch ' + ALL_SOURCES.length + ' RSS) -> Filter -> AI -> Telegram');
  console.log('Schedule: 7:00 & 19:00 MSK');
  console.log('All news in ONE message with source links');
}

main().catch(e => console.error('FATAL:', e.message || e));
