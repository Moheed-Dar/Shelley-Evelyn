"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Quote, Star, MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Erin",
    text: "Being a military spouse, I have 4 moves under my belt. But when it came time to help my mother sell her house, I wasn't as certain. Shelley was wonderful, and definitely went above and beyond for us. Compared to the previous realtors we had worked with, Shelley definetly stands out, and I will recommend her every time someone is looking for a realtor.",
  },
  {
    id: 2,
    name: "Glenn",
    text: "Shelley was friendly and helpful, and made the home buying process a charm!",
  },
  {
    id: 3,
    name: "Laurie",
    text: "Shelley worked patiently with us as we searched for, and found , a great home in neighborhoods with very few listings, and at a good price as well. Then she turned around and sold our existing home in a couple of days. Great knowledge of all things real estate.",
  },
  {
    id: 4,
    name: "Josh & Meghan",
    text: "When buying your first home Shelley is the realtor best suited for the job. Shelley gets to know her clients and is able to pick out homes that will suit you best. She really knows the areas of Ottawa well and is flexible with her time in order to book viewings when it suits you best. She is knowledgeable and we were able to understand the process of buying a home with her expertise. You’d be mistaken to not use Shelley for your future home buying needs!",
  },
  {
    id: 5,
    name: "Nicole Schenk",
    text: "I've had the pleasure of working with Shelley Evelyn for a few years, and I am consistently impressed by her dedication to her clients. Shelley excels in providing a seamless experience for both sellers and buyers, ensuring that every transaction is smooth and stress-free. She takes the time to listen to her clients' needs and preferences, offering personalized and reliable service that is second to none. Her extensive knowledge of the Ottawa real estate market is truly impressive, and it is clear that she is passionate about helping her clients achieve their goals. Shelley is a true professional, and I highly recommend her to anyone looking to buy or sell property in the Ottawa area.",
  },
  {
    id: 6,
    name: "Noah",
    text: "Shelley helped me buy my first home and I'm so very happy with everything she did for me! She was very helpful and patient despite me being picky and not having clear requirements and set search parameters. She made the whole looking and buying process painless and as comfortable and understandable as possible. Shelley is such a friendly and informative resource that I would recommend to anyone wanting to navigate the real estate market. I always looked forward to any house visits that Shelley seamlessly set up for me some on same day short notice!",
  },
  {
    id: 7,
    name: "Dave Graham",
    text: "Simply put Shelley is the best. Super patient, knowledgeable and proactive and always reachable for questions, showings, offers etc etc. We are very picky and didn't know if we would find the right place but Shelley hung in there for the journey with us! Thanks again Shelley for everything you've done.",
  },
  {
    id: 8,
    name: "Cathy",
    text: "Shelley went above and beyond in her work with me. I was selling a property located five hours from my current location, which had its challenges. Shelley helped me to manage the logistics of selling a property remotely. She was, at all times, friendly, informative and, above all, knowledgeable and compassionate. I highly recommend her services!",
  },
  {
    id: 9,
    name: "Kathryn Graham",
    text: "Shelley was wonderful. She kept me well informed as to what was happening in the real estate market and then found me the place I wanted to be. I'll never move again! Shelley was friendly and patient and helped me decide what I wanted in my new home Kudos Shelley!",
  },
  {
    id: 10,
    name: "Daniel P",
    text: "Shelley was amazing since the day I landed in Canada. She treated me like I was her best client since the beginning. Her good humor and patience make the process of finding a home much more enjoyable. I highly recommended her!",
  },
  {
    id: 11,
    name: "Kirby Chan",
    text: "Shelley Evelyn is an amazing Realtor. She's a senior graduate of our social media program. She has all the social media tools to support buyers in finding off market homes and support sellers in promoting their homes to a wide audience!!!",
  },
  {
    id: 12,
    name: "Sandip",
    text: "This real estate agent will be there for you when you need guidance and support. She is very prompt and responsive on email and text and will call or meet you in person if that’s needed. She is a very good listener and has empathy. She has lots of connections in the trades and financial industry. She really goes the extra mile and has passion for what she does. And we sold my house in a spring 2023 market for well above asking. We had a bidding war and a back up offer all which were managed with the above mentioned qualities. She cares and it shows. You need to connect with her if you are in the market.",
  },
  {
    id: 13,
    name: "Mark",
    text: "Shelley is awesome! Her help was instrumental in me being able to find the right house. Very friendly, knowledgeable and responsive!",
  },
  {
    id: 14,
    name: "Shane",
    text: "Shelley is an incredible realtor! This is the second time she's helped us with a house and I'm sure it won't be the last. She got us a good price at an uncertain time. Can't say enough good things about her!",
  },
  {
    id: 15,
    name: "Sandip",
    text: "Amazing experience! She was easily able to understand my needs. She is one of the most reliable people I have met! She was my rock during my perfect home search. Also, very knowledgeable for a home in the country. Very accommodating! I always look for an agent that is on the ball so I can get the best deal and Shelley definitely exceeded my expectations. Highly, highly recommend!",
  },
  {
    id: 16,
    name: "Karen",
    text: "Shelley was recommended to me by a friend two years ago when I arrived in Ottawa from the Niagara region. Shelley spent a lot of time with me helping me find a wonderful house to call home. Two years later and a relocation back to Niagara, Shelley was there every step of the way assisting me in providing suggestions that would allow me to sell my home quickly and for a favourable price. Shelley went over and above her responsibility as a realtor and provided tremendous support during a time that can be very stressful. I feel very lucky to have met her and would highly recommend her services",
  },
  {
    id: 17,
    name: "Soormee Robin",
    text: "I stumbled across Shelley, at the beginning of my house-search, and I now considerate it to be a divine accident. I reached out to ask a question, to which she responded effortlessly, with the ease and lightness which is customary of her style. During our time together, I came to realize that she is a person of high integrity, always taking the extra time to address things things properly and thoroughly. She always made sure that she had done everything possible to accommodate my needs throughout all the various scenarios that we went through together, and she always seemed to have something in her (very ethical) \"bag of tricks\" to make things work. I can't recommend her service highly enough, she gave me 5-star service all the way! I'm very grateful!!",
  },
  {
    id: 18,
    name: "Ann",
    text: "Hi, just a note to say thanks for all you have done for us throughout this process. As first time buyers, we had a lot of unanswered questions regarding the purchase of our home. Thank you for providing the answers to many of these and giving us informed advice on the homes that we visited!",
  },
  {
    id: 19,
    name: "Cheyenne",
    text: "Shelley was a pleasure to work with! As first time Canadian homebuyers, she made the process simple and easy. She provided great resources to help us find our ideal home. We look forward to working with her again in the future!",
  },
  {
    id: 20,
    name: "Sandy",
    text: "Shelley helped us to find our perfect home in Carleton Place, in March 2021! She was always so organized for our house tours, with: clipboards, spec sheets, and hand sanitizer! Shelley always listened to our feedback, and would use our info to update the listings she would send us! We loved working with Shelley, as I'm sure you will!",
  },
  {
    id: 21,
    name: "Spencer",
    text: "Shelley is one of the hardest working and dedicated agents I have dealt with after buying ten houses. Shelley guided us through one of the toughest transactions I have done. The result is we live in our dream forever home.",
  },
  {
    id: 22,
    name: "Ken",
    text: "Shelley goes above and beyond in everything about selling homes!",
  },
  {
    id: 23,
    name: "Suzanne",
    text: "Shelley Evelyn helped me buy a home in Ottawa's Copeland Park neighbourhood in January 2021. There are very few properties on the Ottawa market and you have to move fast. Shelley gave me all the information I needed in a very short period of time and explained clearly how to proceed to make an offer. I could count on her at every step, before and after my offer was accepted. She always answered quickly all my questions. She is supportive, knowledgeable and professional. But there is more: she is also a great person. I highly recommend her services to friends and family.",
  },
  {
    id: 24,
    name: "Virginia",
    text: "What really sets Shelley apart is her heart. When our first offer didn't get accepted she followed up with us the next day with words of encouragement, and that really made us feel comforted. It's personal touches like this that really made the experience with her so great. For first time buyers the process can be really overwhelming and Shelley took the time to patiently walk us through each step, always willing to dig up the information we were looking for and making sure we were comfortable and informed every step of the way. We cannot thank her enough for her help with our new home!",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimationControls();

  const brandPurple = "#301143";

  const startAnimation = () => {
    controls.start({
      x: "-50%",
      transition: {
        x: {
          duration: 140,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    });
  };

  const stopAnimation = () => {
    controls.stop();
  };

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const timer = setTimeout(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setIsVisible(true);
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const renderCard = (t, index) => (
    <div
      key={`${t.id}-dup-${index}`}
      className="shrink-0 w-[320px] sm:w-92.5 lg:w-105 group relative rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 will-change-transform"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      <div className="relative p-6 sm:p-7 backdrop-blur-md h-full flex flex-col">
        {/* Quote icon */}
        <div className="mb-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <Quote size={16} className="text-purple-200/30" />
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} className="fill-yellow-400/90 text-yellow-400/90" />
          ))}
        </div>

        {/* Text */}flex-grow
        <p
          className="text-white/70 text-sm sm:text-[15px] leading-relaxed mb-6 "
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 6,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          &ldquo;{t.text}&rdquo;
        </p>

        {/* Divider */}
        <div className="w-full h-px mb-5" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${brandPurple}, #5e1a85)`,
            }}
          >
            {t.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">{t.name}</h4>
            <p className="text-xs text-white/35 truncate">Verified Client</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #1a0b24 0%, ${brandPurple} 50%, #1a0b24 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 mb-12 sm:mb-16">
        {/* Heading */}
        <div
          className={`text-center px-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle size={16} className="text-purple-200/70" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium text-purple-200/60">
              Client Stories
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-3">
            Real Experiences,
            <br />
            <span className="text-purple-200">Trusted by Clients</span>
          </h2>

          <p
            className={`text-white/50 text-sm sm:text-base md:text-lg max-w-lg mx-auto transition-all duration-700 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Hear how Shelley has helped families find homes that truly match their lifestyle and expectations.
          </p>
        </div>
      </div>

      {/* Single Row Infinite Carousel Container */}
      <div className="relative z-10">
        {/* Left Edge Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1a0b24, transparent)" }} />
        {/* Right Edge Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1a0b24, transparent)" }} />

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6 sm:gap-8 w-max py-2"
            animate={controls}
            onMouseEnter={stopAnimation}
            onMouseLeave={startAnimation}
          >
            {/* Rendering 2 identical sets creates a seamless infinite loop when translating X by -50% */}
            {testimonials.map((t, i) => renderCard(t, `set1-${i}`))}
            {testimonials.map((t, i) => renderCard(t, `set2-${i}`))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}