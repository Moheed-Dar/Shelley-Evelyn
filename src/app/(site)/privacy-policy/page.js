"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  Database,
  FileText,
  UserCheck,
  Scale,
  XCircle,
  ExternalLink,
  RefreshCw,
  Cookie,
  Trash2,
} from "lucide-react";

// ============================================
// DATA
// ============================================
const privacySections = [
  {
    icon: Mail,
    title: "Email Links",
    content: [
      "This site provides email address link located on the Contact Us page so that you may email us directly with any questions or comments you may have. This site reads all messages received and makes efforts to respond promptly.",
      "In addition to replying to your comment or inquiry, we may also file your email for future reference regarding improvements to our website or discard the information. Your personal information is not shared, traded, sold, or exchanged with any third parties without your express permission.",
    ],
  },
  {
    icon: Database,
    title: "Information Collection and Use",
    content: [
      "This site is the sole owner of the information collected. We will not sell, share, trade or rent this information to others in ways different from what is disclosed in this statement. This site collects information from our users at several different points on our website.",
      "We ONLY collect personal information necessary to effectively market and sell the property of sellers, to locate, assess and qualify properties for buyers and to otherwise provide professional services to clients and customers. We do not sell, trade, transfer, rent or exchange your personal information with anyone. Free Evaluation Form / Find Your Dream Home",
    ],
  },
  {
    icon: FileText,
    title: "Did You Know? / Free Real Estate Reports",
    content: [
      "Since this site is a Real Estate Site, we give you the OPTION of requesting FREE Real Estate Information about real estate properties. Your personal Information is stored on our secure database.",
      "We ONLY collect personal information necessary to effectively market and sell the property of sellers, to locate, assess and qualify properties for buyers and to otherwise provide professional services to clients and customers. We do not sell, trade, transfer, rent or exchange your personal information with anyone.",
    ],
  },
  {
    icon: UserCheck,
    title: "Personal Information",
    content: [
      "This site functionality requires/requests users to give us contact information (such as their email address) and personal information (such as their names, addresses, phone numbers, and property details). The visitors contact and personal information is used to contact the visitor when necessary and requested, but is primarily used to collect personal information necessary to effectively market and sell the property of sellers, to locate, assess and qualify properties for buyers and to otherwise provide professional services to clients and customers.",
      "We do not sell, trade, transfer, rent or exchange your personal information with anyone. We do not disclose information about your individual visits to this site, or personal information that you provide, such as your name, address, email address, telephone number, etc. to any outside parties, except when we believe the law requires it.",
    ],
  },
  {
    icon: Scale,
    title: "Legal Disclaimer",
    content: [
      "We may disclose personal information when required by law or in the good-faith belief that such action is necessary in order to conform to the edicts of the law or comply with a legal process serviced on our website.",
    ],
  },
  {
    icon: XCircle,
    title: "Opt-Out",
    content: [
      "Users of this site have the option to unsubscribe from our mailing list directly through their accounts. To opt-out, please navigate to the Subscription Settings located under My Account.",
      "By disabling the email or SMS notification toggle, you will cease to receive notifications associated with the selected options.",
    ],
  },
  {
    icon: ExternalLink,
    title: "Links",
    content: [
      "This site contains links to other sites. These sites have their own policies and practices with respect to online privacy, and This site cannot be responsible for the privacy practices or the content of these Web sites.",
      "In addition, in certain instances a This site advertiser may ask you for personal information. This site cannot be responsible for the privacy practices of its advertisers. Only certain employees have access to the information you provide us. For example, we impose strict rules on our employees who have access either to the databases that store user information or to the servers that host our services. While we cannot guarantee that loss, misuse or alteration to data will not occur, we try to prevent such unfortunate occurrences.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Notification of Changes",
    content: [
      "This policy may be revised over time as new features are added to the website. We will post those changes so that you will always know what information we gather, how we might use that information, and whether we will disclose it to anyone. Please check this site for information about revisions to our privacy policy.",
      "We will notify you directly if there is a material change in our privacy practices. We will take commercially reasonable measures to obtain written or active email consent from the user, if this site is going to be using the information collected from the user in a manner different from that stated at the time of collection. We will also post the changes in our privacy statement 10 days prior to a change.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: [
      "This website uses the following cookies:",
      "Google Analytics: This cookie allows us to see information on user website activities including, but not limited to page views, source and time spent on websites. The information is depersonalised and is displayed as numbers, meaning it cannot be tracked back to individuals. This will help to protect your privacy. Using Google Analytics we can see what content is popular on our website, and strive to give you more of the things you enjoy reading and watching.",
      "Google AdWords: Using Google AdWords code we are able to see which pages helped lead to contact form submissions. This allows us to make better use of our paid search budget.",
    ],
  },
  {
    icon: Trash2,
    title: "Removal of & Access to Personal Info",
    content: [
      "We will accommodate the deletion of any personal information as soon as reasonably possible. Should you wish to request erasure of the personal data, please submit a written request to AgentLocator, addressed to the address listed below.",
      "Each request will be validated and you will be required to provide some personal information for security reasons. Please note that AgentLocator has the right to deny and provide explanation as to why for each denied request.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#1F2D3D] relative overflow-x-hidden">
      {/* ===== BACKGROUND TEXTURE + WATERMARK ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FFF7F0 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.3]">
          <div className="relative w-75 h-75 sm:w-100 sm:h-100">
            <Image
              src="/images/solidlogo.png"
              alt="Watermark"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
        {/* Ambient radial glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(32,178,184,0.15)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,200,181,0.12)_0%,transparent_50%)]" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-linear-to-r from-[#20B2B8] to-transparent" />
              <span className="text-[10px] font-bold text-[#20B2B8] uppercase tracking-[0.25em]">
                Your Privacy Matters
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[4.25rem] text-[#FFF7F0] tracking-tight leading-[1.15] mb-4 font-bold">
              Privacy Policy
            </h1>
            <p className="text-[#FFF7F0]/70 text-sm sm:text-[15px] leading-relaxed">
              We understand the power that the Internet holds for changing your
              life and making things easier for you. These benefits are at risk if
              people are concerned about their personal privacy. We are committed
              to providing you with an Internet experience that respects and
              protects your personal privacy choices and concerns.
            </p>
            <p className="text-[#FFF7F0]/50 text-sm sm:text-[15px] leading-relaxed mt-4">
              In general, we gather information about all of our users
              collectively. We only use such information anonymously and in the
              aggregate. This information helps us determine what is most
              beneficial for our users, and how we can continually create a better
              overall experience for you.
            </p>
          </div>
        </div>
      </div>

      {/* ===== DYNAMIC SECTIONS ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative isolate bg-[#1E3040] rounded-2xl p-5 sm:p-6 border border-[#FFF7F0]/10 overflow-hidden group hover:border-[#20B2B8]/20 transition-colors"
              >
                {/* Hover Blur Layer */}
                <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#20B2B8]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#20B2B8]/15 flex items-center justify-center shrink-0 border border-[#20B2B8]/20">
                      <Icon size={16} className="text-[#20B2B8]" />
                    </div>
                    <h2 className="text-base sm:text-lg text-[#FFF7F0] leading-snug font-bold">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[13px] sm:text-sm text-[#FFF7F0]/60 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== FOOTER SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
            <span className="text-[10px] font-bold text-[#20B2B8] uppercase tracking-[0.25em]">
              Last Updated
            </span>
            <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
          </div>
          <p className="text-xs text-[#FFF7F0]/50">
            This policy was last updated on {new Date().getFullYear()}.
          </p>
          <p className="text-xs text-[#FFF7F0]/40 mt-2 max-w-xl mx-auto">
            If you have any questions about this Privacy Policy, please contact us
            through our Contact Page.
          </p>
        </div>
      </div>
    </div>
  );
}