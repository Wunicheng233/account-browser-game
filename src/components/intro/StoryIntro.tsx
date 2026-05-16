interface StoryIntroProps {
  onDismiss: () => void;
}

export function StoryIntro({ onDismiss }: StoryIntroProps) {
  return (
    <div className="intro-backdrop">
      <section className="intro-dialog" role="dialog" aria-modal="true" aria-labelledby="story-intro-title">
        <p className="intro-eyebrow">CloudyAI Account Desk</p>
        <h1 id="story-intro-title">剧情说明</h1>
        <p className="intro-lede">
          你正在使用一台过分合规的伪浏览器，尝试注册一个 CloudyAI 账号。系统会像热爱表格的门卫一样逐条审视你，
          直到它终于批准你，然后立刻怀疑你。
        </p>
        <div className="intro-grid" aria-label="玩法和道具">
          <section>
            <h2>你正在干什么</h2>
            <p>
              先完成注册，再面对封号后的申诉流程。右侧规则会一条一条冒出来，你要改表单、找证据、处理自相矛盾的要求。
            </p>
          </section>
          <section>
            <h2>规则怎么赢</h2>
            <p>
              当前规则通过后，下一个规则才会露面。每条规则都是真的要求，也都带一点官僚系统独有的幽默感。
            </p>
          </section>
          <section>
            <h2>浏览器</h2>
            <p>地址栏能打开网址，也能搜索线索。验证码、区号、证件、邮箱工单和时区报告都可能藏在网页里。</p>
          </section>
          <section>
            <h2>代理</h2>
            <p>有些网站需要 Proxy ON 才理你；有些本地服务看到代理就关门。失败页通常比客服更诚实。</p>
          </section>
        </div>
        <button type="button" className="primary-button intro-action" onClick={onDismiss} autoFocus>
          开始被审核
        </button>
      </section>
    </div>
  );
}
