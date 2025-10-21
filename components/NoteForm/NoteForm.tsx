"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNoteParams } from "@/lib/api";
import type { Note } from "@/types/note";
import { TAGS } from "@/types/note";
import css from "./NoteForm.module.css";

type FormValues = CreateNoteParams;

const schema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3")
    .max(50, "Max 50")
    .required("Title is required"),
  content: Yup.string().max(500, "Max 500").defined(),
  tag: Yup.string()
    .oneOf([...TAGS], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: { onCancel: () => void }) {
  const qc = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Note,
    Error,
    CreateNoteParams
  >({
    mutationFn: (body) => createNote(body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["notes"] });

      qc.invalidateQueries({
        predicate: (q) => {
          if (!Array.isArray(q.queryKey)) return false;
          if (q.queryKey[0] !== "notes") return false;

          const params = q.queryKey[1] as
            | { page?: number; search?: string; perPage?: number; tag?: string }
            | undefined;

          const tagKey = params?.tag ?? "all";
          return tagKey === "all" || tagKey === variables.tag;
        },
      });
    },
  });

  // const initialValues: FormValues = {
  //   title: "",
  //   content: "",
  //   tag: TAGS[0],
  // };

  // const handleSubmit = (
  //   values: FormValues,
  //   helpers: FormikHelpers<FormValues>
  // ) => {
  //   mutate(values, {
  //     onSuccess: () => {
  //       helpers.resetForm();
  //       onCancel();
  //     },
  //     onSettled: () => helpers.setSubmitting(false),
  //   });
  // };
  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: TAGS[0],
  };

  const handleSubmit = (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ): void => {
    mutate(values, {
      onSuccess: () => {
        helpers.resetForm();
        onCancel();
      },
      onSettled: () => helpers.setSubmitting(false),
    });
  };

  // return (
  //   <Formik<FormValues>
  //     initialValues={initialValues}
  //     validationSchema={schema}
  //     validateOnBlur
  //     validateOnChange
  //     onSubmit={handleSubmit}
  //   >
  //     {(formik: FormikProps<FormValues>) => {
  //       const { isSubmitting } = formik;

  //       return (
  //         <Form className={css.form}>
  //           <div className={css.formGroup}>
  //             <label htmlFor="title">Title</label>
  //             <Field id="title" name="title" className={css.input} />
  //             <ErrorMessage
  //               name="title"
  //               component="span"
  //               className={css.error}
  //             />
  //           </div>

  //           <div className={css.formGroup}>
  //             <label htmlFor="content">Content</label>
  //             <Field
  //               as="textarea"
  //               id="content"
  //               name="content"
  //               rows={8}
  //               className={css.textarea}
  //             />
  //             <ErrorMessage
  //               name="content"
  //               component="span"
  //               className={css.error}
  //             />
  //           </div>

  //           <div className={css.formGroup}>
  //             <label htmlFor="tag">Tag</label>
  //             <Field as="select" id="tag" name="tag" className={css.select}>
  //               {TAGS.map((t) => (
  //                 <option key={t} value={t}>
  //                   {t}
  //                 </option>
  //               ))}
  //             </Field>
  //             <ErrorMessage name="tag" component="span" className={css.error} />
  //           </div>

  //           {error && (
  //             <p className={css.error}>
  //               {error.message ?? "Failed to create note"}
  //             </p>
  //           )}

  //           <div className={css.actions}>
  //             <button
  //               type="button"
  //               className={css.cancelButton}
  //               onClick={onCancel}
  //               disabled={isSubmitting || isPending}
  //             >
  //               Cancel
  //             </button>
  //             <button
  //               type="submit"
  //               className={css.submitButton}
  //               disabled={isSubmitting || isPending}
  //             >
  //               Create note
  //             </button>
  //           </div>
  //         </Form>
  //       );
  //     }}
  //   </Formik>
  // );

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={schema}
      validateOnBlur
      validateOnChange
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const { isSubmitting } = formik;

        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={6}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            {error && (
              <p className={css.error}>
                {error.message ?? "Failed to create note"}
              </p>
            )}

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
                disabled={isSubmitting || isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting || isPending}
              >
                Create note
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
