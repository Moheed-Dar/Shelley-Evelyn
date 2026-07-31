"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const titleContainerRef = useRef(null);
  const cursorGlowRef = useRef(null);
  // Removed: const letsTalkRef = useRef(null);
  const rotatingBadgeRef = useRef(null);
  const arrowRef = useRef(null);
  const bottomOverlayRef = useRef(null);
  const ringTextRef = useRef(null);
  const ringPulseRef = useRef(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isRingHovered, setIsRingHovered] = useState(false);

  const brandBlue = "#97b4f8";

  // Public folder images (banner/banner1.jpg, banner/banner2.jpg, banner/banner3.jpg)
  const heroImages = [
    {
      url: "/banner/banner1.jpg",
      title: "Modern Villa",
      location: "Beverly Hills, CA",
      price: "$4.2M",
    },
    {
      url: "/banner/banner2.jpg",
      title: "Luxury Estate",
      location: "Malibu, CA",
      price: "$7.8M",
    },
    {
      url: "/banner/banner3.jpg",
      title: "Ocean View",
      location: "Miami Beach, FL",
      price: "$5.5M",
    },
  ];

  const clientImages = [
    "/client/client1.jpg",
    "/client/client2.jpg",
    "/client/client3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToImage = useCallback((index) => {
    if (index === currentImageIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [currentImageIndex, isTransitioning]);

  const nextImage = useCallback(() => {
    goToImage((currentImageIndex + 1) % heroImages.length);
  }, [currentImageIndex, goToImage, heroImages.length]);

  const prevImage = useCallback(() => {
    goToImage((currentImageIndex - 1 + heroImages.length) % heroImages.length);
  }, [currentImageIndex, goToImage, heroImages.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Removed letsTalkRef from gsap.set
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 40,
      });

      gsap.set(rotatingBadgeRef.current, {
        opacity: 0,
        scale: 0.5,
      });

      gsap.set(bottomOverlayRef.current, {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({ delay: 0.5 });

      // Removed the letsTalkRef tween from the timeline
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .to(rotatingBadgeRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        }, "-=0.6")
        .to(bottomOverlayRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.2");

      gsap.to(ringTextRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      gsap.to(arrowRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.to(ringPulseRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!rotatingBadgeRef.current) return;

    if (isRingHovered) {
      gsap.to(rotatingBadgeRef.current, {
        scale: 1.1,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
      gsap.to(ringTextRef.current, {
        rotation: "+=180",
        duration: 1,
        ease: "power2.out",
      });
    } else {
      gsap.to(rotatingBadgeRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [isRingHovered]);

  // Soft Blue Cursor Glow Effect on Shelley Evelyn title
  useEffect(() => {
    const titleContainer = titleContainerRef.current;
    const cursorGlow = cursorGlowRef.current;
    if (!titleContainer || !cursorGlow) return;

    const handleMouseMove = (e) => {
      const rect = titleContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursorGlow, {
        x: x - 60,
        y: y - 60,
        duration: 0.15,
        ease: "power1.out",
      });
    };

    const handleMouseEnter = () => {
      setIsHoveringTitle(true);
      gsap.to(cursorGlow, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      setIsHoveringTitle(false);
      gsap.to(cursorGlow, {
        opacity: 0,
        scale: 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    titleContainer.addEventListener("mousemove", handleMouseMove);
    titleContainer.addEventListener("mouseenter", handleMouseEnter);
    titleContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      titleContainer.removeEventListener("mousemove", handleMouseMove);
      titleContainer.removeEventListener("mouseenter", handleMouseEnter);
      titleContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0a1628]"
    >
      <div className="absolute inset-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <button
        onClick={prevImage}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-32">
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-10">
          <div
            ref={titleContainerRef}
            className="relative"
            style={{ cursor: "none" }}
          >
            {/* Soft Blue Cursor Glow - Light and Elegant */}
            <div
              ref={cursorGlowRef}
              className="absolute pointer-events-none z-20 opacity-0"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(151, 180, 248, 0.35) 0%, rgba(100, 149, 237, 0.15) 40%, transparent 70%)",
                filter: "blur(8px)",
                transform: "scale(0.3)",
                mixBlendMode: "screen",
              }}
            />

            {/* Soft secondary glow */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(151, 180, 248, 0.08) 0%, transparent 70%)",
                filter: "blur(12px)",
                transform: "translate(-20px, -20px)",
                opacity: isHoveringTitle ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />

            <h1
              ref={titleRef}
              className="text-6xl sm:text-7xl md:text-8xl md:py-5  py-2 lg:text-9xl xl:text-[10rem] font-black tracking-tighter leading-none select-none text-center relative z-10 bg-linear-to-r from-[#faae62d5] via-purple-300 to-[#faae62ee] bg-clip-text text-transparent"
              style={{
                // textShadow gradient text par kaam nahi karta, isliye drop-shadow use kiya hai
                filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.5)) drop-shadow(0 2px 10px rgba(0,0,0,0.3))",
              }}
            >
              Shelley Evelyn
            </h1>
          </div>
        </div>

        {/* ========== ENLARGED ROTATING BADGE WITH ANIMATIONS ========== */}
        <Link href="/services" passHref>
          <div
            ref={rotatingBadgeRef}
            onMouseEnter={() => setIsRingHovered(true)}
            onMouseLeave={() => setIsRingHovered(false)}
            className="relative w-28 h-28 mt-15 md:mt-0 top-10 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            {/* Outer Pulse Ring */}
            <div
              ref={ringPulseRef}
              className="absolute inset-0 rounded-full border-2 border-white/20"
              style={{
                boxShadow:
                  "0 0 30px rgba(151, 180, 248, 0.3), inset 0 0 30px rgba(151, 180, 248, 0.1)",
              }}
            />

            {/* Second outer ring */}
            <div
              className="absolute inset-2 rounded-full border border-white/10"
              style={{
                animation: "spin-slow 25s linear infinite",
              }}
            />

            {/* Rotating SVG Text Ring */}
            <div ref={ringTextRef} className="absolute inset-0 w-full h-full">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                style={{ transformOrigin: "center" }}
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                  />
                  <linearGradient
                    id="textGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#97b4f8" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#97b4f8" />
                  </linearGradient>
                </defs>
                <text
                  fill="url(#textGradient)"
                  className="font-semibold tracking-[0.25em] uppercase"
                  style={{ fontSize: "7.5px" }}
                >
                  <textPath href="#circlePath">
                    New Concepts • Explore • New Concepts • Explore •
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Decorative dots around the ring */}
            <div
              className="absolute inset-0 w-full h-full animate-spin"
              style={{ animationDuration: "30s" }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: brandBlue,
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translate(0, -${isRingHovered ? "110px" : "95px"
                      })`,
                    opacity: 0.7,
                    transition: "transform 0.5s ease, opacity 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Center Circle with enhanced effects */}
            <div
              ref={arrowRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500"
                style={{
                  boxShadow: isRingHovered
                    ? "0 0 40px rgba(151, 180, 248, 0.6), 0 0 80px rgba(151, 180, 248, 0.3)"
                    : "0 10px 40px rgba(0,0,0,0.3)",
                }}
              >
                {/* Inner glow ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 transition-all duration-500"
                  style={{
                    borderColor: isRingHovered ? brandBlue : "transparent",
                    transform: isRingHovered ? "scale(1.2)" : "scale(1)",
                    opacity: isRingHovered ? 0.5 : 0,
                  }}
                />

                <ArrowUpRight
                  size={20}
                  className="text-gray-900 transition-all duration-300"
                  style={{
                    color: isRingHovered ? brandBlue : "#1a1a1a",
                    transform: isRingHovered
                      ? "rotate(45deg) scale(1.2)"
                      : "rotate(0deg) scale(1)",
                  }}
                />
              </div>
            </div>

            {/* Hover glow effect */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-500 pointer-events-none"
              style={{
                background: isRingHovered
                  ? "radial-gradient(circle, rgba(151,180,248,0.15) 0%, transparent 70%)"
                  : "transparent",
              }}
            />
          </div>
        </Link>
        {/* ========== END ENLARGED BADGE ========== */}
      </div>

      <div
        ref={bottomOverlayRef}
        className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pb-6 md:pb-8"
      >
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
            <Link
              href="/testimonials"
              className="flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-2xl px-4 py-3 cursor-pointer transition-colors hover:bg-black/40"
            >
              {/* Images Section - Inner Link removed */}
              <div className="flex -space-x-3">
                {clientImages.map((src, index) => (
                  <div
                    key={index}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`Client ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ))}
              </div>

              {/* Text Section */}
              <div className="flex items-baseline gap-1.5">
                {/* <span className="text-white font-bold text-lg">1.2k+</span> */}
                <span className="text-gray-300 text-xs">Trusted Clients</span>
              </div>
            </Link>

            {/* Scroll Indicator - Centered */}
            <div className="hidden lg:flex flex-col items-center gap-2 pb-2 opacity-50 absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8">
              <span className="text-[10px] text-white/70 tracking-widest uppercase">
                Scroll
              </span>
              <div className="w-5 h-9 border-2 border-white/40 rounded-full flex justify-center pt-2">
                <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" />
              </div>
            </div>

            <div className="hidden md:flex flex-row gap-3">
              {heroImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-32 lg:w-40 h-20 cursor-pointer lg:h-24 rounded-xl overflow-hidden group transition-all duration-500 ${index === currentImageIndex ? "shadow-lg" : "hover:scale-105"
                    }`}
                  style={{
                    border:
                      index === currentImageIndex
                        ? `2px solid ${brandBlue}`
                        : "2px solid transparent",
                    boxShadow:
                      index === currentImageIndex
                        ? `0 0 20px ${brandBlue}40`
                        : "none",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-2 flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-white text-[11px] font-bold">
                        {img.title}
                      </h3>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: brandBlue }}
                      >
                        {img.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <MapPin
                        size={8}
                        style={{ color: brandBlue }}
                        className="shrink-0"
                      />
                      <span className="truncate">{img.location}</span>
                    </div>
                  </div>
                  {index === currentImageIndex && (
                    <div
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: brandBlue }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex md:hidden flex-row gap-3 w-full">
              {heroImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className="relative flex-1 h-24 rounded-xl overflow-hidden group transition-all duration-500 hover:scale-105"
                  style={{
                    border:
                      index === currentImageIndex
                        ? `2px solid ${brandBlue}`
                        : "2px solid transparent",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-2 flex flex-col justify-end">
                    <h3 className="text-white text-[10px] font-bold">
                      {img.title}
                    </h3>
                    <span
                      className="text-[9px] font-bold"
                      style={{ color: brandBlue }}
                    >
                      {img.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}