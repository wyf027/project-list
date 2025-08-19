import { fetchProjectsFromGitHub } from "./github-api"

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  status: "completed" | "in-progress" | "planned"
  githubUrl?: string
  demoUrl?: string
  createdAt: string
  updatedAt: string
  features: string[]
  challenges: string[]
  learnings: string[]
  issueUrl?: string
  issueNumber?: number
}

// 默认项目数据（作为后备）
const defaultProjects: Project[] = [
  {
    id: "minesweeper-game",
    title: "扫雷游戏",
    description: "经典的扫雷游戏，支持多种难度级别，具有现代化的用户界面和流畅的游戏体验。",
    longDescription:
      "这是一个完全重新设计的扫雷游戏，保留了经典游戏的所有乐趣，同时加入了现代化的界面设计和用户体验优化。游戏支持三种难度级别，包含计时器、最佳时间记录等功能。",
    image: "/placeholder.svg?height=200&width=300&text=扫雷游戏",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "shadcn/ui"],
    status: "completed",
    githubUrl: "https://github.com/username/minesweeper",
    demoUrl: "/minesweeper",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    features: [
      "三种难度级别（初级、中级、高级）",
      "智能首次点击保护",
      "自动展开空白区域",
      "右键标记功能",
      "实时计时器",
      "最佳时间记录",
      "响应式设计",
    ],
    challenges: ["实现高效的地雷生成算法", "处理复杂的游戏状态管理", "优化用户交互体验"],
    learnings: ["深入理解React Hooks的使用", "掌握复杂状态管理技巧", "提升算法设计能力"],
  },
]

// 获取项目数据（优先从 GitHub 获取，失败时使用默认数据）
export async function getProjects(): Promise<Project[]> {
  try {
    const githubProjects = await fetchProjectsFromGitHub()

    if (githubProjects.length > 0) {
      // 转换 GitHub 项目数据格式
      return githubProjects.map((project) => ({
        ...project,
        issueUrl: project.issueUrl,
        issueNumber: project.issueNumber,
      }))
    }

    return defaultProjects
  } catch (error) {
    console.error("Failed to fetch projects from GitHub:", error)
    return defaultProjects
  }
}

// 根据 ID 获取单个项目
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((project) => project.id === id) || null
}

// 兼容性导出（保持向后兼容）
export const projects = defaultProjects
