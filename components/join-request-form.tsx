"use client";

import { useState } from "react";
import { requestActivityJoinAction } from "@/app/actions";

type JoinRequestCopy = {
  title: string;
  text: string;
  aboutYou: string;
  phoneHint: string;
  motivation: string;
  motivationPlaceholder: string;
  whatsappConsent: string;
  submit: string;
  success: string;
  loggedInHint: string;
  noAccountHint: string;
  passwordLabel: string;
  passwordHint: string;
  passwordError: string;
  credentialsError: string;
  genericError: string;
  registeredChoice: string;
  newChoice: string;
  chooseAccountState: string;
  existingAccountHint: string;
};

type MessagesShape = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone: string;
};

type JoinRequestFormProps = {
  activityId: string;
  redirectTo: string;
  isLoggedIn: boolean;
  requested: boolean;
  errorCode: string | null;
  joinUi: JoinRequestCopy;
  messages: MessagesShape;
  defaults: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
  };
};

export function JoinRequestForm({
  activityId,
  redirectTo,
  isLoggedIn,
  requested,
  errorCode,
  joinUi,
  messages,
  defaults
}: JoinRequestFormProps) {
  const [accountState, setAccountState] = useState<"existing" | "new">("new");

  const errorMessage =
    errorCode === "password"
      ? joinUi.passwordError
      : errorCode === "credentials"
        ? joinUi.credentialsError
        : errorCode
          ? joinUi.genericError
          : null;

  return (
    <>
      <p className="eyebrow">{joinUi.title}</p>
      <h2>{joinUi.title}</h2>
      <p className="section-note">{joinUi.text}</p>
      {requested ? <p className="status status-success">{joinUi.success}</p> : null}
      {errorMessage ? <p className="status status-error">{errorMessage}</p> : null}
      <p className="join-request-hint">{isLoggedIn ? joinUi.loggedInHint : joinUi.noAccountHint}</p>

      <form action={requestActivityJoinAction} className="profile-form join-request-form">
        <input type="hidden" name="activity_id" value={activityId} />
        <input type="hidden" name="redirect_to" value={redirectTo} />
        {!isLoggedIn ? <input type="hidden" name="account_status" value={accountState} /> : null}

        <div className="panel-head panel-head-form">
          <div>
            <p className="eyebrow">{joinUi.aboutYou}</p>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="join-request-account-switch">
            <p className="join-request-switch-label">{joinUi.chooseAccountState}</p>
            <div className="join-request-switch-options">
              <label className={`join-request-switch-option ${accountState === "existing" ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="account_status_ui"
                  checked={accountState === "existing"}
                  onChange={() => setAccountState("existing")}
                />
                <span>{joinUi.registeredChoice}</span>
              </label>
              <label className={`join-request-switch-option ${accountState === "new" ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="account_status_ui"
                  checked={accountState === "new"}
                  onChange={() => setAccountState("new")}
                />
                <span>{joinUi.newChoice}</span>
              </label>
            </div>
          </div>
        ) : null}

        {!isLoggedIn && accountState === "existing" ? (
          <>
            <p className="join-request-existing-hint">{joinUi.existingAccountHint}</p>
            <label className="form-field">
              <span>{messages.email}</span>
              <input type="email" name="email" defaultValue={defaults.email} required />
            </label>
            <label className="form-field">
              <span>{joinUi.passwordLabel}</span>
              <input type="password" name="password" minLength={8} required />
            </label>
          </>
        ) : null}

        {!isLoggedIn && accountState === "new" ? (
          <>
            <label className="form-field">
              <span>{messages.firstName}</span>
              <input type="text" name="first_name" defaultValue={defaults.firstName} required />
            </label>
            <label className="form-field">
              <span>{messages.lastName}</span>
              <input type="text" name="last_name" defaultValue={defaults.lastName} required />
            </label>
            <label className="form-field">
              <span>{messages.email}</span>
              <input type="email" name="email" defaultValue={defaults.email} required />
            </label>
            <label className="form-field">
              <span>{joinUi.passwordLabel}</span>
              <input type="password" name="password" minLength={8} required />
              <small>{joinUi.passwordHint}</small>
            </label>
            <label className="form-field">
              <span>{messages.birthDate}</span>
              <input type="date" name="birth_date" defaultValue={defaults.birthDate} required />
            </label>
            <label className="form-field">
              <span>{messages.phone}</span>
              <input type="tel" name="phone_number" defaultValue={defaults.phoneNumber} required />
              <small>{joinUi.phoneHint}</small>
            </label>
          </>
        ) : null}

        {isLoggedIn ? (
          <div className="join-request-identity">
            <div className="info-item">
              <p className="label">{messages.firstName}</p>
              <p className="value">{defaults.firstName || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.lastName}</p>
              <p className="value">{defaults.lastName || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.email}</p>
              <p className="value">{defaults.email || "-"}</p>
            </div>
            <label className="form-field">
              <span>{messages.phone}</span>
              <input type="tel" name="phone_number" defaultValue={defaults.phoneNumber} required />
              <small>{joinUi.phoneHint}</small>
            </label>
          </div>
        ) : null}

        <label className="form-field">
          <span>{joinUi.motivation}</span>
          <textarea
            name="motivation"
            rows={5}
            placeholder={joinUi.motivationPlaceholder}
            required
          />
        </label>

        <label className="checkbox-field">
          <input type="checkbox" name="whatsapp_consent" required />
          <span>{joinUi.whatsappConsent}</span>
        </label>

        <button type="submit" className="button button-primary">
          {joinUi.submit}
        </button>
      </form>
    </>
  );
}
