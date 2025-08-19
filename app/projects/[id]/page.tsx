import { notFound } from "next/navigation"
import { getProjectById } from "@/lib/projects-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回项目列表
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.issueUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.issueUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Issue #{project.issueNumber}
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {project.demoUrl && (
                <Button size="sm" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    查看演示
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  项目介绍
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {project.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    主要功能
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Challenges */}
            {project.challenges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    技术挑战
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Learnings */}
            {project.learnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    收获与学习
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.learnings.map((learning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>项目信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">状态</p>
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

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">创建时间</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">最后更新</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>

                {project.issueNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Issue 编号</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MessageSquare className="w-4 h-4" />#{project.issueNumber}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>技术栈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>相关链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.issueUrl && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={project.issueUrl} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      查看 Issue
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      查看源码
                    </a>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button className="w-full justify-start" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      在线演示
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
