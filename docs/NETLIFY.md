# Netlify 免费静态部署

当前用户已选择改试 Netlify。网站是完整静态快照，只需发布 `site/` 内的九个文件；不需要后端或数据库。
不购买域名、不添加银行卡、不开通付费方案。

## 本次状态（2026-10-01）

首次部署时将校验过的 `mochan-caoshu-static.zip` 上传到 Netlify Drop。ZIP 顶层为 `index.html`，九个文件与 `site/` 内容完全一致。
初始临时名称为 `fanciful-pegasus-b45762`。账号持有人已完成登录和认领，已将同一个项目更名为 `mochan-caoshu`、设为 Public。
正式网站：<https://mochan-caoshu.netlify.app>；控制台：<https://app.netlify.com/projects/mochan-caoshu/overview>。
当前生产部署 ID：`6abe0aa28f3e78a84e995656`；来自 Drop，控制台显示 Currently published，2026-10-01 15:24（Asia/Shanghai）发布，本次4个变更文件、部署包含完整9个文件。通过原项目的文件夹入口上传 `site/`；同步ZIP也已完成校验，可用于后续更新。前一版疏朗设计部署 `6abd135afaf1b7ea160d892d` 和首次认领部署 `6abcfde2fabe2f2caa80b714` 作为历史版本保留。
账号账单页面确认 Free、无银行卡资料；不受匿名 Drop 一小时认领期限限制。

当前版本采用浅纸色、开放书目、朱色细线与轻工具栏；手机五部经典直接选择，小屏以两行展示，章节操作紧邻正文。设计说明见 [疏朗书卷设计](design/AIRY-READER.md)。

当前版本已加入81章道德经、20篇论语及永嘉玄觉禅师《证道歌》全文1813字，支持24–200字号、适合中老年使用的大字按钮、全量于右任字库和明确的字体加载/失败重试提示。正文仅在选中字库就绪后显示，去掉标点并按语句和原段落分行；米字格同样分行。经典与字形说明见 [CLASSICS.md](CLASSICS.md)。

当前验收记录见 [PROGRESS.md](../PROGRESS.md) 的2026-10-01更新：完整歌文逐字一致，草书、来源说明、手机五书布局通过；9项公网资源HTTP200，原始哈希均与本地完全一致。本次静态文件总计3,497,078字节，同步ZIP为2,897,238字节。
[疏朗设计版本证据](evidence/netlify-airy-design-2026-09-30.json)、[无标点版本证据](evidence/netlify-unpunctuated-2026-09-30.json)、[字体与经典证据](evidence/netlify-classics-full-font-2026-09-30.json) 和 [首次部署证据](evidence/netlify-2026-09-30.json) 为历史记录。
首次验收曾观察到首页加入326字节纯托管说明HTML注释；它不是可执行脚本，验收仍需区分原始哈希和去除该唯一注释后的内容一致性。
用户在首次发布后已确认手机关闭 VPN，Wi-Fi 和移动网络均正常打开。本次更新仅验证浏览器手机模拟视口，尚无单独真机网络反馈。该用户实测覆盖当时的两种网络，不能扩展为大陆所有地区及运营商保障；本机 HTTP 测试与用户反馈分别记录。

## 在另一台电脑继续

1. 登录原 Netlify 账号，打开已有 `mochan-caoshu` 项目；不要重新匿名上传建立第二个站点。
2. 检查生产域名、Public 状态及当前生产部署，与本次记录一致。
3. 根据后续更新步骤上传到已有项目。仅上传现成 ZIP 或 `site/`，不上传仓库文档、`.git` 或用户其他文件。
4. 更新后再次检查未登录访客可以打开首页、经文、字体和图片。

匿名 Drop 的一小时期限只适用于未认领阶段。本项目已经认领，后续按账号 Free 额度规则运行；不要把历史临时项目名当作当前生产网址。

## 后续更新

此次是手动 Drop 上传，未连接 GitHub；向仓库推送内容不会自动更新网站。
修改站点后同步维护 `manifest.json` 和部署 ZIP，先执行完整性校验，再向现有项目的部署区上传新文件，避免另建项目。

如果用户之后选择自动发布，可使用 **Add new project → Import an existing project → GitHub**，或在现有项目连接仓库。
本仓库附有 `netlify.toml`，使用以下参数：

| 设置 | 值 |
| --- | --- |
| Repository | `JackLee992/mochan-caoshu` |
| Branch | `main` |
| Base directory | 留空，仓库根目录 |
| Build command | `node scripts/verify-snapshot.mjs` |
| Publish directory | `site` |
| Node version | `22` |

如 GitHub 授权扩大到所有私有仓库或引入其他权限，先交由账号持有人确认。配置文件的存在不表示已经连接仓库或验证自动部署。
网站无客户端路由，不需要把所有 404 重写为首页。

## 验收与免费边界

- 控制台生产部署成功，项目已认领并允许公开访问。
- 未登录访问首页和全部九个资源成功，部署文件与仓库快照哈希一致。
- 五部经典切换、32分/81章/20篇章节选择、证道歌完整1813字、三种草书与宋体校读、24–200字号和米字格正常。字体加载中应有提示且正文隐藏；失败可重试；原作放大正常。
- 用户在中国大陆手机关闭 VPN 后，分别用移动网络和 Wi-Fi 实测；本机或外部网络验证不能代表大陆网络可达性。
- 更新 README 和 PROGRESS 中的实际网址、项目状态及验证结果，不保存 Cookie、密码、令牌或登录链接。

当前官方 Free 方案为每月 300 个团队共享 credits，无超额自动收费；用完额度会暂停项目，等待下个周期。
生产部署、流量及请求会消耗额度，不能将免费理解为无限流量或始终不中断。

## 官方参考

- [Netlify Drop 快速入门](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/)
- [新建项目和手动部署](https://docs.netlify.com/manage/projects/add-new-project/)
- [项目可见性](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/)
- [从 Git 仓库部署](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)
- [当前额度方案](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [额度和账单常见问题](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/)
