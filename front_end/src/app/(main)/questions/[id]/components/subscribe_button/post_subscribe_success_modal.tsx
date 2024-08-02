"use client";
import { useTranslations } from "next-intl";
import { FC, useCallback, useState } from "react";

import { changePostSubscriptions } from "@/app/(main)/questions/actions";
import BaseModal from "@/components/base_modal";
import Button from "@/components/ui/button";
import { Post } from "@/types/post";

type Props = {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  post: Post;
  // Triggered on "customise" button click
  onCustomiseClick: () => void;
};

const PostSubscribeSuccessModal: FC<Props> = ({
  isOpen,
  onClose,
  post,
  onCustomiseClick,
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnfollow = useCallback(async () => {
    setIsLoading(true);
    try {
      await changePostSubscriptions(post.id, []);
    } finally {
      setIsLoading(false);
    }

    onClose(true);
  }, [onClose, post.id]);

  return (
    <BaseModal
      label={
        post.group_of_questions
          ? t("followModalYouAreFollowingThisGroup")
          : t("followModalYouAreFollowingThisQuestion")
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="max-w-xl">
        <p className="text-base leading-tight">
          {post.group_of_questions
            ? t("followModalSuccessMessageDefaultNotificationGroup")
            : t("followModalSuccessMessageDefaultNotificationQuestion")}
        </p>
        <div className="flex w-full justify-end">
          <div className="flex w-fit gap-2">
            <Button
              variant="link"
              disabled={isLoading}
              onClick={onCustomiseClick}
            >
              {t("customiseButton")}
            </Button>
            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={handleUnfollow}
            >
              {t("followModalUnfollowButton")}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default PostSubscribeSuccessModal;