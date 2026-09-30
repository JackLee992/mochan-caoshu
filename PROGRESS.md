# 当前进展与交接

更新时间：2026-09-30（Asia/Shanghai）。

## 最新疏朗书卷设计（2026-09-30）

- 按用户“设计不够飘逸”反馈，先生成桌面与手机视觉稿，再落实浅纸色、开放书目、朱色选中线、去掉深色工具栏和纸面阴影；章节选择移到正文上方。
- 手机端四部经典改为一行书名，保留字号滑杆、数值、64/96/160预设、横竖排和米字格；核心按钮实测49像素高。字体雅集与原作页同步使用浅色开放布局。
- 当前生产部署 `6abd135afaf1b7ea160d892d`，2026-09-30 21:49（Asia/Shanghai）发布于 <https://mochan-caoshu.netlify.app>。本次2个变更文件，完整9文件3,475,415字节，ZIP 2,891,204字节；全部公网文件HTTP200且SHA-256与清单一致。
- 本地IAB在1448×1086对照设计稿检查，生产1280宽桌面与390×844手机模拟视口验证；320/390/700/740/768/1024/1280宽度无整页横溢出。200px两种排版与米字格、章节首末及记忆、书体选择、原作200%放大通过。
- 本次仅HTML/CSS外观改变；app.js、content.json、全量字体和原作图不变，沿用已核对的全文、无标点分行及加载失败处理。未将浏览器手机模拟声称为新增真机测试。
- 设计稿/取舍/对照检查：`docs/design/AIRY-READER.md`。发布证据：`docs/evidence/netlify-airy-design-2026-09-30.json`；实际截图：`docs/evidence/images/airy-design-live.jpg` 与 `airy-design-mobile-live.jpg`。

以下为此前版本记录。

## 此前无标点排版（2026-09-30）

- 按用户要求，四部经典正文与书体样例不显示标点，停顿处换行、原段落之间空行；顿号及引号/括号字形直接删除，括号内汉字保留。支持ASCII与Unicode小型标点。来源JSON保留原版本以便复核。
- 直排、横排和米字格采用相同分行。核对全文134个章节，展示汉字顺序和字数完全保持；心经260字、金刚经5179字、道德经5297字、论语15929字。
- 当时生产部署 `6abd0d81385be585d6bcb77c` 已发布至 <https://mochan-caoshu.netlify.app>，本次2个变更文件、完整9文件。当前静态文件3,463,134字节，部署包2,890,265字节。
- 已核对公网文件与实际页面无标点显示；手机390像素视口、200字号、横排米字格保持整页宽度390。验收见 `docs/evidence/netlify-unpunctuated-2026-09-30.json` 和 `docs/evidence/images/unpunctuated-live.jpg`。

以下为此前内容与字体更新记录。


## 此前内容与字体更新（2026-09-30）

- 上一版在原 Netlify 项目完成发布，生产部署为 `6abd0a53030f75973205959f`，网址仍为 <https://mochan-caoshu.netlify.app>。本次上传3个变更文件，部署包含完整9个文件；前一阶段全量字库与经典更新部署为 `6abd087f259226875568c903`。
- 加入王弼本《道德经》全文81章、5297正文汉字，以及维基文库繁体整理本《论语》全文20篇、15929正文汉字。提供章节/篇目下拉选择、前后翻页、切书后保留当前篇章位置。固定来源和异文说明见 `docs/CLASSICS.md`。
- 为中老年受众把默认字号设为48，范围24–200；新增缩小/放大按钮、64/96/160快捷字号。主要阅读与章节控件至少48像素高。
- 按用户“直接用全量字库，不用保留”要求，以原TTF全量转换覆盖旧精简 WOFF2。文件1,812,748字节，保留22153码位、22141字形；全部cmap、轮廓与横纵排度量验证一致，只移除嵌入位图表。CSS字体资源附哈希版本参数。
- 查明原包10794汉字共用「缺」占位，不能把cmap存在当成实际有对应草书。CSS排除占位，真正「缺」仍用原字体；其他字以设备正体补读。心经、金刚经、道德经、论语分别涉及1、1、12、41个独立字。全量文件未删减字符。
- 按最新要求增加字体加载提示：初始HTML不包含可见备用正文；选定草书加载完成后才显示经文，等待时明确显示加载中。下载失败保留占位并提供重新载入，字体雅集样例也等待各自字库。
- 本地模拟8秒字体延迟与503失败，验证加载期间正文隐藏、列印禁用、错误重试、快速切换后旧下载不会覆盖当前书体。CDP实际渲染核对「觀」用原草书 SCFYYREN，「埵」用设备 Kaiti SC。
- 检查81章道德经、20篇论语及32分金刚经的末章与翻页边界。390像素宽手机视口、200像素字大和米字格没有整页横向溢出；阅读区域内部可滚动。
- 上一版静态文件总计3,462,473字节，部署包2,890,000字节；完整性与章节校验通过。当前公网及浏览器证据见 `docs/evidence/netlify-classics-full-font-2026-09-30.json`，字体核查见 `docs/evidence/yu-font-classics-2026-09-30.json`。
- 此次更新发布到 Netlify，未同步旧 ChatGPT Sites 镜像；保持手动 Drop，没有配置 GitHub 自动发布。此前用户手机无VPN反馈覆盖首次发布，不冒充本次新字体下载的手机实测。

以下为首次迁移和部署的历史记录。


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
- 已上传现成 ZIP 到 Netlify Drop，账号持有人完成登录认领，项目更名为 `mochan-caoshu` 并设为 Public，生产网址为 <https://mochan-caoshu.netlify.app>。
- 无 Cookie 请求全部九个静态文件均返回 HTTP 200；八个资源哈希完全一致，首页仅存在 Netlify 注入的纯 HTML 注释，去除该注释后与本地完全一致。
- 新网址已实测经文切换、金刚经 32 分、三种字体、字大、米字格、直排/横排及原作放大。
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

## 后续边界

- GitHub 自动部署尚未配置；本次 Netlify Drop 属于手动发布，推送仓库不会自动更新站点。
- 用户确认手机关闭 VPN 后，Wi-Fi 和移动网络均正常打开。这是用户当前两种网络的实测反馈，不代表大陆所有地区、运营商或未来时间均可达。

Render 的阻塞已从“尚未登录 / Mac 锁定”更新为“要求银行卡身份验证”；用户随后明确要求改试 Netlify。
仓库不保存密码、访问令牌、Cookie、浏览器配置、邮箱验证链接或银行卡资料。
CloudBase 已不再是当前部署路线；Gitee 不是 Render 部署前置条件。

## Netlify 接续结果（2026-09-30，Asia/Shanghai）

- 使用本机 Chrome 中的 Netlify Drop 页面，通过本机文件选择器上传仓库的 `mochan-caoshu-static.zip`。
- 上传前检查 ZIP：路径安全、顶层入口正确、九个文件的 SHA-256 与 `site/` 逐项相同。
- 平台实际显示 `Your project is live`，临时项目名 `fanciful-pegasus-b45762`；匿名项目仅有一小时认领窗口，认领前需要临时密码。
- 点击 **Claim this site** 后到达登录/注册页面。注册页明确涉及接受 Netlify 服务条款，已交由账号持有人完成。
- Drop 页明确显示 `No credit card required or overages on our free plan.`；没有填入银行卡、接受收费升级或付款。
- 用户确认已登录并认领；控制台实际进入项目概览，提示项目应用团队默认 Private 可见性。
- 在 **Make public** 中确认 Public、检查新名称可用，将同一个项目更名为 `mochan-caoshu` 后公开；平台显示 `Your project is public` / `Anyone can visit your production site.`，没有重复建站。
- **正式生产网址：<https://mochan-caoshu.netlify.app>**；控制台：<https://app.netlify.com/projects/mochan-caoshu/overview>。
- 首次生产部署 ID：`6abcfde2fabe2f2caa80b714`，控制台显示 `Currently published`、`Production`、`9 new files uploaded`，来自 Netlify Drop。网站快照对应原仓库提交 `3fd54f9c09fb5c204efd329b9bc7b87eebb3a7ef`；后续提交仅新增交接说明和可选配置，没有改动 `site/` 或 ZIP。
- **Usage & billing** 实际显示 `Free`、`You are on the free plan. You do not need to enter payment information.`、`No credit card info saved`。没有开通付费升级或添加付款方式。
- 无 Cookie 验收：首页及全部九项静态资源 HTTP 200、类型有效，没有密码框或原托管验证脚本；八个资源 SHA-256 与本地完全一致。首页可能被 Netlify 插入 326 字节托管说明 HTML 注释，去除唯一该注释后与本地完全一致，没有新增可执行脚本。因此不能说九项原始哈希全部相同。
- 在原文浏览器验证《心经》显示 260 字、《金刚经》章节选项 32 个、可跳转第 32 分和上一品；于右任/龙藏/马善政三种字体类切换正确、字大可调至 54、横排与米字格状态正确。
- 原作全幅图片成功加载（原图宽 2193 像素），放大控件可到 250%，显示宽度同步为 250%；已恢复默认心经直排页面。
- 验收证据保存于 [docs/evidence/netlify-2026-09-30.json](docs/evidence/netlify-2026-09-30.json)。
- 用户在本次会话确认：手机关闭 VPN 后，Wi-Fi 和移动网络「两种都能正常打开」。记录为用户实测反馈，区别于本机自动 HTTP 验收，不扩大为大陆全部网络保障。
- **当前结果：Netlify 正式公开发布成功，已认领，不受匿名 Drop 一小时认领期限限制；资源与功能验收通过，用户手机无 VPN 的 Wi-Fi 和移动网络访问均正常。**

## 下一步

1. 当前发布和访问验收已完成。未来若访问失败，记录当时实际网络与现象，不据本次两种网络成功宣称大陆全部网络始终可达。
2. 后续更新使用现有 `mochan-caoshu` 项目；先校验并同步部署包，再手动上传。不要重复认领或另建项目。
3. 若以后连接 GitHub，另行确认授权范围并验证真实提交触发；目前不能宣称自动发布。
4. 保持 Free，不绑卡、不升级；额度用完时按平台免费规则暂停或等待下一周期。
5. 更新实际状态和发布证据，不写入 API Key、Cookie 或付款资料。
6. Render 保持停止状态，不反复提交创建服务或填写付款信息；只有用户以后选择恢复且自行解决账号限制时再复查。

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
本次实际账号 Free、无银行卡；网站已认领并成功公开，通过无 Cookie 资源和页面交互验收。用户确认手机关闭 VPN 后，Wi-Fi 和移动网络均正常打开；此结果仅覆盖用户当时的网络。

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
