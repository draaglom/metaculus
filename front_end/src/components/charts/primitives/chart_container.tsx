"use client";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import classNames from "classnames";
import { forwardRef, Fragment, PropsWithChildren, useState } from "react";

import { TimelineChartZoomOption } from "@/types/charts";
import { getChartZoomOptions } from "@/utils/charts";

type Props = {
  height: number;
  zoom?: TimelineChartZoomOption;
  onZoomChange?: (zoom: TimelineChartZoomOption) => void;
};

const ChartContainer = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ height, zoom, onZoomChange, children }, ref) => {
    const tabOptions = getChartZoomOptions();
    const [selectedIndex, setSelectedIndex] = useState(
      tabOptions.findIndex((option) => option.value === zoom)
    );

    const handleTabChange = (index: number) => {
      setSelectedIndex(index);
      onZoomChange?.(tabOptions[index].value as TimelineChartZoomOption);
    };

    return (
      <div className="relative flex w-full flex-col">
        {!!zoom && (
          <TabGroup
            selectedIndex={selectedIndex}
            onChange={handleTabChange}
            manual
            className="self-end"
          >
            <TabList className="flex gap-0.5">
              {tabOptions.map((option) => (
                <Tab as={Fragment} key={option.value}>
                  {({ selected, hover }) => (
                    <button
                      className={classNames(
                        "rounded px-1.5 py-1 text-sm font-medium leading-4 text-gray-600 hover:text-blue-800 focus:outline-none dark:text-gray-600-dark hover:dark:text-blue-800-dark",
                        { "text-gray-800 dark:text-gray-800-dark": selected },
                        {
                          "bg-gray-300 dark:bg-gray-300-dark":
                            hover || selected,
                        }
                      )}
                    >
                      {option.label}
                    </button>
                  )}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        )}
        <div ref={ref} style={{ height }} className="w-full">
          {children}
        </div>
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

export default ChartContainer;
