import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="mx-auto flex w-[60%] flex-col items-center justify-center py-16">
      <img
        alt="Không tìm thấy trang"
        className="w-full max-w-md"
        src="/not%20found.png"
      />
      <Link to="/">
        <Button className="mt-6 gap-2" variant="ghost">
          <Home className="size-4" />
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
