import type { ChatCompletionParams } from '../types';

// 判断是否需要前端携带 Authorization header
const needAuthHeader = (): boolean => {
  return (import.meta as any).env?.DEV || window.location.protocol === 'https:';
};

const getApiConfig = () => {
  const apiKey = localStorage.getItem('apiKey') || '';
  const apiBaseUrl = localStorage.getItem('apiBaseUrl') || '/v1';
  return { apiKey, apiBaseUrl };
};

const getDashScopeConfig = () => {
  const apiKey = localStorage.getItem('dashscopeApiKey') || '';
  const apiBaseUrl = '/dashscope-compatible'; // 通过 Vite 代理
  return { apiKey, apiBaseUrl };
};

// 获取 DashScope 请求 headers
const getDashScopeHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (needAuthHeader()) {
    const { apiKey } = getDashScopeConfig();
    if (!apiKey) {
      throw new Error('请在设置中配置 DashScope API Key');
    }
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  return headers;
};

// DashScope 流式调用 (qwen-plus 等模型)
export async function* streamDashScopeChatCompletions(
  data: ChatCompletionParams,
  signal?: AbortSignal
): AsyncGenerator<string, void, undefined> {
  const { apiBaseUrl } = getDashScopeConfig();
  const headers = getDashScopeHeaders();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...data, stream: true }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`请求失败: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function* streamChatCompletions(
  data: ChatCompletionParams,
  signal?: AbortSignal
): AsyncGenerator<string, void, undefined> {
  const { apiKey, apiBaseUrl } = getApiConfig();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ ...data, stream: true }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function chatCompletions(data: ChatCompletionParams): Promise<string> {
  const { apiKey, apiBaseUrl } = getApiConfig();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ ...data, stream: false }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || '';
}
