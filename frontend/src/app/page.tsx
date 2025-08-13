// src/app/page.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gift,
  HandCoins,
  Phone,
  Plane,
  ShieldCheck,
  FileSearch,
  Truck,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-blue-50 w-full">
          <div className="container mx-auto px-5 md:px-8 lg:px-10 py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-red-600 font-semibold text-sm">
                No 1 in Medical Procurement for Hospitals & Clinics
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-4 text-slate-900">
                Medical Equipment & Supplies for Hospitals, Clinics & Patients
              </h1>
              <p className="text-gray-600 mt-4 max-w-xl">
                AetherZen — enterprise-ready medical procurement.
              </p>

              <div className="flex gap-3 mt-6">
                <Button className="px-6 py-2">Shop Medical Devices</Button>
                <Button variant="secondary" className="px-6 py-2">
                  Request Bulk Quote
                </Button>
              </div>

              {/* quick highlights */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>HIPAA-safe prescription storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  <span>Priority shipping for emergency orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-amber-600" />
                  <span>Certification docs available (FDA / CE)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-2xl h-96 md:h-[600px]">
                <Image
                  src="/images/hero-doctor.png"
                  alt="Doctor wearing mask"
                  width={700}
                  height={600}
                  className="rounded-lg object-cover"
                />
                <div className="absolute top-52 left-4 bg-white rounded-lg shadow-md px-4 py-3 w-64">
                  <p className="text-xs text-gray-500">Emergency hotline</p>
                  <p className="text-sm font-semibold">
                    Rush orders: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency procurement / quick actions banner */}
        <section className="bg-red-50 py-4">
          <div className="container mx-auto px-5 md:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                ⚠
              </div>
              <div>
                <p className="font-semibold">Emergency Procurement</p>
                <p className="text-sm text-gray-600">
                  Need critical equipment now? Use Rush Shipping and priority
                  order processing for hospitals and clinics.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost">Raise Emergency Order</Button>
              <Button>Contact Procurement Sales</Button>
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section className="bg-white w-full py-10 border-b">
          <div className="container mx-auto grid md:grid-cols-5 gap-6 px-5 md:px-8 lg:px-10">
            {[
              {
                title: "Free Shipping",
                subtitle: "Orders over $200 (select regions)",
                icon: <Plane className="w-6 h-6" />,
              },
              {
                title: "Money Back",
                subtitle: "30-day returns on eligible items",
                icon: <HandCoins className="w-6 h-6" />,
              },
              {
                title: "B2B Gift Voucher",
                subtitle: "Institutional credits and bulk incentives",
                icon: <Gift className="w-6 h-6" />,
              },
              {
                title: "24/7 Support",
                subtitle: "Dedicated account managers for hospitals",
                icon: <Phone className="w-6 h-6" />,
              },
              {
                title: "Secure Payments",
                subtitle: "SSL Commerce + invoice generation",
                icon: <ShieldCheck className="w-6 h-6" />,
              },
            ].map((f, i) => (
              <Card key={i} className="text-center shadow-sm">
                <CardContent className="py-6 flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-md mb-2">
                    {f.icon}
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{f.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category / Use-case Cards */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-5 md:px-8 lg:px-10 grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden relative">
              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  Surgical & Sterile Supplies
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Gloves, gowns, sutures, sterilization trays. Filter by
                  certifications (FDA / CE) and expiration date.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button>Browse Surgical</Button>
                  <Button variant="secondary">Upload Certification</Button>
                </div>
              </div>
              <div className="h-36 md:h-40 w-full relative">
                <Image
                  src="/images/surgical.jpg"
                  alt="Surgical supplies"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            <Card className="overflow-hidden relative">
              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  Diagnostics & Monitoring
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Pulse oximeters, ECG machines, thermometers with device specs
                  and maintenance schedules.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button>Browse Diagnostics</Button>
                  <Button variant="secondary">Request Demo</Button>
                </div>
              </div>
              <div className="h-36 md:h-40 w-full relative">
                <Image
                  src="/images/diagnostics.jpg"
                  alt="Diagnostics"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            <Card className="overflow-hidden relative">
              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  Respiratory & Critical Care
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Oxygen concentrators, ventilator accessories, and emergency
                  kits — prescription validation for restricted items.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button>Browse Respiratory</Button>
                  <Button variant="secondary">Rush Order</Button>
                </div>
              </div>
              <div className="h-36 md:h-40 w-full relative">
                <Image
                  src="/images/respiratory.jpg"
                  alt="Respiratory"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-5 md:px-8 lg:px-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-500">Intensive Care Offer</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Oxygen Concentrators — Weekly Clearance
              </h2>
              <p className="text-gray-600 mt-4 max-w-lg">
                Up to 40% off on selected models. Prescription required — upload
                it during checkout for expedited review and shipment.
              </p>
              <div className="mt-6 flex gap-3">
                <Button>Shop Now</Button>
                <Button variant="secondary">Upload Prescription</Button>
              </div>
            </div>
            <div className="flex justify-center relative">
              <Image
                src="/images/doctor-offer.png"
                alt="Offer Doctor"
                width={600}
                height={600}
                className="rounded-lg object-cover"
              />
              <span className="absolute top-18 left-28 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Up to 40% OFF
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
