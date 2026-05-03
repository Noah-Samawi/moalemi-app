import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLiveData } from "@/context/LiveDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ADMIN_EMAIL = "noah.alsamawi@gmail.com";

type NewTeacherForm = {
  name_ar: string;
  name_de: string;
  subjects: string;
  price_per_hour: string;
  years_of_experience: string;
  image_url: string;
};

const initialFormState: NewTeacherForm = {
  name_ar: "",
  name_de: "",
  subjects: "",
  price_per_hour: "",
  years_of_experience: "",
  image_url: "",
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewTeacherForm>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const { teachers, bookings, loadingTeachers, loadingBookings, refreshTeachers, refreshBookings } = useLiveData();

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data, error } = await supabase.auth.getSession();
      const email = data?.session?.user?.email ?? null;

      if (error || email !== ADMIN_EMAIL) {
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    };

    verifyAdmin();
  }, []);

  const handleAddTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const subjectsArray = form.subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean);

    if (!form.name_ar || !form.name_de || !form.price_per_hour || !form.years_of_experience) {
      setFormError("Please complete all required fields before adding a teacher.");
      return;
    }

    setBusy(true);

    const { error } = await supabase.from("teachers").insert([
      {
        name_ar: form.name_ar,
        name_de: form.name_de,
        subjects: subjectsArray,
        price_per_hour: Number(form.price_per_hour),
        years_of_experience: Number(form.years_of_experience),
        image_url: form.image_url,
      },
    ]);

    if (error) {
      toast({
        title: "Unable to add teacher",
        description: error.message,
      });
    } else {
      toast({
        title: "Teacher added successfully",
        description: "A new teacher is visible in your app.",
      });
      setForm(initialFormState);
      setAddDialogOpen(false);
      await refreshTeachers();
    }

    setBusy(false);
  };

  const handleDeleteTeacher = async (id: string) => {
    setBusy(true);

    const { error } = await supabase.from("teachers").delete().eq("id", id);

    if (error) {
      toast({
        title: "Unable to delete teacher",
        description: error.message,
      });
    } else {
      toast({
        title: "Teacher deleted",
        description: "The teacher record has been removed.",
      });
      await refreshTeachers();
    }

    setDeleteTeacherId(null);
    setBusy(false);
  };

  const handleDeleteBooking = async (id: string) => {
    setBusy(true);

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Unable to cancel booking",
        description: error.message,
      });
    } else {
      toast({
        title: "Booking canceled",
        description: "The booking has been removed.",
      });
      await refreshBookings();
    }

    setDeleteBookingId(null);
    setBusy(false);
  };

  if (authorized === false) {
    return <Navigate to="/" replace />;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-3/5 rounded-full bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-40 rounded-3xl bg-slate-200" />
              <div className="h-40 rounded-3xl bg-slate-200" />
            </div>
            <div className="h-80 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin portal</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">In-App Admin Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Manage teachers and bookings in real-time using Supabase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={refreshTeachers} disabled={loadingTeachers || busy}>
              Refresh teachers
            </Button>
            <Button variant="secondary" size="sm" onClick={refreshBookings} disabled={loadingBookings || busy}>
              Refresh bookings
            </Button>
            <Button size="sm" onClick={() => setAddDialogOpen(true)} disabled={busy}>
              Add teacher
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Teachers in database</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{loadingTeachers ? <Skeleton className="h-10 w-20" /> : teachers.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Bookings tracked</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{loadingBookings ? <Skeleton className="h-10 w-20" /> : bookings.length}</p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Teacher Control Center</CardTitle>
                <CardDescription>Live teacher records sourced directly from Supabase.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto px-0 py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name AR</TableHead>
                      <TableHead>Name DE</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Price/hr</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingTeachers ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={6} className="py-6">
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : teachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                          No teachers are available yet.
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
                          <TableCell className="text-right">
                            <AlertDialog open={deleteTeacherId === teacher.id} onOpenChange={(open) => !open && setDeleteTeacherId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => setDeleteTeacherId(teacher.id)}>
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete teacher?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will remove the teacher permanently.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteTeacherId && handleDeleteTeacher(deleteTeacherId)}>
                                    Delete teacher
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                <CardTitle>Booking Monitor</CardTitle>
                <CardDescription>View every booking and update it in one place.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto px-0 py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingBookings ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={7} className="py-6">
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                          No bookings have been created yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.student_name}</TableCell>
                          <TableCell>{booking.teacher?.name_de ?? booking.teacher?.name_ar ?? booking.teacher_id}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>
                            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell>${booking.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog open={deleteBookingId === booking.id} onOpenChange={(open) => !open && setDeleteBookingId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setDeleteBookingId(booking.id)}>
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove the booking permanently.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep booking</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteBookingId && handleDeleteBooking(deleteBookingId)}>
                                    Cancel booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <aside className="hidden xl:block rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
            <div className="mb-8 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin summary</p>
              <h2 className="text-3xl font-semibold">Live dashboard</h2>
              <p className="text-sm text-slate-300">
                This sidebar syncs teacher and booking changes automatically.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-900 p-5">
              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Teachers</p>
                <p className="mt-3 text-3xl font-semibold">{loadingTeachers ? <Skeleton className="h-10 w-24" /> : teachers.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Bookings</p>
                <p className="mt-3 text-3xl font-semibold">{loadingBookings ? <Skeleton className="h-10 w-24" /> : bookings.length}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4 rounded-3xl bg-slate-800 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick actions</p>
              <Button variant="secondary" size="sm" onClick={refreshTeachers} disabled={busy || loadingTeachers}>
                Refresh teachers
              </Button>
              <Button variant="secondary" size="sm" onClick={refreshBookings} disabled={busy || loadingBookings}>
                Refresh bookings
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add a new teacher</DialogTitle>
            <DialogDescription>
              Create a teacher profile with localized names, pricing, and experience.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAddTeacher}>
            <div className="space-y-2">
              <Label htmlFor="admin-name-ar">Name (AR)</Label>
              <Input
                id="admin-name-ar"
                value={form.name_ar}
                onChange={(event) => setForm({ ...form, name_ar: event.target.value })}
                placeholder="أ. فاطمة علي"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-name-de">Name (DE)</Label>
              <Input
                id="admin-name-de"
                value={form.name_de}
                onChange={(event) => setForm({ ...form, name_de: event.target.value })}
                placeholder="Fatima Ali"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-subjects">Subjects</Label>
              <Input
                id="admin-subjects"
                value={form.subjects}
                onChange={(event) => setForm({ ...form, subjects: event.target.value })}
                placeholder="Quran, Tajweed, Arabic Grammar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-price">Price per hour</Label>
              <Input
                id="admin-price"
                type="number"
                min="0"
                step="0.5"
                value={form.price_per_hour}
                onChange={(event) => setForm({ ...form, price_per_hour: event.target.value })}
                placeholder="30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-experience">Years of experience</Label>
              <Input
                id="admin-experience"
                type="number"
                min="0"
                value={form.years_of_experience}
                onChange={(event) => setForm({ ...form, years_of_experience: event.target.value })}
                placeholder="10"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-image-url">Image URL</Label>
              <Input
                id="admin-image-url"
                value={form.image_url}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {formError ? (
              <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <DialogFooter className="sm:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving..." : "Add teacher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
