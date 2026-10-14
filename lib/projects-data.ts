import issueSnapshot from "./project-issues.json"
import { convertIssueToProject, fetchProjectsFromGitHub } from "./github-api"

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
  previewUnavailable?: boolean
}

const titleCatalog: Project = {
  id: "competitive-programming-zh",
  title: "Codeforces · AtCoder 中文题库",
  description: "20,470 道中文算法题，支持来源、算法标签与关键词筛选，并可按比赛浏览。",
  longDescription: "整理 Codeforces 与 AtCoder 的中文题名、题面和比赛目录。机器翻译仅供学习参考，每道题均提供官方原题入口。题库数据截至 2026 年 8 月。",
  image: "/previews/competitive-programming-zh.jpg",
  technologies: ["Python", "HTML", "TailwindCSS", "算法"],
  status: "completed",
  demoUrl: "https://wyf-cp-zh.vercel.app/",
  createdAt: "2026-07-14",
  updatedAt: "2026-10-14",
  features: ["20,470 道中文题目", "按来源、算法标签与关键词筛选", "2,039 场比赛目录", "官方原题链接"],
  challenges: [],
  learnings: [],
}

const previewOverrides: Record<string, { image: string; demoUrl?: string; githubUrl?: string; previewUnavailable?: boolean }> = {
  "issue-8": { image: "/previews/issue-8.jpg", demoUrl: "https://w-web3-connector.vercel.app/", githubUrl: "https://github.com/wyf027/w-wallet-sdk" },
  "issue-7": { image: "/previews/issue-7.jpg" },
  "issue-6": { image: "/previews/issue-6.jpg", previewUnavailable: true, githubUrl: "https://github.com/wyf027/w-stake-fe" },
  "issue-5": { image: "/previews/issue-5.jpg" },
  "issue-4": { image: "/previews/issue-4.jpg", previewUnavailable: true },
  "issue-3": { image: "/previews/issue-3.jpg" },
  "issue-2": { image: "/previews/issue-2.jpg" },
}

const fallbackProjects = issueSnapshot.map((issue) => convertIssueToProject(issue))
export async function getProjects(): Promise<Project[]> {
  const remote = await fetchProjectsFromGitHub()
  const items = remote.length ? remote : fallbackProjects
  return [titleCatalog, ...items.map((project) => ({
    ...project,
    ...previewOverrides[project.id],
    githubUrl: previewOverrides[project.id]?.githubUrl ?? project.githubUrl?.replace("github.com/leno23/", "github.com/wyf027/"),
  }))]
}

export async function getProjectById(id: string): Promise<Project | null> {
  return (await getProjects()).find((project) => project.id === id) || null
}
export const projects = [titleCatalog, ...fallbackProjects]
