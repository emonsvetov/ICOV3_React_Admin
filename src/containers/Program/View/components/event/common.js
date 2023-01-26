export const makeFormData = (program, values) => {
    let eventData = {};
    eventData["organization_id"] = program.organization_id;
    eventData["program_id"] = program.id;
    let {
        name,
        enable,
        max_awardable_amount,
        post_to_social_wall,
        message,
        award_message_editable,
        event_icon_id,
        event_type_id,
    } = values;

    eventData.name = name;
    eventData.max_awardable_amount = max_awardable_amount;
    if (post_to_social_wall) {
        eventData.post_to_social_wall = post_to_social_wall;
    }
    eventData.award_message_editable = award_message_editable;

    eventData.enable = enable ? 1 : 0;

    eventData.message = message;
    eventData.event_icon_id = event_icon_id;
    eventData.include_in_budget = 1;

    //static
    eventData.event_type_id = event_type_id.value;
    return eventData
}