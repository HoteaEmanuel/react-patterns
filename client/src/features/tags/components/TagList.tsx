import { Tag } from "@advanced-react/server/database/schema";
import TagCard from "./TagCard";

type TagListProps = {
  tags: Tag[];
};

const TagList = ({ tags }: TagListProps) => {
  if (tags.length === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {tags.map((t) => (
        <TagCard tag={t} key={t.id} />
      ))}
    </div>
  );
};

export default TagList;
