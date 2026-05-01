import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import SecondaryButton from "@/components/atoms/SecondaryButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-[#2F7A5B]">معلم</span>
            <span className="text-[#DCA842]">ي</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors"
            >
              الرئيسية
            </Link>
            <a
              href="/#teachers"
              className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors"
            >
              المعلمون
            </a>
            <SecondaryButton>تسجيل الدخول</SecondaryButton>
          </div>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#1A1A2E]">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-6 mt-8">
                  <SheetClose asChild>
                    <Link
                      to="/"
                      className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium text-lg"
                      onClick={() => setOpen(false)}
                    >
                      الرئيسية
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <a
                      href="/#teachers"
                      className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium text-lg"
                      onClick={() => setOpen(false)}
                    >
                      المعلمون
                    </a>
                  </SheetClose>
                  <SecondaryButton className="w-full">تسجيل الدخول</SecondaryButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}