import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useCallback } from "react";

import { AppTheme, ThemeColor } from "@/types/theme";

const useAppTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const getThemeColor = useCallback(
    (color: ThemeColor) => {
      if (resolvedTheme === "dark") {
        return color.dark;
      }

      return color.DEFAULT;
    },
    [resolvedTheme]
  );

  return {
    theme: resolvedTheme as AppTheme,
    setTheme: setTheme as Dispatch<SetStateAction<AppTheme>>,
    getThemeColor,
  };
};

export default useAppTheme;
