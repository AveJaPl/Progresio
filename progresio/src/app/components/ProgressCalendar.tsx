import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Parameter } from "@/types/types";

interface ProgressCalendarProps {
  parameter: Parameter;
  calendarData: Record<string, boolean>;
}

const ProgressCalendar: React.FC<ProgressCalendarProps> = ({
  parameter,
  calendarData,
}) => {
  const tileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): string => {
    if (view === "month") {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      if (calendarData[dateString] === true) {
        return "react-calendar__tile--success";
      } else if (calendarData[dateString] === false) {
        return "react-calendar__tile--failure";
      }
    }
    return "";
  };

  const tileContent = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): JSX.Element | null => {
    if (view === "month") {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      if (calendarData[dateString] !== undefined) {
        const value = parameter.progress.find(
          (item) => {
            const itemDateObj = new Date(item.date);
            itemDateObj.setHours(0, 0, 0, 0);
            const itemYear = itemDateObj.getFullYear();
            const itemMonth = String(itemDateObj.getMonth() + 1).padStart(2, "0");
            const itemDay = String(itemDateObj.getDate()).padStart(2, "0");
            const itemDateString = `${itemYear}-${itemMonth}-${itemDay}`;
            return itemDateString === dateString;
          }
        )?.value;

        return (
          <div className="tooltip">
            <span className="tooltiptext">
              Value:{" "}
              {parameter.type === "boolean"
                ? value === "true"
                  ? "Yes"
                  : "No"
                : value}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {parameter.name} Progress Calendar
      </h3>
      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
        view="month"
        className="mx-auto border border-gray-200 rounded-lg"
      />
      {/* Enhanced styles for calendar and tooltips */}
      <style jsx global>{`
        .react-calendar__tile--success {
          background-color: #34d399;
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 128, 0, 0.2);
          transition: transform 0.3s;
        }
        .react-calendar__tile--failure {
          background-color: #f87171;
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(128, 0, 0, 0.2);
          transition: transform 0.3s;
        }
        .react-calendar__tile--success:hover,
        .react-calendar__tile--failure:hover {
          transform: scale(1.05);
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 140px;
          background-color: rgba(0, 0, 0, 0.75);
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 150%; /* Adjusted for better visibility */
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          font-size: 14px;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ProgressCalendar;
