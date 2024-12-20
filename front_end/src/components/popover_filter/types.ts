import { ChipColor } from "@/components/ui/chip";

export enum FilterOptionType {
  MultiChip = "multi_chip",
  ToggleChip = "toggle_chip",
  Combobox = "combobox",
}

export type FilterOption = {
  id?: string;
  label: string;
  active: boolean;
  value: string;
  // currently only supported by FilterOptionType.ToggleChip type
  // TODO: revisit popup component to have more scalable solution for allowing multiple filters per option
  extraValues?: Record<string, string>;
};

type BaseFilterSection = {
  id: string;
  title: string;
  options: FilterOption[];
};

type ComboboxFilterSection = Omit<BaseFilterSection, "options"> & {
  type: FilterOptionType.Combobox;
  chipColor?: ChipColor;
  chipFormat?: (value: string) => string;
  shouldEnforceSearch?: boolean;
  options: FilterOption[];
  optionsFetcher?: (query: string) => Promise<FilterOption[]>;
};

type ToggleChipFilterSection = BaseFilterSection & {
  type: FilterOptionType.ToggleChip;
};

type MultiChipFilterSection = BaseFilterSection & {
  type: FilterOptionType.MultiChip;
};

export type FilterSection =
  | ComboboxFilterSection
  | ToggleChipFilterSection
  | MultiChipFilterSection;

export type FilterReplaceInfo = { optionId: string; replaceIds: string[] };
