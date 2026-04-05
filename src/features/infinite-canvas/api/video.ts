import axios from 'axios';
import type { VideoGenerationParams } from '../types';

// DashScope API base URL (通过 Vite 代理)
const DASHSCOPE_BASE_URL = '/dashscope-api';

// 错误消息映射表 - 将服务端英文错误转换为中文
const errorMessageMap: Record<string, string> = {
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

// Get API key from localStorage
const getDashScopeApiKey = (): string => {
  return localStorage.getItem('dashscopeApiKey') || '';
};

// 判断是否需要前端携带 Authorization header
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

// DashScope 图生视频响应类型
interface DashScopeVideoSubmitResponse {
  output: {
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    task_id: string;
  };
  request_id: string;
}

interface DashScopeVideoTaskResult {
  request_id: string;
  output: {
    task_id: string;
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    submit_time?: string;
    scheduled_time?: string;
    end_time?: string;
    orig_prompt?: string;
    video_url?: string;
    code?: string;
    message?: string;
  };
  usage?: {
    duration?: number;
    input_video_duration?: number;
    output_video_duration?: number;
    video_count?: number;
    SR?: number;
  };
}

// Check if model is DashScope video model
export const isDashScopeVideoModel = (model: string): boolean => {
  return model.startsWith('wan') && (model.includes('i2v') || model.includes('t2v'));
};

export const isDashScopeT2VModel = (model: string): boolean => {
  return model.startsWith('wan') && model.includes('t2v');
};

export const isDashScopeI2VModel = (model: string): boolean => {
  return model.startsWith('wan') && model.includes('i2v');
};

export const isDashScopeKF2VModel = (model: string): boolean => {
  return model.startsWith('wan') && model.includes('kf2v');
};

// Submit DashScope video generation task
export async function submitDashScopeVideoTask(
  prompt: string,
  imageUrl: string,
  resolution: string = '720P',
  duration: number = 5,
  model: string = 'wan2.6-i2v-flash'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const response = await dashscopeRequest.post<DashScopeVideoSubmitResponse>(
    '/services/aigc/video-generation/video-synthesis',
    {
      model,
      input: {
        prompt,
        img_url: imageUrl,
      },
      parameters: {
        resolution,
        prompt_extend: false,
        duration,
        shot_type: 'multi',
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

// Poll DashScope video task status
export async function pollDashScopeVideoTask(
  taskId: string,
  onProgress?: (status: string) => void
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const maxAttempts = 180; // Max 15 minutes with 5s interval
  const pollInterval = 5000; // 5 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await dashscopeRequest.get<DashScopeVideoTaskResult>(
      `/tasks/${taskId}`,
      {
        headers: authHeaders,
      }
    );

    const result = response.data;
    const status = result.output?.task_status;

    onProgress?.(status || 'UNKNOWN');

    if (status === 'SUCCEEDED') {
      const videoUrl = result.output?.video_url;
      if (videoUrl) {
        return videoUrl;
      }
      throw new Error('生成成功但未找到视频URL');
    }

    if (status === 'FAILED') {
      const rawMessage = result.output?.message || '视频生成失败';
      throw new Error(translateErrorMessage(rawMessage));
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('任务超时，请稍后重试');
}

// Generate video using DashScope API (complete flow)
export async function generateDashScopeVideo(
  prompt: string,
  imageUrl: string,
  resolution: string = '720P',
  duration: number = 5,
  model: string = 'wan2.6-i2v-flash',
  onProgress?: (status: string) => void
): Promise<string> {
  // Submit task
  const taskId = await submitDashScopeVideoTask(prompt, imageUrl, resolution, duration, model);
  onProgress?.('PENDING');

  // Poll for result
  const videoUrl = await pollDashScopeVideoTask(taskId, onProgress);
  return videoUrl;
}

// Submit DashScope T2V (text-to-video) task
export async function submitDashScopeT2VTask(
  prompt: string,
  size: string = '1280*720',
  duration: number = 5,
  model: string = 'wan2.6-t2v'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const response = await dashscopeRequest.post<DashScopeVideoSubmitResponse>(
    '/services/aigc/video-generation/video-synthesis',
    {
      model,
      input: {
        prompt,
      },
      parameters: {
        size,
        prompt_extend: true,
        duration,
        shot_type: 'multi',
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

// Generate T2V video using DashScope API (complete flow)
export async function generateDashScopeT2VVideo(
  prompt: string,
  size: string = '1280*720',
  duration: number = 5,
  model: string = 'wan2.6-t2v',
  onProgress?: (status: string) => void
): Promise<string> {
  // Submit task
  const taskId = await submitDashScopeT2VTask(prompt, size, duration, model);
  onProgress?.('PENDING');

  // Poll for result (reuse the same polling function)
  const videoUrl = await pollDashScopeVideoTask(taskId, onProgress);
  return videoUrl;
}

// Submit DashScope KF2V (关键帧生视频) task
export async function submitDashScopeKF2VTask(
  prompt: string,
  firstFrameUrl: string,
  lastFrameUrl: string,
  resolution: string = '720P',
  model: string = 'wan2.2-kf2v-flash'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const response = await dashscopeRequest.post<DashScopeVideoSubmitResponse>(
    '/services/aigc/image2video/video-synthesis',
    {
      model,
      input: {
        first_frame_url: firstFrameUrl,
        last_frame_url: lastFrameUrl,
        prompt,
      },
      parameters: {
        resolution,
        prompt_extend: false,
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

// Generate KF2V video using DashScope API (complete flow)
export async function generateDashScopeKF2VVideo(
  prompt: string,
  firstFrameUrl: string,
  lastFrameUrl: string,
  resolution: string = '720P',
  model: string = 'wan2.2-kf2v-flash',
  onProgress?: (status: string) => void
): Promise<string> {
  // Submit task
  const taskId = await submitDashScopeKF2VTask(prompt, firstFrameUrl, lastFrameUrl, resolution, model);
  onProgress?.('PENDING');

  // Poll for result (reuse the same polling function)
  const videoUrl = await pollDashScopeVideoTask(taskId, onProgress);
  return videoUrl;
}

// Submit DashScope Template Effect (视频特效) task
export async function submitDashScopeTemplateEffectTask(
  imageUrl: string,
  template: string,
  resolution: string = '720P',
  model: string = 'wan2.6-i2v-flash'
): Promise<string> {
  const authHeaders = getAuthHeaders();

  const response = await dashscopeRequest.post<DashScopeVideoSubmitResponse>(
    '/services/aigc/video-generation/video-synthesis',
    {
      model,
      input: {
        img_url: imageUrl,
        template,
      },
      parameters: {
        resolution,
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

// Generate Template Effect video using DashScope API (complete flow)
export async function generateDashScopeTemplateEffectVideo(
  imageUrl: string,
  template: string,
  resolution: string = '720P',
  model: string = 'wan2.6-i2v-flash',
  onProgress?: (status: string) => void
): Promise<string> {
  const taskId = await submitDashScopeTemplateEffectTask(imageUrl, template, resolution, model);
  onProgress?.('PENDING');

  const videoUrl = await pollDashScopeVideoTask(taskId, onProgress);
  return videoUrl;
}

// Legacy function for backward compatibility
export async function generateVideo(params: VideoGenerationParams): Promise<{ video_url: string }> {
  // 视频特效模式（有 template 参数）
  if (params.template && params.first_frame_image) {
    const videoUrl = await generateDashScopeTemplateEffectVideo(
      params.first_frame_image,
      params.template,
      params.resolution || '720P',
      params.model
    );
    return { video_url: videoUrl };
  }

  if (isDashScopeT2VModel(params.model)) {
    // 文生视频
    const videoUrl = await generateDashScopeT2VVideo(
      params.prompt,
      params.size || '1280*720',
      params.seconds || 5,
      params.model
    );
    return { video_url: videoUrl };
  }
  
  if (isDashScopeKF2VModel(params.model)) {
    // 关键帧生视频
    const videoUrl = await generateDashScopeKF2VVideo(
      params.prompt,
      params.first_frame_image || '',
      params.last_frame_image || '',
      params.resolution || '720P',
      params.model
    );
    return { video_url: videoUrl };
  }
  
  if (isDashScopeI2VModel(params.model)) {
    // 图生视频
    const videoUrl = await generateDashScopeVideo(
      params.prompt,
      params.first_frame_image || '',
      params.resolution || '720P',
      params.seconds || 5,
      params.model
    );
    return { video_url: videoUrl };
  }
  
  throw new Error(`不支持的模型: ${params.model}`);
}
