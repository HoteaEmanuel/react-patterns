import { Badge } from "@/features/shared/components/ui/Badge";
import Link from "@/features/shared/components/ui/Link";
import { Tag } from "@advanced-react/server/database/schema";


type TagCardProps = {
  tag: Tag;
};
const TagCard = ({ tag }: TagCardProps) => {
  return (
    <Badge className="cursor-pointer px-2 py-1 hover:scale-105">
      <Link to="/tags/$tagId" params={{ tagId: tag.id }} variant={"ghost"}>
       {tag.name}
      </Link>
    </Badge>
  );
};

export default TagCard;
