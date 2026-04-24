import { Link } from "react-router-dom";
import { stripEmojis } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  postCount: number;
}

const CategoryCard = ({ name, slug, postCount }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${slug}`}
      className="group flex flex-col items-center gap-4 rounded-[1.5rem] border border-border bg-card/50 p-8 text-center shadow-sm transition-all duration-300 hover:border-secondary/40 hover:shadow-xl hover:-translate-y-1"
    >
      <span className="text-md font-black text-title italic tracking-tight group-hover:text-secondary transition-colors">
        {stripEmojis(name)}
      </span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 italic">
        {postCount} {postCount === 1 ? 'Insight' : 'Insights'}
      </span>
    </Link>
  );
};

export default CategoryCard;
