import { dashscopeClient } from '@/api';
import type { ImageGenerationParams, DashScopeSubmitResponse, DashScopeTaskResult } from '../types';

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
  const response = await dashscopeClient.post<DashScopeSubmitResponse>(
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
  const maxAttempts = 120; // Max 2 minutes with 1s interval
  const pollInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await dashscopeClient.get<DashScopeTaskResult>(`/tasks/${taskId}`);

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
      throw new Error(result.output?.message || '图片生成失败');
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

  const response = await dashscopeClient.post<DashScopeSubmitResponse>(
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
