import {
  FiEye,
  FiEdit,
  FiMessageCircle,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiTrash2,
} from "react-icons/fi";

import Dropdown from "../ui/Dropdown";


export default function LeadActions({
  lead,
  onView,
  onEdit,
  onMessage,
  onSchedule,
  onStatusChange,
  onDelete,
}) {

  const actions = [
    {
      label: "View Lead",
      icon: FiEye,
      action: onView,
    },

    {
      label: "Edit Lead",
      icon: FiEdit,
      action: onEdit,
    },

    {
      label: "Send Message",
      icon: FiMessageCircle,
      action: onMessage,
    },

    {
      label: "Schedule Follow-up",
      icon: FiCalendar,
      action: onSchedule,
    },

    {
      label: "Mark Qualified",
      icon: FiCheckCircle,
      action: () =>
        onStatusChange?.(
          lead.id,
          "Qualified"
        ),
    },

    {
      label: "Mark Converted",
      icon: FiDollarSign,
      action: () =>
        onStatusChange?.(
          lead.id,
          "Converted"
        ),
    },

    {
      label: "Delete Lead",
      icon: FiTrash2,
      danger: true,
      action: () =>
        onDelete?.(lead.id),
    },
  ];


  return (
    <Dropdown
      align="right"
      trigger={
        <button
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-900
          "
        >
          ⋮
        </button>
      }
    >

      <div className="w-56 py-2">

        {actions.map(
          ({
            label,
            icon: Icon,
            danger,
            action,
          }) => (

            <button
              key={label}
              onClick={action}
              className={`
                flex
                w-full
                items-center
                gap-3
                px-4
                py-2.5
                text-sm
                transition

                ${
                  danger
                  ? 
                  "text-red-600 hover:bg-red-50"
                  :
                  "text-slate-700 hover:bg-slate-50"
                }
              `}
            >

              <Icon size={16}/>

              {label}

            </button>

          )
        )}

      </div>

    </Dropdown>
  );
}