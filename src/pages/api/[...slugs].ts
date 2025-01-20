import { Elysia, t } from "elysia";
import { Genius } from "../../instances/genius";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "hi")
  .get(
    "/song",
    async ({ query }) => {
      const genius = new Genius();
      try {
        return await genius.searchSong(query.q);
      } catch (error) {
        return null;
      }
    },
    {
      query: t.Object({
        q: t.String(),
      }),
    }
  );

const handle = ({ request }: { request: Request }) => app.handle(request);

export const GET = handle;
