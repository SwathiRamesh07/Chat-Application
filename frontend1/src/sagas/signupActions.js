export const SIGNUP_TRIGGER = 'signup/SIGNUP_TRIGGER';

export const signupTrigger = (payload) => ({
  type: SIGNUP_TRIGGER,
  payload,
});
// this is the plain action for triggering a saga