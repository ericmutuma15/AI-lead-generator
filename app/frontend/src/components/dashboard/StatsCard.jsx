import Card from "../ui/Card";


export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}) {

  return (
    <Card>

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <h3
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h3>


          {
            description && (

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {description}
              </p>

            )
          }


          {
            trend && (

              <span
                className="
                  mt-3
                  inline-flex
                  items-center
                  rounded-full
                  bg-green-50
                  px-2
                  py-1
                  text-xs
                  font-semibold
                  text-green-600
                "
              >

                {trend}

              </span>

            )
          }


        </div>



        {
          Icon && (

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

              <Icon size={24}/>

            </div>

          )
        }


      </div>


    </Card>
  );
}