import Link from "next/link";
import { getTranslations } from "next-intl/server";
import React from "react";

import CommunityHeader from "@/app/(main)/components/headers/community_header";
import Header from "@/app/(main)/components/headers/header";
import { EXPRESSION_OF_INTEREST_FORM_URL } from "@/app/(main)/pro-forecasters/constants/expression_of_interest_form";
import QuestionRepost from "@/app/(main)/questions/components/question_repost";
import ProjectsApi from "@/services/projects";
import { SearchParams } from "@/types/navigation";
import { ProjectPermissions } from "@/types/post";
import { getPublicSettings } from "@/utils/public_settings.server";

import QuestionTypePicker from "../components/question_type_picker";

const linkClassName =
  "text-blue-800 hover:text-blue-900 dark:text-blue-800-dark dark:hover:text-blue-900-dark";

export const metadata = {
  title: "Create a Question | Metaculus",
  description: "Post your own forecasting questions on Metaculus.",
};

const Creator: React.FC<{ searchParams: Promise<SearchParams> }> = async (
  props
) => {
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const createHref = (
    path: string,
    extra_params: { [key: string]: string } = {}
  ) => {
    const params = new URLSearchParams(
      searchParams as { [key: string]: string }
    );
    Object.entries(extra_params).forEach(([key, value]) => {
      params.append(key, value);
    });
    return `${path}?${params.toString()}`;
  };

  const communityId = searchParams["community_id"]
    ? Number(searchParams["community_id"])
    : undefined;
  const communitiesResponse = communityId
    ? await ProjectsApi.getCommunities({ ids: [communityId] })
    : undefined;
  const community = communitiesResponse
    ? communitiesResponse.results[0]
    : undefined;

  const { PUBLIC_MINIMAL_UI } = getPublicSettings();

  return (
    <>
      {community ? <CommunityHeader community={community} /> : <Header />}
      <div className="mb-4 mt-2 flex max-w-4xl flex-col justify-center self-center rounded-none bg-gray-0 px-4 pb-5 pt-4 text-gray-800 dark:bg-gray-0-dark dark:text-gray-800-dark md:m-8 md:mx-auto md:rounded-md md:px-8 md:pb-8 lg:m-12 lg:mx-auto">
        <div className="text-sm md:text-base">
          <h1 className="text-2xl font-medium capitalize md:text-3xl">
            {t("createNewContent")}
          </h1>
          {!PUBLIC_MINIMAL_UI && (
            <>
              <p>
                {t.rich("createQuestionDescription1", {
                  link1: (chunks) => (
                    <Link href="/question-writing" className={linkClassName}>
                      {chunks}
                    </Link>
                  ),
                  link2: (chunks) => (
                    <Link
                      href="/questions/956/suggest-questions-to-launch/"
                      className={linkClassName}
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <p>{t("createQuestionDescription2")}</p>
              <p>
                {t.rich("expressionOfInterestFormMessage", {
                  link: (chunks) => (
                    <a
                      href={EXPRESSION_OF_INTEREST_FORM_URL}
                      className={linkClassName}
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </>
          )}
          {community &&
            community.user_permission &&
            [ProjectPermissions.ADMIN, ProjectPermissions.CURATOR].includes(
              community.user_permission
            ) && (
              <QuestionRepost url={createHref("/questions/create/repost")} />
            )}
        </div>

        <h2 className="mt-0 text-lg font-light capitalize">
          {t("singleQuestion")}
        </h2>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <QuestionTypePicker
            url={createHref("/questions/create/question", { type: "binary" })}
            questionType={t("binaryQuestion")}
            questionExample={`"${t("binaryQuestionExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/question", { type: "numeric" })}
            questionType={t("numericRange")}
            questionExample={`"${t("numericRangeExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/question", { type: "date" })}
            questionType={t("dateRange")}
            questionExample={`"${t("dateRangeExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/question", {
              type: "multiple_choice",
            })}
            questionType={t("multipleChoice")}
            questionExample={`"${t("multipleChoiceExample")}"`}
          />
        </div>

        <h2 className="text-lg font-light capitalize">{t("questionGroup")}</h2>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <QuestionTypePicker
            url={createHref("/questions/create/group", { subtype: "binary" })}
            questionType={t("binaryGroup")}
            questionExample={`"${t("binaryGroupExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/group", { subtype: "numeric" })}
            questionType={t("numericGroup")}
            questionExample={`"${t("numericGroupExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/group", { subtype: "date" })}
            questionType={t("dateGroup")}
            questionExample={`"${t("dateGroupExample")}"`}
          />
          <QuestionTypePicker
            url={createHref("/questions/create/conditional")}
            questionType={t("conditionalPair")}
            questionExample={`"${t("conditionalPairExample")}"`}
          />
        </div>

        <h2 className="text-lg font-light capitalize">{t("posts")}</h2>
        <QuestionTypePicker
          url={createHref("/questions/create/notebook")}
          questionType={t("notebook")}
          questionExample={`"${t("notebookExample")}"`}
        />
      </div>
    </>
  );
};

export default Creator;
