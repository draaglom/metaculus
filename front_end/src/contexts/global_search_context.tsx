"use client";
import {
  PropsWithChildren,
  useContext,
  useState,
  FC,
  createContext,
  useEffect,
} from "react";

import { POST_TEXT_SEARCH_FILTER } from "@/constants/posts_feed";
import useSearchInputState from "@/hooks/use_search_input_state";

interface GlobalSearchContextProps {
  isVisible: boolean;
  setIsVisible: (a: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  setModifySearchParams: (b: boolean) => void;
}
const GlobalSearchContext = createContext<GlobalSearchContextProps>({
  isVisible: false,
  setIsVisible: (a) => {},
  globalSearch: "",
  setGlobalSearch: (s) => {},
  setModifySearchParams: (b: boolean) => {},
});

export const GlobalSearchProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modifySearchParams, setModifySearchParams] = useState(false);
  const [globalSearch, setGlobalSearch] = useSearchInputState(
    POST_TEXT_SEARCH_FILTER,
    {
      debounceTime: 500,
      mode: "server",
      modifySearchParams,
    }
  );

  const [delayedIsVisible, setDelayedIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDelayedIsVisible(isVisible);
    }, 100);
  }, [isVisible]);

  return (
    <GlobalSearchContext.Provider
      value={{
        isVisible: delayedIsVisible,
        setIsVisible,
        globalSearch,
        setGlobalSearch,
        setModifySearchParams,
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearchContext = () => useContext(GlobalSearchContext);