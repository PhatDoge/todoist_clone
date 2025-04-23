import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavItems = [
  {
    id: "primary",
    name: "Buzon",
    link: "/loggedin",
    icon: <Inbox className="w-4 h-4" />,
  },
  {
    name: "Hoy",
    link: "/loggedin/today",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    name: "Proximos",
    link: "/loggedin/upcoming",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    id: "filters",
    name: "Filtros y etiquetas",
    link: "/loggedin/filter-labels",
    icon: <Grid2X2 className="w-4 h-4" />,
  },
];

export const GET_STARTED_PROJECT_ID = "k97ea9zhgeddhgf6208c7q75ks7ekyjh";
