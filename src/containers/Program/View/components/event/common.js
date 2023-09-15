export const makeFormData = (program, values) => {
    // console.log(values)
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
        milestone_award_frequency,
        ledger_code
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
    eventData.event_type_id = extractEventTypeId(eventData, event_type_id)
    eventData.ledger_code = extractLedgerCode(eventData, ledger_code) || null;
    eventData.milestone_award_frequency = milestone_award_frequency?.value ? milestone_award_frequency.value : milestone_award_frequency;

    return eventData
}

const extractLedgerCode = (eventData, ledger_code )   => {
    // console.log(ledger_code)
    if(typeof ledger_code === 'object') {
        if( ledger_code?.value )   {
            return parseInt(ledger_code.value)
        }
    }  else if( eventData.ledger_code ) {
        return eventData.ledger_code
    }
}

const extractEventTypeId = (eventData, selected_event_type_id) => {
    if(typeof selected_event_type_id === 'object') {
        if( selected_event_type_id?.value )   {
            return parseInt(selected_event_type_id.value)
        }
    }   else if (typeof selected_event_type_id === 'number' || selected_event_type_id === 'string') {
        return parseInt(selected_event_type_id)
    } else if( eventData.event_type_id )   {
        if(typeof eventData.event_type_id === 'object') {
            if( eventData.event_type_id?.value )   {
                return parseInt(eventData.event_type_id.value)
            }
        }   else if (typeof eventData.event_type_id === 'number') {
            return eventData.event_type_id
        }
    }   else if (eventData.event_type && typeof eventData.event_type === 'object' && eventData.event_type?.id)    {
        return eventData.event_type.id
    }
}
