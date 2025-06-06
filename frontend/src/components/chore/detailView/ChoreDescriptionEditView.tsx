import React from "react";
import { useDispatch } from "react-redux";
import { useUpdateChoreInfoMutation } from "../../../graphql/generated";
import { updateChoreInfo as updateChoreInfoAction } from "../../../store/chores";
import InlineEditField from "../../ui/form/InlineEditField";
import { choreDescriptionSchema } from "../../../utils/zodSchemas/choreZodSchemas";
import type { Chore, Group } from "../../../graphql/generated";

interface Props {
    chore: Chore;
    groupId: Group['id'];
}

const ChoreDescriptionEditView: React.FC<Props> = ({ chore }) => {
    const dispatch = useDispatch();
    const [updateChoreInfo] = useUpdateChoreInfoMutation();

    return (
        <InlineEditField
            value={chore.description || ""}
            type="textarea"
            schema={choreDescriptionSchema}
            onSave={async (val) => {
                await updateChoreInfo({ variables: { args: { choreId: chore.id, description: val } } });
                dispatch(updateChoreInfoAction({ choreId: chore.id, description: val }));
            }}
        />
    );
};

export default ChoreDescriptionEditView;