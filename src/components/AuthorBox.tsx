interface AuthorBoxProps {
  name: string;
  avatar: string;
  bio: string;
  credentials: string;
}

const AuthorBox = ({ name, bio, credentials }: AuthorBoxProps) => {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/50 p-8 shadow-sm">
      <div className="flex items-start gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-2xl font-bold text-secondary">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-lg font-bold text-title tracking-tight">{name}</h4>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-secondary">{credentials}</p>
          <p className="mt-4 text-md text-muted-foreground leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
