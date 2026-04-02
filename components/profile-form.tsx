"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type ProfileFormProps = {
  action: (formData: FormData) => void;
  messages: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    avatarFile: string;
    avatarFileHelp: string;
    saveProfile: string;
  };
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    avatarUrl: string;
  };
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? "..." : label}
    </button>
  );
}

export function ProfileForm({ action, messages, values }: ProfileFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(values.avatarUrl);
  const fallbackPreview = values.avatarUrl;

  return (
    <form action={action} className="profile-form">
      <input type="hidden" name="redirect_to" value="/profile" />
      <div className="avatar-preview-card">
        <div className="avatar-preview-frame">
          {previewUrl || fallbackPreview ? (
            <img
              src={previewUrl || fallbackPreview}
              alt="Avatar preview"
              className="avatar-preview-image"
            />
          ) : null}
        </div>
      </div>
      <label>
        {messages.firstName}
        <input type="text" name="first_name" defaultValue={values.firstName} />
      </label>
      <label>
        {messages.lastName}
        <input type="text" name="last_name" defaultValue={values.lastName} />
      </label>
      <label>
        {messages.email}
        <input type="email" name="email" defaultValue={values.email} />
      </label>
      <label>
        {messages.phone}
        <input type="tel" name="phone_number" defaultValue={values.phoneNumber} />
      </label>
      <label>
        {messages.birthDate}
        <input type="date" name="birth_date" defaultValue={values.birthDate} />
      </label>
      <label>
        {messages.avatarFile}
        <input
          type="file"
          name="avatar_file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/heic,image/heif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              setPreviewUrl(values.avatarUrl);
              return;
            }
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />
        <small>{messages.avatarFileHelp}</small>
      </label>
      <SubmitButton label={messages.saveProfile} />
    </form>
  );
}
