import ExperienceCard from "./ExperienceCard";
import Spinner from "@/features/shared/components/ui/Spinner";
import { ExperienceForList } from "../types";
type ExperinceListProps = {
  experiences: ExperienceForList[];
  isLoading?: boolean;
  noExperiencesMessage?: string;
};
const ExperienceList = ({
  experiences,
  isLoading,
  noExperiencesMessage = "No experiences found",
}: ExperinceListProps) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {isLoading && (
        <div className="flex justify-center">s
          <Spinner />
        </div>
      )}
      {experiences.map((e) => (
        <ExperienceCard experience={e} key={e.id} />
      ))}
      {!isLoading && experiences.length===0 && (
        <div className="flex justify-center">
          <span>{noExperiencesMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ExperienceList;
