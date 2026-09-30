# 部署到 CloudBase 开发测试环境

此文档针对用户已选定的「暂不购买域名，先使用开发测试地址」。
目前尚未创建环境或部署网站。默认域名只作开发测试，不能作为正式生产地址。

## 方式一：使用现成 ZIP（推荐）

1. 登录 [腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)。按需完成账号实名认证和平台的首次服务授权。
2. 查看当前账号已有环境或免费体验资格。没有免费资格时先确认套餐价格、期限和续费设置，不直接付款。
3. 创建本次专用的测试环境，名称可用 `mochan-caoshu`。记录控制台实际给出的环境 ID 和地域。
4. 打开该环境的「静态网站托管」，进入「新建部署」或「上传代码包」。
5. 上传仓库根目录的 `mochan-caoshu-static.zip`。

   | 配置 | 值 |
   | --- | --- |
   | 项目名称 | `mochan-caoshu` |
   | 安装命令 | 留空 |
   | 构建命令 | 留空 |
   | 构建产物目录 | `.` |
   | 部署路径 | `/` |
   | 首页 / 索引文档 | `index.html` |

6. 确认部署对象是本次新建的空站点，开始部署，等待成功。
7. 从控制台复制实际的默认域名。首次打开可能出现 CloudBase 的测试提示页，按页面指引进入。

若页面使用「上传文件夹」而非 ZIP，上传 `site/` 里的内容，保证服务器根路径直接能访问 `/index.html`。
不要上传整个 Git 仓库，也不要把网站放在 `/site/` 子路径下，因为现有资源采用根路径引用。

## 方式二：官方 CLI

已经有 CloudBase 环境、希望命令行部署时，可使用官方 CLI。Node.js 与 npm 需事先安装。

```sh
npm install -g @cloudbase/cli
cloudbase login
cloudbase hosting deploy site -e YOUR_ENV_ID
```

将 `YOUR_ENV_ID` 替换为控制台中核实的、本次测试环境的真实 ID。
命令会上传到该环境根路径，先确认不会覆盖现有网站。登录凭据留在工具的凭据存储中，不提交到 Git。

## 部署后的验证

- 首页显示「墨禪 · 草書經卷」，字体和原作图片正常加载。
- 心经与金刚经可以切换，金刚经可以浏览第 1 至第 32 分。
- 字体切换、横排/直排、米字格、字号、名家字帖放大正常。
- 无 `content.json`、字体或图片 404。
- 在中国大陆不启用 VPN 的实际网络上测试，分别记录运营商、日期、是否能进入页面。
- 把测试网址、环境名称、地域、套餐和到期时间写进 `PROGRESS.md`，再提交到 GitHub。

## 更新后重新打包

如果修改了 `site/`，应重新打包，不能再直接上传旧 ZIP。
在仓库根目录使用以下任一方式生成一个新包：

macOS / Linux（有 `zip` 命令）：

```sh
cd site
zip -r ../mochan-caoshu-updated.zip index.html style.css app.js content.json assets
cd ..
```

Windows PowerShell：

```powershell
Compress-Archive -Path .\site\* -DestinationPath .\mochan-caoshu-updated.zip
```

使用未被占用的新文件名，避免与旧包内容混淆。ZIP 解压后顶层应直接包含 `index.html`。

## 官方说明

- [纯静态项目部署与配置](https://docs.cloudbase.net/hosting/web-hosting-static)
- [新建环境与免费资格](https://docs.cloudbase.net/quick-start/create-env)
- [默认域名的测试限制](https://docs.cloudbase.net/service/alias)

文档核验日期：2026-09-30。
