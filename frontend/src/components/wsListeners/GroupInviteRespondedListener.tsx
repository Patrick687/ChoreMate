import { useDispatch } from "react-redux";
import { useGroupInviteRespondedSubscription } from "../../graphql/generated";

const GroupInviteResponseListener: React.FC<{ inviterUserId: string }> = ({ inviterUserId }) => {
  const dispatch = useDispatch();
  useGroupInviteRespondedSubscription({
    variables: { inviterUserId },
    onData: ({ data: { data } = {} }) => {
      const invite = data?.groupInviteResponded;
      if (!invite) {
        throw new Error("Data received from GroupInviteRespondedSubscription is undefined");
      }
      // Dispatch an action to update the group invite state
    },
    skip: !inviterUserId,
  });
  return null;
};

export default GroupInviteResponseListener;