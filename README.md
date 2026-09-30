# 墨禅 · 草书经卷

用于保存草书站点的完整静态文件、迁移包和部署进展，方便换电脑后继续操作。

原站：[ChatGPT Site](https://mochan-caoshu.s419505080.chatgpt.site)。
当前目标：部署到 **Netlify 免费静态托管**，使用平台提供的网址验证中国大陆网络访问；不购买域名、不绑定银行卡、不开通付费套餐。
**Netlify Drop 已成功上传，但匿名项目只保留一小时、带临时密码；需在 Chrome 认领页面登录后认领，尚未完成长期公开发布。**

操作见 [Netlify 部署与认领步骤](docs/NETLIFY.md)。Render 登录已完成，但 Blueprint 和手动 Static Site 均被银行卡身份验证要求阻止，没有已上线的 Render 网址；以下入口仅为历史备选。

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FJackLee992%2Fmochan-caoshu)

手机也可以打开上方入口。首次使用需要登录或注册 Render；登录、服务条款及可能的 GitHub 授权由账号持有人确认。只部署一个 Static Site，不添加银行卡；遇到收费要求先停止。

## 换一台电脑后继续

1. 克隆仓库，或通过 GitHub 的 **Code → Download ZIP** 下载。

   ```sh
   git clone https://github.com/JackLee992/mochan-caoshu.git
   cd mochan-caoshu
   ```

2. 阅读 [当前进展与交接说明](PROGRESS.md)。这里记录了已完成的工作、用户选择、当前阻塞点及下一步。
3. 按 [Netlify 部署步骤](docs/NETLIFY.md) 优先认领已上传项目；过期后登录再手动上传现成 ZIP。无需重新抓取原站，也无需新建 Gitee 仓库。[Render 步骤](docs/RENDER.md) 和 [CloudBase 步骤](docs/CLOUDBASE.md) 作为历史参考保留。

如果使用 Codex，可直接让它：

> 阅读 README.md、PROGRESS.md、netlify.toml 和 docs/NETLIFY.md，继续将网站保存到 Netlify Free。先检查登录态和已有项目，优先认领当前 Drop 项目，避免重复创建或覆盖其他站点。注册条款由账号持有人接受。不购买域名、不绑定银行卡、不接受收费升级。完成后确认未登录访客可以访问，验证首页、本地资源和交互，返回控制台实际分配的网址并更新进展记录；大陆无 VPN 可达性需另行实测。

## 本地预览

页面依赖通过 HTTP 加载 `content.json`，请用静态服务器预览，不要直接双击 `index.html`。
安装 Python 3 后，在仓库根目录运行：

```sh
# macOS / Linux
python3 -m http.server 8080 --bind 127.0.0.1 --directory site

# Windows
py -3 -m http.server 8080 --bind 127.0.0.1 --directory site
```

然后打开 <http://127.0.0.1:8080>。这仅供本机预览，不是公网网址。

## 仓库内容

| 路径 | 用途 |
| --- | --- |
| `site/` | 可直接部署的九个静态文件：页面、样式、脚本、经文、字体、图片 |
| `mochan-caoshu-static.zip` | 可直接上传的部署包，入口 `index.html` 位于 ZIP 顶层 |
| `manifest.json` | 初始快照每个文件的来源、大小、SHA-256 和导出时间 |
| `export-site.mjs` | 首次导出工具；已有 `site/` 时会停止，通常无需再次运行 |
| `scripts/verify-snapshot.mjs` | 校验快照完整性、资源引用、脚本语法和经文章节数 |
| `PROGRESS.md` | 当前进展及换电脑交接记录 |
| `render.yaml` | Render 一键部署配置，只公开 `site/` |
| `netlify.toml` | 可选的 Netlify 仓库部署配置，只公开 `site/`；本次手动上传未连接 GitHub |
| `docs/NETLIFY.md` | 当前 Netlify 认领/部署步骤、免费边界和验收要求 |
| `docs/RENDER.md` | Render 账号阻塞记录与备选部署步骤 |
| `docs/CLOUDBASE.md` | 先前 CloudBase 方案的历史参考 |

使用 Node.js 22 或更新版本校验原始快照：

```sh
node scripts/verify-snapshot.mjs
```

此校验对照初始导出的哈希；主动修改站点文件后，哈希变化是预期的，发布新版本时应同步更新快照记录与部署包。

## 部署与来源说明

- `site/` 是静态网站，不需要后端、数据库或 ChatGPT 登录。部署入口为 `index.html`；仓库部署配置的构建命令只运行完整性校验。
- 资源路径以 `/` 开头，须部署到域名根路径。连接代码仓库时发布目录必须是 `site`；手动上传只使用 `site/` 内的内容或现成 ZIP，不把仓库文档和 Git 元数据公开为站点文件。
- 字体、图片及经文都在站点内，正常阅读不需要访问 ChatGPT、GitHub 或外部字体服务。延伸阅读链接仍指向第三方网站。
- 这是原公开站点的发布快照，不包含原项目的 Git 历史；只移除了响应中由原托管平台注入的 Cloudflare 验证脚本，其他站点内容保持不变。
- 保留原站字体与图片的来源、权利说明；公开仓库不等于这些素材获得新的开源许可。于右任字体的额外使用、再分发授权尚未核清。

托管规则及大陆访问验证的边界见 [PROGRESS.md](PROGRESS.md)。
