import classNames from "classnames";
import {
  BeautifulMentionsMenuItemProps,
  BeautifulMentionsMenuProps,
} from "lexical-beautiful-mentions";
import { forwardRef } from "react";

import LoadingSpinner from "@/components/ui/loading_spiner";

export function Menu({ loading, ...other }: BeautifulMentionsMenuProps) {
  if (loading) {
    return (
      <div className="absolute top-[2px] m-0 min-w-[8rem] overflow-y-auto whitespace-nowrap rounded border border-gray-500 bg-gray-0 p-1 py-2 text-sm drop-shadow-lg dark:border-gray-500-dark dark:bg-gray-0-dark">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <ul
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="absolute top-[2px] m-0 min-w-[8rem] overflow-y-auto whitespace-nowrap rounded border border-gray-500 bg-gray-0 p-1 text-sm drop-shadow-lg dark:border-gray-500-dark dark:bg-gray-0-dark"
      {...other}
    />
  );
}

export const MenuItem = forwardRef<
  HTMLLIElement,
  BeautifulMentionsMenuItemProps
>(({ selected, item, ...props }, ref) => (
  <li
    ref={ref}
    className={classNames(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      selected && "bg-gray-200 dark:bg-gray-200-dark"
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";