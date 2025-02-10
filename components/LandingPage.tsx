import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "./Header";
import Footer from "./Footer";
import { Search } from "lucide-react";

const partners = [
  {
    name: "Amazon",
    logo: "https://m.media-amazon.com/images/G/01/gc/designs/livepreview/amzlogo_noto_email_v2016_us-main._CB616929789_.png",
  },
  {
    name: "Course Hero",
    logo: "https://mma.prnewswire.com/media/478224/Course_Hero_Logo.jpg?p=twitter",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Khan Academy",
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*Le7FxLZNPIthsVp2.jpeg",
  },
  {
    name: "Udemy",
    logo: "https://whop.com/blog/content/images/size/w600/2024/05/What-is-Udemy-Pros--Cons--and-Features-2024-Review.webp",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px] mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Free learning resources
                  <br />
                  center for kids.{" "}
                  <span className="text-primary">Yes FREE!</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Free learning resources center for your kids to study, so more
                  access to study, go grab your pencil now kids!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Search for resources..."
                    type="search"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm">
                    Popular Resources
                  </Button>
                  <Button variant="outline" size="sm">
                    Language Tools
                  </Button>
                  <Button variant="outline" size="sm">
                    Reading with Colors
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 -z-10 h-full w-full">
            <div className="absolute left-1/4 top-1/4 h-8 w-8 rounded-full bg-primary/10" />
            <div className="absolute right-1/4 top-1/3 h-12 w-12 rounded-full bg-primary/20" />
            <div className="absolute bottom-1/4 left-1/3 h-6 w-6 rounded-full bg-primary/15" />
          </div>
        </section>

        {/* Partners Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={100}
                    height={30}
                    className="grayscale transition-all hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Worlds <span className="text-primary">#1 FREE</span>
                    <br />
                    learning resources on
                    <br />
                    internet
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    You can find most beautiful free learning resources like
                    that! Almost every subjects and learn good here.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/test-settings">Start Test</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/courses">Explore More</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div>
                    <p className="text-2xl font-bold">1200+</p>
                    <p className="text-sm text-muted-foreground">Resources</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">320+</p>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2902+</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Student with books"
                  className="aspect-[4/3] overflow-hidden rounded-xl object-cover"
                  height={400}
                  src="https://i0.wp.com/opportunitycell.com/wp-content/uploads/2020/11/2020.132_BAM_CA_10-free-short-courses-to-upskill_940x485.jpg?fit=940%2C485&ssl=1"
                  width={600}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
