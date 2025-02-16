"use client"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { GitBranch, Linkedin, Twitter, Instagram } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      className="border-t "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container ml-12 flex flex-col items-center justify-between gap-8 py-10 md:flex-row md:py-6">
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
          <Link
            href="https://barnoyevmehriddin.vercel.app/"
            className="font-medium text-lg text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Mehriddin
          </Link>

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <Link
            href="https://github.com/MehriddinBarnoyev/Learning-center"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Learning Center. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

