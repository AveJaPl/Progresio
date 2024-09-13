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
      // Adjust date to local time zone
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
      // Adjust date to local time zone
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
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Progress Calendar
      </h3>
      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
        view="month"
        className="mx-auto"
      />
      {/* Additional styles for calendar and tooltips */}
      <style jsx global>{`
        .react-calendar__tile--success {
          background-color: #10b981;
          color: white;
        }
        .react-calendar__tile--failure {
          background-color: #ef4444;
          color: white;
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 120px;
          background-color: rgba(0, 0, 0, 0.75);
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Adjust as needed */
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
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
