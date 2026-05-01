import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrimaryButton from "@/components/atoms/PrimaryButton";

interface BookingFormGroupProps {
  hourlyRate: number;
  onConfirm: (data: BookingData) => void;
}

export interface BookingData {
  selectedDate: string;
  startTime: string;
  endTime: string;
  userName: string;
  notes: string;
  totalPrice: number;
}

function generateTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h24 = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      const period = hour < 12 ? "ص" : "م";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const label = `${displayHour}:${min.toString().padStart(2, "0")} ${period}`;
      options.push({ value: h24, label });
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();

export default function BookingFormGroup({ hourlyRate, onConfirm }: BookingFormGroupProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState("");

  const calculateTotalPrice = (): number => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes - startMinutes;
    if (diff <= 0) return 0;
    return (diff / 60) * hourlyRate;
  };

  const totalPrice = calculateTotalPrice();

  const handleConfirm = () => {
    if (!selectedDate || !startTime || !endTime || !userName) return;
    onConfirm({
      selectedDate,
      startTime,
      endTime,
      userName,
      notes,
      totalPrice,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="booking-date">التاريخ</Label>
        <Input
          id="booking-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>وقت البداية</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الوقت" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>وقت النهاية</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الوقت" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions
                .filter((opt) => !startTime || opt.value > startTime)
                .map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-name">الاسم</Label>
        <Input
          id="booking-name"
          placeholder="أدخل اسمك"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-notes">ملاحظات</Label>
        <Textarea
          id="booking-notes"
          placeholder="أضف ملاحظاتك هنا..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {totalPrice > 0 && (
        <div className="bg-[#FDF8F0] rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">السعر الإجمالي</p>
          <p className="text-2xl font-bold text-[#2F7A5B]">${totalPrice.toFixed(2)}</p>
        </div>
      )}

      <PrimaryButton
        className="w-full"
        onClick={handleConfirm}
        disabled={!selectedDate || !startTime || !endTime || !userName}
      >
        تأكيد الحجز
      </PrimaryButton>
    </div>
  );
}