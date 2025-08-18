// src/components/footer.tsx
"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Footer Top */}
      <div className="container mx-auto px-5 md:px-8 lg:px-10 py-12 grid md:grid-cols-4 gap-8">
        {/* My Account */}
        <div>
          <h3 className="text-white font-semibold mb-4">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/account" className="hover:underline">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:underline">
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/prescriptions" className="hover:underline">
                My Prescriptions
              </Link>
            </li>
            <li>
              <Link href="/bulk-requests" className="hover:underline">
                Bulk Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources / Certification */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs/api" className="hover:underline">
                API Docs (Swagger)
              </Link>
            </li>
            <li>
              <Link href="/docs/integration" className="hover:underline">
                Integration Guide
              </Link>
            </li>
            <li>
              <Link href="/certifications" className="hover:underline">
                FDA / CE Certificates
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms & Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Sign Up For Newsletter
          </h3>
          <p className="text-sm mb-4">
            Get product updates, bulk discounts and compliance notices.
          </p>
          <div className="flex">
            <Input placeholder="Enter Your Email" className="rounded-r-none" />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            <p>
              Need enterprise pricing?{" "}
              <Link href="/for-hospitals" className="underline">
                Contact Sales
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AetherZen — All Rights Reserved. &nbsp;
        <span className="hidden sm:inline">
          • Built with Next.js, Prisma & PostgreSQL
        </span>
      </div>
    </footer>
  );
}
