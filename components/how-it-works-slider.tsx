"use client";

import { useEffect, useMemo, useState } from "react";

type StepItem = {
  title: string;
  text: string;
};

type HowItWorksSliderProps = {
  steps: StepItem[];
  previousLabel: string;
  nextLabel: string;
};

export function HowItWorksSlider({
  steps,
  previousLabel,
  nextLabel
}: HowItWorksSliderProps) {
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const extendedSteps = useMemo(() => {
    if (steps.length <= 1) return steps;
    return [steps[steps.length - 1], ...steps, steps[0]];
  }, [steps]);

  const activeIndex =
    steps.length <= 1 ? 0 : ((virtualIndex - 1 + steps.length) % steps.length + steps.length) % steps.length;

  useEffect(() => {
    if (steps.length <= 1) return;

    const interval = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setVirtualIndex((current) => current + 1);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    if (steps.length <= 1) {
      setVirtualIndex(0);
      return;
    }

    setVirtualIndex(1);
    setIsTransitionEnabled(true);
  }, [steps]);

  if (steps.length === 0) return null;

  const goPrevious = () => {
    if (steps.length <= 1) return;
    setIsTransitionEnabled(true);
    setVirtualIndex((current) => current - 1);
  };

  const goNext = () => {
    if (steps.length <= 1) return;
    setIsTransitionEnabled(true);
    setVirtualIndex((current) => current + 1);
  };

  const handleTransitionEnd = () => {
    if (steps.length <= 1) return;

    if (virtualIndex === 0) {
      setIsTransitionEnabled(false);
      setVirtualIndex(steps.length);
    } else if (virtualIndex === steps.length + 1) {
      setIsTransitionEnabled(false);
      setVirtualIndex(1);
    }
  };

  return (
    <div className="steps-slider" aria-roledescription="carousel">
      <div
        className={`steps-slider-track${isTransitionEnabled ? "" : " steps-slider-track-reset"}`}
        style={{ transform: `translateX(-${(steps.length <= 1 ? activeIndex : virtualIndex) * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSteps.map((step, index) => (
          <article
            className="step-card step-slide"
            key={`${step.title}-${index}`}
            aria-hidden={index !== virtualIndex}
          >
            <span className="step-number">0{((index - 1 + steps.length) % steps.length) + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>

      {steps.length > 1 ? (
        <div className="steps-slider-controls">
          <button
            type="button"
            className="steps-slider-button"
            onClick={goPrevious}
            aria-label={previousLabel}
          >
            <span aria-hidden="true">←</span>
          </button>

          <div className="steps-slider-dots" aria-label="Progress">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`steps-slider-dot${index === activeIndex ? " is-active" : ""}`}
                onClick={() => {
                  if (steps.length <= 1) return;
                  setIsTransitionEnabled(true);
                  setVirtualIndex(index + 1);
                }}
                aria-label={`${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="steps-slider-button"
            onClick={goNext}
            aria-label={nextLabel}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
