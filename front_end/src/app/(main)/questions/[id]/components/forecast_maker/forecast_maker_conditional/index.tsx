import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";

import { PostConditional, PostWithForecasts } from "@/types/post";
import {
  QuestionType,
  QuestionWithForecasts,
  QuestionWithNumericForecasts,
} from "@/types/question";

import ForecastMakerConditionalBinary from "./forecast_maker_conditional_binary";
import ForecastMakerConditionalContinuous from "./forecast_maker_conditional_continuous";
import ForecastMakerContainer from "../container";

type Props = {
  post: PostWithForecasts;
  conditional: PostConditional<QuestionWithForecasts>;
  canPredict: boolean;
  predictionMessage: ReactNode;
};

const ForecastMakerConditional: FC<Props> = ({
  post,
  conditional,
  canPredict,
  predictionMessage,
}) => {
  const t = useTranslations();

  const { id: postId, title: postTitle, projects } = post;
  const { condition, condition_child, question_yes, question_no } = conditional;

  if (question_yes.type !== question_no.type) {
    return null;
  }

  return (
    <ForecastMakerContainer
      resolutionCriteria={[
        {
          title: t("parentResolutionCriteria"),
          content: condition.resolution_criteria,
          questionTitle: condition.title,
          finePrint: condition.fine_print,
        },
        {
          title: t("childResolutionCriteria"),
          content: condition_child.resolution_criteria,
          questionTitle: condition_child.title,
          finePrint: condition_child.fine_print,
        },
      ]}
    >
      {question_yes.type === QuestionType.Binary && (
        <ForecastMakerConditionalBinary
          postId={postId}
          postTitle={postTitle}
          conditional={
            conditional as PostConditional<QuestionWithNumericForecasts>
          }
          canPredict={canPredict}
          predictionMessage={predictionMessage}
          projects={projects}
        />
      )}
      {(question_yes.type === QuestionType.Date ||
        question_yes.type === QuestionType.Numeric) && (
        <ForecastMakerConditionalContinuous
          postId={postId}
          postTitle={postTitle}
          conditional={
            conditional as PostConditional<QuestionWithNumericForecasts>
          }
          canPredict={canPredict}
          predictionMessage={predictionMessage}
          projects={projects}
        />
      )}
    </ForecastMakerContainer>
  );
};

export default ForecastMakerConditional;
