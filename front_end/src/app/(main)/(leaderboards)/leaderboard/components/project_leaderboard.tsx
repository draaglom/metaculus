import classNames from "classnames";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

import WithServerComponentErrorBoundary from "@/components/server_component_error_boundary";
import SectionToggle from "@/components/ui/section_toggle";
import LeaderboardApi from "@/services/leaderboard";
import { LeaderboardType } from "@/types/scoring";

import ProjectLeaderboardTable from "./project_leaderboard_table";

type Props = {
  projectId: number;
  prizePool: string | null;
  leaderboardType?: LeaderboardType;
  userId?: number;
  isQuestionSeries?: boolean;
};

const ProjectLeaderboard: FC<Props> = async ({
  projectId,
  prizePool,
  leaderboardType,
  isQuestionSeries,
  userId,
}) => {
  const leaderboardDetails = await LeaderboardApi.getProjectLeaderboard(
    projectId,
    leaderboardType
  );

  if (!leaderboardDetails || !leaderboardDetails.entries.length) {
    return null;
  }

  const prizePoolValue = !isNaN(Number(prizePool)) ? Number(prizePool) : 0;

  const t = await getTranslations();

  const leaderboardTitle = isQuestionSeries
    ? t("openLeaderboard")
    : t("leaderboard");

  return (
    <SectionToggle
      title={leaderboardTitle}
      variant={isQuestionSeries ? "primary" : "gold"}
    >
      <ProjectLeaderboardTable
        leaderboardDetails={leaderboardDetails}
        prizePool={prizePoolValue}
        userId={userId}
      />
    </SectionToggle>
  );
};

export default WithServerComponentErrorBoundary(ProjectLeaderboard);
