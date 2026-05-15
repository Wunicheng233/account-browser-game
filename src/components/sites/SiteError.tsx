interface SiteErrorProps {
  title: string;
  message: string;
}

export function SiteError({ title, message }: SiteErrorProps) {
  return (
    <div className="site-card" role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
