import { useDispatch } from "react-redux";
import { useGroupInviteRespondedSubscription } from "../../graphql/generated";
import { updateSentInviteStatus as updateSentInviteStatusToGroupInviteState } from "../../store/groupInvites";

const GroupInviteResponseListener: React.FC<{ inviterUserId: string }> = ({ inviterUserId }) => {
  const dispatch = useDispatch();
  useGroupInviteRespondedSubscription({
    variables: { inviterUserId },
    onData: ({ data: { data } = {} }) => {
      const invite = data?.groupInviteResponded;
      if (!invite) {
        throw new Error("Data received from GroupInviteRespondedSubscription is undefined");
      }
      dispatch(updateSentInviteStatusToGroupInviteState(invite));
      dispatch()
    },
    skip: !inviterUserId,
  });
  return null;
};

export default GroupInviteResponseListener;