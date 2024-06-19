"use client";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { round } from "lodash";
import { useTranslations } from "next-intl";
import React, { FC, useCallback, useMemo, useState } from "react";

import { createForecasts } from "@/app/(main)/questions/actions";
import Button from "@/components/ui/button";
import { FormError } from "@/components/ui/form_field";
import { METAC_COLORS, MULTIPLE_CHOICE_COLOR_SCALE } from "@/constants/colors";
import { useAuth } from "@/contexts/auth_context";
import { useModal } from "@/contexts/modal_context";
import { ErrorResponse } from "@/types/fetch";
import { QuestionWithNumericForecasts } from "@/types/question";
import { extractPrevBinaryForecastValue } from "@/utils/forecasts";
import { extractQuestionGroupName } from "@/utils/questions";

import {
  BINARY_FORECAST_PRECISION,
  BINARY_MAX_VALUE,
  BINARY_MIN_VALUE,
} from "../binary_slider";
import ForecastChoiceOption from "../forecast_choice_option";

type QuestionOption = {
  id: number;
  name: string;
  communityForecast: number | null;
  forecast: number | null;
  isDirty: boolean;
  color: {
    DEFAULT: string;
    dark: string;
  };
};

type Props = {
  postId: number;
  questions: QuestionWithNumericForecasts[];
};

const ForecastMakerGroupBinary: FC<Props> = ({ postId, questions }) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { setCurrentModal } = useModal();

  const prevForecastValuesMap = useMemo(
    () =>
      questions.reduce<Record<number, number | null>>(
        (acc, question) => ({
          ...acc,
          [question.id]: extractPrevBinaryForecastValue(
            question.forecasts.my_forecasts?.slider_values
          ),
        }),
        {}
      ),
    [questions]
  );
  const [questionOptions, setQuestionOptions] = useState<QuestionOption[]>(
    generateChoiceOptions(questions, prevForecastValuesMap)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<ErrorResponse[]>([]);
  const questionsToSubmit = useMemo(
    () =>
      questionOptions.filter(
        (option) => option.isDirty && option.forecast !== null
      ),
    [questionOptions]
  );
  const submitIsAllowed = !isSubmitting && !!questionsToSubmit.length;
  const isPickerDirty = useMemo(
    () => questionOptions.some((option) => option.isDirty),
    [questionOptions]
  );

  const resetForecasts = useCallback(() => {
    setQuestionOptions((prev) =>
      prev.map((prevQuestion) => ({
        ...prevQuestion,
        isDirty: false,
        forecast: prevForecastValuesMap[prevQuestion.id] ?? null,
      }))
    );
  }, [prevForecastValuesMap]);
  const handleForecastChange = useCallback((id: number, forecast: number) => {
    setQuestionOptions((prev) =>
      prev.map((prevQuestion) => {
        if (prevQuestion.id === id) {
          return { ...prevQuestion, isDirty: true, forecast };
        }

        return prevQuestion;
      })
    );
  }, []);
  const handlePredictSubmit = useCallback(async () => {
    setSubmitErrors([]);

    if (!questionsToSubmit.length) {
      return;
    }

    setIsSubmitting(true);
    const responses = await createForecasts(
      postId,
      questionsToSubmit.map((q) => {
        const forecastValue = round(
          q.forecast! / 100,
          BINARY_FORECAST_PRECISION
        );

        return {
          questionId: q.id,
          forecastData: {
            probabilityYes: forecastValue,
            probabilityYesPerCategory: null,
            continuousCdf: null,
          },
          sliderValues: forecastValue,
        };
      })
    );
    setQuestionOptions((prev) =>
      prev.map((prevQuestion) => ({ ...prevQuestion, isDirty: false }))
    );
    setIsSubmitting(false);

    const errors: ErrorResponse[] = [];
    for (const response of responses) {
      if ("errors" in response && !!response.errors) {
        errors.push(response.errors);
      }
    }
    if (errors.length) {
      setSubmitErrors(errors);
    }
  }, [postId, questionsToSubmit]);

  return (
    <>
      <table className="mt-3 border-separate rounded border border-gray-300 bg-gray-0 dark:border-gray-300-dark dark:bg-gray-0-dark">
        <thead>
          <tr>
            <th className="bg-blue-100 p-2 text-left text-xs font-bold dark:bg-blue-100-dark">
              {t("Candidates")}
            </th>
            <th className="bg-blue-100 p-2 pr-4 text-right text-xs dark:bg-blue-100-dark">
              <FontAwesomeIcon
                icon={faUserGroup}
                size="sm"
                className="align-middle text-olive-700 dark:text-olive-700-dark"
              />
            </th>
            <th
              className="hidden bg-blue-100 p-2 text-left text-xs font-bold text-orange-800 dark:bg-blue-100-dark dark:text-orange-800-dark sm:table-cell"
              colSpan={2}
            >
              My Prediction
            </th>
            <th className="bg-blue-100 p-2 text-center text-xs font-bold text-orange-800 dark:bg-blue-100-dark dark:text-orange-800-dark sm:hidden">
              Me
            </th>
          </tr>
        </thead>
        <tbody>
          {questionOptions.map((questionOption) => (
            <ForecastChoiceOption
              key={questionOption.id}
              id={questionOption.id}
              forecastValue={questionOption.forecast}
              defaultSliderValue={50}
              choiceName={questionOption.name}
              choiceColor={questionOption.color}
              communityForecast={questionOption.communityForecast}
              min={BINARY_MIN_VALUE}
              max={BINARY_MAX_VALUE}
              onChange={handleForecastChange}
              isDirty={questionOption.isDirty}
              isRowDirty={questionOption.isDirty}
            />
          ))}
        </tbody>
      </table>
      <div className="my-5 flex flex-wrap items-center justify-center gap-3 px-4">
        {user ? (
          <>
            <Button
              variant="secondary"
              type="reset"
              onClick={resetForecasts}
              disabled={!isPickerDirty}
            >
              {t("discardChangesButton")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handlePredictSubmit}
              disabled={!submitIsAllowed}
            >
              {t("saveButton")}
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            type="button"
            onClick={() => setCurrentModal({ type: "signup" })}
          >
            {t("signUpButton")}
          </Button>
        )}
      </div>
      {submitErrors.map((errResponse, index) => (
        <FormError key={`error-${index}`} errors={errResponse} />
      ))}
    </>
  );
};

function generateChoiceOptions(
  questions: QuestionWithNumericForecasts[],
  prevForecastValuesMap: Record<number, number | null>
): QuestionOption[] {
  return questions.map((question, index) => {
    return {
      id: question.id,
      name: extractQuestionGroupName(question.title),
      communityForecast: question.forecasts.values_mean.at(-1) ?? null,
      forecast: prevForecastValuesMap[question.id] ?? null,
      isDirty: false,
      color: MULTIPLE_CHOICE_COLOR_SCALE[index] ?? METAC_COLORS.gray["400"],
    };
  });
}

export default ForecastMakerGroupBinary;