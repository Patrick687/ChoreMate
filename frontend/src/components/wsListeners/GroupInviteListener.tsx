import { useDispatch } from "react-redux";
import { useGroupInviteAddedSubscription } from "../../graphql/generated";
import { addReceivedInvite as addReceivedInviteToGroupInviteState } from "../../store/groupInvites";

const GroupInviteListener: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useDispatch();
  console.log("GroupInviteListener subscribing for userId:", userId);
  useGroupInviteAddedSubscription({
    variables: { userId },
    onData: ({ data: { data } = {} }) => {
      const groupInvite = data?.groupInviteAdded;
      if(!groupInvite) {
        throw new Error("Data received from GroupInviteAddedSubscription is undefined");
      }
      dispatch(addReceivedInviteToGroupInviteState(groupInvite));
    },
    skip: !userId, // Don't run if no userId
  });
  return null;
};

export default GroupInviteListener;