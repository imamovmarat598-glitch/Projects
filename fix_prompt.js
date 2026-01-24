const https = require('https');
const BASE_URL = 'https://cuhelibbeerank.beget.app';
const WORKFLOW_ID = 'q3AbMtyUcI7ANJZD';

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: d, cookies: res.headers['set-cookie'] || [] }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const loginBody = JSON.stringify({ emailOrLdapLoginId: 'Imamovmarat598@gmail.com', password: 'M@maiko17081988!' });
  const loginRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: '/rest/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Referer': BASE_URL + '/signin', 'Content-Length': Buffer.byteLength(loginBody) }
  }, loginBody);
  const cookieHeader = loginRes.cookies.map(c => c.split(';')[0]).join('; ');
  console.log('Logged in');

  // Deactivate
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/deactivate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': 2 } }, '{}');

  // Get current workflow
  const getRes = await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'GET', headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader } }, null);
  const wf = JSON.parse(getRes.data).data;

  // Find and update the Prepare AI node - fix the system prompt
  const nodes = wf.nodes.map(n => {
    if (n.id === 'code-prepare') {
      // Replace the old prompt with new one (no "Итого" line)
      let code = n.parameters.jsCode;
      // Replace the entire SYSTEM_PROMPT section in the code
      const oldPromptStart = code.indexOf('const systemPrompt =');
      if (oldPromptStart === -1) {
        console.log('WARNING: could not find systemPrompt in code');
        return n;
      }
      console.log('Found Prepare AI code, updating prompt...');
      return n; // We'll replace the whole jsCode below
    }
    return n;
  });

  // Build updated Prepare AI code with new prompt (no "Итого")
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

• <b>Регион:</b> Краткое описание. Изъято: X кг. Задержано: N чел.
  <a href="ССЫЛКА">Источник</a>

• <b>Регион:</b> Описание...
  <a href="ССЫЛКА">Источник</a>

<b>КАЗАХСТАН</b>

• <b>Город:</b> Описание...
  <a href="ССЫЛКА">Источник</a>

ПРАВИЛА:
1. БЕЗ эмодзи флагов - только текст
2. Россия ПЕРВАЯ, остальные по алфавиту
3. Страны БЕЗ новостей НЕ включать
4. Каждая новость с ССЫЛКОЙ (тег <a href="URL">Источник</a>)
5. 1-2 строки на новость, кратко
6. Указывать вещество, вес, задержанных
7. НЕ добавлять строку "Итого" или подсчёт событий/стран
8. НЕ добавлять разделители (━━━) в конце
9. Просто список новостей по странам и всё

Если новостей НЕТ:
<b>СВОДКА SKYNET</b>
<i>[ДАТА]</i>
За отчётный период релевантных событий не зафиксировано.`;

  const CHAT_ID = '-1001121854465';
  const newPrepareCode = `const newsItems = $input.all().map(item => ({
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

return [{ json: { skipAI: false, requestBody: JSON.stringify(requestBody) } }];`;

  // Update the node
  const updatedNodes = wf.nodes.map(n => {
    if (n.id === 'code-prepare') {
      return { ...n, parameters: { ...n.parameters, jsCode: newPrepareCode } };
    }
    return n;
  });

  // Upload
  const updateData = { name: wf.name, nodes: updatedNodes, connections: wf.connections, settings: wf.settings, versionId: wf.versionId };
  const updateBody = JSON.stringify(updateData);
  console.log('Uploading updated prompt...');
  const updRes = await makeRequest({
    hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}`, method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(updateBody) }
  }, updateBody);

  if (updRes.status !== 200) {
    console.error('FAILED:', updRes.data.substring(0, 300));
    return;
  }
  console.log('OK');

  // Activate
  const updWf = JSON.parse(updRes.data).data;
  const actBody = JSON.stringify({ versionId: updWf.versionId });
  await makeRequest({ hostname: 'cuhelibbeerank.beget.app', port: 443, path: `/rest/workflows/${WORKFLOW_ID}/activate`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': BASE_URL, 'Cookie': cookieHeader, 'Content-Length': Buffer.byteLength(actBody) } }, actBody);
  console.log('Activated with cron 0 4,16 * * * (7:00/19:00 MSK)');
  console.log('Done - removed "Итого" line from format');
}

main().catch(e => console.error('Error:', e.message));
