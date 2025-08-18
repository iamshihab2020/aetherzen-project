import { ReactNode } from "react";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li>
              <Link
                href="/dashboard/products"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/categories"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/orders"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/prescriptions"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Prescriptions
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
