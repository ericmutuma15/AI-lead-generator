import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";


export default function LeadPagination({
  page = 1,
  setPage = () => {},

  totalItems = 0,

  itemsPerPage = 10,
  setItemsPerPage = () => {},

}) {


  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  );


  if (totalPages <= 1) {
    return null;
  }



  const getPages = () => {

    const pages = [];


    if (totalPages <= 5) {

      for(let i = 1; i <= totalPages; i++){
        pages.push(i);
      }

    }

    else {

      pages.push(1);


      if(page > 3){
        pages.push("...");
      }


      const start = Math.max(
        2,
        page - 1
      );


      const end = Math.min(
        totalPages - 1,
        page + 1
      );


      for(
        let i=start;
        i<=end;
        i++
      ){
        pages.push(i);
      }


      if(page < totalPages - 2){
        pages.push("...");
      }


      pages.push(totalPages);

    }


    return pages;

  };



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

        md:flex-row
        md:items-center
        md:justify-between
      "
    >



      {/* Count */}

      <p
        className="
          text-sm
          text-slate-500
        "
      >

        Showing

        <span className="mx-1 font-semibold text-slate-900">

          {
            Math.min(
              page * itemsPerPage,
              totalItems
            )
          }

        </span>

        of

        <span className="mx-1 font-semibold text-slate-900">

          {totalItems}

        </span>

        leads

      </p>




      {/* Navigation */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >


        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            text-slate-600
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <FiChevronLeft/>

        </button>



        {
          getPages().map(
            (number,index)=>(

              number === "..."
              ?

              <span
                key={index}
                className="
                  px-2
                  text-slate-400
                "
              >
                ...
              </span>


              :

              <button
                key={number}
                onClick={() =>
                  setPage(number)
                }

                className={`
                  h-9
                  min-w-9
                  rounded-lg
                  px-3
                  text-sm
                  font-medium

                  ${
                    page === number
                    ?
                    "bg-blue-600 text-white"
                    :
                    "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >

                {number}

              </button>

            )
          )
        }




        <button

          disabled={
            page === totalPages
          }

          onClick={() =>
            setPage(page + 1)
          }

          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            text-slate-600
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <FiChevronRight/>

        </button>


      </div>





      {/* Per page */}

      <select

        value={itemsPerPage}

        onChange={(e)=>{

          setItemsPerPage(
            Number(e.target.value)
          );

          setPage(1);

        }}

        className="
          rounded-lg
          border
          border-slate-200
          bg-slate-50
          px-3
          py-2
          text-sm
          outline-none
          focus:border-blue-500
        "
      >

        <option value={10}>
          10 / page
        </option>

        <option value={25}>
          25 / page
        </option>

        <option value={50}>
          50 / page
        </option>

        <option value={100}>
          100 / page
        </option>

      </select>


    </div>

  );
}