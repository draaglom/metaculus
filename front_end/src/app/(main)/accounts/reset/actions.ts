"use server";

import {
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
} from "@/app/(main)/accounts/schemas";
import AuthApi from "@/services/auth";
import { setServerSession } from "@/services/session";
import { AuthResponse } from "@/types/auth";
import { ApiError } from "@/utils/errors";

export type PasswordResetRequestActionState = {
  errors?: any;
} | null;

export async function passwordResetRequestAction(
  _prevState: PasswordResetRequestActionState,
  formData: FormData
): Promise<PasswordResetRequestActionState> {
  const validatedFields = passwordResetRequestSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await AuthApi.passwordResetRequest(validatedFields.data.login);

    return {};
  } catch (err) {
    return {
      errors: ApiError.isApiError(err) ? err.data : undefined,
    };
  }
}

export type PasswordResetConfirmActionState = {
  errors?: any;
  data?: AuthResponse;
} | null;

export async function passwordResetConfirmAction(
  _prevState: PasswordResetConfirmActionState,
  formData: FormData
): Promise<PasswordResetConfirmActionState> {
  const validatedFields = passwordResetConfirmSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await AuthApi.passwordResetConfirm(
      validatedFields.data.user_id,
      validatedFields.data.token,
      validatedFields.data.password
    );

    await setServerSession(response.token);

    return {
      data: response,
    };
  } catch (err) {
    return {
      errors: ApiError.isApiError(err) ? err.data : undefined,
    };
  }
}
