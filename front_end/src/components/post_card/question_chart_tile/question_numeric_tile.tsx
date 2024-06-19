import { FC } from "react";

import NumericChart from "@/components/charts/numeric_chart";
import PredictionChip from "@/components/prediction_chip";
import { PostStatus } from "@/types/post";
import { QuestionWithNumericForecasts } from "@/types/question";
import { getNumericChartTypeFromQuestion } from "@/utils/charts";

const HEIGHT = 100;

type Props = {
  question: QuestionWithNumericForecasts;
  curationStatus: PostStatus;
};

const QuestionNumericTile: FC<Props> = ({ question, curationStatus }) => {
  const prediction =
    question.forecasts.values_mean[question.forecasts.values_mean.length - 1];

  return (
    <div className="flex justify-between">
      <div className="mr-3 inline-flex flex-col justify-center gap-0.5 text-xs font-semibold text-gray-600 dark:text-gray-600-dark xs:max-w-[650px]">
        <PredictionChip
          prediction={prediction}
          resolution={question.resolution}
          nr_forecasters={question.nr_forecasters}
          status={curationStatus}
          questionType={question.type}
        />
      </div>
      <div className="my-1 w-2/3 min-w-24 max-w-[500px] flex-1 overflow-visible">
        <NumericChart
          dataset={question.forecasts}
          height={HEIGHT}
          type={getNumericChartTypeFromQuestion(question.type)}
        />
      </div>
    </div>
  );
};

export default QuestionNumericTile;