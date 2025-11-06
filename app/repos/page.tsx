import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Star, GitFork, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { fetchUserRepos } from "@/lib/github-api"

export default async function ReposPage() {
  // 替换为你的 GitHub 用户名
  const repos = await fetchUserRepos("leno23")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回首页
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                GitHub 项目仓库
              </h1>
              <p className="text-gray-600 mt-1">展示所有 w- 开头的项目</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/leno23" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                访问 GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总仓库数</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{repos.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Github className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总 Stars</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总 Forks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <GitFork className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">语言类型</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {new Set(repos.map((r) => r.language).filter(Boolean)).size}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-sm bg-white/70 backdrop-blur"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors truncate">
                      {repo.name}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2 min-h-[2.5rem]">
                      {repo.description || "暂无描述"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Language */}
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                    <span className="text-sm text-gray-600">{repo.language}</span>
                  </div>
                )}

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs font-normal">
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 4 && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        +{repo.topics.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(repo.updated_at).toLocaleDateString("zh-CN")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="default" className="flex-1" asChild>
                    <a href={`https://${repo.name}.vercel.app`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      访问项目
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {repos.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Github className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无仓库数据</h3>
            <p className="text-gray-600 mb-6">没有找到以 w- 开头的 GitHub 仓库</p>
            <Button variant="outline" asChild>
              <a href="https://github.com/leno23?tab=repositories" target="_blank" rel="noopener noreferrer">
                查看所有仓库
              </a>
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>数据来源于 GitHub API，每小时更新一次</p>
        </div>
      </footer>
    </div>
  )
}

