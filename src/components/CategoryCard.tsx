import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

interface CategoryCardProps {
  emoji: string;
  name: string;
  slug: string;
  postCount: number;
}

const CategoryCard = ({ emoji, name, slug, postCount }: CategoryCardProps) => {
  const { localePath } = useI18n();

  return (
    <Link
      to={localePath(`/categoria/${slug}`)}
      className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:border-secondary/40 hover:shadow-md"
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-card-foreground group-hover:text-secondary transition-colors">
        {name}
      </span>
      <span className="text-xs text-muted-foreground">{postCount} posts</span>
    </Link>
  );
};

export default CategoryCard;
