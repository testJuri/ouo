import type { Workflow } from '@/types'
import { errorResponse, successResponse, toApiResponse } from './shared'
import type { ApiResponse } from './shared'

interface ListData<T> {
  list: T[]
  pagination?: {
    page: number
    size: number
    total: number
  }
}

export const workflowsApi = {
  async getAll(
    projectId: number,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<ListData<Workflow>>> {
    return toApiResponse<ListData<Workflow>, never>(
      {
        url: `/projects/${projectId}/canvas-workflows`,
        method: 'GET',
        params,
      },
      { list: [] },
      '获取工作流列表失败'
    ).then((response) =>
      response.success
        ? successResponse(response.data)
        : errorResponse(response.message || '获取工作流列表失败', { list: [] })
    )
  },

  async getById(projectId: number, id: string): Promise<ApiResponse<Workflow | null>> {
    return toApiResponse<Workflow | null>(
      {
        url: `/projects/${projectId}/canvas-workflows/${id}`,
        method: 'GET',
      },
      null,
      '获取工作流详情失败'
    ).then((response) =>
      response.success
        ? successResponse(response.data)
        : errorResponse(response.message || '获取工作流详情失败', null)
    )
  },

  async delete(projectId: number, id: string): Promise<ApiResponse<boolean>> {
    return toApiResponse<true>(
      {
        url: `/projects/${projectId}/canvas-workflows/${id}`,
        method: 'DELETE',
      },
      true,
      '删除工作流失败'
    ).then((response) =>
      response.success ? successResponse(true) : errorResponse(response.message || '删除工作流失败', false)
    )
  },
}
