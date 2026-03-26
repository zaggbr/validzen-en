interface AuthorBoxProps {
  name: string;
  avatar: string;
  bio: string;
  credentials: string;
}

const AuthorBox = ({ name, bio, credentials }: AuthorBoxProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xl font-bold text-secondary">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-card-foreground">{name}</h4>
          <p className="mt-0.5 text-xs font-medium text-secondary">{credentials}</p>
          <p className="mt-2 text-sm text-muted-foreground">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
