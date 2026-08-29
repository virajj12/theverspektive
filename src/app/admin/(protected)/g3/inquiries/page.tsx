export const runtime = 'edge';

import InquiriesInbox from "@/components/admin/g3/InquiriesInbox";

export default function G3InquiriesPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Enquiries</h1>
      <p className="mb-8 text-zinc-500">
        Consultation requests from the G3 site. Every submission is stored here even if the notification email fails.
      </p>
      <InquiriesInbox />
    </div>
  );
}
