import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, { Background, MiniMap, useReactFlow, ReactFlowProvider, SelectionMode } from 'reactflow';
import {
  ArrowLeftOutlined,
  DownOutlined,
  SettingOutlined,
  PlusOutlined,
  AppstoreOutlined,
  UndoOutlined,
  RedoOutlined,
  AimOutlined,
  MinusOutlined,
  FileTextOutlined,
  PictureOutlined,
  BgColorsOutlined,
  VideoCameraOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  SunOutlined,
  MoonOutlined,
  DragOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  AlignCenterOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons';
import { message, Modal } from 'antd';
import 'reactflow/dist/style.css';

import { useCanvasStore } from './stores/canvasStore';
import { useProjectsStore } from './stores/projectsStore';
import { useThemeStore } from './stores/themeStore';

import TextNode from './components/nodes/TextNode';
import ImageNode from './components/nodes/ImageNode';
import ImageConfigNode from './components/nodes/ImageConfigNode';
import VideoNode from './components/nodes/VideoNode';
import VideoConfigNode from './components/nodes/VideoConfigNode';
import EffectConfigNode from './components/nodes/EffectConfigNode';
import TemplateEffectNode from './components/nodes/TemplateEffectNode';
import PromptOrderEdge from './components/edges/PromptOrderEdge';
import ImageRoleEdge from './components/edges/ImageRoleEdge';
import ApiSettings from './components/ApiSettings';
import WorkflowPanel from './components/WorkflowPanel';
import { RadialMenu, MenuItem } from './components/RadialMenu';

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  imageConfig: ImageConfigNode,
  video: VideoNode,
  videoConfig: VideoConfigNode,
  effectConfig: EffectConfigNode,
  templateEffect: TemplateEffectNode,
};

const edgeTypes = {
  promptOrder: PromptOrderEdge,
  imageRole: ImageRoleEdge,
};

const CanvasInner: React.FC = () => {
  const { projectId, episodeId } = useParams<{ projectId: string; episodeId: string }>();
  const navigate = useNavigate();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasProjectId = projectId && episodeId ? `episode-${projectId}-${episodeId}` : undefined;

  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    loadProject,
    saveProject,
    updateViewport,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasStore();

  const { projects, getProjectCanvas, updateProjectCanvas, initProjects } = useProjectsStore();
  const { isDark, toggleTheme } = useThemeStore();

  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const showGrid = true;
  const [isLocked, setIsLocked] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const projectName = projects.find((p) => p.id === canvasProjectId)?.name || `片段 ${episodeId || ''} 画布`;

  // 直接从 nodes 中计算选中的节点
  const selectedNodes = useMemo(() => {
    return nodes.filter(n => (n as any).selected).map(n => n.id);
  }, [nodes]);

  // 获取选中的节点数据
  const selectedNodesData = useMemo(() => {
    return nodes.filter(n => (n as any).selected);
  }, [nodes]);

  // 对齐功能
  const alignNodes = useCallback((alignment: 'left' | 'right' | 'top' | 'bottom' | 'horizontal-center' | 'vertical-center') => {
    if (selectedNodesData.length < 2) return;

    const positions = selectedNodesData.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: (n as any).width || (n as any).measured?.width || 280,
      height: (n as any).height || (n as any).measured?.height || 200,
    }));

    let newPositions: { id: string; x: number; y: number }[] = [];

    switch (alignment) {
      case 'left': {
        const minX = Math.min(...positions.map(p => p.x));
        newPositions = positions.map(p => ({ id: p.id, x: minX, y: p.y }));
        break;
      }
      case 'right': {
        const maxRight = Math.max(...positions.map(p => p.x + p.width));
        newPositions = positions.map(p => ({ id: p.id, x: maxRight - p.width, y: p.y }));
        break;
      }
      case 'top': {
        const minY = Math.min(...positions.map(p => p.y));
        newPositions = positions.map(p => ({ id: p.id, x: p.x, y: minY }));
        break;
      }
      case 'bottom': {
        const maxBottom = Math.max(...positions.map(p => p.y + p.height));
        newPositions = positions.map(p => ({ id: p.id, x: p.x, y: maxBottom - p.height }));
        break;
      }
      case 'horizontal-center': {
        const centerY = positions.reduce((sum, p) => sum + p.y + p.height / 2, 0) / positions.length;
        newPositions = positions.map(p => ({ id: p.id, x: p.x, y: centerY - p.height / 2 }));
        break;
      }
      case 'vertical-center': {
        const centerX = positions.reduce((sum, p) => sum + p.x + p.width / 2, 0) / positions.length;
        newPositions = positions.map(p => ({ id: p.id, x: centerX - p.width / 2, y: p.y }));
        break;
      }
    }

    // 更新节点位置
    const updatedNodes = nodes.map(node => {
      const newPos = newPositions.find(p => p.id === node.id);
      if (newPos) {
        return { ...node, position: { x: newPos.x, y: newPos.y } };
      }
      return node;
    });

    useCanvasStore.setState({ nodes: updatedNodes });
    useCanvasStore.getState().saveHistory();
    message.success('节点已对齐');
  }, [selectedNodesData, nodes]);

  // 智能自动对齐并铺开：根据连线关系按执行顺序排列
  const autoAlignNodes = useCallback(() => {
    if (selectedNodesData.length < 2) return;

    const selectedIds = new Set(selectedNodesData.map(n => n.id));
    
    // 获取选中节点之间的连线
    const relevantEdges = edges.filter(
      e => selectedIds.has(e.source) && selectedIds.has(e.target)
    );

    // 拓扑排序：按执行顺序排列节点
    const inDegree: Record<string, number> = {};
    const outEdges: Record<string, string[]> = {};
    
    selectedNodesData.forEach(n => {
      inDegree[n.id] = 0;
      outEdges[n.id] = [];
    });
    
    relevantEdges.forEach(e => {
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
      outEdges[e.source] = outEdges[e.source] || [];
      outEdges[e.source].push(e.target);
    });

    // BFS 拓扑排序
    const sorted: string[] = [];
    const queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      sorted.push(nodeId);
      (outEdges[nodeId] || []).forEach(targetId => {
        inDegree[targetId]--;
        if (inDegree[targetId] === 0) {
          queue.push(targetId);
        }
      });
    }

    // 如果有节点未被排序（无连线或循环），追加到末尾
    selectedNodesData.forEach(n => {
      if (!sorted.includes(n.id)) {
        sorted.push(n.id);
      }
    });

    const positions = selectedNodesData.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      width: (n as any).width || (n as any).measured?.width || 280,
      height: (n as any).height || (n as any).measured?.height || 200,
    }));

    // 计算节点的水平和垂直范围
    const xRange = Math.max(...positions.map(p => p.x)) - Math.min(...positions.map(p => p.x));
    const yRange = Math.max(...positions.map(p => p.y)) - Math.min(...positions.map(p => p.y));

    let newPositions: { id: string; x: number; y: number }[] = [];
    const gap = 40; // 节点间距

    // 按拓扑顺序排列节点
    const sortedPositions = sorted.map(id => positions.find(p => p.id === id)!);

    if (xRange >= yRange) {
      // 横向排列 -> 水平铺开，Y坐标对齐
      const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
      const startX = Math.min(...positions.map(p => p.x));
      let currentX = startX;
      newPositions = sortedPositions.map((p) => {
        const pos = { id: p.id, x: currentX, y: avgY };
        currentX += p.width + gap;
        return pos;
      });
    } else {
      // 纵向排列 -> 垂直铺开，X坐标对齐
      const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
      const startY = Math.min(...positions.map(p => p.y));
      let currentY = startY;
      newPositions = sortedPositions.map((p) => {
        const pos = { id: p.id, x: avgX, y: currentY };
        currentY += p.height + gap;
        return pos;
      });
    }

    const updatedNodes = nodes.map(node => {
      const newPos = newPositions.find(p => p.id === node.id);
      if (newPos) {
        return { ...node, position: { x: newPos.x, y: newPos.y } };
      }
      return node;
    });

    useCanvasStore.setState({ nodes: updatedNodes });
    useCanvasStore.getState().saveHistory();
    message.success('节点已按执行顺序对齐');
  }, [selectedNodesData, nodes, edges]);

  // 监听双击事件实现自动对齐
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      // 检查是否点击在选区上
      const target = e.target as HTMLElement;
      if (target.closest('.react-flow__nodesselection') || 
          target.closest('.react-flow__selection')) {
        if (selectedNodes.length >= 2) {
          autoAlignNodes();
        }
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    return () => document.removeEventListener('dblclick', handleDoubleClick);
  }, [selectedNodes.length, autoAlignNodes]);

  // 快捷键对齐：A 键自动对齐
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 排除输入框
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key.toLowerCase() === 'a' && selectedNodes.length >= 2) {
        e.preventDefault();
        autoAlignNodes();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes.length, autoAlignNodes]);

  // 判断是否允许在页面配置 API Key（仅 HTTPS 或开发模式）
  const allowApiKeyConfig = (import.meta as any).env?.DEV || window.location.protocol === 'https:';

  // 粘贴图片或图片链接创建图片节点
  useEffect(() => {
    const isImageUrl = (text: string): boolean => {
      const trimmed = text.trim();
      // 检查是否是图片URL
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return false;
      }
      // 常见图片后缀
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)(\?.*)?$/i;
      if (imageExtensions.test(trimmed)) {
        return true;
      }
      // 常见图床/CDN模式
      const imageCdnPatterns = [
        /\/image\//i,
        /\/img\//i,
        /\/photos?\//i,
        /\/pictures?\//i,
        /images?\./i,
        /cdn.*\.(jpg|jpeg|png|gif|webp)/i,
        /oss.*aliyuncs\.com/i,
        /cos.*myqcloud\.com/i,
      ];
      return imageCdnPatterns.some(pattern => pattern.test(trimmed));
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (isLocked) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      // 先检查是否有图片文件
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const viewportCenterX = -viewport.x / viewport.zoom + (window.innerWidth / 2) / viewport.zoom;
            const viewportCenterY = -viewport.y / viewport.zoom + (window.innerHeight / 2) / viewport.zoom;
            
            addNode('image', 
              { x: viewportCenterX - 140, y: viewportCenterY - 100 }, 
              { url: base64, base64, label: '粘贴图片', loading: false }
            );
            message.success('图片已粘贴');
          };
          reader.readAsDataURL(file);
          return;
        }
      }

      // 检查是否是图片链接
      const text = e.clipboardData?.getData('text/plain');
      if (text && isImageUrl(text)) {
        // 检查当前焦点是否在输入框内
        const activeElement = document.activeElement;
        if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
          return; // 在输入框内不处理
        }
        
        e.preventDefault();
        const viewportCenterX = -viewport.x / viewport.zoom + (window.innerWidth / 2) / viewport.zoom;
        const viewportCenterY = -viewport.y / viewport.zoom + (window.innerHeight / 2) / viewport.zoom;
        
        addNode('image', 
          { x: viewportCenterX - 140, y: viewportCenterY - 100 }, 
          { url: text.trim(), label: '网络图片', loading: false }
        );
        message.success('图片链接已粘贴');
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [viewport, addNode, isLocked]);

  // 初始化 projects
  useEffect(() => {
    initProjects();
  }, [initProjects]);

  useEffect(() => {
    if (canvasProjectId && projects.length > 0) {
      loadProject(canvasProjectId, getProjectCanvas);
    }
  }, [canvasProjectId, projects.length, loadProject, getProjectCanvas]);

  useEffect(() => {
    if (!canvasProjectId) return;
    const timer = setInterval(() => {
      saveProject(updateProjectCanvas);
    }, 5000);
    return () => clearInterval(timer);
  }, [canvasProjectId, nodes, edges, saveProject, updateProjectCanvas]);

  const handleAddNode = (type: string) => {
    const viewportCenterX = -viewport.x / viewport.zoom + (window.innerWidth / 2) / viewport.zoom;
    const viewportCenterY = -viewport.y / viewport.zoom + (window.innerHeight / 2) / viewport.zoom;
    addNode(type, { x: viewportCenterX - 100, y: viewportCenterY - 100 });
    setShowNodeMenu(false);
  };

  // Handle radial menu selection
  const handleRadialMenuSelect = useCallback((item: MenuItem, clickPosition: { x: number; y: number }) => {
    // 计算画布坐标
    const canvasX = (clickPosition.x - viewport.x) / viewport.zoom;
    const canvasY = (clickPosition.y - viewport.y - 48) / viewport.zoom; // 48 是 header 高度
    addNode(item.type, { x: canvasX - 140, y: canvasY - 50 });
  }, [addNode, viewport]);

  // 检查是否应该打开轮盘菜单（排除工具栏和弹窗）
  const shouldOpenRadialMenu = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // 排除左侧工具栏、节点菜单、底部控制栏等
    if (target.closest('aside') || 
        target.closest('.ant-modal') || 
        target.closest('.ant-drawer') ||
        target.closest('[class*="absolute"]')) {
      return false;
    }
    return true;
  }, []);

  // 点击画布空白区域时关闭节点菜单
  const handlePaneClick = useCallback(() => {
    setShowNodeMenu(false);
  }, []);

  const nodeTypeOptions = [
    { type: 'text', name: '文本节点', icon: <FileTextOutlined />, color: '#3b82f6' },
    { type: 'imageConfig', name: '文生图配置', icon: <BgColorsOutlined />, color: '#10b981' },
    { type: 'videoConfig', name: '视频生成配置', icon: <VideoCameraOutlined />, color: '#8b5cf6' },
    { type: 'effectConfig', name: '效果配置', icon: <BgColorsOutlined />, color: '#ec4899' },
    { type: 'templateEffect', name: '视频特效', icon: <BgColorsOutlined />, color: '#7c3aed' },
    { type: 'image', name: '图片节点', icon: <PictureOutlined />, color: '#06b6d4' },
    { type: 'video', name: '视频节点', icon: <VideoCameraOutlined />, color: '#f59e0b' },
  ];

  // 导出工作流
  const handleExportWorkflow = useCallback(() => {
    const workflow = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projectName,
      nodes,
      edges,
      viewport,
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `workflow_${projectName}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    message.success('工作流已导出');
    setShowProjectMenu(false);
  }, [nodes, edges, viewport, projectName]);

  // 导入工作流
  const handleImportWorkflow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const workflow = JSON.parse(content);
        
        if (!workflow.nodes || !workflow.edges) {
          message.error('无效的工作流文件');
          return;
        }

        useCanvasStore.setState({
          nodes: workflow.nodes,
          edges: workflow.edges,
          viewport: workflow.viewport || { x: 0, y: 0, zoom: 1 },
        });

        // 自动保存到项目 - 使用 getState 获取最新状态
        setTimeout(() => {
          useCanvasStore.getState().saveProject(updateProjectCanvas);
        }, 100);

        message.success(`工作流已导入: ${workflow.projectName || '未知'}`);
      } catch (err) {
        console.error('Import error:', err);
        message.error('解析工作流文件失败');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
    setShowProjectMenu(false);
  }, [updateProjectCanvas]);

  // 清空画布
  const handleClearCanvas = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      message.info('画布已经是空的');
      return;
    }
    Modal.confirm({
      title: '清空画布',
      content: '确定要清空所有节点和连接吗？此操作不可撤销。',
      okText: '清空',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        useCanvasStore.setState({ nodes: [], edges: [] });
        // 自动保存到项目
        setTimeout(() => {
          useCanvasStore.getState().saveProject(updateProjectCanvas);
        }, 100);
        message.success('画布已清空');
      },
    });
  }, [nodes.length, edges.length, updateProjectCanvas]);

  // 锁定/解锁画布
  const handleToggleLock = useCallback(() => {
    setIsLocked(prev => {
      const newState = !prev;
      message.info(newState ? '画布已锁定' : '画布已解锁');
      return newState;
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#131313] text-[#e5e2e1]">
      {/* Header - Dark theme style */}
      <header className="h-16 flex items-center justify-between px-6 bg-[#131313]/80 backdrop-blur-xl border-b border-[#474747]/30 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/project/${projectId}/episode/${episodeId}`)}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#353534] rounded transition-colors"
          >
            <ArrowLeftOutlined style={{ fontSize: 16 }} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center gap-2 hover:bg-[#353534] px-3 py-1.5 rounded transition-colors"
            >
              <span className="text-sm font-bold tracking-tight">{projectName}</span>
              <DownOutlined style={{ fontSize: 12 }} />
            </button>
            {showProjectMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProjectMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1 bg-[#1c1b1b] rounded-lg border border-[#474747]/30 shadow-xl p-1 z-50 min-w-[160px]">
                  <button
                    onClick={handleExportWorkflow}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#353534] transition-colors text-left text-sm"
                  >
                    <DownloadOutlined style={{ fontSize: 14 }} />
                    <span>导出工作流</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#353534] transition-colors text-left text-sm"
                  >
                    <UploadOutlined style={{ fontSize: 14 }} />
                    <span>导入工作流</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button className="text-xs uppercase tracking-widest text-white font-bold border-b-2 border-white pb-1">
            画布
          </button>
          <button 
            onClick={() => navigate(`/project/${projectId}/episode/${episodeId}`)}
            className="text-xs uppercase tracking-widest text-[#c6c6c6] hover:text-white transition-colors"
          >
            返回片段
          </button>
        </nav>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#353534] rounded transition-colors"
            title={isDark ? '切换到亮色主题' : '切换到深色主题'}
          >
            {isDark ? <SunOutlined style={{ fontSize: 18 }} /> : <MoonOutlined style={{ fontSize: 18 }} />}
          </button>
          {allowApiKeyConfig && (
            <button
              onClick={() => setShowApiSettings(true)}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#353534] rounded transition-colors"
              title="API 设置"
            >
              <SettingOutlined style={{ fontSize: 18 }} />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-[#c6c6c6] ml-2"></div>
        </div>
      </header>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportWorkflow}
        style={{ display: 'none' }}
      />

      {/* Main Canvas Area - Dark canvas grid background */}
      <RadialMenu onSelect={handleRadialMenuSelect} shouldOpen={shouldOpenRadialMenu}>
        <div 
          className="flex-1 relative overflow-hidden h-full cursor-grab"
          style={{
            backgroundImage: 'radial-gradient(circle, #474747 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundColor: '#131313'
          }}
        >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={isLocked ? undefined : onNodesChange}
          onEdgesChange={isLocked ? undefined : onEdgesChange}
          onConnect={isLocked ? undefined : onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={viewport}
          onMove={(_, newViewport) => updateViewport(newViewport)}
          onPaneClick={handlePaneClick}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          minZoom={0.1}
          maxZoom={2}
          className={isDark ? 'dark' : ''}
          nodesDraggable={!isLocked}
          nodesConnectable={!isLocked}
          elementsSelectable={!isLocked}
          selectionMode={isSelectionMode ? SelectionMode.Partial : undefined}
          selectionOnDrag={isSelectionMode}
          panOnDrag={!isSelectionMode}
          selectionKeyCode={null}
        >
          {showGrid && <Background gap={20} size={1} />}
          <MiniMap position="bottom-right" pannable zoomable />
        </ReactFlow>

        {/* Left Toolbar - Dark theme */}
        <aside className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-2 bg-[#1c1b1b] rounded-lg border border-[#474747]/30 shadow-xl z-10">
          <button
            onClick={() => setShowNodeMenu(!showNodeMenu)}
            className="w-10 h-10 flex items-center justify-center rounded bg-white text-black hover:bg-[#c6c6c6] transition-all shadow-lg"
            title="添加节点"
          >
            <PlusOutlined style={{ fontSize: 20 }} />
          </button>
          <button
            onClick={() => setShowWorkflowPanel(true)}
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#353534] transition-colors text-[#c6c6c6]"
            title="工作流模板"
          >
            <AppstoreOutlined style={{ fontSize: 20 }} />
          </button>
          <div className="w-full h-px bg-[#474747]/50 my-1" />
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#353534] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#c6c6c6]"
            title="撤销"
          >
            <UndoOutlined style={{ fontSize: 20 }} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#353534] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#c6c6c6]"
            title="重做"
          >
            <RedoOutlined style={{ fontSize: 20 }} />
          </button>
        </aside>

        {/* Node Menu Popup - Dark theme */}
        {showNodeMenu && (
          <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-[#1c1b1b] rounded-lg border border-[#474747]/30 shadow-xl p-2 z-20">
            {nodeTypeOptions.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => handleAddNode(nodeType.type)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[#353534] transition-colors text-left"
              >
                <span style={{ color: nodeType.color, fontSize: 20 }}>{nodeType.icon}</span>
                <span className="text-sm text-[#e5e2e1]">{nodeType.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Controls - Dark theme */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#1c1b1b]/90 backdrop-blur-md rounded-lg border border-[#474747]/30 p-1 shadow-xl">
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
            title="适应视图"
          >
            <AimOutlined style={{ fontSize: 16 }} />
          </button>
          <div className="w-px h-5 bg-[#474747]/50" />
          <div className="flex items-center gap-1 px-2">
            <button onClick={() => zoomOut()} className="p-1 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]">
              <MinusOutlined style={{ fontSize: 14 }} />
            </button>
            <span className="text-xs min-w-[40px] text-center text-[#c6c6c6]">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <button onClick={() => zoomIn()} className="p-1 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]">
              <PlusOutlined style={{ fontSize: 14 }} />
            </button>
          </div>
          <div className="w-px h-5 bg-[#474747]/50" />
          <button
            onClick={handleToggleLock}
            className={`p-2 rounded transition-colors ${
              isLocked 
                ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' 
                : 'hover:bg-[#353534] text-[#c6c6c6]'
            }`}
            title={isLocked ? '解锁画布' : '锁定画布'}
          >
            {isLocked ? <LockOutlined style={{ fontSize: 16 }} /> : <UnlockOutlined style={{ fontSize: 16 }} />}
          </button>
          <button
            onClick={handleClearCanvas}
            className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors text-[#c6c6c6]"
            title="清空画布"
          >
            <DeleteOutlined style={{ fontSize: 16 }} />
          </button>
          <div className="w-px h-5 bg-[#474747]/50" />
          <button
            onClick={() => {
              setIsSelectionMode(prev => {
                const newState = !prev;
                message.info(newState ? '框选模式已开启' : '框选模式已关闭');
                return newState;
              });
            }}
            className={`p-2 rounded transition-colors ${
              isSelectionMode 
                ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' 
                : 'hover:bg-[#353534] text-[#c6c6c6]'
            }`}
            title={isSelectionMode ? '关闭框选模式' : '开启框选模式'}
          >
            <DragOutlined style={{ fontSize: 16 }} />
          </button>
        </div>

        {/* 对齐工具栏 - 选中多个节点时显示 */}
        {selectedNodes.length >= 2 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1c1b1b]/90 backdrop-blur-md rounded-lg border border-[#474747]/30 p-1 shadow-xl">
            <span className="text-xs text-[#c6c6c6] px-2">对齐 ({selectedNodes.length})</span>
            <div className="w-px h-5 bg-[#474747]/50" />
            <button
              onClick={() => alignNodes('left')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="左对齐"
            >
              <AlignLeftOutlined style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => alignNodes('horizontal-center')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="水平居中"
            >
              <AlignCenterOutlined style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => alignNodes('right')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="右对齐"
            >
              <AlignRightOutlined style={{ fontSize: 16 }} />
            </button>
            <div className="w-px h-5 bg-[#474747]/50" />
            <button
              onClick={() => alignNodes('top')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="顶部对齐"
            >
              <VerticalAlignTopOutlined style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => alignNodes('vertical-center')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="垂直居中"
            >
              <VerticalAlignMiddleOutlined style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => alignNodes('bottom')}
              className="p-2 hover:bg-[#353534] rounded transition-colors text-[#c6c6c6]"
              title="底部对齐"
            >
              <VerticalAlignBottomOutlined style={{ fontSize: 16 }} />
            </button>
            <div className="w-px h-5 bg-[#474747]/50" />
            <button
              onClick={autoAlignNodes}
              className="p-2 hover:bg-blue-500/20 hover:text-blue-500 rounded transition-colors text-[#c6c6c6]"
              title="自动展开（按执行顺序）"
            >
              <SplitCellsOutlined style={{ fontSize: 16 }} />
            </button>
          </div>
        )}
        </div>
      </RadialMenu>

      {/* Modals */}
      <WorkflowPanel visible={showWorkflowPanel} onClose={() => setShowWorkflowPanel(false)} />
      {allowApiKeyConfig && <ApiSettings visible={showApiSettings} onClose={() => setShowApiSettings(false)} />}
    </div>
  );
};

const Canvas: React.FC = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);

export default Canvas;
