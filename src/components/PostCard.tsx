import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface PostCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  slug: string;
}

const PostCard = ({ title, excerpt, category, readTime, slug }: PostCardProps) => {
  return (
    <Link
      to={`/pt/conteudo/${slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-secondary/30 hover:shadow-md"
    >
      <span className="mb-2 inline-block w-fit rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
        {category}
      </span>
      <h3 className="mb-2 text-base font-semibold leading-snug text-card-foreground group-hover:text-secondary transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{readTime}</span>
      </div>
    </Link>
  );
};

export default PostCard;
