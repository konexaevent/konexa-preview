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
    host: string;
    joined: string;
    pending: string;
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

function getHostAnchorId(age: Exclude<AgeOption, "all">) {
  switch (age) {
    case "18-25":
      return "host-18-25";
    case "25-35":
      return "host-25-35";
    case "35-50":
      return "host-35-50";
    case "50+":
      return "host-50-plus";
  }
}

export function HomeActivityFeed({
  activities,
  initialSelectedAge,
  messages,
  homeUi,
  locale
}: HomeActivityFeedProps) {
  const [selectedAge, setSelectedAge] = useState<AgeOption>(initialSelectedAge);

  useEffect(() => {
    setSelectedAge(initialSelectedAge);
  }, [initialSelectedAge]);

  const filteredActivities =
    selectedAge === "all"
      ? activities
      : activities.filter((activity) => activity.ageRange === selectedAge);

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
                style={{
                  objectPosition: `${activity.imageFocusX ?? 50}% ${activity.imageFocusY ?? 50}%`,
                  transform: `scale(${activity.imageZoom ?? 1})`
                }}
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
                  {activity.host ? (
                    <Link
                      href={`/#${getHostAnchorId(activity.ageRange)}`}
                      className={`host-chip ${getAgeToneClass(activity.ageRange)}`}
                      title={activity.host.name}
                    >
                      <span className="host-chip-label">{messages.host}</span>
                      <Image
                        src={activity.host.avatarUrl}
                        alt={activity.host.name}
                        width={28}
                        height={28}
                        className="host-chip-avatar"
                        unoptimized
                      />
                    </Link>
                  ) : null}
                  {activity.bookingStatus === "pending" ? (
                    <span className="pill pill-soft">{messages.pending}</span>
                  ) : activity.joined ? (
                    <span className="pill">{messages.joined}</span>
                  ) : (
                    <Link href={`/activities/${activity.id}/join`} className="button button-primary button-small">
                      {messages.joinActivity}
                    </Link>
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
