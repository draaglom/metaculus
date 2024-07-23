"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { FC } from "react";

import CalibrationChart from "@/app/(main)/charts/calibration_chart";
import { UserProfile } from "@/types/users";

const TrackRecord: FC<{ profile: UserProfile }> = ({ profile }) => {
  const t = useTranslations();

  return (
    <div>
      <div className="flex flex-col gap-6 rounded bg-white p-6 dark:bg-blue-900">
        {profile.calibration_curve && (
          <CalibrationChart data={profile.calibration_curve} />
        )}
      </div>

      <div className="flex flex-col rounded bg-white p-6 dark:bg-blue-900 ">
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="my-0 py-0 text-gray-700 dark:text-gray-300">
            Forecasting Stats
          </h3>
        </div>
        <h3 className="mb-5 mt-0 pt-0 text-gray-700 dark:text-gray-300"></h3>
        <div className="flex flex-row gap-4">
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.avg_score
                ? Math.round(profile.avg_score * 100) / 100
                : "-"}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              AVG SCORE
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.nr_forecasts}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              PREDICTIONS
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.questions_predicted}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              QUESTIONS PREDICTED
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.questions_predicted_scored}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              QUESTIONS SCORED
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded bg-white p-6 dark:bg-blue-900 ">
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="my-0 py-0 text-gray-700 dark:text-gray-300">
            Authoring Stats
          </h3>
        </div>
        <h3 className="mb-5 mt-0 pt-0 text-gray-700 dark:text-gray-300"></h3>
        <div className="flex flex-row gap-4">
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.question_authored}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              QUESTIONS AUTHORED
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {0}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              PREDICTIONS ON AUTHORED QUESTIONS
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.notebooks_authored}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              NOTEBOOKS AUTHORED
            </span>
          </div>
          <div className="flex w-1/3 flex-col gap-1.5 rounded bg-blue-200 p-3 text-center dark:bg-blue-950">
            <span className="text-2xl font-normal text-gray-800 dark:text-gray-200">
              {profile.comments_authored}
            </span>
            <span className="text-xs font-bold uppercase text-blue-900/45 dark:text-blue-100/45">
              COMMENTS AUTHORED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRecord;