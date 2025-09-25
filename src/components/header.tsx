import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";


export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
           <div className="flex items-center gap-2.5">
             <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <span className="text-lg font-headline font-semibold">Project: Thrive</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
