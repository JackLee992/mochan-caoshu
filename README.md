# 墨禅 · 草书经卷

用于保存草书站点的完整静态文件、迁移包和部署进展，方便换电脑后继续操作。

原站：[ChatGPT Site](https://mochan-caoshu.s419505080.chatgpt.site)。
当前使用 **Netlify 免费静态托管**；不购买域名、不绑定银行卡、不开通付费套餐。
**已成功发布并认领为公开网站：[墨禅 · 草书经卷](https://mochan-caoshu.netlify.app)。账号为 Free，未保存银行卡；无需 Netlify 登录或临时密码即可阅读。**

当前已收录《心经》、32分《金刚经》、81章《道德经》和20篇《论语》全文，支持章节选择和前后翻页。经典正文不显示标点，按语句与原段落分行，直排、横排和米字格使用同样的分行。默认字号48，可调24–200，提供64/96/160三个大字快捷按钮；主要触控控件至少48像素高。于右任字体已换成原包全量 WOFF2，旧精简版已覆盖。字体下载时显示加载提示并隐藏正文，成功后再显示；失败可重新载入。

已验证全部九项资源及章节、大字、字库加载交互。用户此前确认手机关闭 VPN 后，Wi-Fi 和移动网络均正常打开；该手机反馈来自首次部署。后续更新见 [Netlify 部署步骤](docs/NETLIFY.md)。Render 登录已完成，但 Blueprint 和手动 Static Site 均被银行卡身份验证要求阻止，没有已上线的 Render 网址；以下入口仅为历史备选。

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FJackLee992%2Fmochan-caoshu)

手机也可以打开上方入口。首次使用需要登录或注册 Render；登录、服务条款及可能的 GitHub 授权由账号持有人确认。只部署一个 Static Site，不添加银行卡；遇到收费要求先停止。

## 换一台电脑后继续

1. 克隆仓库，或通过 GitHub 的 **Code → Download ZIP** 下载。

   ```sh
   git clone https://github.com/JackLee992/mochan-caoshu.git
   cd mochan-caoshu
   ```

2. 阅读 [当前进展与交接说明](PROGRESS.md)。这里记录了已完成的工作、用户选择、当前阻塞点及下一步。
3. 按 [Netlify 部署步骤](docs/NETLIFY.md) 更新现有 `mochan-caoshu` 项目。已经完成认领，不需要重建。无需重新抓取原站，也无需新建 Gitee 仓库。[Render 步骤](docs/RENDER.md) 和 [CloudBase 步骤](docs/CLOUDBASE.md) 作为历史参考保留。

如果使用 Codex，可直接让它：

> 阅读 README.md、PROGRESS.md、netlify.toml 和 docs/NETLIFY.md，继续维护已发布的 Netlify Free 项目 mochan-caoshu。先检查登录态和现有项目，避免重复创建或覆盖其他站点。此次为手动 Drop 发布，GitHub 自动部署尚未连接。不购买域名、不绑定银行卡、不接受收费升级。更新后确认未登录访客可以访问，验证首页、本地资源和交互并更新进展记录；大陆无 VPN 可达性需另行实测。

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
| `manifest.json` | 当前发布文件的大小、SHA-256 与初始导出来源记录 |
| `export-site.mjs` | 首次导出工具；已有 `site/` 时会停止，通常无需再次运行 |
| `scripts/verify-snapshot.mjs` | 校验快照完整性、资源引用、脚本语法和经文章节数 |
| `PROGRESS.md` | 当前进展及换电脑交接记录 |
| `render.yaml` | Render 一键部署配置，只公开 `site/` |
| `netlify.toml` | 可选的 Netlify 仓库部署配置，只公开 `site/`；本次手动上传未连接 GitHub |
| `docs/NETLIFY.md` | 当前 Netlify 网站、更新步骤、免费边界和验收要求 |
| `docs/CLASSICS.md` | 经典固定版本、正文导入方法、全量字体与占位字形处理 |
| `scripts/build-yu-font.py` | 将用户原字体包全量转换为 WOFF2，验证轮廓和横纵排度量并生成有效字形范围 |
| `docs/evidence/netlify-unpunctuated-2026-09-30.json` | 当前无标点版本公网及分行验收记录 |
| `docs/evidence/netlify-classics-full-font-2026-09-30.json` | 字体与经典更新的历史验收记录 |
| `docs/evidence/yu-font-classics-2026-09-30.json` | 全量字体转换、轮廓和原字库缺字核查 |
| `docs/evidence/netlify-2026-09-30.json` | 首次部署的历史验收记录 |
| `docs/RENDER.md` | Render 账号阻塞记录与备选部署步骤 |
| `docs/CLOUDBASE.md` | 先前 CloudBase 方案的历史参考 |

使用 Node.js 22 或更新版本校验当前发布快照：

```sh
node scripts/verify-snapshot.mjs
```

此校验对照当前清单，检查资源引用、脚本语法与完整章节。修改站点后同步更新清单和部署包再发布；初始来源哈希单独保存。

## 部署与来源说明

- `site/` 是静态网站，不需要后端、数据库或 ChatGPT 登录。部署入口为 `index.html`；仓库部署配置的构建命令只运行完整性校验。
- 资源路径以 `/` 开头，须部署到域名根路径。连接代码仓库时发布目录必须是 `site`；手动上传只使用 `site/` 内的内容或现成 ZIP，不把仓库文档和 Git 元数据公开为站点文件。
- 字体、图片及经文都在站点内，正常阅读不需要访问 ChatGPT、GitHub 或外部字体服务。延伸阅读链接仍指向第三方网站。
- 首次迁移移除了原托管平台注入的 Cloudflare 验证脚本；后续功能更新保存在本仓库并发布至 Netlify，原 ChatGPT Sites 网址未同步本次更新。
- 保留原站字体与图片的来源、权利说明；公开仓库不等于这些素材获得新的开源许可。于右任字体的额外使用、再分发授权尚未核清。

托管规则及大陆访问验证的边界见 [PROGRESS.md](PROGRESS.md)。

原字体虽包含22153个字符映射，其中10794个汉字共用缺字占位形。网页排除这些占位映射，让设备正体补读；全量文件仍完整保留原TTF字符、轮廓和横纵排度量。不能把字符映射数量当作真实草书字形数量。详情见 [经典与字体说明](docs/CLASSICS.md)。
