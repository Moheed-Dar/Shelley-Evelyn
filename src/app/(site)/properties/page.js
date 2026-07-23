"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Grid3X3,
  List,
  X,
  Star,
  ArrowUpRight,
  Building2,
  Crown,
  Gem,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const PROPERTY_TYPES = [
  "all",
  "house",
  "apartment",
  "villa",
  "penthouse",
  "plot",
  "commercial",
  "flat",
  "studio",
];

const PRICE_TYPES = [
  { value: "", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "title", label: "Name: A to Z" },
  { value: "viewsCount", label: "Most Viewed" },
];

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// ============================================
// STATUS COLOR HELPER (LIGHT VERSION)
// ============================================
const getStatusStyles = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/15";
    case "sold":
      return "bg-red-500/15 text-red-300 border border-red-400/15";
    case "rented":
      return "bg-amber-500/15 text-amber-300 border border-amber-400/15";
    case "pending":
      return "bg-yellow-400/15 text-yellow-200 border border-yellow-300/15";
    case "reserved":
      return "bg-purple-500/15 text-purple-300 border border-purple-400/15";
    case "under construction":
      return "bg-sky-500/15 text-sky-300 border border-sky-400/15";
    case "off plan":
      return "bg-indigo-500/15 text-indigo-300 border border-indigo-400/15";
    case "new":
      return "bg-teal-500/15 text-teal-300 border border-teal-400/15";
    default:
      return "bg-gray-500/15 text-gray-300 border border-gray-400/15";
  }
};

const getStatusDotColor = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-400";
    case "sold":
      return "bg-red-400";
    case "rented":
      return "bg-amber-400";
    case "pending":
      return "bg-yellow-400";
    case "reserved":
      return "bg-purple-400";
    case "under construction":
      return "bg-sky-400";
    case "off plan":
      return "bg-indigo-400";
    case "new":
      return "bg-teal-400";
    default:
      return "bg-gray-400";
  }
};

// ============================================
// HIGHLIGHT MATCHED TEXT
// ============================================
const HighlightText = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;
  const regex = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#FAAE62] font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

// ============================================
// REUSABLE: SELECT WITH CUSTOM STYLING
// ============================================
const DarkSelect = ({ value, onChange, options, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-4 pr-8 py-2.5 bg-[#3d1660]/80 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/40 focus:border-[#FAAE62]/40 transition-all duration-200 hover:bg-[#3d1660] cursor-pointer shadow-lg shadow-black/10"
      style={{ colorScheme: "dark" }}
    >
      {options}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2.5}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none transition-transform duration-200"
    />
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceType, setPriceType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ============================================
  // FETCH
  // ============================================
  const fetchProperties = async (pageNum = page) => {
    try {
      setLoading(true);
      let url = `/api/properties/get-all?page=${pageNum}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (priceType) url += `&priceType=${priceType}`;
      if (propertyType && propertyType !== "all")
        url += `&propertyType=${propertyType}`;
      const res = await axios.get(url);
      setProperties(res.data?.data || []);
      setPagination(res.data?.pagination || null);
      setPage(pageNum);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
  }, [propertyType, priceType, sortBy, sortOrder]);

  // ============================================
  // CLIENT-SIDE SEARCH FILTER
  // ============================================
  const matchProperty = useCallback((p, words) => {
    const title = (p.title || "").toLowerCase();
    const location = (p.location || p.city || "").toLowerCase();
    const code = (p.propertyCode || "").toLowerCase();
    return words.every(
      (word) => title.includes(word) || location.includes(word) || code.includes(word)
    );
  }, []);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties;
    const searchWords = search
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (searchWords.length === 0) return properties;
    return properties.filter((p) => matchProperty(p, searchWords));
  }, [properties, search, matchProperty]);

  // ============================================
  // SUGGESTIONS
  // ============================================
  const suggestions = useMemo(() => {
    if (!searchInput.trim()) return [];
    const words = searchInput.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return properties.filter((p) => matchProperty(p, words)).slice(0, 5);
  }, [searchInput, properties, matchProperty]);

  // ============================================
  // DEBOUNCED AUTO-SEARCH
  // ============================================
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  // ============================================
  // CLOSE SUGGESTIONS ON OUTSIDE CLICK
  // ============================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setShowSuggestions(false);
  };
  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };
  const handleSuggestionClick = () => {
    setShowSuggestions(false);
  };

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasActiveFilters = propertyType !== "all" || priceType || search;
  const clearAllFilters = () => {
    setPropertyType("all");
    setPriceType("");
    setSearch("");
    setSearchInput("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleRefresh = () => {
    fetchProperties(page);
  };

  // ============================================
  // SKELETONS
  // ============================================
  const SkeletonCard = () => (
    <div className="bg-[#3d1660] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="h-72 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-[#3d1660] rounded-2xl overflow-hidden border border-white/5 animate-pulse flex h-48">
      <div className="w-56 bg-white/5 shrink-0" />
      <div className="p-5 flex-1 space-y-3">
        <div className="h-5 bg-white/5 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
      </div>
    </div>
  );

  // ============================================
  // PROPERTY CARD (GRID)
  // ============================================
  const PropertyCard = ({ property }) => {
    const img =
      getSafeImg(property.thumbnail) ||
      getSafeImg(property.images?.[0]) ||
      PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link href={`/properties/${property._id}`} className="group block">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-105 sm:h-110px rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/30 bg-[#3d1660] cursor-pointer hover:shadow-2xl hover:shadow-[#FAAE62]/15 hover:border-[#FAAE62]/30 transition-all duration-500"
        >
          <Image
            src={img}
            alt={property.title}
            fill
            priority
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Top badges — Status REMOVED from here */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex flex-wrap gap-2">
              {property.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAAE62]/90 backdrop-blur-md text-[#301143] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <Crown size={9} className="fill-[#301143]" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 bg-white/15 backdrop-blur-md text-white/90 text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                {property.priceType}
              </span>
            </div>
            <button
              onClick={(e) => toggleLike(property._id, e)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all"
            >
              <Heart
                size={15}
                className={
                  isLiked ? "fill-red-400 text-red-400" : "text-white/70"
                }
              />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <div className="flex items-center gap-3 mb-3">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                  <Bed size={12} className="text-[#FAAE62]/80" />
                  <span className="text-white text-xs font-semibold">
                    {property.bedrooms}
                  </span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                  <Bath size={12} className="text-[#FAAE62]/80" />
                  <span className="text-white text-xs font-semibold">
                    {property.bathrooms}
                  </span>
                </div>
              )}
              {(property.areaSize || property.area) > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                  <Maximize size={12} className="text-[#FAAE62]/80" />
                  <span className="text-white text-xs font-semibold">
                    {property.areaSize || property.area}{" "}
                    {property.areaUnit || "sqft"}
                  </span>
                </div>
              )}
            </div>

            <h3 className="text-xl text-white mb-1.5 leading-tight line-clamp-1 drop-shadow-lg font-inter">
              {property.title}
            </h3>

            {property.propertyCode && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-[#FAAE62]/15 text-[#FAAE62] border border-[#FAAE62]/25">
                  {property.propertyCode}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
              <MapPin size={13} className="text-[#FAAE62]/70 shrink-0" />
              <span className="truncate">
                {property.location || property.city}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl text-transparent bg-clip-text bg-linear-to-r from-[#FFD9AE] via-[#FFC188] to-[#FAAE62] leading-none font-inter">
                  {property.currency === "PKR" ? "Rs" : "$"}{" "}
                  {Number(property.price)?.toLocaleString()}
                </p>
                {/* ONLY bottom status badge — lighter bg + rounded-md */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md capitalize backdrop-blur-sm ${getStatusStyles(property.status)}`}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${getStatusDotColor(property.status)}`} />
                    {property.status}
                  </span>
                  {property.viewsCount > 0 && (
                    <span className="text-white/40 text-xs">
                      · {property.viewsCount} views
                    </span>
                  )}
                </div>
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FAAE62] text-[#301143] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-[#FAAE62]/30">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  // ============================================
  // PROPERTY CARD (LIST)
  // ============================================
  const PropertyListItem = ({ property }) => {
    const img =
      getSafeImg(property.thumbnail) ||
      getSafeImg(property.images?.[0]) ||
      PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link href={`/properties/${property._id}`} className="group block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/30 bg-[#3d1660] cursor-pointer hover:shadow-2xl hover:shadow-[#FAAE62]/15 hover:border-[#FAAE62]/30 transition-all duration-500"
        >
          <Image
            src={img}
            alt={property.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            <div className="flex gap-1.5">
              {property.isFeatured && (
                <span className="px-2 py-0.5 bg-[#FAAE62]/90 text-[#301143] text-[9px] font-bold rounded-full uppercase tracking-wider">
                  <Crown size={8} className="fill-[#301143] inline mr-0.5" />
                  Featured
                </span>
              )}
              <span className="px-2 py-0.5 bg-white/15 backdrop-blur-md text-white/90 text-[9px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                {property.priceType}
              </span>
              {/* Lighter + rounded-md status badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold rounded-md capitalize backdrop-blur-sm ${getStatusStyles(property.status)}`}
              >
                <span className={`inline-block w-1 h-1 rounded-full ${getStatusDotColor(property.status)}`} />
                {property.status}
              </span>
            </div>
            <button
              onClick={(e) => toggleLike(property._id, e)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all"
            >
              <Heart
                size={14}
                className={
                  isLiked ? "fill-red-400 text-red-400" : "text-white/70"
                }
              />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-lg text-white mb-0.5 leading-tight drop-shadow-lg line-clamp-1 font-inter">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                  {property.propertyCode && (
                    <span className="inline-block font-mono text-[10px] font-bold text-[#FAAE62]/80 bg-[#FAAE62]/10 px-1.5 py-0.5 rounded mr-2">
                      {property.propertyCode}
                    </span>
                  )}
                  <MapPin size={11} className="text-[#FAAE62]/70" />
                  <span className="truncate">
                    {property.location || property.city}
                  </span>
                  <span className="text-white/20 mx-1">·</span>
                  <div className="flex items-center gap-2">
                    {property.bedrooms > 0 && (
                      <span>{property.bedrooms} Bed</span>
                    )}
                    {property.bathrooms > 0 && (
                      <span>{property.bathrooms} Bath</span>
                    )}
                    {(property.areaSize || property.area) > 0 && (
                      <span>
                        {property.areaSize || property.area}{" "}
                        {property.areaUnit || "sqft"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xl text-transparent bg-clip-text bg-linear-to-r from-[#FFD9AE] to-[#FAAE62] leading-none font-inter">
                {property.currency === "PKR" ? "Rs" : "$"}{" "}
                {Number(property.price)?.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  // ============================================
  // DARK OPTION STYLE
  // ============================================
  const darkOptionStyle = {
    backgroundColor: "#3d1660",
    color: "#e3cdf0",
    padding: "8px 12px",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`min-h-screen bg-[#301143] font-inter`}>
      {/* Background Texture + Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div className="relative w-75 h-75 sm:w-100 sm:h-100">
            <Image
              src="/images/logo3.png"
              alt="Watermark"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(250,174,98,0.12)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(250,174,98,0.08)_0%,transparent_50%)]" />
      </div>

      {/* ===== HERO — z-50 ===== */}
      <div className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-linear-to-r from-[#FAAE62] to-transparent" />
              <p className="text-[#FAAE62] text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <Building2 size={14} />
                Explore Listings
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-4 font-inter">
              Our Properties
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8">
              Discover your perfect property from our curated collection of
              premium real estate listings.
            </p>
          </div>

          {/* ===== SEARCH BAR + CONTROLS ===== */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-45">
                <form onSubmit={handleSearch}>
                  <div className="relative flex items-center bg-white/10 border border-white/15 rounded-2xl focus-within:border-[#FAAE62]/50 focus-within:ring-2 focus-within:ring-[#FAAE62]/20 transition-all">
                    <Search
                      size={16}
                      className="absolute left-3.5 text-white/40"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        if (searchInput.trim()) setShowSuggestions(true);
                      }}
                      placeholder="Search by title, location, or property code..."
                      className="w-full pl-9 pr-20 py-3 text-sm bg-transparent text-white placeholder-white/30 focus:outline-none"
                      autoComplete="off"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-12 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors group"
                        title="Clear search"
                      >
                        <X
                          size={14}
                          className="text-white/50 group-hover:text-white/80 transition-colors"
                        />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#FAAE62] text-[#301143] rounded-xl hover:bg-[#FFC188] transition-colors shadow-lg shadow-[#FAAE62]/25"
                      title="Search"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#3d1660]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                          {suggestions.length} suggestion
                          {suggestions.length !== 1 ? "s" : ""} found
                        </span>
                        <button
                          onClick={() => setShowSuggestions(false)}
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        >
                          <X size={11} className="text-white/30" />
                        </button>
                      </div>
                      <div
                        className="max-h-80 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "rgba(250,174,98,0.3) transparent",
                        }}
                      >
                        {suggestions.map((property) => {
                          const img =
                            getSafeImg(property.thumbnail) ||
                            getSafeImg(property.images?.[0]) ||
                            PLACEHOLDER;
                          return (
                            <Link
                              key={property._id}
                              href={`/properties/${property._id}`}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                            >
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 shadow-lg shadow-black/30 ring-1 ring-white/10">
                                <Image
                                  src={img}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white leading-tight line-clam-1 font-inter">
                                  <HighlightText
                                    text={property.title}
                                    query={searchInput}
                                  />
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <MapPin
                                    size={10}
                                    className="text-[#FAAE62]/70 shrink-0"
                                  />
                                  <span className="text-[11px] text-white/50 truncate">
                                    <HighlightText
                                      text={
                                        property.location ||
                                        property.city ||
                                        "N/A"
                                      }
                                      query={searchInput}
                                    />
                                  </span>
                                  {property.propertyCode && (
                                    <span className="ml-2 text-[10px] font-mono font-bold text-[#FAAE62]/70 bg-[#FAAE62]/10 px-1.5 py-0.5 rounded">
                                      {property.propertyCode}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="text-xs font-bold text-white/70">
                                  {property.currency === "PKR" ? "Rs" : "$"}{" "}
                                  {Number(property.price)?.toLocaleString()}
                                </span>
                                <span className={`inline-block w-2 h-2 rounded-full ${getStatusDotColor(property.status)}`} title={property.status} />
                                <div className="w-6 h-6 rounded-md bg-[#FAAE62]/10 flex items-center justify-center">
                                  <ArrowUpRight
                                    size={11}
                                    className="text-[#FAAE62]/60"
                                  />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-white/5">
                        <button
                          onClick={() => {
                            setSearch(searchInput);
                            setShowSuggestions(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FAAE62] hover:bg-[#FAAE62]/10 transition-colors"
                        >
                          <Search size={12} />
                          View all results for &quot;{searchInput.slice(0, 30)}
                          {searchInput.length > 30 ? "..." : ""}&quot;
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showSuggestions &&
                    searchInput.trim().length > 0 &&
                    suggestions.length === 0 &&
                    !loading && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#3d1660]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                      >
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <div className="w-10 h-10 rounded-full bg-[#FAAE62]/5 flex items-center justify-center mb-3 border border-[#FAAE62]/10">
                            <Search size={16} className="text-[#FAAE62]/40" />
                          </div>
                          <p className="text-sm text-white/50 font-medium">
                            No matches found
                          </p>
                          <p className="text-[11px] text-white/30 mt-1">
                            Try different keywords
                          </p>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              <div className="shrink-0 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-white/80 text-xs font-medium whitespace-nowrap">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "property" : "properties"}
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-40 shrink-0"
                title="Refresh listings"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors shrink-0 ${
                  showFilters || hasActiveFilters
                    ? "bg-[#FAAE62] text-[#301143] shadow-lg shadow-[#FAAE62]/25"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/15"
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-4 h-4 flex items-center justify-center bg-[#301143] text-[#FAAE62] text-[10px] font-black rounded-full">
                    !
                  </span>
                )}
              </button>

              <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#FAAE62] text-[#301143] shadow-lg shadow-[#FAAE62]/25" : "text-white/40 hover:text-white/70"}`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#FAAE62] text-[#301143] shadow-lg shadow-[#FAAE62]/25" : "text-white/40 hover:text-white/70"}`}
                >
                  <List size={15} />
                </button>
              </div>

              <DarkSelect
                className="w-36 shrink-0"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split("-");
                  setSortBy(f);
                  setSortOrder(o);
                }}
                options={SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={`${opt.value}-${opt.value === "price" ? "asc" : "desc"}`}
                    style={darkOptionStyle}
                  >
                    {opt.label}
                  </option>
                ))}
              />
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {propertyType !== "all" && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FAAE62]/20 text-[#FFC188] text-[11px] font-semibold rounded-full capitalize border border-[#FAAE62]/25">
                    {propertyType}
                    <button onClick={() => setPropertyType("all")}>
                      <X size={9} />
                    </button>
                  </span>
                )}
                {priceType && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FAAE62]/20 text-[#FFC188] text-[11px] font-semibold rounded-full capitalize border border-[#FAAE62]/25">
                    {priceType}
                    <button onClick={() => setPriceType("")}>
                      <X size={9} />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FAAE62]/20 text-[#FFC188] text-[11px] font-semibold rounded-full border border-[#FAAE62]/25">
                    &quot;{search.slice(0, 15)}&quot;
                    <button onClick={handleClearSearch}>
                      <X size={9} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-red-400 font-semibold hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== FILTER PANEL ===== */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-40 overflow-hidden bg-[#42165f]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Property Type
                  </label>
                  <DarkSelect
                    className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    options={PROPERTY_TYPES.map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={darkOptionStyle}
                        className="capitalize"
                      >
                        {t === "all" ? "All Types" : t}
                      </option>
                    ))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Listing Type
                  </label>
                  <DarkSelect
                    className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80"
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    options={PRICE_TYPES.map((t) => (
                      <option
                        key={t.value}
                        value={t.value}
                        style={darkOptionStyle}
                      >
                        {t.label}
                      </option>
                    ))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Sort By
                  </label>
                  <DarkSelect
                    className="w-full [&>select]:py-2.5 [&>select]:rounded-xl [&>select]:text-sm [&>select]:text-white/80"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [f, o] = e.target.value.split("-");
                      setSortBy(f);
                      setSortOrder(o);
                    }}
                    options={SORT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={`${opt.value}-${opt.value === "price" ? "asc" : "desc"}`}
                        style={darkOptionStyle}
                      >
                        {opt.label}
                      </option>
                    ))}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2.5 border border-white/15 text-white/60 text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== GRID / LIST ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonList key={i} />
              ))}
            </div>
          )
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FAAE62]/10 flex items-center justify-center mb-4 border border-[#FAAE62]/15">
              <Search size={28} className="text-[#FAAE62]/40" />
            </div>
            <h3 className="text-lg text-white mb-1 font-inter">
              No Properties Found
            </h3>
            <p className="text-white/60 text-sm max-w-sm mb-4">
              {hasActiveFilters
                ? `No match found for "${search}". Try different keywords or clear filters.`
                : "No properties listed yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#FAAE62] text-[#301143] text-sm font-semibold rounded-xl hover:bg-[#FFC188] transition-colors shadow-lg shadow-[#FAAE62]/25"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProperties.map((property) => (
              <PropertyListItem key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => fetchProperties(page - 1)}
              disabled={!pagination.hasPrevPage}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/15 text-white/40 hover:border-[#FAAE62]/50 hover:text-[#FAAE62] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span
                    key={`d${i}`}
                    className="w-10 h-10 flex items-center justify-center text-white/20 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => fetchProperties(item)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${page === item ? "bg-[#FAAE62] text-[#301143] shadow-lg shadow-[#FAAE62]/25" : "border border-white/15 text-white/50 hover:border-[#FAAE62]/50 hover:text-[#FAAE62]"}`}
                  >
                    {item}
                  </button>
                ),
              )}
            <button
              onClick={() => fetchProperties(page + 1)}
              disabled={!pagination.hasNextPage}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/15 text-white/40 hover:border-[#FAAE62]/50 hover:text-[#FAAE62] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}