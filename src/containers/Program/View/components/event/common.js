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
    email_template_id,
    template_name,
    email_template,
    custom_email_template
  } = values;

  eventData.name = name;
  eventData.max_awardable_amount = max_awardable_amount;
  if (post_to_social_wall) {
    eventData.post_to_social_wall = post_to_social_wall;
  }
  if (award_message_editable) {
    eventData.award_message_editable = award_message_editable;
  }
  if (custom_email_template) {
    eventData.custom_email_template = custom_email_template;
    eventData.template_name = template_name ? template_name : '';
    eventData.email_template = email_template ? email_template : '';
  } else if (email_template_id) {
    eventData.email_template_id = email_template_id?.value ? email_template_id.value : null;
  }

  eventData.enable = enable ? 1 : 0;

  eventData.message = message;
  eventData.event_icon_id = event_icon_id;
  eventData.include_in_budget = 1;

  //static
  eventData.event_type_id = event_type_id.value;
  return eventData
}