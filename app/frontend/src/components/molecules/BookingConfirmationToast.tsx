import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface BookingConfirmationToastProps {
  open: boolean;
  onClose: () => void;
  data: {
    teacherName: string;
    selectedDate: string;
    startTime: string;
    endTime: string;
    userName: string;
    totalPrice: number;
  } | null;
}

export default function BookingConfirmationToast({
  open,
  onClose,
  data,
}: BookingConfirmationToastProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  if (!visible || !data) return null;

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Green header bar */}
        <div className="bg-[#2F7A5B] px-6 py-4 flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-white" />
          <h3 className="text-lg font-bold text-white">{t("bookingConfirm.title")}</h3>
          <button
            onClick={handleClose}
            className="ms-auto text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{t("bookingConfirm.teacher")}</span>
            <span className="text-sm font-semibold text-[#1A1A2E]">{data.teacherName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{t("bookingConfirm.date")}</span>
            <span className="text-sm font-semibold text-[#1A1A2E]">{data.selectedDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{t("bookingConfirm.time")}</span>
            <span className="text-sm font-semibold text-[#1A1A2E]">
              {data.startTime} - {data.endTime}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{t("bookingConfirm.student")}</span>
            <span className="text-sm font-semibold text-[#1A1A2E]">{data.userName}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">{t("bookingConfirm.price")}</span>
            <span className="text-xl font-bold text-[#2F7A5B]">${data.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Close button */}
        <div className="px-6 pb-5">
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-lg bg-[#2F7A5B] text-white font-semibold hover:bg-[#25694A] transition-colors"
          >
            {t("bookingConfirm.close")}
          </button>
        </div>
      </div>
    </div>
  );
}