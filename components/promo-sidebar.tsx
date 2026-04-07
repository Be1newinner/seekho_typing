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
    <aside className="hidden xl:block w-72 shrink-0 space-y-4">
      {/* Typing Course Banner */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Learn Typing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-foreground">Seekho Computer Institute</span> for professional typing training at very affordable rates!
          </p>
          
          <div className="space-y-2">
            <a 
              href="tel:9217746682"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Phone className="h-4 w-4" />
              9217746682
            </a>
            
            <Button asChild size="sm" className="w-full">
              <a 
                href="https://seekhocomputer.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Banner */}
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Our Courses</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {courses.map((course) => (
              <Badge 
                key={course} 
                variant="secondary" 
                className="text-xs font-normal"
              >
                {course}
              </Badge>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground pt-1">
            ...and many more computer courses!
          </p>
          
          <Button asChild variant="outline" size="sm" className="w-full">
            <a 
              href="https://seekhocomputer.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Explore All Courses
            </a>
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
