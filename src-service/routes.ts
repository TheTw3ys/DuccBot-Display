import { fullState } from "./parse-log";

export function defineAllRoutes(app) {
  app.get("/api/info", (req, res) => {
    res.json({
      description:
        "This is an monitor overviewing current xp, it sits on the logfiles and displays its content nicely.",
    });
  });
  app.get("/api/log_names", (req, res) => {
    res.json(Object.keys(fullState));
  });

  app.get("/api/states/:LogName", (req, res) => {
    const LogName = req.params.LogName;
    if (LogName != null) {
      if (fullState[LogName] != null) {
        res.json(fullState[LogName]);
      }
    }
    res.status(404);
  });
}
