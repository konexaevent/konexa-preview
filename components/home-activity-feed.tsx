"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    sharedAvailable: string;
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
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setSelectedAge(initialSelectedAge);
  }, [initialSelectedAge]);

  const filteredActivities =
    selectedAge === "all"
      ? activities
      : activities.filter((activity) => activity.ageRange === selectedAge);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      setCanScrollLeft(slider.scrollLeft > 8);
      setCanScrollRight(maxScrollLeft - slider.scrollLeft > 8);
    };

    updateScrollState();
    slider.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [filteredActivities.length]);

  function handleAgeChange(option: AgeOption) {
    setSelectedAge(option);
    const nextUrl = option === "all" ? "/#plans" : `/?age=${option}#plans`;
    window.history.replaceState({}, "", nextUrl);
    requestAnimationFrame(() => {
      sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    });
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

  function scrollSlider(direction: "left" | "right") {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const step = Math.min(slider.clientWidth * 0.9, 380);
    slider.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth"
    });
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

      <section className="activity-slider-shell">
        {filteredActivities.length > 0 ? (
          <div className="activity-slider-toolbar">
            <div className="activity-slider-controls" aria-label="Activity slider controls">
              <button
                type="button"
                className="activity-slider-button"
                onClick={() => scrollSlider("left")}
                disabled={!canScrollLeft}
                aria-label="Previous activities"
              >
                ←
              </button>
              <button
                type="button"
                className="activity-slider-button"
                onClick={() => scrollSlider("right")}
                disabled={!canScrollRight}
                aria-label="Next activities"
              >
                →
              </button>
            </div>
          </div>
        ) : null}
        <div className="activity-slider-track" ref={sliderRef}>
          {filteredActivities.map((activity, index) => (
            <article className="activity-card activity-slider-card" key={activity.id}>
              {(() => {
                return (
                  <>
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
                      <div className="activity-cover-overlay" aria-hidden="true" />
                      <div className="activity-cover-top">
                        <span className={`signal-tag signal-tag-age ${getAgeToneClass(activity.ageRange)}`}>
                          {homeUi.ageLabels[activity.ageRange]}
                        </span>
                        <span className="pill pill-soft">
                          {activity.maxParticipants - activity.participantCount} {homeUi.spotsLeft}
                        </span>
                      </div>
                    </div>
                    <div className="activity-content">
                      <div className="activity-card-accent" aria-hidden="true" />
                      <div className="activity-card-body">
                        <h3>{activity.title}</h3>
                        <p className="card-date">{formatLocalDate(activity.startsAt)}</p>
                        <p className="card-copy">{activity.summary}</p>
                      </div>
                      <div className="known-row activity-card-footer">
                        <a href={`/activities/${activity.id}`} className="text-link activity-primary-link">
                          {messages.viewActivity}
                        </a>
                        <div className="inline-actions">
                          {activity.host ? (
                            <a
                              href={`/hosts#${getHostAnchorId(activity.ageRange)}`}
                              className={`host-chip ${getAgeToneClass(activity.ageRange)}`}
                              title={activity.host.name}
                            >
                              <span className="host-chip-label">{messages.host}</span>
                              <img
                                src={activity.host.avatarUrl}
                                alt={activity.host.name}
                                width={28}
                                height={28}
                                className="host-chip-avatar"
                              />
                            </a>
                          ) : null}
                          {activity.bookingStatus === "pending" ? (
                            <span className="pill pill-soft">{messages.pending}</span>
                          ) : activity.joined ? (
                            <span className="pill">{messages.joined}</span>
                          ) : (
                            <a href={`/activities/${activity.id}/join`} className="button button-primary button-small">
                              {messages.joinActivity}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </article>
          ))}
          {filteredActivities.length === 0 ? (
            <article className="dashboard-panel activity-slider-empty">
              <p className="empty-state">{homeUi.ageTitle}</p>
            </article>
          ) : null}
        </div>
      </section>
    </>
  );
}
