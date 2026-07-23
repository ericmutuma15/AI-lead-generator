import { useState } from "react";
import { FiX, FiUserPlus } from "react-icons/fi";

const API_BASE = import.meta.env.PROD ? "/_/backend" : "/api";

const BUSINESS_ID = "biz1";


export default function LeadModal({
  open,
  onClose,
  onSuccess,
}) {


  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    budget: "",
    source: "Web",
  });


  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");




  if (!open) return null;




  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };





  const resetForm = () => {

    setForm({
      name: "",
      phone: "",
      email: "",
      interest: "",
      budget: "",
      source: "Web",
    });

  };





  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {


      const response = await fetch(
        `${API_BASE}/capture`,
        {
          method: "POST",

          headers:{
            "Content-Type":"application/json",
          },

          body: JSON.stringify({
            ...form,
            business_id: BUSINESS_ID,
          }),
        }
      );



      if(!response.ok){

        throw new Error(
          "Failed to create lead"
        );

      }



      await response.json();


      resetForm();

      onSuccess?.();

      onClose();



    } catch(err){

      setError(
        err.message
      );

    } finally {

      setLoading(false);

    }

  };





  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
    >


      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          bg-white
          shadow-2xl
          border
          border-slate-200
        "
      >



        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
              "
            >
              <FiUserPlus size={20}/>
            </div>


            <div>

              <h2
                className="
                  font-semibold
                  text-slate-900
                "
              >
                Add New Lead
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Create a customer record
              </p>

            </div>


          </div>



          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-slate-100
            "
          >

            <FiX/>

          </button>


        </div>






        {/* Form */}


        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
            p-6
          "
        >


          {
            error && (

              <div
                className="
                  rounded-xl
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >

                {error}

              </div>

            )
          }






          {
            [
              ["name","Full Name"],
              ["phone","Phone Number"],
              ["email","Email Address"],
              ["interest","Interest"],
              ["budget","Budget"],
            ].map(([field,label]) => (

              <div
                key={field}
              >

                <label
                  className="
                    mb-1
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >

                  {label}

                </label>


                <input

                  name={field}

                  value={
                    form[field]
                  }

                  onChange={
                    handleChange
                  }

                  required={
                    field !== "budget"
                  }

                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "

                />


              </div>


            ))
          }





          <div>

            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-slate-700
              "
            >

              Source

            </label>


            <select

              name="source"

              value={
                form.source
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
              "
            >

              <option>
                Web
              </option>

              <option>
                WhatsApp
              </option>

              <option>
                Referral
              </option>

            </select>


          </div>





          <button

            disabled={loading}

            className="
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:opacity-50
            "

          >

            {
              loading
              ?
              "Saving..."
              :
              "Create Lead"
            }


          </button>



        </form>


      </div>


    </div>

  );

}