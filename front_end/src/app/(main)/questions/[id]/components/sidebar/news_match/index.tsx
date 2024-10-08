import { FC } from "react";

import WithServerComponentErrorBoundary from "@/components/server_component_error_boundary";
import PostsApi from "@/services/posts";

import NewsMatchDrawer from "./news_match_drawer";

interface Props {
  questionId: number;
}

const NewsMatch: FC<Props> = async ({ questionId }) => {
  const articles = await PostsApi.getRelatedNews(questionId);

  if (articles.length > 0) {
    return <NewsMatchDrawer articles={articles} questionId={questionId} />;
  } else {
    return null;
  }
};

export default WithServerComponentErrorBoundary(NewsMatch);
