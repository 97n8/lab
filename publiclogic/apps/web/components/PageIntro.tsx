type PageIntroProps = {
  eyebrow: string;
  title: string;
  lede: string;
};

export function PageIntro({ eyebrow, title, lede }: PageIntroProps) {
  return (
    <section className="section page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="lede">{lede}</p>
    </section>
  );
}
