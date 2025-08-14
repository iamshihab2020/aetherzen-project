"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Gift,
  HandCoins,
  Phone,
  Plane,
  ShieldCheck,
  FileSearch,
  Truck,
  Star,
  ShoppingCart,
  Heart,
  Search,
  UserCheck,
  ClipboardList,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage() {
  const featuredProducts = [
    {
      name: "Digital Thermometer",
      price: "$29.99",
      image: "/images/diagnostics.jpg",
      category: "Diagnostics",
    },
    {
      name: "N95 Respirator Mask (Box of 20)",
      price: "$45.00",
      image: "/images/respiratory.jpg",
      category: "Respiratory",
    },
    {
      name: "Sterile Surgical Gloves",
      price: "$35.50",
      image: "/images/surgical.jpg",
      category: "Surgical",
    },
    {
      name: "Portable Oxygen Concentrator",
      price: "$1,800.00",
      image: "/images/doctor-offer.png",
      category: "Critical Care",
    },
  ];

  const testimonials = [
    {
      quote:
        "AetherZen has revolutionized our procurement process. The speed and reliability are unmatched. We can now focus more on patient care.",
      name: "Dr. Emily Carter",
      title: "Chief Medical Officer, Mercy General Hospital",
      avatar: "EC",
    },
    {
      quote:
        "The platform is incredibly user-friendly, and the customer support is top-notch. Bulk ordering has never been easier for our clinic network.",
      name: "John T. Smith",
      title: "Director of Operations, Unity Health Clinics",
      avatar: "JS",
    },
    {
      quote:
        "Finding certified medical equipment used to be a major hassle. With AetherZen, we get all the documentation we need right away. A true game-changer.",
      name: "Samantha Lee",
      title: "Procurement Manager, Oak Valley Medical Center",
      avatar: "SL",
    },
  ];

  return (
    <div className={inter.className}>
      <Navbar />
      <main className="flex flex-col bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <p className="text-red-600 font-semibold">
                #1 in Medical Procurement for Hospitals & Clinics
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-4 text-slate-900">
                Medical Equipment for Modern Healthcare
              </h1>
              <p className="text-gray-600 mt-6 max-w-xl mx-auto md:mx-0">
                AetherZen offers an enterprise-ready procurement platform with a
                focus on reliability, compliance, and efficiency for healthcare
                providers of all sizes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
                <Button size="lg" className="px-8 py-3">
                  Shop Medical Devices
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Request Bulk Quote
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>HIPAA-Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  <span>Emergency Priority Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-amber-600" />
                  <span>FDA / CE Certifications</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/hero-doctor.png"
                  alt="Doctor with modern medical equipment"
                  width={700}
                  height={700}
                  className="rounded-full object-cover shadow-2xl aspect-square"
                />
                <div className="absolute -bottom-8 -left-12 bg-white rounded-full p-2 shadow-lg">
                  <div className="bg-red-600 text-white rounded-full w-28 h-28 flex flex-col items-center justify-center font-bold text-center p-2">
                    <p className="text-3xl">24/7</p>
                    <p className="text-xs font-normal">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency procurement banner */}
        <section className="bg-red-50 border-y border-red-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-600 rounded-full p-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Emergency Procurement
                </p>
                <p className="text-sm text-gray-600">
                  Critical equipment with rush shipping and priority processing
                  for hospitals.
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <Button variant="destructive">Raise Emergency Order</Button>
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section className="bg-white w-full py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                title: "Free Shipping",
                subtitle: "Orders over $200",
                icon: <Plane className="w-7 h-7 text-blue-600" />,
              },
              {
                title: "Money Back",
                subtitle: "30-day returns",
                icon: <HandCoins className="w-7 h-7 text-green-600" />,
              },
              {
                title: "B2B Vouchers",
                subtitle: "Bulk incentives",
                icon: <Gift className="w-7 h-7 text-orange-500" />,
              },
              {
                title: "24/7 Support",
                subtitle: "Dedicated managers",
                icon: <Phone className="w-7 h-7 text-red-600" />,
              },
              {
                title: "Secure Payments",
                subtitle: "SSL & Invoicing",
                icon: <ShieldCheck className="w-7 h-7 text-indigo-600" />,
              },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                  {f.icon}
                </div>
                <p className="font-semibold text-slate-900">{f.title}</p>
                <p className="text-sm text-gray-500 mt-1">{f.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category Grid */}
        <section className="py-16 sm:py-20 bg-gray-50 border-t">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Shop by Category
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Find the specific equipment and supplies you need across our
              curated categories, designed for professional healthcare
              environments.
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden group relative">
              <div className="h-64 w-full">
                <Image
                  src="/images/surgical.jpg"
                  alt="Surgical supplies"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold">
                  Surgical & Sterile Supplies
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Gloves, gowns, sutures, and sterilization trays.
                </p>
                <Button className="mt-4">Browse Surgical</Button>
              </div>
            </Card>
            <Card className="overflow-hidden group relative">
              <div className="h-64 w-full">
                <Image
                  src="/images/diagnostics.jpg"
                  alt="Diagnostics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold">
                  Diagnostics & Monitoring
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Pulse oximeters, ECG machines, and thermometers.
                </p>
                <Button className="mt-4">Browse Diagnostics</Button>
              </div>
            </Card>
            <Card className="overflow-hidden group relative">
              <div className="h-64 w-full">
                <Image
                  src="/images/respiratory.jpg"
                  alt="Respiratory"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold">
                  Respiratory & Critical Care
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Oxygen concentrators and ventilator accessories.
                </p>
                <Button className="mt-4">Browse Respiratory</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-20 bg-white border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Handpicked essentials for every clinic and hospital. Quality you
                can trust, prices you can afford.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, i) => (
                <Card key={i} className="group overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="aspect-square w-full relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-white/80 backdrop-blur-sm h-9 w-9 scale-0 group-hover:scale-100 transition-transform duration-200 delay-100"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-white/80 backdrop-blur-sm h-9 w-9 scale-0 group-hover:scale-100 transition-transform duration-200 delay-200"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 uppercase">
                      {product.category}
                    </p>
                    <h3 className="font-semibold mt-1 truncate">
                      {product.name}
                    </h3>
                    <p className="font-bold text-lg text-slate-900 mt-2">
                      {product.price}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-gray-50 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Streamlined Procurement in 4 Steps
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                From browsing to delivery, our process is designed for maximum
                efficiency and transparency.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">1. Find Your Products</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Browse our extensive catalog or use the search to find exactly
                  what you need.
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">2. Place Your Order</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Add items to your cart or request a bulk quote for
                  institutional pricing.
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">3. Verify & Comply</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Upload prescriptions or certifications as needed for regulated
                  items.
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">
                  4. Receive Your Delivery
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Get your order delivered with priority shipping and real-time
                  tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="bg-blue-600 text-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-sm uppercase font-semibold opacity-80">
                Intensive Care Offer
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Oxygen Concentrators — Weekly Clearance
              </h2>
              <p className="opacity-90 mt-4 max-w-lg mx-auto md:mx-0">
                Up to 40% off on selected models. Prescription required — upload
                it during checkout for expedited review and shipment.
              </p>
              <div className="mt-6 flex gap-4 justify-center md:justify-start">
                <Button size="lg" variant="secondary">
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Upload Prescription
                </Button>
              </div>
            </div>
            <div className="flex justify-center relative">
              <Image
                src="/images/doctor-offer.png"
                alt="Offer Doctor"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 font-bold rounded-full h-24 w-24 flex items-center justify-center text-center p-2 shadow-lg">
                Up to 40% OFF
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Trusted by Healthcare Leaders
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Our platform is the trusted choice for hospitals, clinics, and
                medical professionals nationwide.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="flex flex-col justify-between">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-4 bg-gray-50 p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
