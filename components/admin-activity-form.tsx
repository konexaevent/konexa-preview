"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveActivityAction } from "@/app/actions";

type EditableActivity = {
  id: string;
  title: string;
  summary: string;
  price: string;
  startsAt: string;
  city: string;
  ageRange: "18-25" | "25-35" | "35-50" | "50+";
  heroImageUrl: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageZoom?: number;
  hostUserId?: string;
  hostName?: string;
  hostAvatarUrl?: string;
  requiresApproval?: boolean;
  maxParticipants: number;
};

type HostOption = {
  name: string;
  avatarUrl: string;
  userId?: string;
};

type AdminActivityFormProps = {
  editingActivity: EditableActivity | null;
  hosts: HostOption[];
  copy: {
    titleLabel: string;
    dateLabel: string;
    priceLabel: string;
    summaryLabel: string;
    cityLabel: string;
    ageLabel: string;
    hostLabel: string;
    seatsLabel: string;
    approvalLabel: string;
    imageLabel: string;
    imageHelp: string;
    existingImage: string;
    save: string;
    cancelEdit: string;
    imagePreviewTitle: string;
    imagePreviewText: string;
    imageZoomLabel: string;
    imageHorizontalLabel: string;
    imageVerticalLabel: string;
    noImagePreview: string;
  };
};

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AdminActivityForm({
  editingActivity,
  hosts,
  copy
}: AdminActivityFormProps) {
  const [previewUrl, setPreviewUrl] = useState(editingActivity?.heroImageUrl || "");
  const [focusX, setFocusX] = useState(editingActivity?.imageFocusX ?? 50);
  const [focusY, setFocusY] = useState(editingActivity?.imageFocusY ?? 50);
  const [zoom, setZoom] = useState(editingActivity?.imageZoom ?? 1);
  const [selectedHostName, setSelectedHostName] = useState(editingActivity?.hostName || "");

  useEffect(() => {
    setPreviewUrl(editingActivity?.heroImageUrl || "");
    setFocusX(editingActivity?.imageFocusX ?? 50);
    setFocusY(editingActivity?.imageFocusY ?? 50);
    setZoom(editingActivity?.imageZoom ?? 1);
    setSelectedHostName(editingActivity?.hostName || "");
  }, [editingActivity]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const previewStyle = useMemo(
    () => ({
      objectPosition: `${focusX}% ${focusY}%`,
      transform: `scale(${zoom})`
    }),
    [focusX, focusY, zoom]
  );
  const selectedHost = hosts.find((host) => host.name === selectedHostName);

  return (
    <form action={saveActivityAction} className="admin-activity-form">
      <input type="hidden" name="activity_id" value={editingActivity?.id || ""} />
      <input
        type="hidden"
        name="existing_image_url"
        value={editingActivity?.heroImageUrl || ""}
      />
      <input type="hidden" name="image_focus_x" value={String(focusX)} />
      <input type="hidden" name="image_focus_y" value={String(focusY)} />
      <input type="hidden" name="image_zoom" value={String(zoom)} />
      <input type="hidden" name="host_name" value={selectedHostName} />
      <input type="hidden" name="host_avatar_url" value={selectedHost?.avatarUrl || ""} />
      <input type="hidden" name="host_user_id" value={selectedHost?.userId || ""} />

      <div className="admin-form-grid">
        <label>
          {copy.titleLabel}
          <input
            type="text"
            name="title"
            defaultValue={editingActivity?.title || ""}
            required
          />
        </label>
        <label>
          {copy.dateLabel}
          <input
            type="datetime-local"
            name="starts_at"
            defaultValue={editingActivity ? toDateTimeLocal(editingActivity.startsAt) : ""}
            required
          />
        </label>
        <label>
          {copy.priceLabel}
          <input
            type="text"
            name="price"
            defaultValue={editingActivity?.price || ""}
            placeholder="22 EUR"
            required
          />
        </label>
        <label className="admin-form-span-2">
          {copy.summaryLabel}
          <textarea
            name="summary"
            rows={4}
            defaultValue={editingActivity?.summary || ""}
            required
          />
        </label>
        <label>
          {copy.cityLabel}
          <input
            type="text"
            name="city"
            defaultValue={editingActivity?.city || "Girona"}
            required
          />
        </label>
        <label>
          {copy.ageLabel}
          <select name="age_range" defaultValue={editingActivity?.ageRange || "25-35"}>
            <option value="18-25">18-25</option>
            <option value="25-35">25-35</option>
            <option value="35-50">35-50</option>
            <option value="50+">50+</option>
          </select>
        </label>
        <label>
          {copy.hostLabel}
          <select value={selectedHostName} onChange={(event) => setSelectedHostName(event.currentTarget.value)}>
            <option value="">Sense host</option>
            {hosts.map((host) => (
              <option key={host.name} value={host.name}>
                {host.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {copy.seatsLabel}
          <input
            type="number"
            min="2"
            max="20"
            name="max_participants"
            defaultValue={editingActivity?.maxParticipants || 8}
            required
          />
        </label>
        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="requires_approval"
            defaultChecked={editingActivity?.requiresApproval || false}
          />
          <span>{copy.approvalLabel}</span>
        </label>
        <label className="admin-form-span-2">
          {copy.imageLabel}
          <input
            type="file"
            name="hero_image_file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) {
                setPreviewUrl(editingActivity?.heroImageUrl || "");
                return;
              }

              const nextPreviewUrl = URL.createObjectURL(file);
              setPreviewUrl((current) => {
                if (current.startsWith("blob:")) {
                  URL.revokeObjectURL(current);
                }
                return nextPreviewUrl;
              });
            }}
          />
          <small>{copy.imageHelp}</small>
        </label>
      </div>

      <div className="admin-image-editor">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{copy.imagePreviewTitle}</p>
            <h3>{copy.imagePreviewTitle}</h3>
          </div>
          <p className="section-note">{copy.imagePreviewText}</p>
        </div>

        <div className="admin-image-editor-grid">
          <div className="admin-image-preview-frame">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt={editingActivity?.title || "Preview"}
                  className="admin-image-preview-media"
                  style={previewStyle}
                />
                <div className="admin-image-preview-safezone" aria-hidden="true" />
              </>
            ) : (
              <div className="admin-image-preview-empty">{copy.noImagePreview}</div>
            )}
          </div>

          <div className="admin-image-controls">
            <label>
              {copy.imageZoomLabel}
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.currentTarget.value))}
              />
            </label>
            <label>
              {copy.imageHorizontalLabel}
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={focusX}
                onChange={(event) => setFocusX(Number(event.currentTarget.value))}
              />
            </label>
            <label>
              {copy.imageVerticalLabel}
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={focusY}
                onChange={(event) => setFocusY(Number(event.currentTarget.value))}
              />
            </label>
          </div>
        </div>
      </div>

      {editingActivity?.heroImageUrl ? (
        <div className="admin-existing-image">
          <span>{copy.existingImage}</span>
          <Image
            src={editingActivity.heroImageUrl}
            alt={editingActivity.title}
            width={240}
            height={140}
            className="admin-existing-image-frame"
            style={{
              objectPosition: `${editingActivity.imageFocusX ?? 50}% ${editingActivity.imageFocusY ?? 50}%`,
              transform: `scale(${editingActivity.imageZoom ?? 1})`
            }}
            unoptimized
          />
        </div>
      ) : null}

      <div className="admin-form-actions">
        <button className="button button-primary" type="submit">
          {copy.save}
        </button>
        {editingActivity ? (
          <Link href="/admin" className="button button-secondary">
            {copy.cancelEdit}
          </Link>
        ) : null}
      </div>
    </form>
  );
}
