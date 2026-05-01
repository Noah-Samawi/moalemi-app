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
import { useLanguage } from "@/i18n/LanguageContext";

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

function generateTimeOptions(lang: string): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h24 = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      if (lang === "ar") {
        const period = hour < 12 ? "ص" : "م";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const label = `${displayHour}:${min.toString().padStart(2, "0")} ${period}`;
        options.push({ value: h24, label });
      } else {
        const period = hour < 12 ? "AM" : "PM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const label = `${displayHour}:${min.toString().padStart(2, "0")} ${period}`;
        options.push({ value: h24, label });
      }
    }
  }
  return options;
}

export default function BookingFormGroup({ hourlyRate, onConfirm }: BookingFormGroupProps) {
  const { t, lang } = useLanguage();
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState("");

  const timeOptions = generateTimeOptions(lang);

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
        <Label htmlFor="booking-date">{t("booking.date")}</Label>
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
          <Label>{t("booking.startTime")}</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder={t("booking.selectTime")} />
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
          <Label>{t("booking.endTime")}</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger>
              <SelectValue placeholder={t("booking.selectTime")} />
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
        <Label htmlFor="booking-name">{t("booking.name")}</Label>
        <Input
          id="booking-name"
          placeholder={t("booking.namePlaceholder")}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-notes">{t("booking.notes")}</Label>
        <Textarea
          id="booking-notes"
          placeholder={t("booking.notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {totalPrice > 0 && (
        <div className="bg-[#FDF8F0] rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">{t("booking.totalPrice")}</p>
          <p className="text-2xl font-bold text-[#2F7A5B]">${totalPrice.toFixed(2)}</p>
        </div>
      )}

      <PrimaryButton
        className="w-full"
        onClick={handleConfirm}
        disabled={!selectedDate || !startTime || !endTime || !userName}
      >
        {t("booking.confirm")}
      </PrimaryButton>
    </div>
  );
}