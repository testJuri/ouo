import { useState, useCallback } from 'react';
import { message } from 'antd';
import { generateImage, generateDashScopeImage, generateDashScopeI2IImage, isDashScopeModel, isDashScopeI2IModel } from '../api/image';
import type { ImageGenerationParams } from '../types';

interface UseImageGenerationReturn {
  generate: (params: ImageGenerationParams, onProgress?: (status: string) => void) => Promise<string[] | null>;
  loading: boolean;
  error: string | null;
  status: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const generate = useCallback(async (
    params: ImageGenerationParams,
    onProgress?: (status: string) => void
  ): Promise<string[] | null> => {
    setLoading(true);
    setError(null);
    setStatus('准备中...');

    try {
      // Check if using DashScope model
      if (isDashScopeModel(params.model)) {
        // Convert size format from 2048x2048 to 1280*1280
        const size = params.size.replace('x', '*');
        
        let imageUrl: string;
        
        // Check if it's image-to-image model
        if (isDashScopeI2IModel(params.model)) {
          // Image-to-image mode: requires reference images
          const refImages = params.images || [];
          if (refImages.length === 0) {
            throw new Error('图生图模式需要输入参考图片');
          }
          imageUrl = await generateDashScopeI2IImage(
            params.prompt,
            refImages,
            size,
            params.model,
            (taskStatus) => {
              const statusMap: Record<string, string> = {
                'PENDING': '任务排队中...',
                'RUNNING': '图片生成中...',
                'SUCCEEDED': '生成完成！',
                'FAILED': '生成失败',
              };
              const displayStatus = statusMap[taskStatus] || taskStatus;
              setStatus(displayStatus);
              onProgress?.(displayStatus);
            }
          );
        } else {
          // Text-to-image mode
          imageUrl = await generateDashScopeImage(
            params.prompt,
            size,
            params.model,
            (taskStatus) => {
              const statusMap: Record<string, string> = {
                'PENDING': '任务排队中...',
                'RUNNING': '图片生成中...',
                'SUCCEEDED': '生成完成！',
                'FAILED': '生成失败',
              };
              const displayStatus = statusMap[taskStatus] || taskStatus;
              setStatus(displayStatus);
              onProgress?.(displayStatus);
            }
          );
        }
        
        setLoading(false);
        setStatus('');
        return [imageUrl];
      }

      // Use legacy API for other models
      const result = await generateImage(params);
      setLoading(false);
      setStatus('');
      return result.map((item) => item.url);
    } catch (err: unknown) {
      const is429 = err instanceof Error && (err.message.includes('429') || (err as { response?: { status?: number } }).response?.status === 429);
      const errorMessage = is429 
        ? 'API_RATE_LIMIT' 
        : (err instanceof Error ? err.message : '图片生成失败');
      setError(errorMessage);
      setStatus('');
      if (!is429) {
        message.error(errorMessage);
      }
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return { generate, loading, error, status };
}
