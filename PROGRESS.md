# 当前进展与交接

更新时间：2026-09-30（Asia/Shanghai）。

## 目标和已确认的选择

用户希望中国大陆访客无需 VPN 就能访问「墨禅 · 草书经卷」。原站托管在 ChatGPT Sites。
用户目前没有自有域名，最初选择「先用无域名的开发测试地址」。后续明确接受国外平台，希望零成本、部署简单、平台同时支持静态网站和动态后端，且大陆不至于普遍无法访问。
最新确认改试 **Netlify 免费档**；Render 当前账号要求银行卡验证，CloudBase 也不是当前部署路线。不购买域名、不绑定银行卡、不擅自开通付费套餐。
当前网站无后端，使用静态托管；不为尚未存在的后端需求引入服务器。
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
- 已上传现成 ZIP 到 Netlify Drop，平台生成一个临时项目，当前等待账号认领。
- 新增 `docs/NETLIFY.md` 和可选的仓库部署配置 `netlify.toml`；本次 Drop 上传未连接 GitHub。

## 本次接续结果（2026-09-30，Asia/Shanghai）

- 已在用户本机 Chrome 确认 Render 登录成功，已越过邮箱验证步骤。
- 创建前核对控制台：当前账号没有已有的 `mochan-caoshu` 服务。
- 本次使用的 GitHub 提交：`3fd54f9c09fb5c204efd329b9bc7b87eebb3a7ef`（`main`）。
- 执行现有 `node scripts/verify-snapshot.mjs` 成功：九个文件、八条本地资源引用、1,274,080 字节、三十二分金刚经，JavaScript 与字体/图片格式有效。
- 一键 Blueprint 入口找到 `render.yaml`，但弹出 `Payment Information Required`，提示服务需要账户添加付款信息；没有输入或提交付款信息，已取消。
- 改用手动 **New → Static Site → Public Git Repository**，仓库为 `JackLee992/mochan-caoshu`；名称 `mochan-caoshu`、分支 `main`、Root Directory 留空、Build Command 为 `node scripts/verify-snapshot.mjs`、Publish Directory 为 `site`，环境变量为 `NODE_VERSION=22` 和 `SKIP_INSTALL_DEPS=true`。创建表单 Auto-Deploy 显示 `On Commit`。
- 点击 `Deploy Static Site` 后，当前账号再次弹出 `Add Card` / `Add credit card to verify your identity.`，页面同时显示 `need_payment_info`。提示包括 1 USD 的临时银行卡授权验证。这是实际账号限制，不能用一般“免费静态托管”说明替代。
- 严格按“不绑定银行卡、不付费”的要求停止，未填入银行卡或账单地址，未提交任何付款操作。
- 取消弹窗后再次检查 Overview：`My project` 显示 `No active services`。没有获得站点服务 ID、Live 部署或 `onrender.com` 网址。默认项目的出现不表示网站已创建。
- 手动配置表单保留在 Chrome，可在账号限制解决后继续；没有另建第二个网站服务，没有覆盖其他站点。
- 未连接 GitHub 应用；当前属于公开仓库导入，不能据表单 `On Commit` 就宣称提交触发自动发布已经验证。
- **本次结果：发布被 Render 账号银行卡身份验证要求阻塞；尚未上线。**

## 尚未完成

- Netlify 账号登录/注册、认领临时项目、设为公开并取得长期生产网址。
- 公开后首页与全部资源返回成功、经文/章节/字体/米字格/原作放大交互验收。
- GitHub 自动部署尚未配置；本次 Netlify Drop 属于手动发布，推送仓库不会自动更新站点。
- 中国大陆手机流量和 Wi-Fi 关闭 VPN 后的实际访问验证；匿名临时项目带密码，不能据此宣称大陆无障碍可达。

Render 的阻塞已从“尚未登录 / Mac 锁定”更新为“要求银行卡身份验证”；用户随后明确要求改试 Netlify。
仓库不保存密码、访问令牌、Cookie、浏览器配置、邮箱验证链接或银行卡资料。
CloudBase 已不再是当前部署路线；Gitee 不是 Render 部署前置条件。

## Netlify 接续结果（2026-09-30，Asia/Shanghai）

- 使用本机 Chrome 中的 Netlify Drop 页面，通过本机文件选择器上传仓库的 `mochan-caoshu-static.zip`。
- 上传前检查 ZIP：路径安全、顶层入口正确、九个文件的 SHA-256 与 `site/` 逐项相同。
- 平台实际显示 `Your project is live`，临时项目名 `fanciful-pegasus-b45762`；匿名项目仅有一小时认领窗口，认领前需要临时密码。
- 点击 **Claim this site** 后到达登录/注册页面。注册页明确涉及接受 Netlify 服务条款，已交由账号持有人完成。
- Drop 页明确显示 `No credit card required or overages on our free plan.`；没有填入银行卡、接受收费升级或付款。
- **当前结果：静态文件已上传成功，等待账号认领。临时 Live 预览不等于长期公开发布，暂无已验收的长期 Netlify 地址。**

## 下一步

1. 在本次 Chrome 认领页面登录/注册 Netlify，由账号持有人完成服务条款确认；优先认领 `fanciful-pegasus-b45762`，避免另建项目。
2. 只用 Free 方案；如出现卡验证、收费或升级要求，停止记录。若匿名项目已过期，登录后上传现成 ZIP。
3. 认领后确认项目公开，可选更名为 `mochan-caoshu`；实际网址以控制台显示为准。
4. 完成经文切换、金刚经 32 分、三种字体、米字格、原作放大和全部本地资源验收，并单独记录用户大陆无 VPN 实测。
5. 若以后连接 GitHub，另行确认授权范围并验证真实提交触发；目前不能宣称自动发布。
6. 更新本文件和 README 的实际网址、项目状态、发布证据；不写入 API Key、Cookie 或付款资料。
7. Render 保持停止状态，不反复提交创建服务或填写付款信息；只有用户以后选择恢复且自行解决账号限制时再复查。

当前操作见 [docs/NETLIFY.md](docs/NETLIFY.md)；Render 历史方案见 [docs/RENDER.md](docs/RENDER.md)。

## 已调研结论及其边界

以下是 2026-09-30 核验的状态；实际部署时仍需以控制台最新规则为准。

### ChatGPT Site 与 IP 访问

原域名在此前测试链路上通过 Cloudflare 返回 200，节点标识为 NRT。直接用解析得到的共享 IP 访问，
HTTP 返回 403，HTTPS 握手失败；指定原域名的 Host/SNI 后才返回 200。
因此直接把 IP 发给访客不可行，也不能据此认定更换 DNS 就能解决问题。
这些结果不代表完成了大陆三网测试，尚未确定每个大陆网络访问失败的具体原因。

Sites 提供自定义域名能力，但仅更换域名不能保证底层网络可达性。
用户目前无自有域名，已选择先做独立的静态测试部署。

### Netlify（当前选定）

静态文件可通过 Drop 上传；匿名项目需在一小时内认领，认领前受临时密码保护。长期公开访问需登录认领并检查项目可见性。
Free 当前每月提供 300 个团队共享 credits，生产部署、流量和请求会消耗额度；额度耗尽会暂停项目直到下一周期，不自动收取超额费用。
本次平台页面明确说 Free 不需要银行卡。网站成功上传，但认领、公开验收和大陆网络实测尚未完成。

- [Drop 快速入门](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/)
- [Drop 一小时认领窗口说明](https://www.netlify.com/blog/thirteen-years-of-netlify-drop/)
- [项目可见性](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/)
- [免费额度方案](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)

### Render（账号要求银行卡验证，当前不部署）

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
