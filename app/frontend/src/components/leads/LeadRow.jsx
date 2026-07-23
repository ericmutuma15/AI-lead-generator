import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiCalendar,
} from "react-icons/fi";

import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

export default function LeadRow({
  lead,
  selected,
  onSelect,
  onEdit,
  onMessage,
  onSchedule,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <tr
      className="
        border-t
        border-slate-100
        hover:bg-slate-50
        transition
      "
    >
      {/* Checkbox */}

      <td className="px-5 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(lead.id)}
          className="
            h-4
            w-4
            rounded
            border-slate-300
            text-blue-600
          "
        />
      </td>

      {/* Lead */}

      <td className="px-5 py-4">
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Avatar name={lead.name} />

          <div>
            <button
              onClick={() => navigate(`/leads/${lead.id}`)}
              className="
                font-medium
                text-slate-900
                hover:text-blue-600
              "
            >
              {lead.name}
            </button>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              {lead.phone}
            </p>
          </div>
        </div>
      </td>

      {/* Interest */}

      <td className="px-5 py-4 text-slate-600">{lead.interest || "-"}</td>

      {/* Source */}

      <td className="px-5 py-4">
        <span
          className="
            rounded-lg
            bg-slate-100
            px-3
            py-1
            text-xs
            text-slate-600
          "
        >
          {lead.source}
        </span>
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <Badge status={lead.status} />
      </td>

      {/* Date */}

      <td className="px-5 py-4 text-sm text-slate-500">
        {lead.created_at
          ? new Date(lead.created_at).toLocaleDateString("en-KE")
          : "-"}
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <button
            title="View"
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <FiEye />
          </button>

          <button
            title="Message"
            onClick={() => onMessage(lead)}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-green-50
              hover:text-green-600
            "
          >
            <FiMessageCircle />
          </button>

          <button
            title="Schedule follow-up"
            onClick={() => onSchedule(lead)}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-purple-50
              hover:text-purple-600
            "
          >
            <FiCalendar />
          </button>

          <button
            title="Edit"
            onClick={() => onEdit(lead)}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-yellow-50
              hover:text-yellow-600
            "
          >
            <FiEdit />
          </button>

          <button
            title="Delete"
            onClick={() => onDelete(lead)}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
}
