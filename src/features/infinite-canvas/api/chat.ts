import {
  buildBearerAuthHeader,
  getResponseReader,
  getAppApiConfig,
  getDashScopeCompatibleConfig,
  needBrowserAuthHeader,
  parseJsonResponse,
} from '@/api';
import type { ChatCompletionParams } from '../types';

const getOptionalAuthHeader = (apiKey: string): Record<string, string> => {
  if (!apiKey) {
    return {};
  }

  return buildBearerAuthHeader(apiKey, '请先配置 API Key');
};

// 获取 DashScope 请求 headers
const getDashScopeHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (needBrowserAuthHeader()) {
    const { apiKey } = getDashScopeCompatibleConfig();
    Object.assign(headers, buildBearerAuthHeader(apiKey, '请在设置中配置 DashScope API Key'));
  }
  return headers;
};

// DashScope 流式调用 (qwen-plus 等模型)
export async function* streamDashScopeChatCompletions(
  data: ChatCompletionParams,
  signal?: AbortSignal
): AsyncGenerator<string, void, undefined> {
  const { baseURL } = getDashScopeCompatibleConfig();
  const headers = getDashScopeHeaders();

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...data, stream: true }),
    signal,
  });
  const reader = await getResponseReader(response, 'DashScope 流式请求失败');

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
  const { apiKey, baseURL } = getAppApiConfig();

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getOptionalAuthHeader(apiKey),
    },
    body: JSON.stringify({ ...data, stream: true }),
    signal,
  });
  const reader = await getResponseReader(response, '聊天流式请求失败');

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
  const { apiKey, baseURL } = getAppApiConfig();

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getOptionalAuthHeader(apiKey),
    },
    body: JSON.stringify({ ...data, stream: false }),
  });
  const json = await parseJsonResponse<{ choices?: Array<{ message?: { content?: string } }> }>(
    response,
    '聊天请求失败'
  );
  return json.choices?.[0]?.message?.content || '';
}
