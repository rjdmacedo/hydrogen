import {useState} from 'react';
import {useNavigate} from '@shopify/hydrogen/client';

export function AccountActivateForm({
  id,
  activationToken,
}: {
  id: string;
  activationToken: string;
}) {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<null | string>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<null | string>(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    null | string
  >(null);

  function passwordValidation(
    form: HTMLFormElement & {password: HTMLInputElement},
  ) {
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
      setPasswordConfirmError('The two passwords entered did not match.');
    }

    return hasError;
  }

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement & {password: HTMLInputElement}>,
  ) {
    event.preventDefault();

    if (passwordValidation(event.currentTarget)) {
      return;
    }

    const response = await callActivateApi({
      id,
      activationToken,
      password,
    });

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    navigate('/account');
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl">Activate Account.</h1>
        <p className="mt-4">Create your password to activate your account.</p>
        <form noValidate className="mt-4 mb-4 pt-6 pb-8" onSubmit={onSubmit}>
          {submitError && (
            <div className="mb-6 flex items-center justify-center bg-primary/30">
              <p className="text-s m-4 text-contrast">{submitError}</p>
            </div>
          )}
          <div className="mb-4">
            <input
              className={`focus:shadow-outline mb-1 w-full appearance-none border py-2 px-3 leading-tight text-primary placeholder:text-primary/30 ${
                passwordError ? ' border-notice' : 'border-primary'
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
            <p
              className={`text-xs text-red-500 ${
                !passwordError ? 'invisible' : ''
              }`}
            >
              {passwordError} &nbsp;
            </p>
          </div>
          <div className="mb-4">
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
              className="focus:shadow-outline block w-full bg-gray-900 px-4 py-2 uppercase text-contrast"
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

async function callActivateApi({
  id,
  activationToken,
  password,
}: {
  id: string;
  activationToken: string;
  password: string;
}) {
  try {
    const res = await fetch(`/account/activate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, activationToken, password}),
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
