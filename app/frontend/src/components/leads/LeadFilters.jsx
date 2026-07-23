import {
  FiFilter,
  FiX
} from "react-icons/fi";

import Badge from "../ui/Badge";


export default function LeadFilters({
  filters,
  setFilters,
  onClear,
}) {


  const statuses = [
    "All",
    "New",
    "Qualified",
    "Converted",
    "Lost",
  ];


  const sources = [
    "All",
    "Web",
    "WhatsApp",
    "Referral",
    "Other",
  ];



  const updateFilter = (
    key,
    value
  ) => {

    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));

  };



  const activeFilters =
    filters.status !== "All" ||
    filters.source !== "All";



  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >


      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <FiFilter
            className="text-blue-600"
            size={18}
          />

          <h3
            className="
              font-semibold
              text-slate-900
            "
          >
            Filters
          </h3>

        </div>



        {
          activeFilters && (

            <button
              onClick={onClear}
              className="
                flex
                items-center
                gap-1
                text-sm
                text-red-500
                hover:text-red-600
              "
            >

              <FiX size={15}/>

              Clear

            </button>

          )
        }


      </div>





      <div
        className="
          grid
          gap-5

          md:grid-cols-2
        "
      >



        {/* Status Filter */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-600
            "
          >
            Status
          </label>


          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >

            {
              statuses.map(status => (

                <button
                  key={status}
                  onClick={() =>
                    updateFilter(
                      "status",
                      status
                    )
                  }

                  className={`
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    transition

                    ${
                      filters.status === status
                      ?
                      "bg-blue-600 text-white"
                      :
                      "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }
                  `}
                >

                  {status}

                </button>

              ))
            }

          </div>

        </div>






        {/* Source Filter */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-600
            "
          >
            Source
          </label>


          <select

            value={filters.source}

            onChange={(e)=>
              updateFilter(
                "source",
                e.target.value
              )
            }

            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3
              text-sm
              outline-none

              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "

          >

            {
              sources.map(source => (

                <option
                  key={source}
                  value={source}
                >
                  {source}
                </option>

              ))
            }

          </select>


        </div>



      </div>





      {/* Active filters preview */}

      {
        activeFilters && (

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
              border-t
              border-slate-100
              pt-4
            "
          >

            {
              filters.status !== "All" && (

                <Badge>
                  Status: {filters.status}
                </Badge>

              )
            }


            {
              filters.source !== "All" && (

                <Badge>
                  Source: {filters.source}
                </Badge>

              )
            }


          </div>

        )
      }


    </div>

  );

}