# Render 免费部署

Render 是此前选择的目标平台；因账号要求银行卡验证，用户已改试 Netlify，当前操作见 [NETLIFY.md](NETLIFY.md)。以下保留 Render 接续参考。原站没有后端，若恢复该路线应部署为 Static Site。

## 当前账号实测状态（2026-09-30）

网站快照和部署参数均已校验通过，Render 登录已完成，但当前账号在两条创建路径均要求银行卡身份验证：

- 一键 Blueprint：`Payment Information Required`，已取消。
- 手动 Static Site：提交后弹出 `Add Card` / `Add credit card to verify your identity.`，同时显示 `need_payment_info`，已取消。

没有填入付款资料或提交银行卡授权；Overview 显示 `My project — No active services`。没有已上线的 Render 地址。
保留“不绑定银行卡”的用户约定，不能继续通过该验证关卡；账号限制未解决时，不要将一键按钮或正确的配置误报为部署成功。

## 手机或电脑一键部署

打开 [Deploy to Render](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FJackLee992%2Fmochan-caoshu)，登录自己的 Render 账号。仓库根目录的 `render.yaml` 已包含配置。

1. 如首次注册需要接受服务条款或完成邮箱验证，由账号持有人操作。
2. 检查待创建资源：只有一个名为 `mochan-caoshu` 的 Static Site，没有数据库、磁盘或付费 Web Service。
3. 使用免费的工作区方案，不购买域名，不开通付费套餐，也不添加银行卡。
4. 如果 GitHub 授权要求选择仓库，只选择 `JackLee992/mochan-caoshu`，不要授权所有私有仓库。如果授权范围超出需要，先停止确认。
5. 如果已存在同名服务，先检查是否是本项目；不要覆盖其他服务，也不要重复创建。
6. 确认部署后，等状态变为 Live。以控制台实际显示的 `https://…onrender.com` 为准，不预先假定名称对应的网址已可用。

如果出现付费要求、银行卡验证或升级提示，先停止，不付款，记录提示后再决定。

## 手动创建时的配置

在 Render 控制台选择 **New → Static Site**，不是 Web Service。

| 字段 | 值 |
| --- | --- |
| Repository | `https://github.com/JackLee992/mochan-caoshu` |
| Branch | `main` |
| Root Directory | 留空，使用仓库根目录 |
| Build Command | `node scripts/verify-snapshot.mjs` |
| Publish Directory | `site` |
| Auto-Deploy | On Commit |
| Environment: `NODE_VERSION` | `22` |
| Environment: `SKIP_INSTALL_DEPS` | `true` |

构建命令只校验网站完整性，不安装依赖，也不生成新页面。只有 `site/` 内的九个文件对外发布。
当前页面使用域名根路径加载资源，没有客户端路径路由，因此无需把所有 404 重写为 `index.html`。
`runtime: static` 的 Blueprint 不应设置 `plan`、`region` 或 `startCommand`。

## 部署验收

- 首页、`/style.css`、`/app.js`、`/content.json` 以及所有字体、图片返回成功。
- 可切换《心经》和《金刚经》，金刚经包含 32 分。
- 字体切换、米字格、原作查看功能正常。
- 控制台显示的发布提交与 GitHub 预期提交一致。
- 用户手机关闭 VPN 后，分别使用移动网络和 Wi-Fi 检查加载情况。外部网络返回 200 不等于大陆网络已验证。
- 将实际网址、服务 ID、部署状态和验证结果写回 `PROGRESS.md`；不要写入 API Key、Cookie 或临时登录链接。

## 后续更新与免费边界

连接 GitHub 后，向 `main` 推送更新可触发自动部署。修改 `site/` 后要同步维护 `manifest.json`，否则构建校验会有意失败，防止上传缺损或不一致的快照。现有 ZIP 是原始快照，主动修改网站后也应更新它。

Static Site 没有动态免费服务的 15 分钟闲置休眠，但仍占用工作区免费流量和构建额度。
Render 官方说明：添加支付方式后，超出某些免费额度可能产生费用；不添加支付方式时，超额可能暂停服务或新构建。因此不把“免费”理解为无限流量，也不绑定银行卡。

未来如创建免费动态服务，需要另行考虑休眠、临时文件系统和数据库持久化；Render 的免费 PostgreSQL 不是永久免费数据库。

## 官方参考

- [静态站点](https://render.com/docs/static-sites)
- [Blueprint 配置](https://render.com/docs/blueprint-spec)
- [一键部署按钮](https://render.com/docs/deploy-to-render)
- [免费额度及限制](https://render.com/docs/free)
- [费用常见问题](https://render.com/docs/faq)
- [Node.js 版本](https://render.com/docs/node-version)
