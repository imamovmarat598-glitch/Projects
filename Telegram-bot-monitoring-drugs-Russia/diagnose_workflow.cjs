const https = require('https');

const N8N_URL = 'cuhelibbeerank.beget.app';
const N8N_EMAIL = 'Imamovmarat598@gmail.com';
const N8N_PASSWORD = 'M@maiko17081988!';
const WORKFLOW_ID = 'cQeB8MAZTXagmbBx'; // ULTRA-FAST 15 Sources

console.log('🔍 Диагностика Drug Monitor workflow\n');

function login() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({emailOrLdapLoginId:N8N_EMAIL,password:N8N_PASSWORD});
    const req = https.request({hostname:N8N_URL,path:'/rest/login',method:'POST',headers:{'Content-Type':'application/json'}}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(res.headers['set-cookie']));
    });
    req.write(postData);
    req.end();
  });
}

function getWorkflow(id, cookies) {
  return new Promise((resolve) => {
    https.request({hostname:N8N_URL,path:`/rest/workflows/${id}`,method:'GET',headers:{'Cookie':cookies.join('; ')}}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.data || result);
        } catch(e) {
          resolve(null);
        }
      });
    }).end();
  });
}

function getExecutions(workflowId, cookies) {
  return new Promise((resolve) => {
    https.request({hostname:N8N_URL,path:`/rest/executions?filter={"workflowId":"${workflowId}"}&limit=5`,method:'GET',headers:{'Cookie':cookies.join('; ')}}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.data || []);
        } catch(e) {
          resolve([]);
        }
      });
    }).end();
  });
}

(async () => {
  try {
    console.log('1. Авторизация...');
    const cookies = await login();
    console.log('   ✅\n');

    console.log('2. Получение workflow...');
    const wf = await getWorkflow(WORKFLOW_ID, cookies);
    if (!wf) {
      console.log('   ❌ Не найден\n');
      return;
    }
    console.log(`   ✅ ${wf.name}`);
    console.log(`   Active: ${wf.active ? '✅' : '❌'}`);
    console.log(`   Nodes: ${wf.nodes?.length || 0}\n`);

    console.log('3. Проверка узлов:');
    if (wf.nodes) {
      // Проверяем ключевые узлы
      const mergeNode = wf.nodes.find(n => n.name?.includes('Merge') || n.type === 'n8n-nodes-base.merge');
      const aiNode = wf.nodes.find(n => n.name?.includes('AI') || n.name?.includes('OpenAI'));
      const telegramNode = wf.nodes.find(n => n.type === 'n8n-nodes-base.telegram');

      if (mergeNode) {
        const timeout = mergeNode.settings?.timeout || 3000;
        console.log(`   Merge: timeout = ${timeout}ms ${timeout < 30000 ? '⚠️  (слишком мало!)' : '✅'}`);
      }

      if (aiNode) {
        const timeout = aiNode.settings?.timeout || 10000;
        const maxTokens = aiNode.parameters?.options?.maxTokens || 2000;
        console.log(`   AI: timeout = ${timeout}ms ${timeout < 60000 ? '⚠️  (слишком мало!)' : '✅'}`);
        console.log(`   AI: maxTokens = ${maxTokens} ${maxTokens > 1500 ? '⚠️  (слишком много!)' : '✅'}`);
      }

      if (telegramNode) {
        const timeout = telegramNode.settings?.timeout || 3000;
        console.log(`   Telegram: timeout = ${timeout}ms ${timeout < 30000 ? '⚠️  (слишком мало!)' : '✅'}`);
      }
    }
    console.log('');

    console.log('4. Последние выполнения:');
    const executions = await getExecutions(WORKFLOW_ID, cookies);

    if (executions.length === 0) {
      console.log('   Нет записей о выполнении\n');
    } else {
      executions.forEach((exec, i) => {
        const status = exec.finished ? '✅' : (exec.stoppedAt ? '❌' : '⏳');
        const date = new Date(exec.startedAt).toLocaleString('ru-RU');
        console.log(`   ${i+1}. ${status} ${date}`);
        if (exec.stoppedAt && !exec.finished) {
          console.log(`      ❌ Остановлен с ошибкой`);
          if (exec.data?.resultData?.error) {
            console.log(`      Ошибка: ${exec.data.resultData.error.message}`);
          }
        }
      });
      console.log('');
    }

    console.log('='.repeat(60));
    console.log('РЕКОМЕНДАЦИИ:');
    console.log('='.repeat(60));
    console.log('');

    if (mergeNode && (mergeNode.settings?.timeout || 3000) < 30000) {
      console.log('⚠️  УВЕЛИЧЬТЕ timeout в Merge node до 30000ms');
    }

    if (aiNode && (aiNode.settings?.timeout || 10000) < 60000) {
      console.log('⚠️  УВЕЛИЧЬТЕ timeout в AI node до 60000ms');
    }

    if (aiNode && (aiNode.parameters?.options?.maxTokens || 2000) > 1500) {
      console.log('⚠️  УМЕНЬШИТЕ maxTokens в AI node до 1500');
    }

    console.log('');
    console.log('Откройте workflow в браузере для настройки:');
    console.log(`https://cuhelibbeerank.beget.app/workflow/${WORKFLOW_ID}`);
    console.log('');

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
})();
