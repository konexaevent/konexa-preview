"use client";

import { useMemo, useState } from "react";

type ActivityAttendee = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  status: "pending" | "confirmed" | "cancelled";
  whatsappOptIn: boolean;
  requestMessage: string;
};

type AdminActivityRosterProps = {
  activityTitle: string;
  attendees: ActivityAttendee[];
  copy: {
    attendeesTitle: string;
    attendeesEmpty: string;
    whatsappTitle: string;
    whatsappText: string;
    copyPhones: string;
    copiedPhones: string;
    openWhatsapp: string;
    pendingBadge: string;
    confirmedBadge: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    reasonLabel: string;
    yes: string;
    no: string;
  };
};

export function AdminActivityRoster({ activityTitle, attendees, copy }: AdminActivityRosterProps) {
  const [copied, setCopied] = useState(false);

  const whatsappPhones = useMemo(
    () =>
      attendees
        .filter((attendee) => attendee.whatsappOptIn && attendee.phoneNumber)
        .map((attendee) => attendee.phoneNumber),
    [attendees]
  );

  const whatsappMessage = useMemo(() => {
    const lines = [
      `Konexa · ${activityTitle}`,
      "",
      "Hola! Aquest serà el grup temporal de coordinació de l'activitat."
    ];
    return encodeURIComponent(lines.join("\n"));
  }, [activityTitle]);

  async function handleCopyPhones() {
    if (!whatsappPhones.length) {
      return;
    }

    await navigator.clipboard.writeText(whatsappPhones.join(", "));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="admin-roster">
      <div className="admin-roster-head">
        <div>
          <p className="eyebrow">{copy.attendeesTitle}</p>
          <h4>{copy.attendeesTitle}</h4>
        </div>
      </div>

      <div className="admin-roster-list">
        {attendees.map((attendee) => (
          <article className="admin-roster-card" key={attendee.id}>
            <div className="admin-roster-main">
              <img src={attendee.avatarUrl} alt={attendee.name} className="avatar" />
              <div className="admin-roster-copy">
                <strong>{attendee.name}</strong>
                <span>{attendee.status === "confirmed" ? copy.confirmedBadge : copy.pendingBadge}</span>
              </div>
            </div>
            <div className="admin-roster-meta">
              <p><strong>{copy.emailLabel}:</strong> {attendee.email || "-"}</p>
              <p><strong>{copy.phoneLabel}:</strong> {attendee.phoneNumber || "-"}</p>
              <p><strong>{copy.whatsappLabel}:</strong> {attendee.whatsappOptIn ? copy.yes : copy.no}</p>
              <p><strong>{copy.reasonLabel}:</strong> {attendee.requestMessage || "-"}</p>
            </div>
          </article>
        ))}
        {attendees.length === 0 ? <p className="empty-state">{copy.attendeesEmpty}</p> : null}
      </div>

      <div className="admin-whatsapp-box">
        <div>
          <p className="eyebrow">{copy.whatsappTitle}</p>
          <p>{copy.whatsappText}</p>
        </div>
        <div className="admin-whatsapp-actions">
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={handleCopyPhones}
            disabled={!whatsappPhones.length}
          >
            {copied ? copy.copiedPhones : copy.copyPhones}
          </button>
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="button button-primary button-small"
          >
            {copy.openWhatsapp}
          </a>
        </div>
      </div>
    </div>
  );
}
