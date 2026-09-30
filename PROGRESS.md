# 当前进展与交接

更新时间：2026-09-30（Asia/Shanghai）。

## 目标和已确认的选择

用户希望中国大陆访客无需 VPN 就能访问「墨禅 · 草书经卷」。原站托管在 ChatGPT Sites。
用户目前没有自有域名，最初选择「先用无域名的开发测试地址」。后续明确接受国外平台，希望零成本、部署简单、平台同时支持静态网站和动态后端，且大陆不至于普遍无法访问。
最新确认改用 **Render 免费档**；不再继续当前 CloudBase 部署路线。不购买域名、不绑定银行卡、不擅自开通付费套餐。
当前网站无后端，选择 Render Static Site 避免动态免费实例的休眠。未来确需后端时，可在同平台增加 Web Service，不为尚未存在的需求引入服务器。
用户目前主要使用手机；工作保存在独立公开 GitHub 仓库 <https://github.com/JackLee992/mochan-caoshu>，之后可以在另一台电脑继续。

## 已完成

- 确认原站公开且处于活动状态：<https://mochan-caoshu.s419505080.chatgpt.site>。
- 取得九个完整静态文件，总计 1,274,080 字节，保存于 `site/`。
- 包含《心经》、完整三十二分《金刚经》、三种字体、原作图片，以及页面交互。
- 移除原托管平台响应中注入的 Cloudflare 验证脚本，保留站点本身的内容和来源说明。
- 生成 `mochan-caoshu-static.zip`；ZIP 顶层是 `index.html`，可直接上传静态托管。
- 验证九个文件哈希、所有八条本地资源引用、JavaScript 语法、字体与图片格式及经文章节数量。
- 本仓库包含后续部署说明，不依赖此前聊天中的本机绝对路径。
- 增加 `render.yaml` 和 README 一键部署入口，配置为一个 Static Site，发布目录仅 `site/`，构建阶段执行完整性校验。
- 新增 `docs/RENDER.md`，保留 CloudBase 文档作为历史备选。

## 尚未完成

- 尚未完成 Render 登录和实际部署；尚无确认上线的 `onrender.com` 地址。
- 本机未安装 Render CLI，当前进程未提供 Render API 凭据。用户明确要求不再使用 TinyFish，改用本机 Chrome；当前桌面自动化确认 Mac 已锁定，需要用户先手动解锁，再检查 Chrome 的 Render 登录态。
- CloudBase 未部署；当前已切换到 Render，不再把腾讯云登录作为前置步骤。
- 尚未进行中国大陆电信、联通、移动网络的实际访问测试。
- 尚未创建 Gitee 仓库；它不是当前 Render 部署路线的前置条件。
- 尚未购买或配置自有域名，未办理备案，未支出云服务费用。

之前尝试的临时登录窗口在用户手机上无法打开，已放弃此路线；当前还没有收到 Render 登录成功确认。
继续时仅使用本机 Chrome 检查登录态，必要时请用户在浏览器中登录。
仓库不保存密码、访问令牌、Cookie、浏览器配置或临时登录链接。

## 下一步

1. 由用户解锁 Mac；使用本机 Chrome 检查 Render 登录态，必要时由用户完成登录或注册。不再使用 TinyFish。
2. 检查 Render 内是否已有 `mochan-caoshu` 服务；有则核对是否属于本项目，避免重复创建或覆盖。
3. 打开 README 的 Deploy to Render 入口，或按文档创建 Static Site。
4. 核对待创建资源只有一个免费静态站点，没有数据库、磁盘或付费 Web Service。如出现费用或银行卡要求，先停止。
5. 等待发布状态变为 Live，从控制台复制实际地址，不预先宣称 `mochan-caoshu.onrender.com` 可用。
6. 验证首页、经文切换、32 分章节、字体、米字格、原作放大以及全部资源。
7. 用中国大陆手机流量及 Wi-Fi 关闭 VPN 打开，记录可达性和加载体验；国外节点测试不能代替这一步。
8. 把成功网址、服务 ID、部署提交及测试结果写回本文件。访问密钥和临时登录链接不写进仓库。

详细操作见 [docs/RENDER.md](docs/RENDER.md)。

## 已调研结论及其边界

以下是 2026-09-30 核验的状态；实际部署时仍需以控制台最新规则为准。

### ChatGPT Site 与 IP 访问

原域名在此前测试链路上通过 Cloudflare 返回 200，节点标识为 NRT。直接用解析得到的共享 IP 访问，
HTTP 返回 403，HTTPS 握手失败；指定原域名的 Host/SNI 后才返回 200。
因此直接把 IP 发给访客不可行，也不能据此认定更换 DNS 就能解决问题。
这些结果不代表完成了大陆三网测试，尚未确定每个大陆网络访问失败的具体原因。

Sites 提供自定义域名能力，但仅更换域名不能保证底层网络可达性。
用户目前无自有域名，已选择先做独立的静态测试部署。

### Render（当前选定）

提供免费 Static Site 和免费动态 Web Service，可从 GitHub 部署，分配 `onrender.com` 地址。
当前静态站点不受动态服务闲置 15 分钟休眠的限制，但仍占用工作区免费流量及构建额度。
不添加付款方式；有付款方式时某些超额用量可能计费，没有时可能暂停服务或新构建。
未来动态免费服务涉及休眠和临时文件系统；免费 PostgreSQL 30 天后到期，不宜当长期免费数据库。

外部监测显示 `onrender.com` 样本有正常访问和间歇异常两类，不能保证本项目在所有大陆地区和运营商都可达，必须部署后实测。

- [静态站点](https://render.com/docs/static-sites)
- [免费规则](https://render.com/docs/free)
- [费用常见问题](https://render.com/docs/faq)
- [大陆访问抽样监测，非本项目实测](https://en.greatfire.org/domain/onrender.com)

### CloudBase（原方案，当前不部署）

默认域名用于开发测试，浏览器会显示访问提示中间页，确认后进入站点。
官方说明已取消原默认域名定期续期机制，但仍有流量风控；不允许用于正式生产或大规模分发。
正式网站应使用完成 ICP 备案的自定义域名。免费环境是否可用、免费期和可用功能需在账号内核对。

- [默认域名限制与中间页](https://docs.cloudbase.net/service/alias)
- [HTTP 网关与默认域名说明](https://docs.cloudbase.net/service/introduce)
- [创建云开发环境](https://docs.cloudbase.net/quick-start/create-env)
- [纯静态项目部署](https://docs.cloudbase.net/hosting/web-hosting-static)

### EdgeOne Makers（备选）

大陆访问默认项目/部署域名需使用有效期三小时的预览链接，不适合作为长期分享地址。
自定义域名选「全球可用区（不含中国大陆）」无需备案，但仍依赖跨境链路；
选择包含中国大陆节点的区域需要备案。

- [域名及加速区域规则](https://cloud.tencent.com/document/product/1552/127403)
- [Git 仓库导入与自动部署](https://cloud.tencent.com/document/product/1552/127369)

### Gitee 与代码托管

代码仓库和网站托管是两件事。Gitee 镜像可帮助分发源码，但单独创建仓库不能改变网站访问链路。
找到的是 Gitee Pages 曾暂停服务的历史反馈，未确认当前新用户可用性，不据此断言其永久停服。
本次不把它作为部署依赖。

- [Gitee 历史反馈](https://gitee.com/oschina/git-osc/issues/I9RGKI)

## 内容与权利

原页面保留了于右任字体「私人使用」相关说明，其再分发和商用授权尚未核清；
这里原样保存进展，没有代替用户作出授权判断。图片与其他字体的来源可在页面「内容与来源」中查看。
若后续要正式面向公众推广或商用，应据实际授权选择保留或替换素材。
