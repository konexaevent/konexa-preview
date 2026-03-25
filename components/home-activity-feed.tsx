"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ActivityCard } from "@/lib/demo-data";

type AgeOption = "all" | "18-25" | "25-35" | "35-50" | "50+";

type HomeActivityFeedProps = {
  activities: ActivityCard[];
  initialSelectedAge: AgeOption;
  messages: {
    viewActivity: string;
    joined: string;
    joinActivity: string;
    smallHostedGroup: string;
  };
  homeUi: {
    ageEyebrow: string;
    ageTitle: string;
    ageAll: string;
    ageLabels: Record<Exclude<AgeOption, "all">, string>;
    energy: string[];
    hostApproval: string;
    instantJoin: string;
    spotsLeft: string;
  };
  locale: string;
  joinAction: (formData: FormData) => void;
};

const ageOptions: AgeOption[] = ["all", "18-25", "25-35", "35-50", "50+"];

function getAgeToneClass(age: AgeOption) {
  switch (age) {
    case "18-25":
      return "age-tone-18-25";
    case "25-35":
      return "age-tone-25-35";
    case "35-50":
      return "age-tone-35-50";
    case "50+":
      return "age-tone-50-plus";
    default:
      return "age-tone-all";
  }
}

export function HomeActivityFeed({
  activities,
  initialSelectedAge,
  messages,
  homeUi,
  locale,
  joinAction
}: HomeActivityFeedProps) {
  const [selectedAge, setSelectedAge] = useState<AgeOption>(initialSelectedAge);

  useEffect(() => {
    setSelectedAge(initialSelectedAge);
  }, [initialSelectedAge]);

  const filteredActivities =
    selectedAge === "all"
      ? activities
      : activities.filter((activity) => activity.ageRange === selectedAge);

  const currentHomeHref =
    selectedAge === "all" ? "/#plans" : `/?age=${selectedAge}#plans`;

  function handleAgeChange(option: AgeOption) {
    setSelectedAge(option);
    const nextUrl = option === "all" ? "/#plans" : `/?age=${option}#plans`;
    window.history.replaceState({}, "", nextUrl);
  }

  function formatLocalDate(date: string) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));
  }

  return (
    <>
      <section className="age-filter-panel">
        <div>
          <p className="eyebrow">{homeUi.ageEyebrow}</p>
          <h3>{homeUi.ageTitle}</h3>
        </div>
        <div className="age-filter-row">
          {ageOptions.map((option) => {
            const label = option === "all" ? homeUi.ageAll : homeUi.ageLabels[option];
            return (
              <button
                key={option}
                type="button"
                className={`age-filter-chip ${getAgeToneClass(option)} ${selectedAge === option ? "age-filter-chip-active" : ""}`}
                onClick={() => handleAgeChange(option)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="activity-grid">
        {filteredActivities.map((activity, index) => (
          <article className="activity-card" key={activity.id}>
            <div className="activity-cover">
              <Image
                src={activity.heroImageUrl}
                alt={activity.title}
                fill
                className="activity-image"
              />
            </div>
            <div className="activity-content">
              <div className="activity-card-accent" aria-hidden="true" />
              <div className="meta-row">
                <span className="pill">{activity.city}</span>
                <span className="pill pill-soft">
                  {activity.maxParticipants - activity.participantCount} {homeUi.spotsLeft}
                </span>
              </div>
              <div className="activity-signal-row">
                <span className={`signal-tag signal-tag-age ${getAgeToneClass(activity.ageRange)}`}>
                  {homeUi.ageLabels[activity.ageRange]}
                </span>
                <span className="signal-tag">{homeUi.energy[index % homeUi.energy.length]}</span>
                <span className="signal-tag signal-tag-muted">
                  {activity.requiresApproval ? homeUi.hostApproval : homeUi.instantJoin}
                </span>
              </div>
              <h3>{activity.title}</h3>
              <p className="card-date">{formatLocalDate(activity.startsAt)}</p>
              <p className="card-copy">{activity.summary}</p>
              <div className="known-row">
                <span className="known-badge">
                  {activity.familiarityLabel || messages.smallHostedGroup}
                </span>
                <div className="inline-actions">
                  <Link href={`/activities/${activity.id}`} className="text-link">
                    {messages.viewActivity}
                  </Link>
                  {activity.joined ? (
                    <span className="pill">{messages.joined}</span>
                  ) : (
                    <form action={joinAction}>
                      <input type="hidden" name="activity_id" value={activity.id} />
                      <input type="hidden" name="redirect_to" value={currentHomeHref} />
                      <button type="submit" className="button button-primary button-small">
                        {messages.joinActivity}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
        {filteredActivities.length === 0 ? (
          <article className="dashboard-panel">
            <p className="empty-state">{homeUi.ageTitle}</p>
          </article>
        ) : null}
      </section>
    </>
  );
}
