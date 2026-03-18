import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import SectionHeader from "@/components/SectionHeader";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  categories: string[];
  activeCategory: string;
  activeSearch: string;
  whatsappNumber: string;
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  Panjabi: "👘",
  "Kabli Set": "🧥",
  Pajama: "👖",
  "Casual Shirt": "👕",
  "Formal Shirt": "👔",
  "T-Shirt": "👕",
  "Polo Shirt": "🏌️",
  Jeans: "👖",
  Chinos: "👖",
  "Formal Trousers": "👔",
  Belt: "🪢",
  Wallet: "👛",
};

function pickIcon(category: string) {
  return CATEGORY_ICON_MAP[category] || "🛍️";
}

function slugify(value: string) {
  return encodeURIComponent(value.trim());
}

export default function UpazilaHomepageV2({
  products,
  categories,
  activeCategory,
  activeSearch,
  whatsappNumber,
}: Props) {
  const safeWhatsApp = whatsappNumber || "8801811314262";
  const heroFocusKeywords = /panjabi|kabli|shirt|t-shirt|polo|pant|trouser|jeans/i;
  const heroLooks = products
    .filter((p) => heroFocusKeywords.test(`${p.name} ${p.category}`))
    .slice(0, 8);
  const heroCarouselProducts = (heroLooks.length > 0 ? heroLooks : products.slice(0, 8)).filter(
    (product, index, list) => list.findIndex((candidate) => candidate.id === product.id) === index
  );
  const heroMarqueeItems =
    heroCarouselProducts.length > 0 ? [...heroCarouselProducts, ...heroCarouselProducts] : [];

  const featured = products.filter((p) => p.is_featured).slice(0, 6);
  const newArrival = products.slice(0, 6);
  const bestSelling = (featured.length > 0 ? featured : products).slice(0, 6);
  const panjabiCollection = products
    .filter((p) => /panjabi|kabli|ethnic/i.test(p.category || ""))
    .slice(0, 6);
  const casualShirtCollection = products
    .filter((p) => /casual shirt|shirt|polo|t-shirt/i.test(p.category || ""))
    .slice(0, 6);
  const trending = products
    .filter((p) => p.campaign_badge || p.has_video)
    .slice(0, 6);

  const topCategories = categories.slice(0, 8);

  const trustItems = [
    "✅ COD Available",
    "💳 bKash / Nagad Secure",
    "🔁 7 দিন Exchange",
    "🚚 Upazila Fast Delivery",
  ];

  const reviewSamples = [
    {
      name: "Sabbir, Lakshmipur",
      text: "Product quality onek bhalo. Picture er sathe মিল আছে। আবার order করবো।",
      rating: "⭐ 4.8",
    },
    {
      name: "Rahat, Bhola",
      text: "COD + exchange policy clear chilo, tai trust kore কিনেছি। Fit perfect.",
      rating: "⭐ 4.9",
    },
    {
      name: "Imran, Mymensingh",
      text: "WhatsApp e size help পেয়ে order দিছি। Delivery fast chilo.",
      rating: "⭐ 5.0",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-[#000080] via-[#0a3b7a] to-[#008080] p-5 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#CC5500]/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#8A9A5B]/30 blur-2xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide">
              Upazila Style Drop • Smart Budget Premium
            </p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
              ভাই, আপনার Fit Ready! 2026 Men&apos;s Collection
            </h2>
            <p className="mt-3 text-sm text-slate-100 sm:text-base">
              Panjabi, Polo, Shirt, Jeans – trendy look, budget-friendly price, trusted checkout.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="#new-arrival"
                className="rounded-full bg-[#CC5500] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#b84c00]"
              >
                🛍️ Shop Now
              </Link>
              <a
                href={`https://wa.me/${safeWhatsApp}?text=${encodeURIComponent("ভাই, একটা product নিয়ে help লাগবে")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/50 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                💬 WhatsApp Help
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] sm:flex sm:flex-wrap">
              {trustItems.map((item) => (
                <span key={item} className="rounded-full bg-white/15 px-3 py-1.5 font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">
              Eid Real Looks Preview
            </p>

            {heroMarqueeItems.length > 0 ? (
              <div className="hero-marquee-mask mt-3 rounded-2xl">
                <div className="hero-marquee-track">
                  {heroMarqueeItems.map((product, index) => (
                    <Link key={`${product.id}-${index}`} href={`/product/${product.id}`} className="hero-look-card group">
                      <div className="relative h-36 overflow-hidden rounded-2xl sm:h-44">
                        <Image
                          src={product.image_url || "/hero-modern-fashion.svg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 60vw, 220px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-1 pb-1 pt-2">
                        <p className="line-clamp-1 text-xs font-semibold text-white/95">{product.name}</p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-amber-200">{product.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-5 text-sm font-semibold text-white/90">
                Premium Panjabi, Shirt, Pant & T-Shirt images will appear automatically after product upload.
              </div>
            )}

            <p className="mt-3 text-[11px] font-medium text-white/75">
              Auto flow চলবে ডান দিক থেকে বাম দিকে। পছন্দের item-এ click করলে সরাসরি product page খুলবে।
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card p-4 sm:p-5">
        <SearchAndFilter categories={categories} />

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {topCategories.map((category) => (
            <Link
              key={category}
              href={`/?category=${slugify(category)}${activeSearch ? `&search=${slugify(activeSearch)}` : ""}`}
              className={`flex flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition ${
                activeCategory === category
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg leading-none">{pickIcon(category)}</span>
              <span className="mt-1 line-clamp-1 text-[10px] font-semibold sm:text-xs">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Hot Offer</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">Buy 2 Shirts, Save ৳300</h3>
          <p className="mt-1 text-sm text-slate-600">Limited stock. Student-friendly combo deal.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Festival Deal</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">Panjabi + Pajama Bundle</h3>
          <p className="mt-1 text-sm text-slate-600">Eid-ready look with special exchange support.</p>
        </div>
      </div>

      <div id="new-arrival">
        <SectionHeader
          icon="🆕"
          title="New Arrival"
          subtitle="নতুন কালেকশন — fresh drop for campus + outing"
          rightText={`${newArrival.length} item`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newArrival.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="🔥"
          title="Best Selling"
          subtitle="জনপ্রিয় পণ্য — local boys&apos; top picks"
          rightText={`${bestSelling.length} item`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestSelling.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="👘"
          title="Panjabi Collection"
          subtitle="Ethnic wear for Jumu&apos;ah, Eid, wedding and events"
          rightText={`${panjabiCollection.length} item`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panjabiCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="👔"
          title="Casual Shirt Collection"
          subtitle="Daily campus-ready smart casual look"
          rightText={`${casualShirtCollection.length} item`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {casualShirtCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      {trending.length > 0 && (
        <div>
          <SectionHeader
            icon="📈"
            title="Trending Now"
            subtitle="Facebook/TikTok-inspired current trend picks"
            rightText={`${trending.length} item`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
        <SectionHeader
          icon="🛡️"
          title="Why Trust Clothify"
          subtitle="Clear policy + human support + real reviews"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "✅ COD all over Bangladesh",
            "🔁 7 দিন easy exchange",
            "📍 Upazila-friendly delivery",
            "🔐 Verified bKash/Nagad payment",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
        <SectionHeader
          icon="📸"
          title="Customer Reviews"
          subtitle="What real customers say"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reviewSamples.map((review) => (
            <div key={review.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">“{review.text}”</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{review.name}</span>
                <span className="text-xs font-bold text-amber-600">{review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[#A38A75]/30 bg-[#f7f4f1] p-4 sm:p-6">
        <h3 className="text-xl font-extrabold text-[#3a2f27]">Need size or fabric help?</h3>
        <p className="mt-2 text-sm text-[#5e4c3f]">
          এক click-এ WhatsApp এ message করুন — আমাদের টিম instantly guide করবে।
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${safeWhatsApp}?text=${encodeURIComponent("ভাই, size guide help লাগবে")}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#008080] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#006d6d]"
          >
            💬 Ask on WhatsApp
          </a>
          <Link
            href="/size-guide"
            className="rounded-full border border-[#A38A75] bg-white px-5 py-2.5 text-sm font-semibold text-[#5e4c3f]"
          >
            📏 Size Guide & Exchange
          </Link>
        </div>
      </div>

      <p className="text-center text-xs font-medium text-slate-500">
        ⚡ Lite experience enabled: compressed images, lazy product loading, minimal motion for low-bandwidth users.
      </p>
    </section>
  );
}
