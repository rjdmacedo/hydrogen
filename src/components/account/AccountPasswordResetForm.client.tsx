import {useState} from 'react';
import {useNavigate} from '@shopify/hydrogen/client';

interface FormElements {
  password: HTMLInputElement;
  passwordConfirm: HTMLInputElement;
}

export function AccountPasswordResetForm({
  id,
  resetToken,
}: {
  id: string;
  resetToken: string;
}) {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);

  function passwordValidation(form: HTMLFormElement & FormElements) {
    setPasswordError(null);
    setPasswordConfirmError(null);

    let hasError = false;

    if (!form.password.validity.valid) {
      hasError = true;
      setPasswordError(
        form.password.validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (!form.passwordConfirm.validity.valid) {
      hasError = true;
      setPasswordConfirmError(
        form.password.validity.valueMissing
          ? 'Please re-enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (password !== passwordConfirm) {
      hasError = true;
      setPasswordConfirmError('The two password entered did not match.');
    }

    return hasError;
  }

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement & FormElements>,
  ) {
    event.preventDefault();

    if (passwordValidation(event.currentTarget)) {
      return;
    }

    const response = await callPasswordResetApi({
      id,
      resetToken,
      password,
    });

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    navigate('/account');
  }

  return (
    <div className="my-24 flex justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl">Reset Password.</h1>
        <p className="mt-4">Enter a new password for your account.</p>
        <form noValidate className="mt-4 mb-4 pt-6 pb-8" onSubmit={onSubmit}>
          {submitError && (
            <div className="mb-6 flex items-center justify-center bg-zinc-500">
              <p className="text-s m-4 text-contrast">{submitError}</p>
            </div>
          )}
          <div className="mb-3">
            <input
              className={`focus:shadow-outline mb-1 w-full appearance-none border py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50 ${
                passwordError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={password}
              minLength={8}
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <p
              className={`text-xs text-red-500 ${
                !passwordError ? 'invisible' : ''
              }`}
            >
              {passwordError} &nbsp;
            </p>
          </div>
          <div className="mb-3">
            <input
              className={`focus:shadow-outline mb-1 w-full appearance-none border py-2 px-3 leading-tight text-primary/90 placeholder:text-primary/50 ${
                passwordConfirmError ? ' border-red-500' : 'border-gray-900'
              }`}
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="current-password"
              placeholder="Re-enter password"
              aria-label="Re-enter password"
              value={passwordConfirm}
              required
              minLength={8}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
              }}
            />
            <p
              className={`text-xs text-red-500 ${
                !passwordConfirmError ? 'invisible' : ''
              }`}
            >
              {passwordConfirmError} &nbsp;
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline block w-full rounded bg-gray-900 py-2 px-4 text-contrast"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function callPasswordResetApi({
  id,
  resetToken,
  password,
}: {
  id: string;
  resetToken: string;
  password: string;
}) {
  try {
    const res = await fetch(`/account/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, resetToken, password}),
    });

    if (res.ok) {
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
