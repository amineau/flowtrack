import activityService from "@/server/db/service/activity";
import { Prisma } from "@prisma/client";
interface Query {
  take?: string;
  cursorId?: string;
  include?: string;
}

export default defineWrappedResponseHandler(async (event) => {
  const { take, cursorId, include }: Query = getQuery(event);
  const activities = await activityService.getByUserId(
    event.context.session.user.id,
    {
      take: (take && parseInt(take)) || undefined,
      cursorId: (cursorId && parseInt(cursorId)) || undefined,
      include: ((include && JSON.parse(include)) ||
        undefined) as Prisma.ActivitySelect,
    }
  );
  return activities;
});
