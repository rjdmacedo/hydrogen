import {useState} from 'react';
import {useNavigate, Link} from '@shopify/hydrogen/client';

import {emailValidation, passwordValidation} from '~/lib/utils';

import {callLoginApi} from './AccountLoginForm.client';

interface FormElements {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

export function AccountCreateForm() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<null | string>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<null | string>(null);

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement & FormElements>,
  ) {
    event.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);
    if (newEmailError) {
      setEmailError(newEmailError);
    }

    const newPasswordError = passwordValidation(event.currentTarget.password);
    if (newPasswordError) {
      setPasswordError(newPasswordError);
    }

    if (newEmailError || newPasswordError) {
      return;
    }

    const accountCreateResponse = await callAccountCreateApi({
      email,
      password,
    });

    if (accountCreateResponse.error) {
      setSubmitError(accountCreateResponse.error);
      return;
    }

    // this can be avoided if customerCreate mutation returns customerAccessToken
    await callLoginApi({
      email,
      password,
    });

    navigate('/account');
  }

  return (
    <div className="my-24 flex justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl">Create an Account.</h1>
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
          <div className="mb-3">
            <input
              className={`focus:shadow-outline mb-1 w-full appearance-none rounded border py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50 ${
                passwordError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              minLength={8}
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {!passwordError ? (
              ''
            ) : (
              <p className={`text-xs text-red-500`}>{passwordError} &nbsp;</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline block w-full rounded bg-gray-900 py-2 px-4 text-contrast"
              type="submit"
            >
              Create Account
            </button>
          </div>
          <div className="mt-4 flex items-center">
            <p className="align-baseline text-sm">
              Already have an account? &nbsp;
              <Link className="inline underline" to="/account">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function callAccountCreateApi({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const res = await fetch(`/account/register`, {
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
