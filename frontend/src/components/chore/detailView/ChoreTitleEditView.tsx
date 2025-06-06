import React from "react";
import { useDispatch } from "react-redux";
import { useUpdateChoreInfoMutation } from "../../../graphql/generated";
import { updateChoreInfo as updateChoreInfoAction } from "../../../store/chores";
import InlineEditField from "../../ui/form/InlineEditField";
import { choreTitleSchema } from "../../../utils/zodSchemas/choreZodSchemas";
import type { Chore, Group } from "../../../graphql/generated";

interface Props {
    chore: Chore;
    groupId: Group['id'];
}

const ChoreTitleEditView: React.FC<Props> = ({ chore }) => {
    const dispatch = useDispatch();
    const [updateChoreInfo] = useUpdateChoreInfoMutation();

    return (
        <InlineEditField
            value={chore.title}
            schema={choreTitleSchema}
            onSave={async (val) => {
                await updateChoreInfo({ variables: { args: { choreId: chore.id, title: val } } });
                dispatch(updateChoreInfoAction({ choreId: chore.id, title: val }));
            }}
        />
    );
};

export default ChoreTitleEditView;