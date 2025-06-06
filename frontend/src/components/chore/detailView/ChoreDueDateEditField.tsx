import React from "react";
import { useDispatch } from "react-redux";
import { useUpdateChoreDueDateMutation } from "../../../graphql/generated";
import { updateChoreDueDate as updateChoreDueDateAction } from "../../../store/chores";
import InlineEditField from "../../ui/form/InlineEditField";
import { choreDueDateSchema } from "../../../utils/zodSchemas/choreZodSchemas";
import type { Chore, Group } from "../../../graphql/generated";

interface Props {
    chore: Chore;
    groupId: Group['id'];
}

const ChoreDueDateEditField: React.FC<Props> = ({ chore }) => {
    const dispatch = useDispatch();
    const [updateChoreDueDate] = useUpdateChoreDueDateMutation();

    return (
        <InlineEditField
            value={chore.dueDate ? chore.dueDate.split("T")[0] : ""}
            type="date"
            schema={choreDueDateSchema}
            onSave={async (val) => {
                await updateChoreDueDate({
                    variables: { args: { choreId: chore.id, dueDate: val ? new Date(val + "T00:00:00") : null } }
                });
                dispatch(updateChoreDueDateAction({
                    choreId: chore.id,
                    dueDate: val ? new Date(val + "T00:00:00").toISOString() : null,
                }));
            }}
        />
    );
};

export default ChoreDueDateEditField;