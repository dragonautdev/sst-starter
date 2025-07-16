/**
 * Configure the UI that's used by the Password provider.
 *
 * ```ts {1,7-12}
 * import { PasswordUI } from "@openauthjs/openauth/ui/password"
 * import { PasswordProvider } from "@openauthjs/openauth/provider/password"
 *
 * export default issuer({
 *   providers: {
 *     password: PasswordAdapter(
 *       PasswordUI({
 *         copy: {
 *           error_email_taken: "This email is already taken."
 *         },
 *         sendCode: (email, code) => console.log(email, code)
 *       })
 *     )
 *   },
 *   // ...
 * })
 * ```
 *
 * @packageDocumentation
 */
/** @jsxImportSource hono/jsx */

import {
  PasswordChangeError,
  PasswordConfig,
  PasswordLoginError,
  PasswordRegisterError,
} from '@openauthjs/openauth/provider/password';
import { Layout } from '@openauthjs/openauth/ui/base';
import { FormAlert } from '@openauthjs/openauth/ui/form';

const DEFAULT_COPY = {
  /**
   * Error message when email is already taken.
   */
  error_email_taken: 'There is already an account with this email.',
  /**
   * Error message when the confirmation code is incorrect.
   */
  error_invalid_code: 'Code is incorrect.',
  /**
   * Error message when the email is invalid.
   */
  error_invalid_email: 'Email is not valid.',
  /**
   * Error message when the password is incorrect.
   */
  error_invalid_password: 'Password is incorrect.',
  /**
   * Error message when the passwords do not match.
   */
  error_password_mismatch: 'Passwords do not match.',
  /**
   * Error message when the user enters a password that fails validation.
   */
  error_validation_error: 'Password does not meet requirements.',
  /**
   * Title of the register page.
   */
  register_title: 'Welcome to the app',
  /**
   * Description of the register page.
   */
  register_description: 'Sign in with your email',
  /**
   * Title of the login page.
   */
  login_title: 'Welcome to the app',
  /**
   * Description of the login page.
   */
  login_description: 'Sign in with your email',
  /**
   * Copy for the register button.
   */
  register: 'Register',
  /**
   * Copy for the register link.
   */
  register_prompt: "Don't have an account?",
  /**
   * Copy for the login link.
   */
  login_prompt: 'Already have an account?',
  /**
   * Copy for the login button.
   */
  login: 'Login',
  /**
   * Copy for the forgot password link.
   */
  change_prompt: 'Forgot password?',
  /**
   * Copy for the resend code button.
   */
  code_resend: 'Resend code',
  /**
   * Copy for the "Back to" link.
   */
  code_return: 'Back to',
  /**
   * Copy for the logo.
   * @internal
   */
  logo: 'A',
  /**
   * Copy for the email input.
   */
  input_email: 'Email',
  /**
   * Copy for the password input.
   */
  input_password: 'Password',
  /**
   * Copy for the code input.
   */
  input_code: 'Code',
  /**
   * Copy for the repeat password input.
   */
  input_repeat: 'Repeat password',
  /**
   * Copy for the continue button.
   */
  button_continue: 'Continue',
} satisfies {
  [key in `error_${PasswordLoginError['type'] | PasswordRegisterError['type'] | PasswordChangeError['type']}`]: string;
} & Record<string, string>;

type PasswordUICopy = typeof DEFAULT_COPY;

/**
 * Configure the password UI.
 */
export interface PasswordUIOptions extends Pick<PasswordConfig, 'sendCode' | 'validatePassword'> {
  /**
   * Custom copy for the UI.
   */
  copy?: Partial<PasswordUICopy>;
}

const DISPLAY: Record<string, string> = {
  twitch: 'Twitch',
  google: 'Google',
  github: 'GitHub',
  apple: 'Apple',
  x: 'X',
  facebook: 'Facebook',
  microsoft: 'Microsoft',
  slack: 'Slack',
};

const ICON: Record<string, any> = {
  code: (
    <svg fill='currentColor' viewBox='0 0 52 52' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M8.55,36.91A6.55,6.55,0,1,1,2,43.45,6.54,6.54,0,0,1,8.55,36.91Zm17.45,0a6.55,6.55,0,1,1-6.55,6.54A6.55,6.55,0,0,1,26,36.91Zm17.45,0a6.55,6.55,0,1,1-6.54,6.54A6.54,6.54,0,0,1,43.45,36.91ZM8.55,19.45A6.55,6.55,0,1,1,2,26,6.55,6.55,0,0,1,8.55,19.45Zm17.45,0A6.55,6.55,0,1,1,19.45,26,6.56,6.56,0,0,1,26,19.45Zm17.45,0A6.55,6.55,0,1,1,36.91,26,6.55,6.55,0,0,1,43.45,19.45ZM8.55,2A6.55,6.55,0,1,1,2,8.55,6.54,6.54,0,0,1,8.55,2ZM26,2a6.55,6.55,0,1,1-6.55,6.55A6.55,6.55,0,0,1,26,2ZM43.45,2a6.55,6.55,0,1,1-6.54,6.55A6.55,6.55,0,0,1,43.45,2Z'
        fill-rule='evenodd'
      />
    </svg>
  ),
  password: (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
      <path
        fill-rule='evenodd'
        d='M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z'
        clip-rule='evenodd'
      />
    </svg>
  ),
  twitch: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
      <path
        fill='currentColor'
        d='M40.1 32L10 108.9v314.3h107V480h60.2l56.8-56.8h87l117-117V32H40.1zm357.8 254.1L331 353H224l-56.8 56.8V353H76.9V72.1h321v214zM331 149v116.9h-40.1V149H331zm-107 0v116.9h-40.1V149H224z'
      ></path>
    </svg>
  ),
  google: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512'>
      <path
        fill='currentColor'
        d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
      ></path>
    </svg>
  ),
  github: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'>
      <path
        fill='currentColor'
        d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
      ></path>
    </svg>
  ),
  apple: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 814 1000'>
      <path
        fill='currentColor'
        d='M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z '
      />
    </svg>
  ),
  x: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 1227'>
      <path
        fill='currentColor'
        d='M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z'
      />
    </svg>
  ),
  microsoft: (
    <svg role='img' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'>
      <path fill='#F1511B' d='M121.666 121.666H0V0h121.666z' />
      <path fill='#80CC28' d='M256 121.666H134.335V0H256z' />
      <path fill='#00ADEF' d='M121.663 256.002H0V134.336h121.663z' />
      <path fill='#FBBC09' d='M256 256.002H134.335V134.336H256z' />
    </svg>
  ),
  facebook: (
    <svg role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36' fill='url(#a)'>
      <defs>
        <linearGradient x1='50%' x2='50%' y1='97.078%' y2='0%' id='a'>
          <stop offset='0%' stop-color='#0062E0' />
          <stop offset='100%' stop-color='#19AFFF' />
        </linearGradient>
      </defs>
      <path d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z' />
      <path
        fill='#FFF'
        d='m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
      />
    </svg>
  ),
  slack: (
    <svg
      role='img'
      enable-background='new 0 0 2447.6 2452.5'
      viewBox='0 0 2447.6 2452.5'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clip-rule='evenodd' fill-rule='evenodd'>
        <path
          d='m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z'
          fill='#36c5f0'
        />
        <path
          d='m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z'
          fill='#2eb67d'
        />
        <path
          d='m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z'
          fill='#ecb22e'
        />
        <path
          d='m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0'
          fill='#e01e5a'
        />
      </g>
    </svg>
  ),
};

/**
 * Creates a UI for the Password provider flow.
 * @param input - Configure the UI.
 */
export function PasswordUI(input: PasswordUIOptions): PasswordConfig {
  const copy = {
    ...DEFAULT_COPY,
    ...input.copy,
  };
  return {
    validatePassword: input.validatePassword,
    sendCode: input.sendCode,
    login: async (_req, form, error): Promise<Response> => {
      const jsx = (
        <Layout>
          <form data-component='form' method='post'>
            <FormAlert message={error?.type && copy?.[`error_${error.type}`]} />
            <input
              data-component='input'
              type='email'
              name='email'
              required
              placeholder={copy.input_email}
              autofocus={!error}
              value={form?.get('email')?.toString()}
            />
            <input
              data-component='input'
              autofocus={error?.type === 'invalid_password'}
              required
              type='password'
              name='password'
              placeholder={copy.input_password}
              autoComplete='current-password'
            />
            <button data-component='button'>{copy.login}</button>
            <hr />
                <p style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: 'bold'}}>OR</p>
                <a href={`/google/authorize`} data-component='button' data-color='primary' data-variant='outline'>
                  {ICON['google'] && <i data-slot='icon'>{ICON['google']}</i>}
                  Continue with Gmail
                </a>
            <div data-component='form-footer'>
              <span>
                {copy.register_prompt}{' '}
                <a data-component='link' href='register'>
                  {copy.register}
                </a>
              </span>
              <a data-component='link' href='change'>
                {copy.change_prompt}
              </a>
            </div>
          </form>
        </Layout>
      );
      return new Response(jsx.toString(), {
        status: error ? 401 : 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    },
    register: async (_req, state, form, error): Promise<Response> => {
      const emailError = ['invalid_email', 'email_taken'].includes(error?.type || '');
      const passwordError = ['invalid_password', 'password_mismatch', 'validation_error'].includes(error?.type || '');
      const jsx = (
        <Layout>
          <form data-component='form' method='post'>
            <FormAlert
              message={
                error?.type
                  ? error.type === 'validation_error'
                    ? error.message ?? copy?.[`error_${error.type}`]
                    : copy?.[`error_${error.type}`]
                  : undefined
              }
            />
            {state.type === 'start' && (
              <>
                <input type='hidden' name='action' value='register' />
                <input
                  data-component='input'
                  autofocus={!error || emailError}
                  type='email'
                  name='email'
                  value={!emailError ? form?.get('email')?.toString() : ''}
                  required
                  placeholder={copy.input_email}
                />
                <input
                  data-component='input'
                  autofocus={passwordError}
                  type='password'
                  name='password'
                  placeholder={copy.input_password}
                  required
                  value={!passwordError ? form?.get('password')?.toString() : ''}
                  autoComplete='new-password'
                />
                <input
                  data-component='input'
                  type='password'
                  name='repeat'
                  required
                  autofocus={passwordError}
                  placeholder={copy.input_repeat}
                  autoComplete='new-password'
                />
                <button data-component='button'>{copy.button_continue}</button>
                <div data-component='form-footer'>
                  <span>
                    {copy.login_prompt}{' '}
                    <a data-component='link' href='authorize'>
                      {copy.login}
                    </a>
                  </span>
                </div>
              </>
            )}

            {state.type === 'code' && (
              <>
                <input type='hidden' name='action' value='verify' />
                <input
                  data-component='input'
                  autofocus
                  name='code'
                  minLength={6}
                  maxLength={6}
                  required
                  placeholder={copy.input_code}
                  autoComplete='one-time-code'
                />
                <button data-component='button'>{copy.button_continue}</button>
              </>
            )}
          </form>
        </Layout>
      ) as string;
      return new Response(jsx.toString(), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    },
    change: async (_req, state, form, error): Promise<Response> => {
      const passwordError = ['invalid_password', 'password_mismatch', 'validation_error'].includes(error?.type || '');
      const jsx = (
        <Layout>
          <form data-component='form' method='post' replace>
            <FormAlert
              message={
                error?.type
                  ? error.type === 'validation_error'
                    ? error.message ?? copy?.[`error_${error.type}`]
                    : copy?.[`error_${error.type}`]
                  : undefined
              }
            />
            {state.type === 'start' && (
              <>
                <FormAlert message={'Enter your email to reset your password'} color='success' />
                <input type='hidden' name='action' value='code' />
                <input
                  data-component='input'
                  autofocus
                  type='email'
                  name='email'
                  required
                  value={form?.get('email')?.toString()}
                  placeholder={copy.input_email}
                />
              </>
            )}
            {state.type === 'code' && (
              <>
                <input type='hidden' name='action' value='verify' />
                <input
                  data-component='input'
                  autofocus
                  name='code'
                  minLength={6}
                  maxLength={6}
                  required
                  placeholder={copy.input_code}
                  autoComplete='one-time-code'
                />
              </>
            )}
            {state.type === 'update' && (
              <>
                <input type='hidden' name='action' value='update' />
                <input
                  data-component='input'
                  autofocus
                  type='password'
                  name='password'
                  placeholder={copy.input_password}
                  required
                  value={!passwordError ? form?.get('password')?.toString() : ''}
                  autoComplete='new-password'
                />
                <input
                  data-component='input'
                  type='password'
                  name='repeat'
                  required
                  value={!passwordError ? form?.get('password')?.toString() : ''}
                  placeholder={copy.input_repeat}
                  autoComplete='new-password'
                />
              </>
            )}
            <button data-component='button'>{copy.button_continue}</button>
          </form>
          {state.type === 'code' && (
            <form method='post'>
              <input type='hidden' name='action' value='code' />
              <input type='hidden' name='email' value={state.email} />
              {state.type === 'code' && (
                <div data-component='form-footer'>
                  <span>
                    {copy.code_return}{' '}
                    <a data-component='link' href='authorize'>
                      {copy.login.toLowerCase()}
                    </a>
                  </span>
                  <button data-component='link'>{copy.code_resend}</button>
                </div>
              )}
            </form>
          )}
        </Layout>
      );
      return new Response(jsx.toString(), {
        status: error ? 400 : 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    },
  };
}
