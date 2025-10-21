
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { 
  format, 
  isSameDay, 
  isSameMonth, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths, 
  isToday, 
  isBefore, 
  isAfter, 
  addDays 
} from 'date-fns';
import { th } from 'date-fns/locale';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CustomCalendarProps {
  selectedRange?: { from: Date; to: Date } | null;
  onRangeSelect: (range: { from: Date; to: Date } | null) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabledDates?: Date[];
  allowSingleDay?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  showCloseButton?: boolean;
  showTimeSelection?: boolean;
  locale?: Locale;
  onTimeChange?: (pickupTime: string, returnTime: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const DAY_NAMES = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedRange,
  onRangeSelect,
  onClose,
  minDate = new Date(),
  maxDate,
  className = "",
  disabledDates = [],
  allowSingleDay = true,
  showTodayButton = true,
  showClearButton = false,
  showCloseButton = false,
  showTimeSelection = true,
  locale = th,
  onTimeChange
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [showPickupTimeDropdown, setShowPickupTimeDropdown] = useState(false);
  const [showReturnTimeDropdown, setShowReturnTimeDropdown] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // สร้างปฏิทินสำหรับเดือนที่กำหนด
  const generateCalendarDays = useCallback((date: Date) => {
    const start = startOfWeek(startOfMonth(date), { locale });
    const end = endOfWeek(endOfMonth(date), { locale });
    return eachDayOfInterval({ start, end });
  }, [locale]);

  // ตรวจสอบว่าวันที่อยู่ในช่วงที่เลือก
  const isInRange = useCallback((date: Date) => {
    if (!selectedRange?.from || !selectedRange?.to) return false;
    return date >= selectedRange.from && date <= selectedRange.to;
  }, [selectedRange]);

  // ตรวจสอบว่าวันที่เป็นวันเริ่มต้น
  const isStartDate = useCallback((date: Date) => {
    return selectedRange?.from && isSameDay(date, selectedRange.from);
  }, [selectedRange]);

  // ตรวจสอบว่าวันที่เป็นวันสิ้นสุด
  const isEndDate = useCallback((date: Date) => {
    return selectedRange?.to && isSameDay(date, selectedRange.to);
  }, [selectedRange]);

  // ตรวจสอบว่าวันที่สามารถเลือกได้
  const isSelectable = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) return false;
    if (minDate && isBefore(date, minDate)) return false;
    if (maxDate && isAfter(date, maxDate)) return false;
    
    return !disabledDates.some(disabledDate => isSameDay(date, disabledDate));
  }, [minDate, maxDate, disabledDates]);

  // ตรวจสอบว่าวันที่เป็นวันปัจจุบัน
  const isCurrentDate = useCallback((date: Date) => {
    return isToday(date);
  }, []);

  // ตรวจสอบว่าวันที่อยู่ในเดือนปัจจุบัน
  const isCurrentMonth = useCallback((date: Date) => {
    return isSameMonth(date, currentMonth);
  }, [currentMonth]);

  // ตรวจสอบว่าวันที่เป็นวันหยุดสุดสัปดาห์
  const isWeekend = useCallback((date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // อาทิตย์ = 0, เสาร์ = 6
  }, []);

  // สร้างช่วงวันที่สำหรับ hover
  const getHoverRange = useCallback(() => {
    if (!isSelecting || !hoveredDate || !tempStartDate) return null;
    
    const from = tempStartDate;
    const to = hoveredDate;
    
    return from <= to ? { from, to } : { from: to, to: from };
  }, [isSelecting, hoveredDate, tempStartDate]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // จัดการการคลิกวันที่
  const handleDateClick = useCallback((date: Date) => {
    if (!isSelectable(date)) return;

    // กรณีที่ 1: ยังไม่ได้เลือกวันเริ่มต้น
    if (!tempStartDate) {
      if (selectedRange) {
        onRangeSelect(null);
      }
      setTempStartDate(date);
      setIsSelecting(true);
      return;
    }

    // กรณีที่ 2: เลือกวันเริ่มต้นแล้ว และเลือกวันเดียวกันอีกครั้ง (เลือกวันเดียว)
    if (isSameDay(date, tempStartDate)) {
      onRangeSelect({ from: date, to: date });
      setIsSelecting(false);
      setTempStartDate(null);
      onClose?.();
      return;
    }

    // กรณีที่ 3: เลือกวันสิ้นสุด
    const from = tempStartDate;
    const to = date;
    
    const startDate = from <= to ? from : to;
    const endDate = from <= to ? to : from;
    
    onRangeSelect({ from: startDate, to: endDate });
    setIsSelecting(false);
    setTempStartDate(null);
    onClose?.();
  }, [tempStartDate, isSelectable, onRangeSelect, onClose, selectedRange]);

  // จัดการการ hover วันที่
  const handleDateHover = useCallback((date: Date) => {
    if (isSelecting && tempStartDate && isSelectable(date)) {
      setHoveredDate(date);
    }
  }, [isSelecting, tempStartDate, isSelectable]);

  // จัดการการ focus วันที่
  const handleDateFocus = useCallback((date: Date) => {
    setFocusedDate(date);
  }, []);

  // จัดการ keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, date: Date) => {
    if (!isSelectable(date)) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleDateClick(date);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextDay = addDays(date, 1);
        if (isSelectable(nextDay)) {
          setFocusedDate(nextDay);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevDay = addDays(date, -1);
        if (isSelectable(prevDay)) {
          setFocusedDate(prevDay);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        const weekAgo = addDays(date, -7);
        if (isSelectable(weekAgo)) {
          setFocusedDate(weekAgo);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        const weekLater = addDays(date, 7);
        if (isSelectable(weekLater)) {
          setFocusedDate(weekLater);
        }
        break;
    }
  }, [isSelectable, handleDateClick]);

  // จัดการการเปลี่ยนแปลงเวลา
  const handleTimeChange = useCallback((type: 'pickup' | 'return', time: string) => {
    if (type === 'pickup') {
      setPickupTime(time);
      // เรียก onTimeChange ทันทีเมื่อมีการเปลี่ยนแปลงเวลา
      onTimeChange?.(time, returnTime);
    } else {
      setReturnTime(time);
      // เรียก onTimeChange ทันทีเมื่อมีการเปลี่ยนแปลงเวลา
      onTimeChange?.(pickupTime, time);
    }
  }, [pickupTime, returnTime, onTimeChange]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const goToCurrentMonth = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const handleClear = useCallback(() => {
    onRangeSelect(null);
    setIsSelecting(false);
    setHoveredDate(null);
    setTempStartDate(null);
  }, [onRangeSelect]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Reset temp state when selectedRange changes externally
  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to) {
      setTempStartDate(null);
      setIsSelecting(false);
    }
  }, [selectedRange]);

  // เรียก onTimeChange เมื่อ component mount และเมื่อมีการเปลี่ยนแปลงเวลา
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(pickupTime, returnTime);
    }
  }, [pickupTime, returnTime, onTimeChange]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hoverRange = getHoverRange();
  const days = generateCalendarDays(currentMonth);
  const nextMonth = addMonths(currentMonth, 1);
  const nextMonthDays = generateCalendarDays(nextMonth);

  // ตรวจสอบว่าวันที่อยู่ในช่วงที่ต่อเนื่องหรือไม่
  const isInContinuousRange = useCallback((date: Date) => {
    if (!hoverRange) return false;
    
    const { from, to } = hoverRange;
    const currentDate = new Date(date);
    
    // ตรวจสอบว่าวันที่อยู่ในช่วงที่ต่อเนื่องหรือไม่
    return currentDate >= from && currentDate <= to;
  }, [hoverRange]);

  // ตรวจสอบว่าวันที่อยู่ที่ขอบของช่วงหรือไม่
  const isAtRangeEdge = useCallback((date: Date) => {
    if (!hoverRange) return false;
    
    const { from, to } = hoverRange;
    const currentDate = new Date(date);
    
    return isSameDay(currentDate, from) || isSameDay(currentDate, to);
  }, [hoverRange]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderDateButton = (date: Date, index: number, isCurrentMonthDate: boolean) => {
    const isSelectableDate = isSelectable(date);
    const isInSelectedRange = isInRange(date);
    const isInHoverRange = isCurrentMonthDate && hoverRange && date >= hoverRange.from && date <= hoverRange.to;
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const isHovered = hoveredDate && isSameDay(date, hoveredDate);
    const isFocused = focusedDate && isSameDay(date, focusedDate);
    const isCurrent = isCurrentDate(date);
    const isWeekendDay = isWeekend(date);
    const isTempStart = tempStartDate && isSameDay(date, tempStartDate);
    
    // ตรวจสอบเงื่อนไขการโค้งสำหรับพื้นหลังสีฟ้าอ่อน
    const isInContinuousRange = isCurrentMonthDate && hoverRange && date >= hoverRange.from && date <= hoverRange.to;
    const isAtRangeStart = isCurrentMonthDate && hoverRange && isSameDay(date, hoverRange.from);
    const isAtRangeEnd = isCurrentMonthDate && hoverRange && isSameDay(date, hoverRange.to);

    return (
      <button
        key={index}
        onClick={() => isCurrentMonthDate && isSelectableDate && handleDateClick(date)}
        onMouseEnter={() => isCurrentMonthDate && isSelectableDate && handleDateHover(date)}
        onMouseLeave={() => setHoveredDate(null)}
        onFocus={() => isCurrentMonthDate && isSelectableDate && handleDateFocus(date)}
        onKeyDown={(e) => isCurrentMonthDate && isSelectableDate && handleKeyDown(e, date)}
        disabled={!isSelectableDate || !isCurrentMonthDate}
        className={`
          relative w-full h-10 text-[16px] leading-[18px] font-normal transition-all duration-200
          ${!isCurrentMonthDate ? 'text-gray-300' : isWeekendDay ? 'text-blue-600 font-medium' : 'text-gray-900'}
          ${!isSelectableDate ? 'cursor-not-allowed opacity-30' : isCurrentMonthDate ? 'cursor-pointer hover:bg-blue-50 hover:rounded-full w-10 h-11' : ''}
          ${isInSelectedRange && !isStart && !isEnd ? 'z-0' : ''}
        `}
        aria-label={`${format(date, 'd MMMM yyyy', { locale })}${isCurrent ? ' (วันนี้)' : ''}`}
        aria-selected={isStart || isEnd || isTempStart}
      >
        {/* พื้นหลังสีฟ้าอ่อนของช่วงวันที่เลือก */}
        {isCurrentMonthDate && (isInSelectedRange || (isInHoverRange && hoveredDate && isCurrentMonthDate) || isStart || isEnd || (isTempStart && hoveredDate && isCurrentMonthDate)) && (
          <span
            className={`
              absolute inset-0 bg-blue-100 z-0
              ${isStart ? 'rounded-l-full' : ''}
              ${isEnd ? 'rounded-r-full' : ''}
              ${isInContinuousRange && isAtRangeStart ? 'rounded-l-full' : ''}
              ${isInContinuousRange && isAtRangeEnd ? 'rounded-r-full' : ''}
              ${!isStart && !isEnd && !isInContinuousRange ? 'rounded-none' : ''}
            `}
          />
        )}

        {/* วันที่เริ่ม/สิ้นสุด */}
        {(isStart || isEnd || isTempStart) && isCurrentMonthDate && (
          <span className="relative z-10 flex items-center justify-center w-11 h-11 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600">
            {isCurrentMonthDate ? date.getDate() : ''}
          </span>
        )}

        {/* วงกลมสีเข้มสำหรับวันสุดท้ายที่เมาส์ชี้ */}
        {isHovered && isInHoverRange && !isStart && !isEnd && !isTempStart && isCurrentMonthDate &&(
          <span className="relative z-10 flex items-center justify-center w-11 h-11 bg-blue-300 text-white rounded-full shadow-md">
            {isCurrentMonthDate ? date.getDate() : ''}
          </span>
        )}

        {/* วันที่ปกติ */}
        {!isStart && !isEnd && !isTempStart && !isHovered && (
          <span className="relative z-10">
            {isCurrentMonthDate ? date.getDate() : ''}
          </span>
        )}
      </button>
    );
  };

  const renderTimeSelection = () => {
    if (!showTimeSelection) return null;

    return (
      <div className="flex gap-8 mb-6 px-6 pt-4 pb-6 relative">
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200" style={{ left: '-1.5rem', right: '-1.5rem' }}></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>
        
        {/* เวลารับรถ */}
        <div className="flex-1 pr-8">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">เวลารับรถ</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowReturnTimeDropdown(false);
                setShowPickupTimeDropdown(!showPickupTimeDropdown);
              }}
              className="w-full px-3 py-2 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-900">{pickupTime}</span>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showPickupTimeDropdown ? 'rotate-90' : ''}`} />
            </button>
            {showPickupTimeDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {TIME_OPTIONS.map((time) => (
                  <div
                    key={time}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleTimeChange('pickup', time);
                      setShowPickupTimeDropdown(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* เวลาคืนรถ */}
        <div className="flex-1 pl-8">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">เวลาคืนรถ</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowPickupTimeDropdown(false);
                setShowReturnTimeDropdown(!showReturnTimeDropdown);
              }}
              className="w-full px-3 py-2 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-900">{returnTime}</span>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showReturnTimeDropdown ? 'rotate-90' : ''}`} />
            </button>
            {showReturnTimeDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {TIME_OPTIONS.map((time) => (
                  <div
                    key={time}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleTimeChange('return', time);
                      setShowReturnTimeDropdown(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarHeader = () => (
    <div className="grid grid-cols-6 gap-2 mb-1">
      {/* Column 1: Back Arrow Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={goToPreviousMonth}
          className="p-3 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="เดือนก่อนหน้า"
        >
          <img src="/icons/next.png" alt="เดือนก่อนหน้า" className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Column 2: Month/Year Label (Current Month) */}
      <div className="flex items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
      </div>

      {/* Column 3: Empty Space */}
      <div className="flex items-center justify-center">
        <div className="w-6 h-6"></div>
      </div>

      {/* Column 4: Empty Space */}
      <div className="flex items-center justify-center">
        <div className="w-6 h-6"></div>
      </div>

      {/* Column 5: Month/Year Label (Next Month) */}
      <div className="flex items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
          {MONTH_NAMES[nextMonth.getMonth()]} {nextMonth.getFullYear()}
        </h3>
      </div>

      {/* Column 6: Forward Arrow Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={goToNextMonth}
          className="p-3 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="เดือนถัดไป"
        >
          <img src="/icons/next.png" alt="เดือนถัดไป" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderCalendar = (monthDays: Date[], isCurrentMonthDate: (date: Date) => boolean) => (
    <div>
      {/* วันในสัปดาห์ */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((day, index) => (
          <div key={day} className={`text-center text-sm font-semibold h-8 flex items-center justify-center ${
            index === 0 || index === 6 ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* วันที่ */}
      <div className="grid grid-cols-7 gap-y-1">
        {monthDays.map((date, index) => renderDateButton(date, index, isCurrentMonthDate(date)))}
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

    return (
      <div className={`bg-white rounded-xl shadow-xl pt-2 pb-6 px-6 w-[700px] ${className}`}>
      {/* Time Selection */}
      {renderTimeSelection()}

      {/* Header */}
      {renderCalendarHeader()}

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* ปฏิทินเดือนปัจจุบัน */}
        {renderCalendar(days, isCurrentMonth)}

        {/* ปฏิทินเดือนถัดไป */}
        {renderCalendar(nextMonthDays, (date) => isSameMonth(date, nextMonth))}
      </div>
    </div>
  );
}; 