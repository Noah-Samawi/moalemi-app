import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

type TeacherRecord = {
  id: string;
  name_ar: string;
  name_de: string;
  subjects: string[];
  price_per_hour: number;
  years_of_experience: number;
  image_url: string;
  created_at: string;
};

type BookingRecord = {
  id: string;
  student_name: string;
  teacher_id: string;
  date: string;
  time: string;
  price: number;
  created_at: string;
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
    fetchBookings();
  }, []);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    setError(null);

    const { data, error } = await supabase
      .from<TeacherRecord>("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch teachers", error);
      setError(error.message);
      setTeachers([]);
    } else {
      setTeachers(data ?? []);
    }

    setLoadingTeachers(false);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setError(null);

    const { data, error } = await supabase
      .from<BookingRecord>("bookings")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Failed to fetch bookings", error);
      setError(error.message);
      setBookings([]);
    } else {
      setBookings(data ?? []);
    }

    setLoadingBookings(false);
  };

  const handleDeleteTeacher = async (id: string) => {
    setError(null);

    const { error } = await supabase.from("teachers").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete teacher", error);
      setError(error.message);
      return;
    }

    fetchTeachers();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Manage teachers and review upcoming bookings from Supabase.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchTeachers} size="sm">
              Refresh teachers
            </Button>
            <Button onClick={fetchBookings} size="sm" variant="secondary">
              Refresh bookings
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>Current records stored in the teachers table.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name (AR)</TableHead>
                    <TableHead>Name (DE)</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Price/hr</TableHead>
                    <TableHead>Exp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTeachers ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        Loading teachers...
                      </TableCell>
                    </TableRow>
                  ) : teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No teachers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name_ar}</TableCell>
                        <TableCell>{teacher.name_de}</TableCell>
                        <TableCell>{teacher.subjects.join(", ")}</TableCell>
                        <TableCell>${teacher.price_per_hour.toFixed(2)}</TableCell>
                        <TableCell>{teacher.years_of_experience}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Latest scheduled bookings from the bookings table.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBookings ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Loading bookings...
                      </TableCell>
                    </TableRow>
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.student_name}</TableCell>
                        <TableCell>{booking.teacher_id}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>${booking.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
