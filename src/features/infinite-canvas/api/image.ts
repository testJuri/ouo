import axios from 'axios';
import { message } from 'antd';
import type { ImageGenerationParams, DashScopeSubmitResponse, DashScopeTaskResult } from '../types';

// DashScope API base URL (阿里百炼正式地址)
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1';

// 错误消息映射表 - 将服务端英文错误转换为中文
const errorMessageMap: Record<string, string> = {
  'For i2i model, the last message must contain exactly one text content item': '图生图模式需要输入提示词描述',
  'Got 0 text items': '请输入提示词描述',
  'rate limit exceeded': '请求过于频繁，请稍后重试',
  'invalid api key': 'API Key 无效，请检查配置',
  'insufficient quota': '配额不足，请检查账户余额',
  'InvalidParameter': '参数无效',
  'Throttling': '请求过于频繁，请稍后重试',
  'inappropriate content': '输入内容可能包含不当内容，请修改后重试',
  'Input data may contain inappropriate content': '输入内容可能包含不当内容，请修改后重试',
  'DataInspectionFailed': '内容审核未通过，请修改后重试',
};

// 翻译错误消息
const translateErrorMessage = (msg: string): string => {
  if (!msg) return '请求失败';
  // 完全匹配
  if (errorMessageMap[msg]) {
    return errorMessageMap[msg];
  }
  // 部分匹配
  for (const [key, value] of Object.entries(errorMessageMap)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return msg;
};

// Create DashScope axios instance
const dashscopeRequest = axios.create({
  baseURL: DASHSCOPE_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// DashScope 响应拦截器 - 转换错误消息为中文
dashscopeRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const rawMessage = error.response?.data?.message || error.response?.data?.error?.message || error.message || '请求失败';
    const errorMessage = translateErrorMessage(rawMessage);
    message.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Get API key from localStorage
const getDashScopeApiKey = (): string => {
  return localStorage.getItem('dashscopeApiKey') || '';
};

// 判断是否需要前端携带 Authorization header
// 开发模式或 HTTPS 时需要，生产 HTTP 由 Nginx 注入
const needAuthHeader = (): boolean => {
  return (import.meta as any).env?.DEV || window.location.protocol === 'https:';
};

// 获取请求 headers
const getAuthHeaders = (): Record<string, string> => {
  if (!needAuthHeader()) {
    return {};
  }
  const apiKey = getDashScopeApiKey();
  if (!apiKey) {
    throw new Error('请在设置中配置 DashScope API Key');
  }
  return { Authorization: `Bearer ${apiKey}` };
};

// Check if model is DashScope model
export const isDashScopeModel = (model: string): boolean => {
  return model.startsWith('wan');
};

// Check if model is image-to-image model
export const isDashScopeI2IModel = (model: string): boolean => {
  return model === 'wan2.6-image';
};

// Submit DashScope image generation task (text-to-image)
export async function submitDashScopeImageTask(
  prompt: string,
  size: string = '1280*1280',
  model: string = 'wan2.6-t2i'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const response = await dashscopeRequest.post<DashScopeSubmitResponse>(
    '/services/aigc/image-generation/generation',
    {
      model,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      parameters: {
        prompt_extend: false,
        watermark: false,
        n: 1,
        negative_prompt: '',
        size,
      },
    },
    {
      headers: {
        ...authHeaders,
        'X-DashScope-Async': 'enable',
      },
    }
  );

  const result = response.data;
  if (!result.output?.task_id) {
    throw new Error('提交任务失败：未返回任务ID');
  }

  return result.output.task_id;
}

// Poll DashScope task status
export async function pollDashScopeTask(
  taskId: string,
  onProgress?: (status: string) => void
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const maxAttempts = 120; // Max 2 minutes with 1s interval
  const pollInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await dashscopeRequest.get<DashScopeTaskResult>(
      `/tasks/${taskId}`,
      {
        headers: authHeaders,
      }
    );

    const result = response.data;
    const status = result.output?.task_status;

    onProgress?.(status || 'UNKNOWN');

    if (status === 'SUCCEEDED') {
      const choices = result.output?.choices;
      if (choices && choices.length > 0) {
        const imageContent = choices[0].message?.content?.find(
          (c) => c.type === 'image' && c.image
        );
        if (imageContent?.image) {
          return imageContent.image;
        }
      }
      throw new Error('生成成功但未找到图片URL');
    }

    if (status === 'FAILED') {
      const rawMessage = result.output?.message || '图片生成失败';
      throw new Error(translateErrorMessage(rawMessage));
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('任务超时，请稍后重试');
}

// Generate image using DashScope API (complete flow)
export async function generateDashScopeImage(
  prompt: string,
  size: string = '1280*1280',
  model: string = 'wan2.6-t2i',
  onProgress?: (status: string) => void
): Promise<string> {
  // Submit task
  const taskId = await submitDashScopeImageTask(prompt, size, model);
  onProgress?.('PENDING');

  // Poll for result
  const imageUrl = await pollDashScopeTask(taskId, onProgress);
  return imageUrl;
}

// Submit DashScope image-to-image task
export async function submitDashScopeI2ITask(
  prompt: string,
  images: string[],
  size: string = '1280*1280',
  model: string = 'wan2.6-image'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  // Build content array with text and images
  const content: Array<{ text?: string; image?: string }> = [];
  
  // Add prompt text
  if (prompt) {
    content.push({ text: prompt });
  }
  
  // Add reference images
  images.forEach((imageUrl) => {
    content.push({ image: imageUrl });
  });

  const response = await dashscopeRequest.post<DashScopeSubmitResponse>(
    '/services/aigc/image-generation/generation',
    {
      model,
      input: {
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      },
      parameters: {
        prompt_extend: false,
        watermark: false,
        n: 1,
        enable_interleave: false,
        size,
      },
    },
    {
      headers: {
        ...authHeaders,
        'X-DashScope-Async': 'enable',
      },
    }
  );

  const result = response.data;
  if (!result.output?.task_id) {
    throw new Error('提交任务失败：未返回任务ID');
  }

  return result.output.task_id;
}

// Generate image using DashScope I2I API (complete flow)
export async function generateDashScopeI2IImage(
  prompt: string,
  images: string[],
  size: string = '1280*1280',
  model: string = 'wan2.6-image',
  onProgress?: (status: string) => void
): Promise<string> {
  // Submit task
  const taskId = await submitDashScopeI2ITask(prompt, images, size, model);
  onProgress?.('PENDING');

  // Poll for result
  const imageUrl = await pollDashScopeTask(taskId, onProgress);
  return imageUrl;
}

// Legacy generateImage function for backward compatibility
export async function generateImage(params: ImageGenerationParams): Promise<{ url: string }[]> {
  if (isDashScopeModel(params.model)) {
    // Convert size format from 2048x2048 to 1280*1280
    const size = params.size.replace('x', '*');
    const imageUrl = await generateDashScopeImage(params.prompt, size, params.model);
    return [{ url: imageUrl }];
  }
  
  // Fallback to original API (can be extended for other providers)
  throw new Error(`不支持的模型: ${params.model}`);
}
