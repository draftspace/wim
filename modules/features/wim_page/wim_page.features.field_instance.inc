<?php
/**
 * @file
 * wim_page.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function wim_page_field_default_field_instances() {
  $field_instances = [];

  // Exported field_instance: 'node-page-body'.
  $field_instances['node-page-body'] = [
    'bundle' => 'page',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => [
      'default' => [
        'label' => 'hidden',
        'module' => 'text',
        'settings' => [],
        'type' => 'text_default',
        'weight' => 0,
      ],
      'introduction' => [
        'label' => 'hidden',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 3,
      ],
      'search_result' => [
        'label' => 'hidden',
        'module' => 'text',
        'settings' => [
          'trim_length' => 200,
        ],
        'type' => 'text_summary_or_trimmed',
        'weight' => 0,
      ],
      'teaser' => [
        'label' => 'hidden',
        'module' => 'text',
        'settings' => [
          'trim_length' => 200,
        ],
        'type' => 'text_summary_or_trimmed',
        'weight' => 2,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'body',
    'label' => 'Body',
    'required' => FALSE,
    'settings' => [
      'display_summary' => TRUE,
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'module' => 'text',
      'settings' => [
        'rows' => 20,
        'summary_rows' => 5,
      ],
      'type' => 'text_textarea_with_summary',
      'weight' => 2,
    ],
  ];

  // Exported field_instance: 'node-page-field_image'.
  $field_instances['node-page-field_image'] = [
    'bundle' => 'page',
    'deleted' => 0,
    'description' => '',
    'display' => [
      'default' => [
        'label' => 'hidden',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 4,
      ],
      'introduction' => [
        'label' => 'hidden',
        'module' => 'image',
        'settings' => [
          'image_link' => 'content',
          'image_style' => 'pictogram',
        ],
        'type' => 'image',
        'weight' => 0,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 4,
      ],
      'teaser' => [
        'label' => 'hidden',
        'module' => 'picture',
        'settings' => [
          'colorbox_settings' => [
            'colorbox_caption' => 'auto',
            'colorbox_caption_custom' => '',
            'colorbox_gallery' => 'post',
            'colorbox_gallery_custom' => '',
            'colorbox_group' => '',
            'colorbox_multivalue_index' => NULL,
          ],
          'fallback_image_style' => 'teaser',
          'image_link' => 'content',
          'lazyload' => 0,
          'lazyload_aspect_ratio' => 0,
          'picture_mapping' => 'teaser_responsive',
        ],
        'type' => 'picture',
        'weight' => 1,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_image',
    'label' => 'Image',
    'required' => 0,
    'settings' => [
      'alt_field' => 1,
      'default_image' => 0,
      'file_directory' => 'page/images',
      'file_extensions' => 'png gif jpg jpeg',
      'max_filesize' => '',
      'max_resolution' => '',
      'min_resolution' => '',
      'title_field' => 0,
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 1,
      'module' => 'media',
      'settings' => [
        'allowed_schemes' => [
          'public' => 'public',
        ],
        'allowed_types' => [
          'audio' => 0,
          'document' => 0,
          'image' => 'image',
          'video' => 0,
        ],
        'browser_plugins' => [
          'media_default--media_browser_1' => 'media_default--media_browser_1',
          'media_default--media_browser_my_files' => 'media_default--media_browser_my_files',
          'upload' => 'upload',
        ],
      ],
      'type' => 'media_generic',
      'weight' => 3,
    ],
  ];

  // Exported field_instance: 'node-page-field_lead_paragraph'.
  $field_instances['node-page-field_lead_paragraph'] = [
    'bundle' => 'page',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => [
      'default' => [
        'label' => 'hidden',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 7,
      ],
      'introduction' => [
        'label' => 'hidden',
        'module' => 'text',
        'settings' => [],
        'type' => 'text_default',
        'weight' => 1,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 0,
      ],
      'teaser' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 0,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_lead_paragraph',
    'label' => 'Lead paragraph',
    'required' => 0,
    'settings' => [
      'linkit' => [
        'button_text' => 'Search',
        'enable' => 0,
        'profile' => '',
      ],
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 1,
      'module' => 'text',
      'settings' => [
        'rows' => 5,
      ],
      'type' => 'text_textarea',
      'weight' => 4,
    ],
  ];

  // Exported field_instance: 'node-page-field_promoted'.
  $field_instances['node-page-field_promoted'] = [
    'bundle' => 'page',
    'default_value' => [
      0 => [
        'value' => 0,
      ],
    ],
    'deleted' => 0,
    'description' => 'Check if You want to stick this node on top of lists',
    'display' => [
      'default' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 5,
      ],
      'introduction' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 5,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 3,
      ],
      'teaser' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 4,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_promoted',
    'label' => 'Promoted',
    'required' => 0,
    'settings' => [
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 1,
      'module' => 'options',
      'settings' => [
        'display_label' => 1,
      ],
      'type' => 'options_onoff',
      'weight' => 5,
    ],
  ];

  // Exported field_instance: 'node-page-field_publication_date'.
  $field_instances['node-page-field_publication_date'] = [
    'bundle' => 'page',
    'deleted' => 0,
    'description' => 'You can use this field to display a custom publication date instead of the default creation date of the content item.',
    'display' => [
      'default' => [
        'label' => 'hidden',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 3,
      ],
      'introduction' => [
        'label' => 'hidden',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 4,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 2,
      ],
      'teaser' => [
        'label' => 'hidden',
        'module' => 'date',
        'settings' => [
          'format_type' => 'medium',
          'fromto' => 'both',
          'multiple_from' => '',
          'multiple_number' => '',
          'multiple_to' => '',
          'show_remaining_days' => 0,
        ],
        'type' => 'date_default',
        'weight' => 0,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_publication_date',
    'label' => 'Publication date',
    'required' => 0,
    'settings' => [
      'default_value' => 'now',
      'default_value2' => 'same',
      'default_value_code' => '',
      'default_value_code2' => '',
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 1,
      'module' => 'date',
      'settings' => [
        'increment' => 15,
        'input_format' => 'd/m/Y - H:i:s',
        'input_format_custom' => '',
        'label_position' => 'above',
        'no_fieldset' => 0,
        'text_parts' => [],
        'year_range' => '-3:+3',
      ],
      'type' => 'date_popup',
      'weight' => 10,
    ],
  ];

  // Exported field_instance: 'node-page-field_tags'.
  $field_instances['node-page-field_tags'] = [
    'bundle' => 'page',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => 'Enter a comma-separated list of tags.',
    'display' => [
      'default' => [
        'label' => 'inline',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 2,
      ],
      'introduction' => [
        'label' => 'inline',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 2,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 1,
      ],
      'teaser' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 3,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_tags',
    'label' => 'Tags',
    'required' => 0,
    'settings' => [
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 0,
      'module' => 'taxonomy',
      'settings' => [
        'autocomplete_path' => 'taxonomy/autocomplete',
        'size' => 60,
      ],
      'type' => 'taxonomy_autocomplete',
      'weight' => 4,
    ],
  ];

  // Exported field_instance: 'node-page-field_weight'.
  $field_instances['node-page-field_weight'] = [
    'bundle' => 'page',
    'default_value' => [
      0 => [
        'value' => 0,
      ],
    ],
    'deleted' => 0,
    'description' => '',
    'display' => [
      'default' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 1,
      ],
      'introduction' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 0,
      ],
      'search_result' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 0,
      ],
      'teaser' => [
        'label' => 'above',
        'settings' => [],
        'type' => 'hidden',
        'weight' => 0,
      ],
    ],
    'entity_type' => 'node',
    'field_name' => 'field_weight',
    'label' => 'Weight',
    'required' => 0,
    'settings' => [
      'range' => 20,
      'user_register_form' => FALSE,
    ],
    'widget' => [
      'active' => 1,
      'module' => 'weight',
      'settings' => [
        'range' => 20,
      ],
      'type' => 'weight_selector',
      'weight' => 44,
    ],
  ];

  // Translatables
  // Included for use with string extractors like potx.
  t('Body');
  t('Check if You want to stick this node on top of lists');
  t('Enter a comma-separated list of tags.');
  t('Image');
  t('Lead paragraph');
  t('Promoted');
  t('Publication date');
  t('Tags');
  t('Weight');
  t('You can use this field to display a custom publication date instead of the default creation date of the content item.');

  return $field_instances;
}
