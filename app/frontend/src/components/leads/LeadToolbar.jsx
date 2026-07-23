import {
  FiPlus,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiGrid,
  FiList,
} from "react-icons/fi";

import Button from "../ui/Button";


export default function LeadToolbar({
  search,
  setSearch,

  onAdd,
  onExport,
  onRefresh,

  view,
  setView,

  loading = false,
}) {


  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >


      {/* Search */}

      <div
        className="
          relative
          w-full
          lg:max-w-md
        "
      >

        <FiSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
          size={18}
        />


        <input
          type="text"
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          placeholder="
            Search name, phone or interest...
          "
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-4
            text-sm
            outline-none

            transition

            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

      </div>



      {/* Actions */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >


        {/* View toggle */}

        <div
          className="
            flex
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            p-1
          "
        >

          <button
            onClick={() =>
              setView("table")
            }
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg

              ${
                view === "table"
                ?
                "bg-white shadow text-blue-600"
                :
                "text-slate-500"
              }
            `}
          >

            <FiList size={18}/>

          </button>


          <button
            onClick={() =>
              setView("grid")
            }
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg

              ${
                view === "grid"
                ?
                "bg-white shadow text-blue-600"
                :
                "text-slate-500"
              }
            `}
          >

            <FiGrid size={18}/>

          </button>

        </div>




        <Button
          variant="secondary"
          onClick={onRefresh}
          disabled={loading}
          icon={
            <FiRefreshCw
              className={
                loading
                ?
                "animate-spin"
                :
                ""
              }
            />
          }
        >
          Refresh
        </Button>




        <Button
          variant="secondary"
          onClick={onExport}
          icon={<FiDownload />}
        >
          Export
        </Button>




        <Button
          onClick={onAdd}
          icon={<FiPlus />}
        >
          Add Lead
        </Button>


      </div>


    </div>
  );
}