import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-sm text-gray-600 mb-0 ml-40">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          <span
            className={`cursor-pointer transition-colors ${
              item.isActive
                ? "text-gray-800 font-medium"
                : "hover:text-blue-600"
            }`}
            onClick={() => {
              if (item.path && !item.isActive) {
                if (item.path === "#") {
                  // สำหรับกรณีที่ต้องการกลับไปหน้าโปรไฟล์หลัก
                  window.location.reload();
                } else {
                  navigate(item.path);
                }
              }
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}; 