"use client";

import { addDays, isBefore, isAfter } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslations } from "next-intl";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import BaseModal from "@/components/base_modal";
import Button from "@/components/ui/button";
import DatetimeUtc from "@/components/ui/datetime_utc";
import { FormError } from "@/components/ui/form_field";
import { ApprovePostParams } from "@/services/posts";
import { ErrorResponse } from "@/types/fetch";
import { Post } from "@/types/post";

import { approvePost } from "../../actions";

const PostApprovalModal: FC<{
  post: Post;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}> = ({ post, isOpen, setIsOpen }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<ErrorResponse>();

  const currentDateTime = useMemo(
    () => formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    []
  );

  const [approvalData, setApprovalData] = useState<ApprovePostParams>(() => ({
    published_at:
      post.published_at ??
      formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    open_time: post.question?.open_time
      ? isAfter(new Date(post.question?.open_time), addDays(new Date(), 1))
        ? post.question?.open_time
        : formatInTimeZone(
            addDays(new Date(), 1),
            "UTC",
            "yyyy-MM-dd'T'HH:mm:ss'Z'"
          )
      : post.published_at ??
        formatInTimeZone(
          addDays(new Date(), 1),
          "UTC",
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        ),
    cp_reveal_time:
      post.question?.cp_reveal_time ??
      formatInTimeZone(
        addDays(new Date(), 5),
        "UTC",
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      ),
    scheduled_close_time:
      post.scheduled_close_time ??
      formatInTimeZone(
        addDays(new Date(), 30),
        "UTC",
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      ),
    scheduled_resolve_time:
      post.scheduled_resolve_time ??
      formatInTimeZone(
        addDays(new Date(), 30),
        "UTC",
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      ),
  }));

  useEffect(() => {
    setSubmitErrors(undefined);
    // TODO: refactor to use react-hook-form and zod validation
    if (!post.notebook) {
      if (isAfter(approvalData.published_at, approvalData.open_time)) {
        setSubmitErrors(new Error("Publish Time cannot be after Open Time."));
      }
      if (isAfter(approvalData.published_at, approvalData.cp_reveal_time)) {
        setSubmitErrors(
          new Error("Publish Time cannot be after CP Reveal Time.")
        );
      }
      if (
        isAfter(approvalData.published_at, approvalData.scheduled_close_time)
      ) {
        setSubmitErrors(
          new Error("Publish Time cannot be after Closing Time.")
        );
      }
      if (
        isAfter(approvalData.published_at, approvalData.scheduled_resolve_time)
      ) {
        setSubmitErrors(
          new Error("Publish Time cannot be after Resolving Time.")
        );
      }
      if (
        !isBefore(approvalData.open_time, approvalData.scheduled_close_time)
      ) {
        setSubmitErrors(new Error("Open Time must be before Closing Time."));
      }
      if (
        !isBefore(approvalData.open_time, approvalData.scheduled_resolve_time)
      ) {
        setSubmitErrors(new Error("Open Time must be before Resolving Time."));
      }
      if (
        isAfter(
          approvalData.scheduled_close_time,
          approvalData.scheduled_resolve_time
        )
      ) {
        setSubmitErrors(
          new Error("Closing Time cannot be after Resolving Time.")
        );
      }
    }
  }, [post.notebook, approvalData, t]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // use form data to send request to the email api
      const response = await approvePost(post.id, approvalData);

      if (response && "errors" in response && !!response.errors) {
        setSubmitErrors(response.errors);
      } else {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [approvalData, post.id, setIsOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      label={
        post.notebook ? t("postNotebookApproval") : t("postQuestionApproval")
      }
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <div className="flex max-w-sm flex-col gap-4">
        <p className="text-base leading-tight">
          {post.notebook
            ? t("postNotebookApprovalSubtitle")
            : post.group_of_questions
              ? t("postGroupOfQuestionsApprovalSubtitle")
              : t("postQuestionApprovalSubtitle")}
        </p>
        {!post.notebook && (
          <div className="mb-4 flex flex-col gap-2">
            <span>{t("postPublishTime")}</span>
            <DatetimeUtc
              placeholder="time when post becomes visible"
              onChange={(dt) =>
                setApprovalData({
                  ...approvalData,
                  published_at: dt,
                })
              }
              defaultValue={approvalData.published_at}
            />
            <span>{t("openTime")}</span>
            <DatetimeUtc
              placeholder="date when forecasts will open"
              min={currentDateTime}
              onChange={(dt) =>
                setApprovalData({
                  ...approvalData,
                  open_time: dt,
                })
              }
              defaultValue={approvalData.open_time}
            />
            <span>{t("cpRevealTime")}</span>
            <DatetimeUtc
              placeholder="time when the cp will be revealed"
              min={currentDateTime}
              onChange={(dt) =>
                setApprovalData({
                  ...approvalData,
                  cp_reveal_time: dt,
                })
              }
              defaultValue={approvalData.cp_reveal_time}
            />
            <span>{t("closingTime")}</span>
            <DatetimeUtc
              placeholder="scheduled close time of question"
              min={approvalData.open_time}
              onChange={(dt) =>
                setApprovalData({
                  ...approvalData,
                  scheduled_close_time: dt,
                })
              }
              defaultValue={approvalData.scheduled_close_time}
            />
            <span>{t("resolvingTime")}</span>
            <DatetimeUtc
              placeholder="scheduled resolve time of question"
              min={approvalData.scheduled_close_time}
              onChange={(dt) =>
                setApprovalData({
                  ...approvalData,
                  scheduled_resolve_time: dt,
                })
              }
              defaultValue={approvalData.scheduled_resolve_time}
            />
          </div>
        )}
        <div className="flex w-full justify-end gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            variant="secondary"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !!submitErrors}
            variant="primary"
          >
            {t("approve")}
          </Button>
        </div>
        <FormError errors={submitErrors} />
      </div>
    </BaseModal>
  );
};

export default PostApprovalModal;
