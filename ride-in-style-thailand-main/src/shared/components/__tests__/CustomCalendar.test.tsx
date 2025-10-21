import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomCalendar } from '../CustomCalendar';

// Mock date-fns functions
jest.mock('date-fns', () => ({
  format: jest.fn((date) => date.toLocaleDateString('th-TH')),
  isSameDay: jest.fn((date1, date2) => date1.toDateString() === date2.toDateString()),
  isSameMonth: jest.fn((date1, date2) => date1.getMonth() === date2.getMonth()),
  startOfMonth: jest.fn((date) => new Date(date.getFullYear(), date.getMonth(), 1)),
  endOfMonth: jest.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  eachDayOfInterval: jest.fn(({ start, end }) => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }),
  startOfWeek: jest.fn((date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }),
  endOfWeek: jest.fn((date) => {
    const end = new Date(date);
    end.setDate(end.getDate() + (6 - end.getDay()));
    return end;
  }),
  addMonths: jest.fn((date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }),
  subMonths: jest.fn((date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
  }),
  isToday: jest.fn((date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }),
  isBefore: jest.fn((date1, date2) => date1 < date2),
  isAfter: jest.fn((date1, date2) => date1 > date2),
  addDays: jest.fn((date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }),
}));

// Mock date-fns/locale
jest.mock('date-fns/locale', () => ({
  th: {
    code: 'th',
    formatDistance: jest.fn(),
    formatRelative: jest.fn(),
    localize: {
      ordinalNumber: jest.fn(),
      era: jest.fn(),
      quarter: jest.fn(),
      month: jest.fn(),
      day: jest.fn(),
      dayPeriod: jest.fn(),
    },
    formatLong: {
      date: jest.fn(),
      time: jest.fn(),
      dateTime: jest.fn(),
    },
    match: {
      ordinalNumber: jest.fn(),
      era: jest.fn(),
      quarter: jest.fn(),
      month: jest.fn(),
      day: jest.fn(),
      dayPeriod: jest.fn(),
    },
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1,
    },
  },
}));

describe('CustomCalendar', () => {
  const mockOnRangeSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders calendar with current month', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
      />
    );

    // ตรวจสอบว่ามีการแสดงชื่อเดือน
    expect(screen.getByText(/มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม/)).toBeInTheDocument();
    
    // ตรวจสอบว่ามีการแสดงปี
    expect(screen.getByText(new Date().getFullYear().toString())).toBeInTheDocument();
  });

  it('renders day headers correctly', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
      />
    );

    // ตรวจสอบว่ามีการแสดงชื่อวันในสัปดาห์
    expect(screen.getByText('อา')).toBeInTheDocument();
    expect(screen.getByText('จ')).toBeInTheDocument();
    expect(screen.getByText('อ')).toBeInTheDocument();
    expect(screen.getByText('พ')).toBeInTheDocument();
    expect(screen.getByText('พฤ')).toBeInTheDocument();
    expect(screen.getByText('ศ')).toBeInTheDocument();
    expect(screen.getByText('ส')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
      />
    );

    // ตรวจสอบว่ามีปุ่มนำทาง
    const prevButton = screen.getByLabelText('เดือนก่อนหน้า');
    const nextButton = screen.getByLabelText('เดือนถัดไป');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders today button when showTodayButton is true', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showTodayButton={true}
      />
    );

    expect(screen.getByText('วันนี้')).toBeInTheDocument();
  });

  it('does not render today button when showTodayButton is false', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showTodayButton={false}
      />
    );

    expect(screen.queryByText('วันนี้')).not.toBeInTheDocument();
  });

  it('renders clear and close buttons when enabled', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showClearButton={true}
        showCloseButton={true}
      />
    );

    expect(screen.getByText('ล้าง')).toBeInTheDocument();
    expect(screen.getByText('ปิด')).toBeInTheDocument();
  });

  it('does not render clear and close buttons when disabled', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showClearButton={false}
        showCloseButton={false}
      />
    );

    expect(screen.queryByText('ล้าง')).not.toBeInTheDocument();
    expect(screen.queryByText('ปิด')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showCloseButton={true}
      />
    );

    const closeButton = screen.getByText('ปิด');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onRangeSelect with null when clear button is clicked', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        showClearButton={true}
      />
    );

    const clearButton = screen.getByText('ล้าง');
    fireEvent.click(clearButton);

    expect(mockOnRangeSelect).toHaveBeenCalledWith(null);
  });

  it('displays selected range in footer when provided', () => {
    const selectedRange = {
      from: new Date(2024, 11, 15),
      to: new Date(2024, 11, 20)
    };

    render(
      <CustomCalendar
        selectedRange={selectedRange}
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/เลือก:/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        className="custom-calendar"
      />
    );

    expect(container.firstChild).toHaveClass('custom-calendar');
  });

  it('handles keyboard navigation', () => {
    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
      />
    );

    // หาปุ่มวันที่แรกที่สามารถคลิกได้
    const dateButtons = screen.getAllByRole('button').filter(button => 
      /^\d+$/.test(button.textContent || '') && !button.disabled
    );

    if (dateButtons.length > 0) {
      const firstDateButton = dateButtons[0];
      
      // Focus on the button
      firstDateButton.focus();
      
      // Test Enter key
      fireEvent.keyDown(firstDateButton, { key: 'Enter' });
      
      expect(mockOnRangeSelect).toHaveBeenCalled();
    }
  });

  it('disables dates before minDate', () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7); // 7 วันข้างหน้า

    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        minDate={minDate}
      />
    );

    // ตรวจสอบว่าวันที่ก่อน minDate ถูกปิดใช้งาน
    const todayButton = screen.getByText(new Date().getDate().toString());
    expect(todayButton).toBeDisabled();
  });

  it('disables dates in disabledDates array', () => {
    const disabledDate = new Date();
    disabledDate.setDate(disabledDate.getDate() + 1); // พรุ่งนี้

    render(
      <CustomCalendar
        onRangeSelect={mockOnRangeSelect}
        onClose={mockOnClose}
        disabledDates={[disabledDate]}
      />
    );

    // ตรวจสอบว่าวันที่ใน disabledDates ถูกปิดใช้งาน
    const disabledButton = screen.getByText(disabledDate.getDate().toString());
    expect(disabledButton).toBeDisabled();
  });
}); 