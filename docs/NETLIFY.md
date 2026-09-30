# Netlify 免费静态部署

当前用户已选择改试 Netlify。网站是完整静态快照，只需发布 `site/` 内的九个文件；不需要后端或数据库。
不购买域名、不添加银行卡、不开通付费方案。

## 本次状态（2026-09-30）

已将校验过的 `mochan-caoshu-static.zip` 上传到 Netlify Drop。ZIP 顶层为 `index.html`，九个文件与 `site/` 内容完全一致。
平台显示 `Your project is live`，临时名称为 `fanciful-pegasus-b45762`。
匿名上传的项目需要在一小时内 **Claim this site**；认领前受临时密码保护，不能将其当作长期公开网站交付。
当前停在账号认领流程，需账号持有人登录或注册，注册涉及接受平台服务条款。

## 接续认领同一个项目

1. 优先使用本次 Chrome 中保留的 Netlify 认领页面，避免重复创建项目。
2. 已有账号选择 **Log in**；没有账号由账号持有人注册免费账号、接受条款和完成验证。
3. 登录后认领 `fanciful-pegasus-b45762`。只选 Free；如出现银行卡或收费要求，停止记录，不付款。
4. 若项目仍为 Private，在项目概览选择 **Make public**，或在 **Project configuration → General → Visitor access → Project visibility** 设为 Public。
5. 从平台复制实际生产域名，检查未登录访客可以打开首页、经文、字体和图片；匿名临时页的 Live 状态不能替代这项验收。
6. 可将项目名称改为 `mochan-caoshu`；先确认名称可用，以实际控制台显示的网址为准。

如果匿名项目已经过期，登录 Free 账号后在 **Projects → Add new project → Deploy manually** 上传现成 ZIP 或 `site/` 文件夹。
上传范围仅限网站文件，不上传仓库文档、`.git` 或用户其他文件。

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
- 《心经》与《金刚经》切换、32 分章节选择、三种字体、米字格和原作放大正常。
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
