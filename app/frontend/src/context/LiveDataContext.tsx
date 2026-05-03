import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type LiveTeacher = {
  id: string;
  name_ar: string;
  name_de: string;
  subjects: string[];
  price_per_hour: number;
  years_of_experience: number;
  image_url: string;
  created_at: string;
  rating?: number;
  reviews_count?: number;
  bio_ar?: string;
  bio_de?: string;
};

type LiveBooking = {
  id: string;
  student_name: string;
  teacher_id: string;
  date: string;
  time: string;
  price: number;
  status: string;
  created_at: string;
  teacher?: {
    name_ar?: string;
    name_de?: string;
  };
};

interface LiveDataContextValue {
  teachers: LiveTeacher[];
  bookings: LiveBooking[];
  loadingTeachers: boolean;
  loadingBookings: boolean;
  refreshTeachers: () => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const LiveDataContext = createContext<LiveDataContextValue | undefined>(undefined);

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<LiveTeacher[]>([]);
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const refreshTeachers = useCallback(async () => {
    setLoadingTeachers(true);

    const { data, error } = await supabase
      .from<LiveTeacher>("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LiveDataContext: failed to load teachers", error);
      setTeachers([]);
    } else {
      setTeachers(
        (data ?? []).map((teacher) => ({
          rating: 4.9,
          reviews_count: 120,
          bio_ar: "مدرس محترف مع سجل ممتاز في التدريس.",
          bio_de: "Professioneller Lehrer mit exzellentem Erfahrungshintergrund.",
          ...teacher,
        }))
      );
    }

    setLoadingTeachers(false);
  }, []);

  const refreshBookings = useCallback(async () => {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from<LiveBooking>("bookings")
      .select("*, teacher:teachers(name_ar,name_de)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("LiveDataContext: failed to load bookings with join", error);
      const fallback = await supabase
        .from<LiveBooking>("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (fallback.error) {
        console.error("LiveDataContext: failed to load bookings", fallback.error);
        setBookings([]);
      } else {
        setBookings(
          (fallback.data ?? []).map((booking) => ({
            status: "Confirmed",
            ...booking,
          }))
        );
      }
    } else {
      setBookings(
        (data ?? []).map((booking) => ({
          status: booking.status ?? "Confirmed",
          ...booking,
        }))
      );
    }

    setLoadingBookings(false);
  }, []);

  useEffect(() => {
    refreshTeachers();
    refreshBookings();

    const channel = supabase
      .channel("live-data")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teachers" },
        () => {
          void refreshTeachers();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          void refreshBookings();
        }
      );

    void channel.subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [refreshBookings, refreshTeachers]);

  return (
    <LiveDataContext.Provider
      value={{ teachers, bookings, loadingTeachers, loadingBookings, refreshTeachers, refreshBookings }}
    >
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData(): LiveDataContextValue {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error("useLiveData must be used within LiveDataProvider");
  }
  return context;
}
