export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  state: string
  labels: Array<{
    id: number
    name: string
    color: string
    description: string | null
  }>
  created_at: string
  updated_at: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

export interface ProjectFromIssue {
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
  issueUrl: string
  issueNumber: number
}

// 从 GitHub API 获取 issues
export async function fetchGitHubIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // 如果需要认证，可以添加 token
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      // 添加缓存控制
      next: { revalidate: 3600 }, // 1小时缓存
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const issues: GitHubIssue[] = await response.json()
    return issues.filter((issue) => !issue.html_url.includes("/pull/")) // 过滤掉 PR
  } catch (error) {
    console.error("Error fetching GitHub issues:", error)
    return []
  }
}

// 解析 issue body 中的项目信息
function parseIssueBody(body: string | null): {
  description: string
  longDescription: string
  technologies: string[]
  features: string[]
  challenges: string[]
  learnings: string[]
  githubUrl?: string
  demoUrl?: string
  image?: string
} {
  if (!body) {
    return {
      description: "",
      longDescription: "",
      technologies: [],
      features: [],
      challenges: [],
      learnings: [],
    }
  }

  const sections = {
    description: "",
    longDescription: "",
    technologies: [] as string[],
    features: [] as string[],
    challenges: [] as string[],
    learnings: [] as string[],
    githubUrl: undefined as string | undefined,
    demoUrl: undefined as string | undefined,
    image: undefined as string | undefined,
  }

  // 解析描述
  const descMatch = body.match(/## 描述\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (descMatch) {
    sections.description = descMatch[1].trim()
  }

  // 解析详细描述
  const longDescMatch = body.match(/## 详细描述\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (longDescMatch) {
    sections.longDescription = longDescMatch[1].trim()
  } else {
    sections.longDescription = sections.description
  }

  // 解析技术栈
  const techMatch = body.match(/## 技术栈\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (techMatch) {
    sections.technologies = techMatch[1]
      .split(/[,\n]/)
      .map((tech) => tech.replace(/[-*]\s*/, "").trim())
      .filter((tech) => tech.length > 0)
  }

  // 解析功能特性
  const featuresMatch = body.match(/## 功能特性\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (featuresMatch) {
    sections.features = featuresMatch[1]
      .split("\n")
      .map((feature) => feature.replace(/[-*]\s*/, "").trim())
      .filter((feature) => feature.length > 0)
  }

  // 解析技术挑战
  const challengesMatch = body.match(/## 技术挑战\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (challengesMatch) {
    sections.challenges = challengesMatch[1]
      .split("\n")
      .map((challenge) => challenge.replace(/[-*]\s*/, "").trim())
      .filter((challenge) => challenge.length > 0)
  }

  // 解析学习收获
  const learningsMatch = body.match(/## 学习收获\s*\n(.*?)(?=\n##|\n---|\n$)/s)
  if (learningsMatch) {
    sections.learnings = learningsMatch[1]
      .split("\n")
      .map((learning) => learning.replace(/[-*]\s*/, "").trim())
      .filter((learning) => learning.length > 0)
  }

  // 解析链接
  const githubMatch = body.match(/GitHub[：:]\s*(https?:\/\/[^\s\n]+)/i)
  if (githubMatch) {
    sections.githubUrl = githubMatch[1]
  }

  const demoMatch = body.match(/演示[：:]?\s*(https?:\/\/[^\s\n]+)/i)
  if (demoMatch) {
    sections.demoUrl = demoMatch[1]
  }

  // 解析图片
  const imageMatch = body.match(/!\[.*?\]$$(.*?)$$/)
  if (imageMatch) {
    sections.image = imageMatch[1]
  }

  return sections
}

// 根据标签确定项目状态
function getProjectStatus(labels: GitHubIssue["labels"]): "completed" | "in-progress" | "planned" {
  const labelNames = labels.map((label) => label.name.toLowerCase())

  if (labelNames.includes("completed") || labelNames.includes("done") || labelNames.includes("已完成")) {
    return "completed"
  }
  if (labelNames.includes("in-progress") || labelNames.includes("wip") || labelNames.includes("进行中")) {
    return "in-progress"
  }
  return "planned"
}

// 将 GitHub issue 转换为项目数据
export function convertIssueToProject(issue: GitHubIssue): ProjectFromIssue {
  const parsedBody = parseIssueBody(issue.body)

  return {
    id: `issue-${issue.number}`,
    title: issue.title,
    description: parsedBody.description || issue.title,
    longDescription: parsedBody.longDescription || parsedBody.description || issue.title,
    image: parsedBody.image || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(issue.title)}`,
    technologies: parsedBody.technologies,
    status: getProjectStatus(issue.labels),
    githubUrl: parsedBody.githubUrl,
    demoUrl: parsedBody.demoUrl,
    createdAt: issue.created_at.split("T")[0],
    updatedAt: issue.updated_at.split("T")[0],
    features: parsedBody.features,
    challenges: parsedBody.challenges,
    learnings: parsedBody.learnings,
    issueUrl: issue.html_url,
    issueNumber: issue.number,
  }
}

// 获取并转换所有项目数据
export async function fetchProjectsFromGitHub(): Promise<ProjectFromIssue[]> {
  const issues = await fetchGitHubIssues("leno23", "project-list")
  return issues.map(convertIssueToProject)
}
