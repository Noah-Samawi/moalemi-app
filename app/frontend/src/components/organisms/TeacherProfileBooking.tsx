import AvatarAtom from "@/components/atoms/AvatarAtom";
import StarRating from "@/components/atoms/StarRating";
import BadgeTag from "@/components/atoms/BadgeTag";
import BookingFormGroup from "@/components/molecules/BookingFormGroup";
import type { Teacher } from "@/data/mockData";

interface TeacherProfileBookingProps {
  teacher: Teacher;
}

export default function TeacherProfileBooking({ teacher }: TeacherProfileBookingProps) {
  const handleBookingConfirm = (data: {
    selectedDate: string;
    startTime: string;
    endTime: string;
    userName: string;
    notes: string;
    totalPrice: number;
  }) => {
    alert(`تم تأكيد الحجز!\nالمعلم: ${teacher.name}\nالتاريخ: ${data.selectedDate}\nالوقت: ${data.startTime} - ${data.endTime}\nالاسم: ${data.userName}\nالسعر: $${data.totalPrice.toFixed(2)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Bio Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start gap-6">
            <AvatarAtom src={teacher.avatar} alt={teacher.name} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">{teacher.name}</h1>
              <StarRating rating={teacher.rating} />
              <p className="text-sm text-gray-500 mt-1">{teacher.reviewsCount} تقييم</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {teacher.specializations.map((spec) => (
              <BadgeTag key={spec} text={spec} variant="green" />
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="font-semibold">{teacher.experience} سنة خبرة</span>
            <span className="font-bold text-[#2F7A5B] text-lg">${teacher.hourlyRate}/ساعة</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">نبذة عن المعلم</h2>
            <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">الخدمات</h2>
            <div className="space-y-4">
              {teacher.services.map((service) => (
                <div
                  key={service.name}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeTag text={service.name} variant="gold" />
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">احجز درساً</h2>
            <BookingFormGroup
              hourlyRate={teacher.hourlyRate}
              onConfirm={handleBookingConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}