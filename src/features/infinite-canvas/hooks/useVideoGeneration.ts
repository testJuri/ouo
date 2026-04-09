import { useState, useCallback } from 'react';
import { message } from 'antd';
import { 
  generateDashScopeVideo, 
  generateDashScopeT2VVideo, 
  generateDashScopeKF2VVideo, 
  generateDashScopeTemplateEffectVideo,
  isDashScopeT2VModel, 
  isDashScopeI2VModel, 
  isDashScopeKF2VModel 
} from '../api/video';
import type { VideoGenerationParams } from '../types';

interface UseVideoGenerationReturn {
  generate: (params: VideoGenerationParams, onProgress?: (status: string) => void) => Promise<string | null>;
  loading: boolean;
  error: string | null;
  status: string;
}

export function useVideoGeneration(): UseVideoGenerationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const generate = useCallback(async (
    params: VideoGenerationParams,
    onProgress?: (status: string) => void
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setStatus('准备中...');

    const handleProgress = (taskStatus: string) => {
      const statusMap: Record<string, string> = {
        'PENDING': '任务排队中...',
        'RUNNING': '视频生成中...',
        'SUCCEEDED': '生成完成！',
        'FAILED': '生成失败',
      };
      const displayStatus = statusMap[taskStatus] || taskStatus;
      setStatus(displayStatus);
      onProgress?.(displayStatus);
    };

    try {
      let videoUrl: string;

      // 视频特效模式（有 template 参数）
      if (params.template && params.first_frame_image) {
        videoUrl = await generateDashScopeTemplateEffectVideo(
          params.first_frame_image,
          params.template,
          params.resolution || '720P',
          params.model,
          handleProgress
        );
      } else if (isDashScopeT2VModel(params.model)) {
        // 文生视频
        videoUrl = await generateDashScopeT2VVideo(
          params.prompt,
          params.size || '1280*720',
          params.seconds || 5,
          params.model,
          handleProgress
        );
      } else if (isDashScopeKF2VModel(params.model)) {
        // 关键帧生视频
        videoUrl = await generateDashScopeKF2VVideo(
          params.prompt,
          params.first_frame_image || '',
          params.last_frame_image || '',
          params.resolution || '720P',
          params.model,
          handleProgress
        );
      } else if (isDashScopeI2VModel(params.model)) {
        // 图生视频
        videoUrl = await generateDashScopeVideo(
          params.prompt,
          params.first_frame_image || '',
          params.resolution || '720P',
          params.seconds || 5,
          params.model,
          handleProgress
        );
      } else {
        throw new Error(`不支持的模型: ${params.model}`);
      }
        
      message.success('视频生成完成！');
      setLoading(false);
      setStatus('');
      return videoUrl;
    } catch (err: unknown) {
      const is429 = err instanceof Error && (err.message.includes('429') || (err as { response?: { status?: number } }).response?.status === 429);
      const errorMessage = is429 
        ? 'API_RATE_LIMIT' 
        : (err instanceof Error ? err.message : '视频生成失败');
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
