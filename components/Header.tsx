import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
        <div>
          <img src="https://www.nametag.com/learning-center/wp-content/uploads/2018/03/cropped-tlc-logo1.png" alt="Logo" width={100} height={60} />
        </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium hover:text-primary"
          >
            Courses
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button size="lg" asChild>
            <Link href="/test-settings">Start Test</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
