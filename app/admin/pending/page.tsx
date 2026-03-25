import Image from "next/image";
import { redirect } from "next/navigation";
import { reviewPendingAction } from "@/app/actions";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getCurrentUser, getPendingApprovals, getProfileDashboard } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type PendingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type PendingApprovalItem = NonNullable<
  Awaited<ReturnType<typeof getPendingApprovals>>[number]
>;

export default async function PendingApprovalsPage({ searchParams }: PendingPageProps) {
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : {};

  if (!user) {
    redirect("/login?next=/admin/pending");
  }

  const dashboard = await getProfileDashboard(user.id);
  if (dashboard.profile.role !== "admin" && dashboard.profile.role !== "host") {
    redirect("/profile");
  }

  const approvals = (await getPendingApprovals(user.id)).filter(
    (approval: Awaited<ReturnType<typeof getPendingApprovals>>[number]): approval is PendingApprovalItem =>
      approval !== null
  );

  return (
    <div className="page-stack">
      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{messages.adminPending}</p>
            <h1>{messages.adminPendingTitle}</h1>
          </div>
          <p className="section-note">{messages.adminPendingText}</p>
        </div>
        {typeof resolvedSearchParams.review === "string" ? (
          <p className="status status-success">{messages.statusConfirmed}</p>
        ) : null}
        <div className="stack-list">
          {approvals.map((approval: PendingApprovalItem) => (
            <article className="approval-card" key={`${approval.activityId}-${approval.attendeeId}`}>
              <div className="connection-head">
                <Image
                  src={approval.attendeeAvatarUrl}
                  alt={approval.attendeeName}
                  width={56}
                  height={56}
                  className="avatar"
                  unoptimized
                />
                <div>
                  <h3>{approval.attendeeName}</h3>
                  <p>{approval.activityTitle}</p>
                  <small>{formatActivityDate(approval.activityDate, locale)}</small>
                </div>
              </div>
              <div className="approval-actions">
                <form action={reviewPendingAction}>
                  <input type="hidden" name="activity_id" value={approval.activityId} />
                  <input type="hidden" name="attendee_id" value={approval.attendeeId} />
                  <input type="hidden" name="decision" value="confirmed" />
                  <button className="button button-primary button-small" type="submit">
                    {messages.approve}
                  </button>
                </form>
                <form action={reviewPendingAction}>
                  <input type="hidden" name="activity_id" value={approval.activityId} />
                  <input type="hidden" name="attendee_id" value={approval.attendeeId} />
                  <input type="hidden" name="decision" value="cancelled" />
                  <button className="button button-secondary button-small" type="submit">
                    {messages.reject}
                  </button>
                </form>
              </div>
            </article>
          ))}
          {approvals.length === 0 ? <p className="empty-state">{messages.noApprovals}</p> : null}
        </div>
      </section>
    </div>
  );
}
