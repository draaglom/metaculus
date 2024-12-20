"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import MultipleChoiceTile from "@/components/multiple_choice_tile";
import { useAuth } from "@/contexts/auth_context";
import { TimelineChartZoomOption } from "@/types/charts";
import { PostStatus, QuestionStatus } from "@/types/post";
import { QuestionType, QuestionWithForecasts } from "@/types/question";
import { generateChoiceItemsFromMultipleChoiceForecast } from "@/utils/charts";
import { generateUserForecastsForMultipleQuestion } from "@/utils/questions";

import QuestionNumericTile from "./question_numeric_tile";

type Props = {
  question: QuestionWithForecasts;
  authorUsername: string;
  curationStatus: PostStatus | QuestionStatus;
  hideCP?: boolean;
  forecasters?: number;
};

const QuestionChartTile: FC<Props> = ({
  question,
  authorUsername,
  curationStatus,
  hideCP,
  forecasters,
}) => {
  const t = useTranslations();
  const { user } = useAuth();
  const isForecastEmpty =
    question.aggregations.recency_weighted.history.length === 0;
  const isCPRevealed = question.cp_reveal_time
    ? new Date(question.cp_reveal_time) <= new Date()
    : true;
  if (curationStatus === PostStatus.PENDING) {
    return (
      <div>
        {t("createdByUserOnDate", {
          user: authorUsername,
          date: question.created_at.slice(0, 7),
        })}
      </div>
    );
  }

  if (isForecastEmpty) {
    if (curationStatus !== PostStatus.OPEN) {
      return null;
    }
    if (forecasters === 0) {
      return <div>{t("forecastDataIsEmpty")}</div>;
    }
  }

  const defaultChartZoom: TimelineChartZoomOption = user
    ? TimelineChartZoomOption.All
    : TimelineChartZoomOption.TwoMonths;

  switch (question.type) {
    case QuestionType.Numeric:
    case QuestionType.Date:
    case QuestionType.Binary:
      return (
        <QuestionNumericTile
          question={question}
          curationStatus={curationStatus}
          defaultChartZoom={defaultChartZoom}
          hideCP={hideCP}
          isCPRevealed={isCPRevealed}
          forecasters={forecasters}
        />
      );
    case QuestionType.MultipleChoice: {
      const visibleChoicesCount = 3;

      const choices = generateChoiceItemsFromMultipleChoiceForecast(question, {
        activeCount: visibleChoicesCount,
      });
      const userForecasts = generateUserForecastsForMultipleQuestion(question);
      const actualCloseTime = question.actual_close_time
        ? new Date(question.actual_close_time).getTime()
        : null;
      return (
        <MultipleChoiceTile
          timestamps={question.aggregations.recency_weighted.history.map(
            (forecast) => forecast.start_time
          )}
          choices={choices}
          visibleChoicesCount={visibleChoicesCount}
          defaultChartZoom={defaultChartZoom}
          question={question}
          userForecasts={userForecasts}
          hideCP={hideCP}
          isCPRevealed={isCPRevealed}
          actualCloseTime={actualCloseTime}
        />
      );
    }
    default:
      return null;
  }
};

export default QuestionChartTile;
