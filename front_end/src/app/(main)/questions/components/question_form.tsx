"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import QuestionChartTile from "@/components/post_card/question_chart_tile";
import Button from "@/components/ui/button";
import { FormError, Input, Textarea } from "@/components/ui/form_field";
import Select, { SelectOption } from "@/components/ui/select";
import { PostWithForecasts } from "@/types/post";
import { QuestionType } from "@/types/question";

import { createQuestionPost, getPost } from "../actions";

type PostCreationData = {
  title: string;
  question?: any;
  conditional?: any;
  group_of_questions?: any;
};

const baseQuestionSchema = z.object({
  type: z
    .enum([
      "binary",
      "multiple_choice",
      "date",
      "numeric",
      "conditional",
      "group",
    ])
    .default("binary"),
  title: z.string().min(4).max(200),
  description: z.string().min(10),
  resolution: z.string().optional(),
  closed_at: z.date().optional(),
  resolved_at: z.date().optional(),
});

const binaryQuestionSchema = baseQuestionSchema;

const continuousQuestionSchema = baseQuestionSchema.merge(
  z.object({
    zero_point: z.number().default(0),
    open_upper_bound: z.boolean().default(true),
    open_lower_bound: z.boolean().default(true),
  })
);

const numericQuestionSchema = continuousQuestionSchema.merge(
  z.object({
    max: z.number().optional(),
    min: z.number().optional(),
  })
);

const dateQuestionSchema = continuousQuestionSchema.merge(
  z.object({
    max: z.date().optional(),
    min: z.date().optional(),
  })
);

const multipleChoiceQuestionSchema = baseQuestionSchema.merge(
  z.object({
    options: z.array(z.string()).min(1),
  })
);

const groupQuestionSchema = baseQuestionSchema.merge(
  z.object({
    options: z.any(),
  })
);

const conditionalQuestionSchema = baseQuestionSchema.merge(
  z.object({
    condition_id: z.number(),
    condition_child_id: z.number(),
  })
);

type Props = {
  no_submit?: boolean;
  change_callback?: any;
  question_type?: string;
  display_type_selector?: boolean;
  tiny?: boolean;
};

const QuestionForm: React.FC<Props> = ({
  no_submit = false,
  change_callback = null,
  question_type = null,
  display_type_selector = true,
  tiny = false,
}) => {
  const router = useRouter();
  const submitQuestion = async (data: any) => {
    data["type"] = questionType;
    let post_data: PostCreationData = {
      title: data["title"],
    };
    if (
      ["binary", "multiple_choice", "date", "numeric"].includes(data["type"])
    ) {
      post_data["question"] = data;
    } else if ("conditional" == data["type"]) {
      post_data["conditional"] = data;
    } else if ("group" == data["type"]) {
      console.log(questionFormValues);
      post_data["group_of_questions"] = {
        questions: questionFormValues,
      };
    }
    const resp = await createQuestionPost(post_data);
    router.push(`/questions/${resp.post?.id}`);
  };

  const [advanced, setAdvanced] = useState(false);
  const [questionType, setQuestionType] = useState(question_type);
  const [subQuestionType, setSubQuestionType] = useState(question_type);
  const [condition, setCondition] = useState<PostWithForecasts | null>(null);
  const [conditionChild, setConditionChild] =
    useState<PostWithForecasts | null>(null);
  const [questionForms, setQuestionForms] = useState<any[]>([]);
  const [questionFormValues, setQuestionFormValues] = useState<any[]>([]);

  const getFormSchema = (type: string) => {
    switch (type) {
      case "binary":
        return binaryQuestionSchema;
      case "numeric":
        return numericQuestionSchema;
      case "date":
        return dateQuestionSchema;
      case "multiple_choice":
        return multipleChoiceQuestionSchema;
      case "conditional":
        return conditionalQuestionSchema;
      case "group":
        return groupQuestionSchema;
      default:
        return binaryQuestionSchema;
    }
  };

  const control = useForm({
    // @ts-ignore
    resolver: zodResolver(getFormSchema(questionType)),
  });

  const questionTypeSelect = {
    binary: "Binary",
    numeric: "Numeric",
    date: "Date",
    multiple_choice: "Multiple Choice",
  };

  if (questionType) {
    control.setValue("type", questionType);
  }

  return (
    <div className="flex flex-row justify-center">
      <form
        onSubmit={async (e) => {
          // e.preventDefault(); // Good for debugging
          await control.handleSubmit(
            async (data) => {
              await submitQuestion(data);
            },
            async (e) => {
              console.log("Error: ", e);
            }
          )(e);
        }}
        onChange={async (e) => {
          const data = control.getValues();
          data["type"] = questionType;
          if (change_callback) {
            change_callback(data);
          }
        }}
        className={`${tiny ? "text-light-100 m-2 flex w-[420px] flex-col space-y-4 rounded-s border border-blue-800 bg-blue-900 p-2 text-xs" : "text-light-100 text-m mb-8 mt-8 flex w-[540px] flex-col space-y-4 rounded-s border border-blue-800 bg-blue-900 p-8"}`}
      >
        {display_type_selector && !questionType && (
          <>
            <span>Question Type</span>
            <Select
              {...control.register("type")}
              value={questionType ? questionType : "binary"}
              // @ts-ignore
              label={questionTypeSelect[questionType]}
              options={Object.keys(questionTypeSelect).map((key) => {
                return {
                  value: key,
                  // @ts-ignore
                  label: questionTypeSelect[key],
                };
              })}
              onChange={(val) => {
                control.setValue("type", questionType);
                setQuestionType(val);
              }}
            />
          </>
        )}

        <FormError
          errors={control.formState.errors}
          className="text-red-500-dark"
          {...control.register("type")}
        />
        {questionType && (
          <>
            <span>Title</span>
            <Input
              {...control.register("title")}
              errors={control.formState.errors.title}
            />
            <span>Description</span>
            <Textarea
              {...control.register("description")}
              errors={control.formState.errors.description}
              className="h-[120px] w-[400px]"
            />

            {advanced && (
              <>
                <span>Closing Date</span>
                <Input
                  type="date"
                  {...control.register("closed_at", {
                    setValueAs: (value: string) => {
                      return new Date(value);
                    },
                  })}
                  errors={control.formState.errors.closed_at}
                />

                <span>Resolving Date</span>
                <Input
                  type="date"
                  {...control.register("resolved_at", {
                    setValueAs: (value: string) => {
                      return new Date(value);
                    },
                  })}
                  errors={control.formState.errors.resolved_at}
                />
              </>
            )}

            {questionType == "numeric" && (
              <>
                <span>Max</span>
                <Input
                  type="number"
                  {...control.register("max", {
                    setValueAs: (value: string) => Number(value),
                  })}
                  errors={control.formState.errors.max}
                />
                <span>Min</span>
                <Input
                  type="number"
                  {...control.register("min", {
                    setValueAs: (value: string) => Number(value),
                  })}
                  errors={control.formState.errors.min}
                />
              </>
            )}
            {questionType == "date" && (
              <>
                <span>Max</span>
                <Input
                  type="date"
                  {...control.register("max", {
                    setValueAs: (value: string) => {
                      return new Date(value);
                    },
                  })}
                  errors={control.formState.errors.max}
                />
                <span>Min</span>
                <Input
                  type="date"
                  {...control.register("min", {
                    setValueAs: (value: string) => {
                      return new Date(value);
                    },
                  })}
                  errors={control.formState.errors.min}
                />
              </>
            )}
            {(questionType == "numeric" || questionType == "date") && (
              <>
                <span>Open Upper Bound</span>
                <Input
                  type="checkbox"
                  {...control.register("open_upper_bound")}
                  errors={control.formState.errors.open_upper_bound}
                />

                <span>Open Lower Bound</span>
                <Input
                  type="checkbox"
                  {...control.register("open_lower_bound")}
                  errors={control.formState.errors.open_lower_bound}
                />
              </>
            )}

            {questionType == "multiple_choice" && (
              <>
                <span>Multiple Choice (separate by ,)</span>
                <Input
                  type="text"
                  onChange={(event) => {
                    const options = String(event.target.value)
                      .split(",")
                      .map((option) => option.trim());
                    control.setValue("options", options);
                  }}
                  errors={control.formState.errors.options}
                />
              </>
            )}

            {questionType == "conditional" && (
              <>
                <span>Condition ID</span>
                <Input
                  type="number"
                  {...control.register("condition_id", {
                    setValueAs: (value: string) => {
                      const valueAsNr = Number(value);
                      getPost(valueAsNr).then((res) => {
                        if (res && res.question?.type === QuestionType.Binary) {
                          setCondition(res);
                        } else {
                          setCondition(null);
                        }
                      });
                      return valueAsNr;
                    },
                  })}
                  errors={control.formState.errors.condition_id}
                />
                {condition?.question ? (
                  <QuestionChartTile
                    question={condition?.question}
                    authorUsername={condition.author_username}
                    curationStatus={condition.curation_status}
                  />
                ) : (
                  <span className="text-l w-full text-center text-red-300">
                    Please enter the id of a binary question.
                  </span>
                )}

                <span>Condition Child ID</span>
                <Input
                  type="number"
                  {...control.register("condition_child_id", {
                    setValueAs: (value: string) => {
                      const valueAsNr = Number(value);
                      getPost(valueAsNr).then((res) => {
                        if (res && res.question) {
                          setConditionChild(res);
                        } else {
                          setConditionChild(null);
                        }
                      });
                      return valueAsNr;
                    },
                  })}
                  errors={control.formState.errors.condition_child_id}
                />
                {conditionChild?.question ? (
                  <QuestionChartTile
                    question={conditionChild?.question}
                    authorUsername={conditionChild.author_username}
                    curationStatus={conditionChild.curation_status}
                  />
                ) : (
                  <span className="text-l w-full text-center text-red-300">
                    Please enter the id of a question.
                  </span>
                )}
              </>
            )}

            {questionType == "group" && (
              <>
                {questionForms.length === 0 ? (
                  <>
                    <span>Sub-Question Type</span>
                    <Select
                      value={subQuestionType ? subQuestionType : "binary"}
                      // @ts-ignore
                      label={questionTypeSelect[subQuestionType]}
                      options={Object.keys(questionTypeSelect)
                        .filter((k) => !["conditional", "group"].includes(k))
                        .map((key) => {
                          return {
                            value: key,
                            // @ts-ignore
                            label: questionTypeSelect[key],
                          };
                        })}
                      onChange={(val) => {
                        setSubQuestionType(val);
                      }}
                    />
                  </>
                ) : (
                  <span>Sub-Question Type: {subQuestionType}</span>
                )}

                {questionForms}
                <Button
                  onClick={() => {
                    setQuestionFormValues([...questionFormValues, {}]);
                    setQuestionForms([
                      ...questionForms,
                      <QuestionForm
                        key={String(questionForms.length)}
                        no_submit={true}
                        question_type={
                          subQuestionType ? subQuestionType : "binary"
                        }
                        display_type_selector={false}
                        tiny={true}
                        // @ts-ignore
                        change_callback={(data) => {
                          questionFormValues[questionForms.length] = data;
                          setQuestionFormValues([...questionFormValues]);
                        }}
                      />,
                    ]);
                  }}
                >
                  Add Question
                </Button>
              </>
            )}

            {advanced &&
              (questionType == "numeric" || questionType == "date") && (
                <>
                  <span>Zero Point</span>
                  <Input
                    type="number"
                    {...control.register("zero_point", {
                      setValueAs: (value: string) => Number(value),
                    })}
                    errors={control.formState.errors.zero_point}
                  />
                </>
              )}

            {advanced && (
              <>
                <span>Resolution</span>
                <Textarea
                  {...control.register("resolution")}
                  errors={control.formState.errors.resolution}
                  className="h-[120px] w-[400px]"
                />
              </>
            )}

            <div className=""></div>
            {no_submit !== true && (
              <Button type="submit">Create Question</Button>
            )}
            <Button onClick={() => setAdvanced(!advanced)}>
              {advanced ? "Change to Simple Mode" : "Change to Advanced Mode"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default QuestionForm;