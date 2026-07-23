// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Send,
//   User,
//   Phone,
//   Mail,
//   MessageSquare,
//   Building2,
//   CheckCircle2,
//   Loader2,
//   Heart,
//   Tag,
// } from "lucide-react";
// import { submitLead } from "@/lib/api";
// import { Playfair_Display, Inter } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// /**
//  * =============================================
//  * REUSABLE LEAD FORM — Har jagah use ho sakta hai
//  * =============================================
//  *
//  * PROPERTY PAGE PAR:
//  *   <LeadForm
//  *     propertyId={property._id}
//  *     propertyTitle={property.title}
//  *     propertyCode={property.propertyCode}
//  *     propertyPrice={property.price}
//  *     propertyCurrency={property.currency}
//  *     open={showLeadForm}
//  *     onOpenChange={setShowLeadForm}
//  *     onSuccess={() => console.log("done")}
//  *   />
//  *
//  * CUSTOM TRIGGER KE SATH:
//  *   <LeadForm
//  *     propertyId={property._id}
//  *     propertyTitle={property.title}
//  *     trigger={<button className="...">Ask Price</button>}
//  *   />
//  *
//  * BINA PROPERTY (General Inquiry):
//  *   <LeadForm
//  *     title="Contact Us"
//  *     subtitle="Send us a message"
//  *     trigger={<button>Contact</button>}
//  *   />
//  * =============================================
//  */
// export default function LeadForm({
//   // Property info — jab property page par use ho
//   propertyId,
//   propertyTitle,
//   propertyCode,
//   propertyPrice,
//   propertyCurrency = "PKR",

//   // General
//   title = "Interested",
//   subtitle,

//   // Open/Close control
//   trigger,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,

//   // Callbacks
//   onSuccess,

//   // Extra classes for default trigger button
//   className = "",
// }) {
//   // ---- Open State (controlled ya uncontrolled) ----
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = setControlledOpen || setInternalOpen;

//   // ---- Form State ----
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     message: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const nameRef = useRef(null);

//   const hasProperty = !!(propertyId || propertyTitle);

//   // ---- Auto-focus name input jab modal khule ----
//   useEffect(() => {
//     if (isOpen && !submitted) {
//       const t = setTimeout(() => nameRef.current?.focus(), 350);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen, submitted]);

//   // ✅ AUTO CLOSE — 2 second baad modal band ho jayega
//   useEffect(() => {
//     if (submitted) {
//       const timer = setTimeout(() => {
//         setOpen(false);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [submitted, setOpen]);

//   // ---- Reset form jab modal band ho ----
//   useEffect(() => {
//     if (!isOpen) {
//       const t = setTimeout(() => {
//         setForm({ name: "", phone: "", email: "", message: "" });
//         setSubmitted(false);
//         setError("");
//       }, 300);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen]);

//   // ---- Handlers ----
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim() || !form.phone.trim()) {
//       setError("Name and Phone are required.");
//       return;
//     }

//     // API mein email bhi required hai (backend check)
//     if (!form.email.trim()) {
//       setError("Email is required.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       // ✅ API ke hisaab se field names: property (not propertyId), title
//       const payload = {
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         email: form.email.trim(),
//         message: form.message.trim() || undefined,
//         property: propertyId || undefined,         // ✅ API field name
//         title: propertyTitle || title || "General Inquiry", // ✅ API field name
//       };

//       // undefined keys hata do
//       Object.keys(payload).forEach(
//         (key) => payload[key] === undefined && delete payload[key]
//       );

//       const response = await submitLead(payload);

//       setSubmitted(true);
//       onSuccess?.(response?.data);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatPrice = (price, currency) => {
//     if (!price) return null;
//     const symbol = currency === "PKR" ? "Rs" : "$";
//     return `${symbol} ${Number(price).toLocaleString()}`;
//   };

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <>
//       {/* ---- TRIGGER ---- */}
//       {trigger ? (
//         <div onClick={() => setOpen(true)} className={className}>
//           {trigger}
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#2B7FFF] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#4D94FF] active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25 ${className}`}
//         >
//           <Heart size={16} /> I&apos;m Interested
//         </button>
//       )}

//       {/* ---- MODAL ---- */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm"
//               onClick={() => !submitting && setOpen(false)}
//             />

//             {/* Panel */}
//             <div className="fixed inset-0 z-1001 flex items-end sm:items-center justify-center p-0 sm:p-4">
//               <motion.div
//                 initial={{ y: "100%", opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: "100%", opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 350, damping: 30 }}
//                 className="relative w-full sm:max-w-md bg-[#0d1f3c] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden border border-white/10"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* ---- HEADER ---- */}
//                 <div className="relative bg-linear-to-r from-[#2B7FFF]/15 via-[#2B7FFF]/10 to-transparent px-6 pt-6 pb-12 border-b border-white/10">
//                   {!submitting && !submitted && (
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}

//                   <div className="flex items-center gap-3 mb-2">
//                     <div className="w-10 h-10 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center border border-[#2B7FFF]/20">
//                       {hasProperty ? (
//                         <Heart size={18} className="text-[#2B7FFF]" />
//                       ) : (
//                         <Send size={18} className="text-[#2B7FFF]" />
//                       )}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className={`text-white text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
//                       >
//                         {title}
//                       </h3>
//                       {subtitle && (
//                         <p className="text-[#2B7FFF]/50 text-xs truncate">
//                           {subtitle}
//                         </p>
//                       )}
//                       {propertyTitle && !subtitle && (
//                         <p className="text-[#2B7FFF]/50 text-xs line-clamp-1">
//                           {propertyTitle}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <p className="text-white/30 text-xs mt-1">
//                     {hasProperty
//                       ? "Fill in your details and we'll get back to you shortly."
//                       : "Send us a message and we'll respond promptly."}
//                   </p>
//                 </div>

//                 {/* ---- BODY ---- */}
//                 <div className="relative px-6 pb-6 -mt-6">
//                   <div className="bg-[#0a1628] rounded-2xl border border-white/10 shadow-lg p-5">
//                     {/* SUCCESS */}
//                     {submitted ? (
//                       <div className="flex flex-col items-center py-8 gap-3">
//                         <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
//                           <CheckCircle2
//                             size={30}
//                             className="text-emerald-400"
//                           />
//                         </div>
//                         <h4
//                           className={`text-lg text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//                         >
//                           Thank You!
//                         </h4>
//                         <p className="text-sm text-white/40 text-center max-w-65">
//                           {hasProperty
//                             ? "Your interest has been submitted. We'll contact you soon."
//                             : "Your message has been sent. We'll get back to you shortly."}
//                         </p>
//                         {/* Close button hataya — ab auto close hoga */}
//                       </div>
//                     ) : (
//                       /* FORM */
//                       <form onSubmit={handleSubmit} className="space-y-3.5">
//                         {/* Error */}
//                         {error && (
//                           <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
//                             <X size={14} className="shrink-0" />
//                             <span>{error}</span>
//                           </div>
//                         )}

//                         {/* Name */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <User size={10} />
//                             Full Name <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             ref={nameRef}
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             placeholder="John Doe"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <Phone size={10} />
//                             Phone <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone}
//                             onChange={handleChange}
//                             placeholder="+92 300 1234567"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Email */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <Mail size={10} />
//                             Email <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="john@example.com"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Message */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <MessageSquare size={10} />
//                             Message
//                           </label>
//                           <textarea
//                             name="message"
//                             value={form.message}
//                             onChange={handleChange}
//                             rows={3}
//                             placeholder="I'm interested in this property..."
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 resize-none transition-all"
//                           />
//                         </div>

//                         {/* Property Info Card (sirf jab property ho) */}
//                         {hasProperty && (
//                           <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#2B7FFF]/5 rounded-xl border border-[#2B7FFF]/10">
//                             <Building2
//                               size={14}
//                               className="text-[#2B7FFF]/70 shrink-0"
//                             />
//                             <span className="text-xs text-white/30 truncate flex-1">
//                               {propertyCode || propertyTitle}
//                             </span>
//                             {propertyPrice && (
//                               <span className="text-xs font-bold text-[#2B7FFF]/80 shrink-0">
//                                 {formatPrice(propertyPrice, propertyCurrency)}
//                               </span>
//                             )}
//                           </div>
//                         )}

//                         {/* Submit */}
//                         <button
//                           type="submit"
//                           disabled={submitting}
//                           className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 bg-[#2B7FFF] text-white text-sm font-bold rounded-xl hover:bg-[#4D94FF] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25"
//                         >
//                           {submitting ? (
//                             <>
//                               <Loader2 size={16} className="animate-spin" />{" "}
//                               Submitting...
//                             </>
//                           ) : (
//                             <>
//                               <Send size={16} /> Submit Interest
//                             </>
//                           )}
//                         </button>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Send,
//   User,
//   Phone,
//   Mail,
//   MessageSquare,
//   Building2,
//   CheckCircle2,
//   Loader2,
//   Heart,
// } from "lucide-react";
// import { submitLead } from "@/lib/api";
// import { Playfair_Display, Inter } from "next/font/google";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// /**
//  * REUSABLE LEAD FORM
//  *
//  * PROPERTY PAGE:
//  *   <LeadForm
//  *     propertyId={property._id}
//  *     propertyTitle={property.title}
//  *     propertyCode={property.propertyCode}
//  *     propertyPrice={property.price}
//  *     propertyCurrency={property.currency}
//  *     onSuccess={() => console.log("done")}
//  *   />
//  *
//  * CUSTOM TRIGGER:
//  *   <LeadForm
//  *     propertyId={property._id}
//  *     propertyTitle={property.title}
//  *     trigger={<button className="...">Ask Price</button>}
//  *   />
//  *
//  * GENERAL INQUIRY:
//  *   <LeadForm
//  *     title="Contact Us"
//  *     subtitle="Send us a message"
//  *     trigger={<button>Contact</button>}
//  *   />
//  */
// export default function LeadForm({
//   propertyId,
//   propertyTitle,
//   propertyCode,
//   propertyPrice,
//   propertyCurrency = "PKR",
//   title = "Interested",
//   subtitle,
//   trigger,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,
//   onSuccess,
//   className = "",
// }) {
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = setControlledOpen || setInternalOpen;

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     message: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const nameRef = useRef(null);

//   const hasProperty = !!(propertyId || propertyTitle);

//   useEffect(() => {
//     if (isOpen && !submitted) {
//       const t = setTimeout(() => nameRef.current?.focus(), 350);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen, submitted]);

//   useEffect(() => {
//     if (submitted) {
//       const timer = setTimeout(() => {
//         setOpen(false);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [submitted, setOpen]);

//   useEffect(() => {
//     if (!isOpen) {
//       const t = setTimeout(() => {
//         setForm({ name: "", phone: "", email: "", message: "" });
//         setSubmitted(false);
//         setError("");
//       }, 300);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim() || !form.phone.trim()) {
//       setError("Name and Phone are required.");
//       return;
//     }

//     if (!form.email.trim()) {
//       setError("Email is required.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         email: form.email.trim(),
//         message: form.message.trim() || undefined,
//         property: propertyId || undefined,
//         title: propertyTitle || title || "General Inquiry",
//       };

//       Object.keys(payload).forEach(
//         (key) => payload[key] === undefined && delete payload[key]
//       );

//       const response = await submitLead(payload);
//       setSubmitted(true);
//       onSuccess?.(response?.data);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatPrice = (price, currency) => {
//     if (!price) return null;
//     const symbol = currency === "PKR" ? "Rs" : "$";
//     return `${symbol} ${Number(price).toLocaleString()}`;
//   };

//   return (
//     <>
//       {/* ---- TRIGGER ---- */}
//       {trigger ? (
//         <div onClick={() => setOpen(true)} className={className}>
//           {trigger}
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 bg-[#2B7FFF] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#4D94FF] active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25 ${className}`}
//         >
//           <Heart size={16} /> I&apos;m Interested
//         </button>
//       )}

//       {/* ---- MODAL — ALWAYS OPENS FROM TOP ---- */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm"
//               onClick={() => !submitting && setOpen(false)}
//             />

//             {/* Container — items-start = always from top */}
//             <div className="fixed inset-0 z-1001 flex items-start justify-center overflow-y-auto">
//               <motion.div
//                 initial={{ y: "-100%", opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: "-100%", opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 28 }}
//                 className="relative w-full sm:max-w-md bg-[#0d1f3c] sm:rounded-2xl sm:my-6 shadow-2xl overflow-hidden border-t-0 sm:border-t border-x-0 sm:border-x border-white/10"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* ---- HEADER ---- */}
//                 <div className="relative bg-linear-to-r from-[#2B7FFF]/15 via-[#2B7FFF]/10 to-transparent px-4 sm:px-6 pt-5 sm:pt-6 pb-10 sm:pb-12 border-b border-white/10">
//                   {!submitting && !submitted && (
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}

//                   <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
//                     <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center border border-[#2B7FFF]/20 shrink-0">
//                       {hasProperty ? (
//                         <Heart size={16} className="text-[#2B7FFF]" />
//                       ) : (
//                         <Send size={16} className="text-[#2B7FFF]" />
//                       )}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className={`text-base sm:text-lg text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//                       >
//                         {title}
//                       </h3>
//                       {subtitle && (
//                         <p className="text-[#2B7FFF]/50 text-[11px] sm:text-xs truncate">
//                           {subtitle}
//                         </p>
//                       )}
//                       {propertyTitle && !subtitle && (
//                         <p className="text-[#2B7FFF]/50 text-[11px] sm:text-xs line-clamp-1">
//                           {propertyTitle}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <p className="text-white/30 text-[11px] sm:text-xs mt-1">
//                     {hasProperty
//                       ? "Fill in your details and we'll get back to you shortly."
//                       : "Send us a message and we'll respond promptly."}
//                   </p>
//                 </div>

//                 {/* ---- BODY ---- */}
//                 <div className="relative px-4 sm:px-6 pb-5 sm:pb-6 -mt-5 sm:-mt-6">
//                   <div className="bg-[#0a1628] rounded-xl sm:rounded-2xl border border-white/10 shadow-lg p-4 sm:p-5">
//                     {/* SUCCESS */}
//                     {submitted ? (
//                       <div className="flex flex-col items-center py-6 sm:py-8 gap-3">
//                         <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
//                           <CheckCircle2
//                             size={26}
//                             className="text-emerald-400"
//                           />
//                         </div>
//                         <h4
//                           className={`text-base sm:text-lg text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//                         >
//                           Thank You!
//                         </h4>
//                         <p className="text-xs sm:text-sm text-white/40 text-center max-w-60 sm:max-w-65">
//                           {hasProperty
//                             ? "Your interest has been submitted. We'll contact you soon."
//                             : "Your message has been sent. We'll get back to you shortly."}
//                         </p>
//                       </div>
//                     ) : (
//                       /* FORM */
//                       <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
//                         {/* Error */}
//                         {error && (
//                           <div className="flex items-start gap-2 px-3 sm:px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-300 text-[11px] sm:text-xs">
//                             <X size={13} className="shrink-0 mt-0.5" />
//                             <span>{error}</span>
//                           </div>
//                         )}

//                         {/* Name */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
//                             <User size={9} className="sm:w-2.5 sm:h-2.5" />
//                             Full Name <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             ref={nameRef}
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             placeholder="John Doe"
//                             required
//                             className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
//                             <Phone size={9} className="sm:w-2.5 sm:h-2.5" />
//                             Phone <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone}
//                             onChange={handleChange}
//                             placeholder="+92 300 1234567"
//                             required
//                             className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Email */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
//                             <Mail size={9} className="sm:w-2.5 sm:h-2.5" />
//                             Email <span className="text-[#2B7FFF]">*</span>
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="john@example.com"
//                             required
//                             className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 transition-all"
//                           />
//                         </div>

//                         {/* Message */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
//                             <MessageSquare size={9} className="sm:w-2.5 sm:h-2.5" />
//                             Message
//                           </label>
//                           <textarea
//                             name="message"
//                             value={form.message}
//                             onChange={handleChange}
//                             rows={3}
//                             placeholder="I'm interested in this property..."
//                             className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]/30 resize-none transition-all"
//                           />
//                         </div>

//                         {/* Property Info Card */}
//                         {hasProperty && (
//                           <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2.5 bg-[#2B7FFF]/5 rounded-lg sm:rounded-xl border border-[#2B7FFF]/10">
//                             <Building2
//                               size={13}
//                               className="text-[#2B7FFF]/70 shrink-0"
//                             />
//                             <span className="text-[11px] sm:text-xs text-white/30 truncate flex-1">
//                               {propertyCode || propertyTitle}
//                             </span>
//                             {propertyPrice && (
//                               <span className="text-[11px] sm:text-xs font-bold text-[#2B7FFF]/80 shrink-0">
//                                 {formatPrice(propertyPrice, propertyCurrency)}
//                               </span>
//                             )}
//                           </div>
//                         )}

//                         {/* Submit */}
//                         <button
//                           type="submit"
//                           disabled={submitting}
//                           className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-[#2B7FFF] text-white text-sm font-bold rounded-lg sm:rounded-xl hover:bg-[#4D94FF] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25"
//                         >
//                           {submitting ? (
//                             <>
//                               <Loader2 size={16} className="animate-spin" />
//                               <span>Submitting...</span>
//                             </>
//                           ) : (
//                             <>
//                               <Send size={16} />
//                               <span>Submit Interest</span>
//                             </>
//                           )}
//                         </button>
//                       </form>
//                     )}
//                   </div>
//                 </div>

//                 {/* Bottom safe area for mobile notch phones */}
//                 <div className="h-[env(safe-area-inset-bottom)]" />
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }









"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  User,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  CheckCircle2,
  Loader2,
  Heart,
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * REUSABLE LEAD FORM
 *
 * PROPERTY PAGE:
 *   <LeadForm
 *     propertyId={property._id}
 *     propertyTitle={property.title}
 *     propertyCode={property.propertyCode}
 *     propertyPrice={property.price}
 *     propertyCurrency={property.currency}
 *     onSuccess={() => console.log("done")}
 *   />
 *
 * CUSTOM TRIGGER:
 *   <LeadForm
 *     propertyId={property._id}
 *     propertyTitle={property.title}
 *     trigger={<button className="...">Ask Price</button>}
 *   />
 *
 * GENERAL INQUIRY:
 *   <LeadForm
 *     title="Contact Us"
 *     subtitle="Send us a message"
 *     trigger={<button>Contact</button>}
 *   />
 */
export default function LeadForm({
  propertyId,
  propertyTitle,
  propertyCode,
  propertyPrice,
  propertyCurrency = "PKR",
  title = "Interested",
  subtitle,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  className = "",
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  const hasProperty = !!(propertyId || propertyTitle);

  useEffect(() => {
    if (isOpen && !submitted) {
      const t = setTimeout(() => nameRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen, submitted]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted, setOpen]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm({ name: "", phone: "", email: "", message: "" });
        setSubmitted(false);
        setError("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and Phone are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim() || undefined,
        property: propertyId || undefined,
        title: propertyTitle || title || "General Inquiry",
      };

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const response = await submitLead(payload);
      setSubmitted(true);
      onSuccess?.(response?.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price, currency) => {
    if (!price) return null;
    const symbol = currency === "PKR" ? "Rs" : "$";
    return `${symbol} ${Number(price).toLocaleString()}`;
  };

  return (
    <>
      {/* ---- TRIGGER ---- */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className={className}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 bg-[#FAAE62] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#FBBF77] active:scale-[0.98] transition-all shadow-lg shadow-[#FAAE62]/25 ${className}`}
        >
          <Heart size={16} /> I&apos;m Interested
        </button>
      )}

      {/* ---- MODAL — ALWAYS OPENS FROM TOP ---- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm"
              onClick={() => !submitting && setOpen(false)}
            />

            {/* Container — items-start = always from top */}
            <div className="fixed inset-0 z-1001 flex items-start justify-center overflow-y-auto">
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative w-full sm:max-w-md bg-[#301143] sm:rounded-2xl sm:my-6 shadow-2xl overflow-hidden border-t-0 sm:border-t border-x-0 sm:border-x border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ---- HEADER ---- */}
                <div className="relative bg-linear-to-r from-[#FAAE62]/15 via-[#FAAE62]/10 to-transparent px-4 sm:px-6 pt-5 sm:pt-6 pb-10 sm:pb-12 border-b border-white/10">
                  {!submitting && !submitted && (
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAAE62]/15 flex items-center justify-center border border-[#FAAE62]/20 shrink-0">
                      {hasProperty ? (
                        <Heart size={16} className="text-[#FAAE62]" />
                      ) : (
                        <Send size={16} className="text-[#FAAE62]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-base sm:text-lg text-white ${playfair.variable} font-(family-name:--font-playfair)`}
                      >
                        {title}
                      </h3>
                      {subtitle && (
                        <p className="text-[#FAAE62]/50 text-[11px] sm:text-xs truncate">
                          {subtitle}
                        </p>
                      )}
                      {propertyTitle && !subtitle && (
                        <p className="text-[#FAAE62]/50 text-[11px] sm:text-xs line-clamp-1">
                          {propertyTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-white/30 text-[11px] sm:text-xs mt-1">
                    {hasProperty
                      ? "Fill in your details and we'll get back to you shortly."
                      : "Send us a message and we'll respond promptly."}
                  </p>
                </div>

                {/* ---- BODY ---- */}
                <div className="relative px-4 sm:px-6 pb-5 sm:pb-6 -mt-5 sm:-mt-6">
                  <div className="bg-[#3A1A4E] rounded-xl sm:rounded-2xl border border-white/10 shadow-lg p-4 sm:p-5">
                    {/* SUCCESS */}
                    {submitted ? (
                      <div className="flex flex-col items-center py-6 sm:py-8 gap-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                          <CheckCircle2
                            size={26}
                            className="text-emerald-400"
                          />
                        </div>
                        <h4
                          className={`text-base sm:text-lg text-white ${playfair.variable} font-(family-name:--font-playfair)`}
                        >
                          Thank You!
                        </h4>
                        <p className="text-xs sm:text-sm text-white/40 text-center max-w-60 sm:max-w-65">
                          {hasProperty
                            ? "Your interest has been submitted. We'll contact you soon."
                            : "Your message has been sent. We'll get back to you shortly."}
                        </p>
                      </div>
                    ) : (
                      /* FORM */
                      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                        {/* Error */}
                        {error && (
                          <div className="flex items-start gap-2 px-3 sm:px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-300 text-[11px] sm:text-xs">
                            <X size={13} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {/* Name */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
                            <User size={9} className="sm:w-2.5 sm:h-2.5" />
                            Full Name <span className="text-[#FAAE62]">*</span>
                          </label>
                          <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/20 focus:border-[#FAAE62]/30 transition-all"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
                            <Phone size={9} className="sm:w-2.5 sm:h-2.5" />
                            Phone <span className="text-[#FAAE62]">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+92 300 1234567"
                            required
                            className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/20 focus:border-[#FAAE62]/30 transition-all"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
                            <Mail size={9} className="sm:w-2.5 sm:h-2.5" />
                            Email <span className="text-[#FAAE62]">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/20 focus:border-[#FAAE62]/30 transition-all"
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 sm:mb-1.5">
                            <MessageSquare size={9} className="sm:w-2.5 sm:h-2.5" />
                            Message
                          </label>
                          <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={3}
                            placeholder="I'm interested in this property..."
                            className="w-full px-3.5 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/20 focus:border-[#FAAE62]/30 resize-none transition-all"
                          />
                        </div>

                        {/* Property Info Card */}
                        {hasProperty && (
                          <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2.5 bg-[#FAAE62]/5 rounded-lg sm:rounded-xl border border-[#FAAE62]/10">
                            <Building2
                              size={13}
                              className="text-[#FAAE62]/70 shrink-0"
                            />
                            <span className="text-[11px] sm:text-xs text-white/30 truncate flex-1">
                              {propertyCode || propertyTitle}
                            </span>
                            {propertyPrice && (
                              <span className="text-[11px] sm:text-xs font-bold text-[#FAAE62]/80 shrink-0">
                                {formatPrice(propertyPrice, propertyCurrency)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-[#FAAE62] text-white text-sm font-bold rounded-lg sm:rounded-xl hover:bg-[#FBBF77] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#FAAE62]/25"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              <span>Submit Interest</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Bottom safe area for mobile notch phones */}
                <div className="h-[env(safe-area-inset-bottom)]" />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}