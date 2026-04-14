"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ExternalLink, GraduationCap, Keyboard } from "lucide-react";

const courses = [
  "Data Science",
  "Data Analytics",
  "Web Development",
  "Mobile Development",
  "Digital Marketing",
  "Python",
  "SQL",
  "Basic Computer",
  "Tally",
  "DCA",
  "ADCA",
];

export function PromoSidebar() {
  return (
    <aside className="hidden xl:block w-80 shrink-0 space-y-6 sticky top-24">
      {/* Typing Course Banner */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-primary-container text-white shadow-xl shadow-primary/20">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Keyboard className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold tracking-tight">Master Typing</CardTitle>
          </div>
          
          <p className="text-sm text-white/90 leading-relaxed">
            Elevate your professional skills at <span className="font-bold">Seekho Computer Institute</span>. Professional training at affordable rates.
          </p>

          <div className="pt-2 space-y-3">
            <a
              href="tel:9217746682"
              className="flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Phone className="h-4 w-4" />
              9217746682
            </a>

            <Button asChild size="sm" variant="secondary" className="w-full font-bold shadow-lg shadow-black/10">
              <a
                href="https://seekhocomputer.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Enroll Now
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Banner */}
      <Card className="border-none bg-white dark:bg-zinc-900 shadow-lg shadow-black/[0.03]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/5 rounded-md">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">Premium Programs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <Badge
                key={course}
                variant="outline"
                className="bg-muted border-border/40 text-muted-foreground font-medium hover:bg-primary/5 hover:text-primary transition-colors px-2.5 py-1"
              >
                {course}
              </Badge>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-[11px] text-muted-foreground text-center italic">
              Explore 50+ industry-relevant certifications
            </p>

            <Button asChild variant="outline" size="sm" className="w-full border-primary/20 hover:border-primary hover:bg-primary/5 text-primary font-bold">
              <a
                href="https://seekhocomputer.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Catalog
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
