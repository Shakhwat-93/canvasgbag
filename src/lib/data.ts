import "server-only";

import { cache } from "react";
import type { Category, Product, Review } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-active",
    name: "Active & Rider Gear",
    slug: "everyday-totes",
    description: "কোমর বেল্ট ব্যাগ, ম্যাগনেটিক জিম ক্যারিয়ার এবং রাইডারদের লেগ ব্যাগ।",
    image: "/brand/gym-bag/black.webp",
    productCount: 3,
  },
  {
    id: "cat-backpacks",
    name: "Backpacks & Laptop Bags",
    slug: "crossbody-bags",
    description: "ল্যাপটপ কম্পার্টমেন্ট ও ইউএসবি চার্জিং সুবিধা যুক্ত প্রিমিয়াম বিজনেস ও ট্রাভেল ব্যাকপ্যাক।",
    image: "/brand/prod_b52_backpack.webp",
    productCount: 3,
  },
  {
    id: "cat-travel",
    name: "Travel & Storage",
    slug: "travel-canvas",
    description: "পারিবারিক ভ্রমণের ক্যানভাস ট্রাভেল ব্যাগ ও ঘর গোছানোর বহুমুখী স্টোরেজ বক্স।",
    image: "/brand/smart-travel-bag/black-color.webp",
    productCount: 2,
  },
];

export const products: Product[] = [
  {
    id: "prd-magnetic-gym-crossbody",
    name: "Magnetic Gym Crossbody Bag",
    slug: "magnetic-gym-crossbody",
    categorySlug: "everyday-totes",
    categoryName: "Active & Rider Gear",
    price: 1850,
    compareAtPrice: 2300,
    rating: 4.9,
    reviewCount: 142,
    shortDescription: "জিম, ট্রাভেল এবং প্রতিদিনের ব্যবহারের জন্য অত্যন্ত চমৎকার এবং প্রিমিয়াম ক্রস বডি ব্যাগ।",
    story:
      "জিম সেশন, বাইক রাইডিং এবং প্রতিদিনের ছোটখাটো সফরের জন্য ডিজাইন করা হয়েছে এই স্টাইলিশ ক্রস বডি ব্যাগটি। এতে রয়েছে ম্যাগনেটিক অ্যাটাচমেন্ট প্লেট যা মোটরবাইকের ট্যাঙ্কের সাথে সহজে আটকে থাকে, লক করার সুবিধাযুক্ত SBS চেইন এবং দ্রুত মোবাইল রাখার পকেট। এটি মোটরবাইক ট্যাংক ব্যাগ হিসেবেও চমৎকার কাজ করে।",
    benefits: [
      "লক করার সুবিধাযুক্ত সুরক্ষিত SBS চেইন সিস্টেম",
      "বাইকের ট্যাঙ্কের সাথে সহজে আটকে রাখার জন্য বিল্ট-ইন শক্তিশালী ম্যাগনেট প্লেট",
      "দ্রুত ফোন বের করার জন্য বিশেষ সাইড পকেট",
      "জিম এবং আউটডোর অ্যাক্টিভিটির জন্য আরামদায়ক ও ট্রেন্ডি ফিটিং"
    ],
    specs: [
      "ওয়াটার-রেজিস্ট্যান্ট অক্সফোর্ড আউটার ফেব্রিক",
      "লক করার সুবিধা সহ SBS চেইন লক সিস্টেম",
      "পানির বোতল বা ফ্ল্যাস্ক রাখার জন্য সাইড পকেট",
      "মোটরসাইকেল ট্যাঙ্কে বসার জন্য ম্যাগনেটিক বেস প্লেট",
      "সাইজ: ৩০ সেমি x ১৭ সেমি x ১০ সেমি"
    ],
    images: [
      { id: "img-gym-black", url: "/brand/gym-bag/black.webp", alt: "Magnetic Gym Crossbody Bag - Black" },
      { id: "img-gym-olive", url: "/brand/gym-bag/olive.webp", alt: "Magnetic Gym Crossbody Bag - Olive" },
      { id: "img-gym-pink", url: "/brand/gym-bag/pink.webp", alt: "Magnetic Gym Crossbody Bag - Pink" },
      { id: "img-gym-white", url: "/brand/gym-bag/white.webp", alt: "Magnetic Gym Crossbody Bag - White" }
    ],
    variants: [
      { id: "var-mag-black", name: "Charcoal Black", color: "#171717", stock: 15 },
      { id: "var-mag-olive", name: "Olive Green", color: "#5F6652", stock: 10 },
      { id: "var-mag-pink", name: "Blossom Pink", color: "#E06D9F", stock: 8 },
      { id: "var-mag-white", name: "Off White", color: "#F5F5F5", stock: 12 }
    ],
    isBestSeller: true,
    badge: "Best Seller"
  },
  {
    id: "prd-running-waist-bag",
    name: "Ultra Lightweight Running Waist Bag",
    slug: "running-waist-bag",
    categorySlug: "everyday-totes",
    categoryName: "Active & Rider Gear",
    price: 690,
    compareAtPrice: 990,
    rating: 4.8,
    reviewCount: 88,
    shortDescription: "দৌড়ানো, জিম ও ওয়ার্কআউটের সময় মোবাইল, চাবি ও কার্ড সুরক্ষিত রাখার জন্য অত্যন্ত হালকা বেল্ট ব্যাগ।",
    story:
      "হেঁটে বা দৌড়ে ওয়ার্কআউট করার সময় মোবাইল বা চাবি নিয়ে চিন্তার দিন শেষ। এই আল্ট্রা-লাইটওয়েট ওয়েস্ট ব্যাগটি কোমর বা বুকে ঝুলিয়ে ব্যবহার করা যায়, যা মোটেও ভারী লাগে না এবং দৌড়ানোর সময় নড়াচড়া করে না। ছেলে ও মেয়ে উভয়ের ব্যবহারের উপযোগী অত্যন্ত আরামদায়ক ফিটিং।",
    benefits: [
      "অত্যಂತ হালকা এবং কোমরে সহজে মানিয়ে যায়",
      "দৌড়ানোর সময় নড়াচড়া বা ঝাঁকুনি মুক্ত ফিটিং",
      "ঘাম বা হালকা বৃষ্টি থেকে মোবাইল সুরক্ষিত রাখার জন্য ওয়াটার-প্রুফ লেয়ার",
      "রাতের বেলায় নিরাপত্তার জন্য রিফ্লেক্টিভ সেফটি স্ট্রিপ"
    ],
    specs: [
      "ইলাস্টিক নাইলন লাইক্রা ব্রিদাবেল ম্যাটেরিয়াল",
      "নাইট রিফ্লেক্টিভ স্ট্রিপ সেফটি লাইন",
      "হেডফোন ক্যাবল বের করার জন্য বিশেষ পোর্ট",
      "কোমর অনুযায়ী অ্যাডজাস্টেবল বাকল ও স্ট্র্যাপ"
    ],
    images: [
      { id: "img-cross-1", url: "/brand/cross-bag/cross_1.webp", alt: "Ultra Lightweight Running Waist Bag - Black" },
      { id: "img-cross-2", url: "/brand/cross-bag/cross_2.webp", alt: "Ultra Lightweight Running Waist Bag - Grey" },
      { id: "img-cross-3", url: "/brand/cross-bag/cross_3.webp", alt: "Ultra Lightweight Running Waist Bag - Green" },
      { id: "img-cross-4", url: "/brand/cross-bag/cross_4.webp", alt: "Ultra Lightweight Running Waist Bag - Blue" },
      { id: "img-cross-5", url: "/brand/cross-bag/cross_5.webp", alt: "Ultra Lightweight Running Waist Bag - Orange" }
    ],
    variants: [
      { id: "var-run-black", name: "Charcoal Black", color: "#1C1C1E", stock: 25 },
      { id: "var-run-grey", name: "Steel Grey", color: "#6F7378", stock: 14 },
      { id: "var-run-green", name: "Khaki Green", color: "#4E5345", stock: 10 },
      { id: "var-run-blue", name: "Navy Blue", color: "#2E3D52", stock: 12 },
      { id: "var-run-orange", name: "Coral Orange", color: "#E65A4C", stock: 8 }
    ],
    isBestSeller: true,
    badge: "Hot Deal"
  },
  {
    id: "prd-waist-rider-leg-bag",
    name: "Waterproof Waist Premium Leg Bag",
    slug: "waist-rider-leg-bag",
    categorySlug: "everyday-totes",
    categoryName: "Active & Rider Gear",
    price: 750,
    compareAtPrice: 1150,
    rating: 4.9,
    reviewCount: 76,
    shortDescription: "বাইকার এবং সাইক্লিস্টদের জন্য ওয়াটারপ্রুফ এবং প্রিমিয়াম কোয়ালিটির লেগ ব্যাগ।",
    story:
      "বাইক বা সাইকেল রাইডিংয়ের সময় মোবাইল, ওয়ালেট, টুলস বা প্রয়োজনীয় জিনিসপত্র হাতের কাছে রাখার সবচেয়ে স্মার্ট উপায়। কোমর ও থাইয়ের সাথে বেল্ট দিয়ে সুন্দরভাবে আটকে থাকে, ফলে রাইডিংয়ের সময় পড়ে যাওয়ার বা নড়ে যাওয়ার কোনো ভয় নেই। বৃষ্টিতেও এর ভেতরের জিনিস থাকবে সম্পূর্ণ শুকনো।",
    benefits: [
      "কোমর ও পায়ের সাথে শক্তভাবে আটকে থাকার জন্য ডাবল লক সিস্টেম",
      "১০০% ওয়াটারপ্রুফ ফেব্রিক যা বৃষ্টিতে কাপড় ভিজবে না",
      "টুলস এবং ছোট রাইডিং গিয়ার সাজিয়ে রাখার জন্য মাল্টি-চেম্বার",
      "অ্যারোডাইনামিক ডিজাইন যা রাইডিংয়ে কোনোরকম বাধা সৃষ্টি করে না"
    ],
    specs: [
      "প্রিমিয়াম ওয়াটারপ্রুফ অক্সফোর্ড ও নাইলন ম্যাটেরিয়াল",
      "কোমর এবং থাইয়ের জন্য আলাদা অ্যাডজাস্টেবল বেল্ট",
      "হেভি-ডিউটি কুইক রিলিজ বাকল ও মেটাল জিপার",
      "রিফ্লেক্টিভ ডিজাইন সেফটি লাইন"
    ],
    images: [
      { id: "img-rider-1", url: "/brand/leg-bag/leg_1.webp", alt: "Waterproof Rider Leg Bag - Matte Black" }
    ],
    variants: [
      { id: "var-rider-black", name: "Matte Black", color: "#1C1C1C", stock: 18 }
    ],
    isBestSeller: false,
    badge: "Biker Special"
  },
  {
    id: "prd-b52-business-backpack",
    name: "New Business Backpack - B52",
    slug: "b52-business-backpack",
    categorySlug: "crossbody-bags",
    categoryName: "Backpacks & Laptop Bags",
    price: 1650,
    compareAtPrice: 2500,
    rating: 4.8,
    reviewCount: 112,
    shortDescription: "ল্যাপটপ চেম্বার এবং আরামদায়ক ব্যাক প্যাডিং সহ প্রিমিয়াম অক্সফোর্ড বিজনেস ট্রাভেল ব্যাকপ্যাক।",
    story:
      "অফিস কমিউট, বিজনেস ট্রাভেল বা ভার্সিটির জন্য নিখুঁত ব্যাকপ্যাক। ল্যাপটপের জন্য আলাদা প্রটেক্টিভ স্পেস এবং পিঠের ঘাম কমানোর জন্য রেসিন মেশ ব্রিদাবেল প্যাডিং সহ এটি খুবই আরামদায়ক। এর মাল্টি-পকেট সিস্টেম আপনার কাজের প্রতিটি ফাইল ও গ্যাজেটকে সুরক্ষিত ও গোছানো রাখবে।",
    benefits: [
      "১৫.৬ ইঞ্চি ল্যাপটপ এবং ট্যাব রাখার জন্য সুরক্ষিত আলাদা কম্পিউটার ইন্টারলেয়ার পকেট",
      "পিঠের বাতাস চলাচল স্বাভাবিক রাখার জন্য বিশেষ রেসিন মেশ ব্যাক প্যানেল",
      "হালকা বৃষ্টি ও পানির হাত থেকে বাঁচাতে ওয়াটার-রেজিস্ট্যান্ট অক্সফোর্ড ফেব্রিক",
      "অফিস ও ভ্রমণের প্রয়োজনীয় জিনিস গুছিয়ে রাখার চমৎকার চেম্বার"
    ],
    specs: [
      "উচ্চমানের অক্সফোর্ড আউটার ম্যাটেরিয়াল",
      "ভেতরে প্রিমিয়াম নরম পলিয়েস্টার লাইনিং",
      "সাইজ: ৪৪.৫ সেমি x ৩০ সেমি x ১৮ সেমি",
      "রেসিন মেশ ক্যারিং অ্যান্ড কুলিং সিস্টেম"
    ],
    images: [
      { id: "img-b52-1", url: "/brand/prod_b52_backpack.webp", alt: "New Business Backpack B52" }
    ],
    variants: [
      { id: "var-b52-black", name: "Premium Black", color: "#1F1F21", stock: 22 },
      { id: "var-b52-blue", name: "Deep Navy Blue", color: "#1F2D3D", stock: 14 }
    ],
    isBestSeller: true,
    badge: "Best Seller"
  },
  {
    id: "prd-heroic-knight-backpack",
    name: "Heroic Knight Premium Backpack",
    slug: "heroic-knight-backpack",
    categorySlug: "crossbody-bags",
    categoryName: "Backpacks & Laptop Bags",
    price: 1450,
    compareAtPrice: 1800,
    rating: 4.9,
    reviewCount: 94,
    shortDescription: "কোরিয়ান সার্টিন ফ্যাব্রিকের তৈরি ওয়াটারপ্রুফ প্রিমিয়াম ব্যাকপ্যাক (ইউএসবি চার্জিং পোর্ট সহ)।",
    story:
      "মডার্ন ডিজাইন এবং প্রিমিয়াম ম্যাটেরিয়ালের তৈরি এই ব্যাকপ্যাকটি টেকপ্রেমী ট্রাভেলারদের জন্য সেরা। কোরিয়ান সার্টিন ও ৫০০ডি ডবি ফেব্রিকের ওয়াটারপ্রুফ ফিনিশ এবং বিল্ট-ইন ইউএসবি পোর্ট আপনার দৈনন্দিন লাইফকে করবে আরও সহজ ও স্মার্ট। ল্যাপটপ ও গ্যাজেটের জন্য রয়েছে ডাবল প্রোটেকশন চেম্বার।",
    benefits: [
      "চলতি পথে ফোন চার্জ দেওয়ার জন্য বিল্ট-ইন ইউএসবি চার্জিং পোর্ট",
      "জিনিসপত্র আলাদাভাবে গুছিয়ে রাখার জন্য ৪টি বড় চেম্বার",
      "ল্যাপটপের স্ক্র্যাচ এবং আঘাত থেকে বাঁচাতে বিশেষ ফোম প্যাডেড ল্যাপটপ চেম্বার",
      "অত্যಂತ স্টাইলিশ এবং প্রিমিয়াম কোরিয়ান সার্টিন ফিনিশ"
    ],
    specs: [
      "কোরিয়ান প্রিমিয়াম সার্টিন আউটার ফেব্রিক",
      "৫০০ডি ডবি ওয়াটার রেজিস্ট্যান্স অ্যান্ড কোটিং",
      "বিল্ট-ইন ইউএসবি এক্সটার্নাল ক্যাবল পোর্ট",
      "৪টি প্রধান সিকিউরড চেম্বার"
    ],
    images: [
      { id: "img-hk-1", url: "/brand/prod_heroic_knight.webp", alt: "Heroic Knight Premium Backpack" }
    ],
    variants: [
      { id: "var-hk-black", name: "Coal Black", color: "#18181A", stock: 19 }
    ],
    isBestSeller: true,
    badge: "Highly Popular"
  },
  {
    id: "prd-f35-backpack",
    name: "Durable Backpack - F35",
    slug: "f35-backpack",
    categorySlug: "crossbody-bags",
    categoryName: "Backpacks & Laptop Bags",
    price: 1550,
    compareAtPrice: 2500,
    rating: 4.7,
    reviewCount: 65,
    shortDescription: "প্রতিদিনের ব্যবহার ও ভারি জিনিসপত্র বহনের জন্য রেইনফোর্সড স্টিচিং যুক্ত টেকসই ব্যাকপ্যাক।",
    story:
      "ভারী বইপত্র, ল্যাপটপ বা ট্রাভেলের পোশাক বহনের জন্য সবচেয়ে নির্ভরযোগ্য ও টেকসই ব্যাগ। এর মজবুত সেলাই এবং মজবুত হ্যান্ডেল দীর্ঘস্থায়ী ব্যবহারের নিশ্চয়তা দেয়। স্কুল, college, জিম ও কমিউটের জন্য সেরা বাজেটে শক্তিশালী ব্যাগ।",
    benefits: [
      "ভারী ওজনের জিনিস বহনের জন্য ডাবল স্টিচিং হ্যান্ডেল ও স্ট্র্যাপ",
      "হালকা বৃষ্টি ও ধুলাবালি থেকে বাঁচাতে ওয়াটার-রেজিস্ট্যান্ট বেস",
      "বোতল বা ছাতা রাখার জন্য দুই পাশে চওড়া পকেট",
      "ভারী ওজনেও কাঁধের আরামের জন্য প্যাডেড শোল্ডার স্ট্র্যাপ"
    ],
    specs: [
      "রিনিফোর্সড নাইলন ও ক্যানভাস মিক্সড ফেব্রিক",
      "মজবুত হ্যান্ডেল ও মেটাল রানিং জিপার",
      "ওয়াটার-রেজিস্ট্যান্ট নিচের প্রটেক্টিভ অংশ",
      "সর্বোচ্চ ধারণ ক্ষমতা: প্রায় ১৫ কেজি ওজন"
    ],
    images: [
      { id: "img-f35-1", url: "/brand/prod_f35_backpack.webp", alt: "Durable Backpack F35" }
    ],
    variants: [
      { id: "var-f35-navy", name: "Active Navy", color: "#1C2D42", stock: 10 }
    ],
    isBestSeller: false,
    badge: "Durable Carry"
  },
  {
    id: "prd-family-travel-bag",
    name: "Canvas Family Travel Bag",
    slug: "family-travel-bag",
    categorySlug: "travel-canvas",
    categoryName: "Travel & Storage",
    price: 1280,
    compareAtPrice: 1700,
    rating: 4.8,
    reviewCount: 156,
    shortDescription: "পরিবারের সাথে ২-৩ দিনের ট্যুরের জন্য বড় এবং অত্যন্ত মজবুত ক্যানভাস ট্রাভেল ডাফেল ব্যাগ।",
    story:
      "সপরিবারে ছোট ভ্রমণের জন্য পুরো পরিবারের কাপড় বা প্রয়োজনীয় জিনিসপত্র একটি ব্যাগে সুন্দরভাবে গুছিয়ে নিন। ১৬ আউন্সের ভারী ক্যানভাস ম্যাটেরিয়াল এবং প্রিমিয়াম জিপার ব্যাগটিকে করে তুলেছে অত্যন্ত প্রিমিয়াম ও আকর্ষণীয়। এতে ভ্রমণের সমস্ত কাপড় অনায়াসে জায়গা পেয়ে যাবে।",
    benefits: [
      "২ থেকে ৩ জনের কয়েকদিনের কাপড় অনায়াসে রাখার বিশাল জায়গা",
      "১৬ আউন্স ওজনের অত্যন্ত শক্তিশালী ও প্রিমিয়াম টেক্সচার্ড ক্যানভাস ম্যাটেরিয়াল",
      "ভেতরের কাপড় সুরক্ষিত রাখার জন্য সহজে পরিষ্কারযোগ্য বিশেষ লাইনিং",
      "সহজে বহনের জন্য চামড়ার ট্রিম যুক্ত মজবুত ডাবল হ্যান্ডেল ও স্ট্র্যাপ"
    ],
    specs: [
      "১৬ আউন্স পিওর কটন ক্যানভাস ফেব্রিক",
      "মজবুত মেটাল চেইন ও প্রিমিয়াম রানিং জিপার",
      "সাইজ: ৫২ সেমি x ৩০ সেমি x ২৬ সেমি",
      "ভেতরের ধারণক্ষমতা: প্রায় ৪০ লিটার"
    ],
    images: [
      { id: "img-travel-black", url: "/brand/smart-travel-bag/black-color.webp", alt: "Canvas Family Travel Bag - Black" },
      { id: "img-travel-beige", url: "/brand/smart-travel-bag/beige-color.webp", alt: "Canvas Family Travel Bag - Beige" },
      { id: "img-travel-blue", url: "/brand/smart-travel-bag/blue-color.webp", alt: "Canvas Family Travel Bag - Blue" }
    ],
    variants: [
      { id: "var-fam-black", name: "Classic Black", color: "#1F1F1F", stock: 8 },
      { id: "var-fam-beige", name: "Warm Beige", color: "#E3DAC9", stock: 14 },
      { id: "var-fam-blue", name: "Royal Blue", color: "#1D314A", stock: 11 }
    ],
    isBestSeller: true,
    badge: "Best Seller"
  },
  {
    id: "prd-multipurpose-storage-box",
    name: "Multipurpose Storage Box",
    slug: "multipurpose-storage-box",
    categorySlug: "travel-canvas",
    categoryName: "Travel & Storage",
    price: 1050,
    compareAtPrice: 1400,
    rating: 4.7,
    reviewCount: 52,
    shortDescription: "ওয়ারড্রোব এবং কাপড় গোছানোর জন্য ক্যানভাস ম্যাটেরিয়ালের কোলাপসিবল স্টোরেজ বক্স।",
    story:
      "আপনার আলমারি বা ঘরকে রাখুন একদম পরিপাটি ও সুন্দর। এই ক্যানভাস স্টোরেজ বক্সটি ব্যবহার না করলে ভাজ করে রাখা যায়, আর ব্যবহার করার সময় মেটাল ফ্রেমের সাহায্যে বক্সের শেপ সোজা ও সুন্দর থাকে। ঘরের সৌন্দর্য বাড়াতে এর ডিজাইন অতুলনীয়।",
    benefits: [
      "ভেতরে স্টেইনলেস মেটাল ফ্রেম থাকায় কাপড় ছাড়াই বক্স সুন্দর আকৃতিতে দাঁড়িয়ে থাকে",
      "সহজে টেনে বের করার জন্য দুই পাশে প্রিমিয়াম লেদার টেক্সচার্ড হ্যান্ডেল",
      "ব্যবহার না করার সময় একদম ফ্ল্যাট করে ভাজ করে ড্রয়ারে রাখা যায়",
      "ঘরের আধুনিক ইন্টেরিয়রের সাথে ম্যাচিং আকর্ষণীয় নিউট্রাল কালার ডিজাইন"
    ],
    specs: [
      "মোটা প্রিমিয়াম ক্যানভাস আউটার ফেব্রিক",
      "ভেতরে শক্তিশালী মেটাল সাপোর্ট ফ্রেম",
      "সাইজ: ৪০ সেমি x ৩০ সেমি x ২৫ সেমি",
      "নিচে সাপোর্ট দেওয়ার জন্য মজবুত বেস বোর্ড"
    ],
    images: [
      { id: "img-storage-1", url: "/brand/prod_storage_box.webp", alt: "Multipurpose Storage Box" }
    ],
    variants: [
      { id: "var-store-beige", name: "Warm Beige", color: "#E8DCC4", stock: 14 }
    ],
    isBestSeller: false,
    badge: "Home Essential"
  }
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Zakir H.",
    rating: 5,
    quote: "B52 ব্যাকপ্যাকটি অসাধারণ! আমার ১৫.৬ ইঞ্চি ল্যাপটপ অনায়াসে এঁটে যায়। এয়ার মেশ প্যাডিং থাকায় পিঠে কোনো ঘাম জমে না।",
    location: "Dhaka",
  },
  {
    id: "rev-2",
    author: "Mahbubur R.",
    rating: 5,
    quote: "ক্যানভাস ফ্যামিলি ট্রাভেল ব্যাগটি নিয়ে আমরা খুব খুশি। আমাদের সিলেটের ট্যুরে তিনটি ছোট ব্যাগের কাজ এটি একাই সম্পন্ন করেছে।",
    location: "Sylhet",
  },
  {
    id: "rev-3",
    author: "Liza A.",
    rating: 5,
    quote: "আমি সকালের হাঁটার সময় রানিং ওয়েস্ট ব্যাগটি কোমরে ব্যবহার করি। এটি একদম নড়াচড়া করে না এবং মোবাইল ও চাবি সুরক্ষিত থাকে।",
    location: "Chattogram",
  },
];

export const getProducts = cache(async () => products);

export const getBestSellers = cache(async () => products.filter((product) => product.isBestSeller));

export const getProductBySlug = cache(async (slug: string) =>
  products.find((product) => product.slug === slug) ?? null
);

export const getCategoryBySlug = cache(async (slug: string) =>
  categories.find((category) => category.slug === slug) ?? null
);

export const getProductsByCategory = cache(async (slug: string) =>
  products.filter((product) => product.categorySlug === slug)
);
