/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/courses/NatureCarousel.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Leaf, Calendar } from "lucide-react";
import OfferTimerDisplay from "@/components/ui/OfferTimer";
import { getCoursePrice, getCourseType } from "./utils";
import type { NatureCarouselProps } from "./types";

export const NatureCarousel = ({ 
  courses, 
  pick, 
  slug, 
  lang, 
  Arrow, 
  dir, 
  isDark 
}: NatureCarouselProps) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const ArrowIcon = ArrowLeft;

  if (!courses?.length) return null;

  const total = courses.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const c = courses[index];

  const { originalPrice, discountPercent, finalPrice, hasDiscount } = getCoursePrice(c);
  const type = getCourseType(c, lang);

  const offerStartDate = c?.offer_start_date;
  const offerEndDate = c?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;

  const courseImage = c?.image?.fullUrl || c?.imageUrl || null;
  const courseTitle = pick(c?.title, c?.title_ar) || "Course";
  const courseDescription = pick(c?.description, c?.description_ar) || "";

  const handleCardClick = () => navigate(`/courses/${c?.id}`);

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Carousel */}
        <div className="relative order-2 lg:order-1">
          <div 
            className="relative rounded-[2rem] p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-[1.7rem] overflow-hidden">
              <div className="relative h-72 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-gray-700 dark:to-gray-800 grid place-items-center overflow-hidden">
                {courseImage ? (
                  <img
                    src={courseImage}
                    alt={courseTitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Leaf className="w-24 h-24 text-amber-300 dark:text-amber-600" />
                )}

                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-black shadow-lg">
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  {type}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur grid place-items-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="size-5 text-amber-600 dark:text-amber-400" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur grid place-items-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowIcon className="size-5 text-amber-600 dark:text-amber-400" />
                </button>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-extrabold text-xl text-amber-800 dark:text-amber-300">{courseTitle}</h3>
                <p className="mt-1 text-sm text-amber-600/70 dark:text-amber-400/70">{courseDescription.replace(/<[^>]*>/g, '')}</p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{finalPrice.toFixed(2)} جنيه</span>
                      <span className="text-sm text-amber-400 dark:text-amber-500 line-through font-bold">{originalPrice.toFixed(2)} جنيه</span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{originalPrice.toFixed(2)} جنيه</span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${c?.id}`); }}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    {lang === "ar" ? "اشترك الآن" : "Enroll Now"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${c?.id}`); }}
                    className="px-4 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    {lang === "ar" ? "تفاصيل الكورس" : "Details"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {hasDiscount && hasOfferDates && (
            <div className="mt-3 px-1">
              <OfferTimerDisplay
                startDate={offerStartDate}
                endDate={offerEndDate}
                lang={lang}
                isDark={isDark}
                compact={true}
                variant="gold"
                className="w-full justify-center text-[10px]"
              />
            </div>
          )}

          <div className="mt-5 flex justify-center gap-2">
            {courses.map((_: any, i: number) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`h-2 rounded-full transition-colors duration-300 ${i === index
                  ? "w-8 bg-amber-600 dark:bg-amber-500"
                  : "w-2 bg-amber-300 dark:bg-amber-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="order-1 lg:order-2 text-center">
          <h2 className="text-4xl md:text-5xl font-black leading-tight flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Leaf className="size-9 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-300">{lang === "ar" ? "الكورسات" : "Courses"}</span>
              <span className="text-amber-600 dark:text-amber-400"> {lang === "ar" ? "المُرشّحة" : "Featured"}</span>
              <Leaf className="size-9 text-amber-600 dark:text-amber-400" />
            </div>
          </h2>
          <p className="mt-4 text-lg text-amber-600/70 dark:text-amber-400/70 max-w-md mx-auto">
            {lang === "ar" ? "دول أهم الكورسات اللي جمعناهالك هنا" : "Our featured courses for you"}
          </p>
        </div>
      </div>
    </section>
  );
};