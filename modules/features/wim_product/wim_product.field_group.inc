<?php
/**
 * @file
 * wim_product.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function wim_product_field_group_info() {
  $field_groups = [];

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_introduction|node|product|form';
  $field_group->group_name = 'group_introduction';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'product';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = [
    'label' => 'Introduction',
    'weight' => '1',
    'children' => [
      0 => 'field_image',
      1 => 'field_lead_paragraph',
    ],
    'format_type' => 'fieldset',
    'format_settings' => [
      'label' => 'Introduction',
      'instance_settings' => [
        'required_fields' => 1,
        'id' => '',
        'classes' => 'group-introduction field-group-fieldset',
        'description' => '',
      ],
      'formatter' => 'collapsed',
    ],
  ];
  $field_groups[''] = $field_group;

  // Translatables
  // Included for use with string extractors like potx.
  t('Introduction');

  return $field_groups;
}
