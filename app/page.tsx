import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Calendar, Star, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getProjects } from "@/lib/projects-data"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">我的项目集合</h1>
              <p className="text-slate-400">探索我的个人项目和实验</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/repos">
                  <Github className="w-4 h-4 mr-2" />
                  我的仓库
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/wyf027/project-list" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">总项目数</p>
                  <p className="text-2xl font-bold text-slate-100">{projects.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-950 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">技术栈</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {Array.from(new Set(projects.flatMap((p) => p.technologies))).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-950 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">数据来源</p>
                  <p className="text-sm font-bold text-slate-100">个人作品 / GitHub</p>
                </div>
                <div className="h-12 w-12 bg-violet-950 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-slate-800 bg-slate-900/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      project.status === "completed"
                        ? "default"
                        : project.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {project.status === "completed" ? "已完成" : project.status === "in-progress" ? "进行中" : "计划中"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Project Image */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    loading="lazy"
                    decoding="async"
                    width={1440}
                    height={900}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {project.previewUnavailable && <p className="mb-4 text-xs text-amber-300">站点暂不可访问 · 截图记录当前访问状态</p>}

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button size="sm" className="text-xs">
                        查看详情
                      </Button>
                    </Link>
                    {project.demoUrl && (
                      <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          演示
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {project.githubUrl && (
                      <Button size="sm" variant="ghost" className="text-xs p-2" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.issueUrl && (
                      <Button size="sm" variant="ghost" className="text-xs p-2" asChild>
                        <a href={project.issueUrl} target="_blank" rel="noopener noreferrer" title="查看 GitHub Issue">
                          #{project.issueNumber}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Updated Date */}
                <div className="mt-3 pt-3 border-t text-xs text-slate-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  更新于 {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Github className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">暂无项目数据</h3>
            <p className="text-slate-400 mb-4">无法从 GitHub Issues 获取项目数据</p>
            <Button variant="outline" asChild>
              <a href="https://github.com/wyf027/project-list/issues" target="_blank" rel="noopener noreferrer">
                查看 GitHub Issues
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
