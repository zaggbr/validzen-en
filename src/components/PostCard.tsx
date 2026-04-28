import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

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
      to={`/content/${slug}`}
      className="group flex flex-col rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-secondary/30 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">
          {category}
        </span>
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
          <Clock className="h-3 w-3" />
          <span>{readTime} Min Discovery</span>
        </div>
      </div>
      <h3 className="mb-3 text-xl font-bold leading-tight text-title tracking-tight group-hover:text-secondary transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="mb-6 text-sm text-muted-foreground leading-relaxed line-clamp-2">{excerpt}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-0 transition-all group-hover:opacity-100 flex items-center gap-2">
          Embark <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default PostCard;
