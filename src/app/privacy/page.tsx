import MaskText from "@/components/MaskText";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VerspeKtive",
  description: "Privacy Policy and DPDP-Aligned information for VerspeKtive.",
};

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground pt-32 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-[800px]">
        <MaskText text="Privacy Policy" className="text-4xl md:text-5xl font-bold tracking-tight mb-4" />
        <p className="text-muted-foreground mb-12 font-medium">Last updated: September 24, 2026</p>

        <div className="space-y-12 prose prose-invert max-w-none text-foreground/80 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Collected</h2>
            <p>
              When you use our contact form, we may collect the following information that you voluntarily provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number, if provided</li>
              <li>Project or service requirements</li>
              <li>Any other message or information you choose to submit</li>
            </ul>
            <p className="mt-4">
              We only collect information that is reasonably necessary to respond to your enquiry and understand your requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Purpose of Collection</h2>
            <p>
              The information submitted through our contact form is used strictly to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
              <li>Respond to your enquiries</li>
              <li>Understand your project requirements</li>
              <li>Communicate with you regarding your enquiry</li>
              <li>Provide relevant information about our services when appropriate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Email Processing and Third-Party Services</h2>
            <p>
              Contact form submissions are transmitted securely through <strong>Resend</strong>, our email delivery provider, directly to our designated business email address. 
            </p>
            <p className="mt-4">
              While we do not maintain a separate customer database solely for contact form submissions on this website, the submitted information may exist in our email system and within the systems involved in transmission (such as Resend) according to their applicable data retention practices. Third-party infrastructure providers may process this information where necessary to provide their communication services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Security</h2>
            <p>
              We implement reasonable technical and organizational safeguards to protect the information you submit. All sensitive credentials, including our email delivery API keys, are strictly maintained server-side and are never exposed to the public internet or your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p>
              There is no separate database specifically storing contact form submissions on our website servers. However, emails containing your enquiry information may remain in our business email account and relevant email-delivery systems for as long as reasonably necessary to handle your enquiry, maintain appropriate business records, and comply with applicable requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children&apos;s Data</h2>
            <p>
              Our website and services are not intended to knowingly collect personal data from children except as permitted under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Rights and Grievances</h2>
            <p>
              Under applicable Indian law, you may have rights regarding your personal data, including the right to request information about processing, correction, and erasure where applicable.
            </p>
            <p className="mt-4">
              If you have any questions, privacy requests, or grievances regarding how your information is handled, please contact us at:
            </p>
            <p className="mt-4 font-medium">
              <Link href="mailto:hey@verspektive.in" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                hey@verspektive.in
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. The updated version will be indicated by the &quot;Last updated&quot; date at the top of this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
