import {useState} from 'react';

import {emailValidation} from '~/lib/utils';

interface FormElements {
  email: HTMLInputElement;
}

export function AccountRecoverForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement & FormElements>,
  ) {
    event.preventDefault();

    setEmailError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);

    if (newEmailError) {
      setEmailError(newEmailError);
      return;
    }

    await callAccountRecoverApi({
      email,
    });

    setEmail('');
    setSubmitSuccess(true);
  }

  return (
    <div className="my-24 flex justify-center px-4">
      <div className="w-full max-w-md">
        {submitSuccess ? (
          <>
            <h1 className="text-4xl">Request Sent.</h1>
            <p className="mt-4">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl">Forgot Password.</h1>
            <p className="mt-4">
              Enter the email address associated with your account to receive a
              link to reset your password.
            </p>
          </>
        )}
        <form noValidate className="mt-4 mb-4 pt-6 pb-8" onSubmit={onSubmit}>
          {submitError && (
            <div className="mb-6 flex items-center justify-center bg-zinc-500">
              <p className="text-s m-4 text-contrast">{submitError}</p>
            </div>
          )}
          <div className="mb-3">
            <input
              className={`focus:shadow-outline mb-1 w-full appearance-none rounded border py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50 ${
                emailError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            {!emailError ? (
              ''
            ) : (
              <p className={`text-xs text-red-500`}>{emailError} &nbsp;</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline block w-full rounded bg-gray-900 py-2 px-4 text-contrast"
              type="submit"
            >
              Request Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function callAccountRecoverApi({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const res = await fetch(`/account/recover`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password, firstName, lastName}),
    });
    if (res.status === 200) {
      return {};
    } else {
      return res.json();
    }
  } catch (error: any) {
    return {
      error: error.toString(),
    };
  }
}
