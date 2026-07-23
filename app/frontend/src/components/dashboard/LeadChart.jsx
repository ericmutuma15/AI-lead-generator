import {
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiDollarSign,
} from "react-icons/fi";

import Card from "../ui/Card";


export default function LeadChart({
  title,
  value,
  subtitle,
  icon = "users",
}) {


  const icons = {
    users: FiUsers,
    leads: FiTarget,
    revenue: FiDollarSign,
    growth: FiTrendingUp,
  };


  const Icon = icons[icon] || FiUsers;


  return (
    <Card>

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {title}
          </p>


          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h2>


          {
            subtitle && (

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {subtitle}
              </p>

            )
          }

        </div>



        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >

          <Icon
            size={24}
          />

        </div>


      </div>


    </Card>
  );
}