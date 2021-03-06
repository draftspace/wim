<?php

/**
 * @file
 * Mapping of XML to node content.
 */

/**
 * Populate node object with PDC content.
 *
 * @param DOMXPath $xpath
 *   Xpath object.
 * @param object $node
 *   Node object.
 * @param bool $private
 *   Private flag.
 *
 * @throws \Exception
 */
function sduconnect_set_pdc_content(DOMXPath $xpath, &$node, $private = FALSE) {
  $formats = filter_formats();
  $first_format = reset($formats);
  $default_format = variable_get('sduconnect_default_format', $first_format->format);

  $xpath->registerNameSpace('m', 'http://www.sduconnect.nl/Productoverzicht');
  $xpath->registerNameSpace('dcterms', 'http://purl.org/dc/terms/');
  $xpath->registerNameSpace('overheid', 'http://standaarden.overheid.nl/owms/terms/');
  $xpath->registerNameSpace('overheidproduct', 'http://standaarden.overheid.nl/product/terms/');
  $xpath->registerNameSpace('overheidsc', 'http://standaarden.overheid.nl/sc/terms/');

  $node->type = 'product';
  // Title.
  $node->title = (string) $xpath->query('//m:page/m:product/m:name')
    ->item(0)->nodeValue;

  // Created.
  $created = strtotime(sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:created')));
  if ($created > 0) {
    $node->created = $created;
  }

  // Changed.
  $changed = strtotime(sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:updated')));
  if ($changed > 0) {
    $node->changed = $changed;
  }

  // Language.
  $language = (string) $xpath->query('//m:page/m:product/m:language')
    ->item(0)->nodeValue;
  if ($language) {
    $node->language = strtolower(trim($language));
  }

  // Body.
  $body = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:description'));

  $summary = '';
  if (isset($node->body[LANGUAGE_NONE][0]['summary']) && $node->body[LANGUAGE_NONE][0]['summary']) {
    $summary = $node->body[LANGUAGE_NONE][0]['summary'];
  }

  $node->body = [
    LANGUAGE_NONE => [
      [
        'value' => $body,
        'format' => $default_format,
        'summary' => $summary,
      ],
    ],
  ];

  // Related Product items.
  $items = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:product_relaties/m:product_relatie/@base_id'));
  if ($items) {
    $node->field_related_product = [LANGUAGE_NONE => []];
    foreach ($items as $item) {
      $node->field_related_product[LANGUAGE_NONE][] = ['target_id' => SDUCONNECT_PRODUCT . '-' . trim($item)];
    }
  }
  elseif (empty($items) && !empty($node->field_related_product)) {
    unset($node->field_related_product);
    $node->field_related_product = [];
  }

  // Related FAQ items.
  $items = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:vac_relaties/m:vac_relatie/@base_id'));
  if ($items) {
    $node->field_related_faq = [LANGUAGE_NONE => []];
    foreach ($items as $item) {
      $node->field_related_faq[LANGUAGE_NONE][] = ['target_id' => SDUCONNECT_FAQ . '-' . trim($item)];
    }
  }
  elseif (empty($items) && !empty($node->field_related_faq)) {
    unset($node->field_related_faq);
    $node->field_related_faq = [];
  }

  // More info.
  $names = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:product_links/m:product_link/m:product_link_name'));
  $urls = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:product_links/m:product_link/m:product_link_url'));
  $items = [];
  foreach ($names as $i => $name) {
    $items[] = [
      'url' => $urls[$i],
      'title' => $name,
    ];
  }
  if ($items) {
    $node->field_product_more_information = [LANGUAGE_NONE => $items];
  }
  elseif (empty($items) && !empty($node->field_product_more_information)) {
    unset($node->field_product_more_information);
    $node->field_product_more_information = [];
  }

  // Product address field.
  $pds_addresses_data = [];

  $sub_query_paths = [
    'uitvoerende_instanties',
    'indieningsadressen',
  ];

  foreach ($sub_query_paths as $sub_query_path) {
    if ($pds_address_data = sduconnect_get_address_pdc_data($xpath, "//m:page/m:product/m:{$sub_query_path}/m:instantie/m:")) {
      $pds_addresses_data[] = $pds_address_data;
    }
  }

  if (!empty($pds_addresses_data)) {
    $node->field_product_address = [
      LANGUAGE_NONE => [
        [
          'value' => implode('<br />', $pds_addresses_data),
          'format' => $default_format,
        ],
      ],
    ];
  }
  else {
    $node->field_product_address = [];
  }

  // AVG.
  $field_product_avg = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:avg'));

  if (!empty($field_product_avg)) {
    $node->field_product_avg = [
      LANGUAGE_NONE => [
        [
          'value' => $field_product_avg,
          'format' => $default_format,
        ],
      ],
    ];
  }
  else {
    $node->field_product_avg = [];
  }

  // Related laws.
  $names = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:law_rules/m:law_rule/m:law_rule_name'));
  $urls = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:law_rules/m:law_rule/m:url'));
  $items = [];
  foreach ($names as $i => $name) {
    $items[] = [
      'url' => $urls[$i],
      'title' => $name,
    ];
  }
  if ($items) {
    $node->field_product_related_laws = [LANGUAGE_NONE => $items];
  }
  elseif (empty($items) && !empty($node->field_product_related_laws)) {
    unset($node->field_product_related_laws);
    $node->field_product_related_laws = [];
  }

  // Uniform Product Names List (UPL).
  $sub_expression = '//m:page/m:product/overheidproduct:scproduct/overheidproduct:meta/overheidproduct:scmeta/overheidproduct:';
  $url = sduconnect_nodelist_to_string($xpath->query($sub_expression . 'uniformeProductnaam/@resourceIdentifier'));
  $name = sduconnect_nodelist_to_string($xpath->query($sub_expression . 'uniformeProductnaam'));

  if ($url || $name) {
    $node->field_product_upl = [
      LANGUAGE_NONE => [
        [
          'url' => $url,
          'title' => $name,
        ],
      ],
    ];
  }
  else {
    $node->field_product_upl = [];
  }

  // SDU introduction.
  $sdu_introduction = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:introduction'));

  if (!empty($sdu_introduction)) {
    $node->field_product_sdu_introduction = [
      LANGUAGE_NONE => [
        [
          'value' => $sdu_introduction,
          'format' => $default_format,
        ],
      ],
    ];
  }
  else {
    $node->field_product_sdu_introduction = [];
  }

  // Forms.
  $names = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:formulieren_extern/m:formulier/m:label'));
  $urls = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:formulieren_extern/m:formulier/m:href'));
  $items = [];
  foreach ($names as $i => $name) {
    $items[] = [
      'url' => $urls[$i],
      'title' => $name,
    ];
  }
  if ($items) {
    $node->field_product_forms = [LANGUAGE_NONE => $items];
  }
  elseif (empty($items) && !empty($node->field_product_forms)) {
    unset($node->field_product_forms);
    $node->field_product_forms = [];
  }

  // Helper array to map xml tags to fields in node.
  $mapping = [
//    '//m:page/m:product/m:uitvoerende_instanties/m:instantie/m:opmerkingen' => 'field_product_locations',
    '//m:page/m:product/m:contact' => 'field_product_contact',
    '//m:page/m:product/m:appeal' => 'field_product_objection',
    '//m:page/m:product/m:costs' => 'field_product_costs',
    '//m:page/m:product/m:procedure' => 'field_product_procedure',
    '//m:page/m:product/m:period' => 'field_product_period',
    '//m:page/m:product/m:conditions' => 'field_product_conditions',
    '//m:page/m:product/m:notice' => 'field_product_attention',
    // @codingStandardsIgnoreStart
    // '//m:page/m:product/m:subsidies' => 'field_product_subsidies',
    // '//m:page/m:product/m:subsidies_budget' => 'field_product_subsidies_budget',
    // '//m:page/m:product/m:subsidies_maximale_bijdrage' => 'field_product_subsidies_maximale_bijdrage',
    // @codingStandardsIgnoreEnd
  ];

  // Here we set mapped fields.
  foreach ($mapping as $query => $field_name) {
    $field = sduconnect_nodelist_to_string($xpath->query($query));
    if (!empty($field)) {
      // Gives opportunity alter content before save.
      drupal_alter('sduconnect_prepare_content', $field, $field_name);
      $node->$field_name = [
        LANGUAGE_NONE => [
          [
            'value' => $field,
            'format' => $default_format,
          ],
        ],
      ];
    }
    elseif (strlen($field) == 0 && !empty($node->$field_name)) {
      unset($node->$field_name);
      $node->$field_name = [];
    }
  }

  // Request online.
  $url = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/overheidproduct:scproduct/overheidproduct:meta/overheidproduct:scmeta/overheidproduct:aanvraagURL/@resourceIdentifier'));
  $items = [];
  if ($url) {
    $items[] = [
      'href' => $url,
      'title' => 'Online aanvragen',
    ];
  }
  if ($items) {
    $node->field_product_request = [
      LANGUAGE_NONE => [
        [
          'value' => theme('links', ['links' => $items]),
          'format' => $default_format,
        ],
      ],
    ];
  }
  elseif (empty($items) && !empty($node->field_product_request)) {
    unset($node->field_product_request);
    $node->field_product_request = [];
  }

  // Tags.
  $a = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:doelgroepen/m:doelgroep'));
  $b = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:themes/m:theme/m:main/m:name'));
  $c = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:themes/m:theme/m:subthemes/m:subtheme/m:name'));
  $d = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:vind_themes/m:vind_theme/m:name'));
  $e = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/overheidproduct:scproduct/overheidproduct:meta/overheidproduct:owmsmantel/dcterms:subject'));
  $tags = array_unique(array_merge($a, $b, $c, $d, $e));
  $items = sduconnect_tags($tags);
  $node->field_tags = [LANGUAGE_NONE => $items];

  // Samenwerkende Catalogi.
  $categories = sduconnect_nodelist_to_array($xpath->query('//m:page/m:product/m:doelgroepen/m:doelgroep'));
  $items = [];
  foreach ($categories as $category) {
    if ($category === 'organisatie/ondernemer') {
      $category = 'ondernemer';
    }
    $items[] = [
      'value' => $category,
    ];
  }
  $node->field_sc_audience = [LANGUAGE_NONE => $items]; // @codingStandardsIgnoreLine

  // Start- and end date.
  $start = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:subsidies_startdate'));
  if ($start) {
    $start = implode('-', array_reverse(explode('-', $start))) . ' 00:00:00';
  }
  $end = sduconnect_nodelist_to_string($xpath->query('//m:page/m:product/m:subsidies_enddate'));
  if ($end) {
    $end = implode('-', array_reverse(explode('-', $end))) . ' 00:00:00';
  }
  $items = [];
  if ($start) {
    $items[] = [
      'value' => $start,
      'value2' => $end,
      'timezone' => variable_get('date_default_timezone', 'Europe/Amsterdam'),
      'timezone_db' => 'UTC',
      'date_type' => 'datetime',
    ];
  }
  // $node->field_date = array(LANGUAGE_NONE => $items); // @codingStandardsIgnoreLine

  // Publication date.
  $date[] = [
    'value' => date('Y-m-d H:i:s', $created),
    'value2' => '',
    'timezone' => variable_get('date_default_timezone'),
    'timezone_db' => 'UTC',
    'date_type' => 'datetime',
  ];

  $node->field_publication_date = [LANGUAGE_NONE => $date];
}

/**
 * Populate node object with PDC content.
 *
 * @param object $xpath
 *   Xpath object.
 * @param string $query_path
 *   Query path.
 *
 * @return string
 *   Trimmed string value.
 */
function sduconnect_get_address_pdc_data($xpath, $query_path) {
  $fields = [
//    'land',
    'naam',
    'b_straat',
    'b_nummer',
    'b_pcode',
    'b_stad',
    'p_straat',
    'p_nummer',
    'p_postcode',
    'p_po_box',
    'p_woonplaats',
    'telefoon',
    'fax',
    'email',
    'url',
    'url_naam',
//    'opmerkingen',
    'afdeling/m:hoofd_afdeling',
    'afdeling/m:afdeling_naam',
    'afdeling/m:persoon/m:functie',
    'afdeling/m:persoon/m:naam',
    'afdeling/m:persoon/m:telefoonnummer',
    'afdeling/m:persoon/m:email',
    'afdeling/m:persoon/m:opmerking',
  ];

  $bezoek_adres = '<strong>' . t('Bezoekadres') . ':</strong><br />';
  $bezoek_line_one = '';
  $bezoek_line_two = '';
  $post_adres = '<strong>' . t('Postadres') . ':</strong><br />';
  $post_line_one = '';
  $post_line_two = '';
  $post_line_three = '';

  $addresses = [];
  foreach ($fields as $field) {
    if ($address_data = sduconnect_nodelist_to_string($xpath->query($query_path . $field))) {
      if (in_array($field, ['b_straat', 'b_nummer', 'b_pcode', 'b_stad'])) {
        $addresses['bezoekadres'] = $bezoek_adres;
        if (in_array($field, ['b_straat', 'b_nummer'])) {
          $bezoek_line_one = trim($bezoek_line_one . ' ' . $address_data);
        }
        if (in_array($field, ['b_pcode', 'b_stad'])) {
          $bezoek_line_two = trim($bezoek_line_two . ' ' . $address_data);
        }
      }
      elseif (in_array($field, [
        'p_straat',
        'p_nummer',
        'p_postcode',
        'p_po_box',
        'p_woonplaats',
      ])) {
        $addresses['postadres'] = $post_adres;
        if (in_array($field, ['p_straat', 'p_nummer'])) {
          $post_line_one = trim($post_line_one . ' ' . $address_data);
        }
        if (in_array($field, ['p_po_box'])) {
          $post_line_two = trim($post_line_two . ' ' . $address_data);
        }
        if (in_array($field, ['p_postcode', 'p_woonplaats'])) {
          $post_line_three = trim($post_line_three . ' ' . $address_data);
        }
      }
      else {
        $addresses[$field] = $address_data;
      }
    }
  }

  if (!empty($addresses)) {

    // Set fields formatting and save a right order of items.
    if (!empty($addresses['naam'])) {
      $addresses['naam'] = '<strong>' . $addresses['naam'] . '</strong>';
    }
    if (!empty($addresses['url']) && !empty($addresses['url_naam'])) {
      $addresses['url'] = l($addresses['url_naam'], $addresses['url']);
      unset($addresses['url_naam']);
    }
    if (!empty($addresses['bezoekadres'])) {
      if ($bezoek_line_one) {
        $addresses['bezoekadres'] = $addresses['bezoekadres'] . $bezoek_line_one . '<br />';
      }
      if ($bezoek_line_two) {
        $addresses['bezoekadres'] = $addresses['bezoekadres'] . $bezoek_line_two;
      }
      $addresses['bezoekadres'] = '<p>' . $addresses['bezoekadres'] . '</p>';
    }
    if (!empty($addresses['postadres'])) {
      if ($post_line_one) {
        $addresses['postadres'] = $addresses['postadres'] . $post_line_one . '<br />';
      }
      if ($post_line_two) {
        $addresses['postadres'] = $addresses['postadres'] . $post_line_two . '<br />';
      }
      if ($post_line_three) {
        $addresses['postadres'] = $addresses['postadres'] . $post_line_three;
      }
    }
    if (!empty($addresses['telefoon'])) {
      $addresses['telefoon'] = 'Tel: ' . $addresses['telefoon'];
    }
    if (!empty($addresses['fax'])) {
      $addresses['fax'] = 'Fax: ' . $addresses['fax'];
    }
    if (!empty($addresses['email'])) {
      $addresses['email'] = l($addresses['email'], 'mailto:' . $addresses['email']);
    }

    // Prepare and convert data as separate string for textarea field.
    $addresses = trim(implode('<br />', $addresses));
  }

  return $addresses;
}

/**
 * Populate node object with VAC content.
 *
 * @param object $xpath
 *   Xpath object.
 * @param object $node
 *   Node.
 * @param bool $private
 *   Import private fields.
 */
function sduconnect_set_vac_content($xpath, &$node, $private = FALSE) {
  $formats = filter_formats();
  $first_format = reset($formats);
  $default_format = variable_get('sduconnect_default_format', $first_format->format);

  $xpath->registerNameSpace('vac', 'http://standaarden.overheid.nl/vac/');
  $xpath->registerNameSpace('dcterms', 'http://purl.org/dc/terms/');
  $xpath->registerNameSpace('overheid', 'http://standaarden.overheid.nl/owms/terms/');
  $xpath->registerNameSpace('overheidvac', 'http://standaarden.overheid.nl/vac/terms/');

  $node->type = 'faq';
  // Title.
  $node->title = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:vraag'));

  // Body.
  $body = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:antwoord/vac:antwoordTekst'));
  $body .= sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:antwoord/vac:antwoordProductVeld'));
  if ($private) {
    $body .= sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:onderwaterantwoord/vac:onderwaterantwoordTekst'));
    $body .= sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:onderwaterantwoord/vac:onderwaterantwoordProductVeld'));
  }

  $summary = '';
  if (isset($node->body[LANGUAGE_NONE][0]['summary']) && $node->body[LANGUAGE_NONE][0]['summary']) {
    $summary = $node->body[LANGUAGE_NONE][0]['summary'];
  }

  $node->body = [
    LANGUAGE_NONE => [
      [
        'value' => $body,
        'format' => $default_format,
        'summary' => $summary,
      ],
    ],
  ];

  // Address.
  if ($vac_data = sduconnect_nodelist_get_tree($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:antwoord/vac:antwoordAdres/vac:instantie'))) {
    $address = [];
    foreach ($vac_data as &$item) {
      // Set fields formatting and save a right order of items.
      if (!empty($item['vac:naam'])) {
        $item['vac:naam'] = '<strong>' . $item['vac:naam'] . '</strong>';
      }
      if (!empty($item['vac:url']) && !empty($item['vac:url_naam'])) {
        $item['vac:url'] = l($item['vac:url_naam'], $item['vac:url']);
        unset($item['vac:url_naam']);
      }
      if (!empty($item['vac:opmerkingen'])) {
        unset($item['vac:opmerkingen']);
      }
      if (!empty($item['vac:land'])) {
        unset($item['vac:land']);
      }
      if (!empty($item['vac:telefoon'])) {
        $item['vac:telefoon'] = 'Tel: ' . $item['vac:telefoon'];
      }
      if (!empty($item['vac:fax'])) {
        $item['vac:fax'] = 'Fax: ' . $item['vac:fax'];
      }
      if (!empty($item['vac:email'])) {
        $item['vac:email'] = l($item['vac:email'], 'mailto:' . $item['vac:email']);
      }
      if (!empty($item['vac:b_straat']) || !empty($item['vac:b_nummer']) || !empty($item['vac:b_pcode']) || !empty($item['vac:b_stad'])) {
        $bezoekadres = '<strong>' . t('Bezoekadres') . ':</strong><br />';
        if (!empty($item['vac:b_straat']) && !empty($item['vac:b_nummer'])) {
          $line_one = $item['vac:b_straat'] . ' ' . $item['vac:b_nummer'];
          unset($item['vac:b_nummer']);
        }
        elseif (!empty($item['vac:b_straat'])) {
          $line_one = $item['vac:b_straat'];
          unset($item['vac:b_straat']);
        }
        elseif (!empty($item['vac:b_nummer'])) {
          $line_one = $item['vac:b_nummer'];
          unset($item['vac:b_nummer']);
        }
        if (!empty($item['vac:b_pcode']) && !empty($item['vac:b_stad'])) {
          $line_two = $item['vac:b_pcode'] . ' ' . $item['vac:b_stad'];
          unset($item['vac:b_stad']);
        }
        elseif (!empty($item['vac:b_pcode'])) {
          $line_two = $item['vac:b_pcode'];
          unset($item['vac:b_pcode']);
        }
        elseif (!empty($item['vac:b_stad'])) {
          $line_two = $item['vac:b_stad'];
          unset($item['vac:b_stad']);
        }
        if (!empty($item['vac:b_straat'])) {
          $item['vac:b_straat'] = '<p>' . $bezoekadres . $line_one . '<br />' . $line_two . '</p>';
          unset($item['vac:b_pcode']);
        } else {
          $item['vac:b_pcode'] = '<p>' .$bezoekadres . $line_one . '<br />' . $line_two. '</p>';
        }
      }

      if (!empty($item['vac:p_straat']) || !empty($item['vac:p_nummer']) || !empty($item['vac:p_postcode']) || !empty($item['vac:p_po_box']) || !empty($item['vac:p_woonplaats'])) {
        $postadres = '<strong>' . t('Postadres') . ':</strong><br />';
        if (!empty($item['vac:p_straat']) && !empty($item['vac:p_nummer'])) {
          $line_one = $item['vac:p_straat'] . ' ' . $item['vac:p_nummer'];
          unset($item['vac:p_nummer']);
        }
        elseif (!empty($item['vac:p_straat'])) {
          $line_one = $item['vac:p_straat'];
          unset($item['vac:b_straat']);
        }
        elseif (!empty($item['vac:p_nummer'])) {
          $line_one = $item['vac:p_nummer'];
          unset($item['vac:p_nummer']);
        }
        if (!empty($item['vac:p_po_box'])) {
          $line_two = $item['vac:p_po_box'];
        }
        if (!empty($item['vac:p_postcode']) && !empty($item['vac:p_woonplaats'])) {
          $line_three = $item['vac:p_postcode'] . ' ' . $item['vac:p_woonplaats'];
          unset($item['vac:p_woonplaats']);
        }
        elseif (!empty($item['vac:p_postcode'])) {
          $line_three = $item['vac:p_postcode'];
          unset($item['vac:p_postcode']);
        }
        elseif (!empty($item['vac:p_woonplaats'])) {
          $line_three = $item['vac:p_woonplaats'];
          unset($item['vac:p_woonplaats']);
        }
        if (!empty($item['vac:p_straat'])) {
          $item['vac:p_straat'] = $postadres . $line_one . '<br />' . $line_two . '<br />' . $line_three;
          unset($item['vac:b_pcode']);
          unset($item['vac:p_po_box']);
          unset($item['vac:p_woonplaats']);
        }
        elseif(!empty($item['vac:p_po_box'])) {
          $item['vac:p_po_box'] = $postadres . $line_one . '<br />' . $line_two . '<br />' . $line_three;
          unset($item['vac:p_woonplaats']);
        }
        else{
          $item['vac:p_woonplaats'] = $postadres . $line_one . '<br />' . $line_two . '<br />' . $line_three;
        }
      }


      // Prepare and convert data as separate string for textarea field.
      $address[] = trim(implode('<br />', $item));
    }

    $node->field_faq_address = [
      LANGUAGE_NONE => [
        [
          'value' => implode('<br />', $address),
          'format' => $default_format,
        ],
      ],
    ];
  }
  else {
    $node->field_faq_address = [];
  }

  // Created.
  $created = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:meta/vac:owmsmantel/dcterms:available/start'));
  $node->created = strtotime($created);

  // Changed.
  $changed = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:meta/vac:owmskern/dcterms:modified'));
  $node->changed = strtotime($changed);

  // Language.
  $language = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:meta/vac:owmskern/dcterms:language'));
  if ($language) {
    $parts = explode('-', $language);
    $node->language = trim($parts[0]);
  }

  // Explanation.
  $value = sduconnect_nodelist_to_string($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:toelichting'));
  $items = [];
  if (preg_match('/[a-z0-9]/si', strip_tags($value))) {
    $items[] = [
      'value' => $value,
      'format' => $default_format,
    ];
    $node->field_faq_additional_information = [LANGUAGE_NONE => $items];
  }

  // Tags.
  $a = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:meta/vac:owmsmantel/dcterms:audience'));
  $b = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:meta/vac:vacmeta/vac:trefwoord'));
  $tags = array_unique(array_merge($a, $b));
  $items = sduconnect_tags($tags);
  $node->field_tags = [LANGUAGE_NONE => $items];

  // More information.
  $names = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:verwijzingOverigeInfo'));
  $urls = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:body/vac:kanaal/vac:verwijzingOverigeInfo/@resourceIdentifier'));
  $items = [];
  foreach ($names as $i => $name) {
    $items[] = [
      'url' => $urls[$i],
      'title' => $name,
    ];
  }

  if ($items) {
    $node->field_faq_more_information = [LANGUAGE_NONE => $items];
  }
  elseif (empty($items) && !empty($node->field_faq_more_information)) {
    unset($node->field_faq_more_information);
    $node->field_faq_more_information = [];
  }

  // Related Product items.
  $items = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:body/vac:verwijzingProduct/@resourceIdentifier'));
  if ($items) {
    $node->field_related_product = [LANGUAGE_NONE => []];
    foreach ($items as $item) {
      $node->field_related_product[LANGUAGE_NONE][] = ['target_id' => SDUCONNECT_PRODUCT . '-' . trim($item)];
    }
  }

  // Related FAQ items.
  $items = sduconnect_nodelist_to_array($xpath->query('//vac:vacs/vac:vac/vac:body/vac:verwijzingVac/@resourceIdentifier'));
  if ($items) {
    $node->field_related_faq = [LANGUAGE_NONE => []];
    foreach ($items as $item) {
      $node->field_related_faq[LANGUAGE_NONE][] = ['target_id' => SDUCONNECT_FAQ . '-' . trim($item)];
    }
  }

  // This should be disabled for new items.
  if (!isset($node->nid)) {
    $node->field_show_on_overview[LANGUAGE_NONE][] = ['value' => 0];
  }
}

/**
 * Convert DOMXML node list to string.
 *
 * @param object $node_list
 *   List of nodes.
 *
 * @return string
 *   Trimmed string value.
 */
function sduconnect_nodelist_to_string($node_list) {
  if ($node_list->length) {
    return trim($node_list->item(0)->nodeValue);
  }
  return '';
}

/**
 * Convert DOMXML node list to array.
 *
 * @param object $node_list
 *   List of nodes.
 *
 * @return array
 *   Array of values.
 */
function sduconnect_nodelist_to_array($node_list) {
  $output = [];
  foreach ($node_list as $node) {
    $output[] = $node->nodeValue;
  }
  return $output;
}

/**
 * Populate array with VAC content.
 *
 * @param object $node_list
 *   List of nodes.
 *
 * @return array
 *   Tree of elements:[
 *     parent_id[
 *       key => value,
 *     ]
 *   ]
 */
function sduconnect_nodelist_get_tree($node_list) {
  $tree = [];
  foreach ($node_list as $node) {
    $childNodes = $node->childNodes;
    if (!empty($childNodes)) {
      $id = $node->getAttribute('id');
      foreach ($childNodes as $item) {
        if (!empty($item->nodeValue)) {
          $tree[$id][$item->nodeName] = $item->nodeValue;
        }
      }
    }
  }

  return $tree;
}

/**
 * Get term id's for tags.
 *
 * @param string $names
 *   Term name.
 *
 * @return array
 *   Array of tid's.
 */
function sduconnect_tags($names) {
  $output = [];
  $vocab = 'tags';
  $names = array_filter(array_unique(array_map('trim', $names)));
  foreach ($names as $name) {
    $query = db_select('taxonomy_term_data', 'td')
      ->fields('td', ['tid'])
      ->condition('td.name', $name)
      ->range(0, 1);
    $v = $query->join('taxonomy_vocabulary', 'v', 'td.vid = v.vid');
    $query->condition("$v.machine_name", $vocab);
    $tid = $query->execute()->fetchField();
    if (!$tid) {
      $vid = db_select('taxonomy_vocabulary', 'v')
        ->fields('v', ['vid'])
        ->condition('v.machine_name', $vocab)
        ->execute()
        ->fetchField();
      $term = (object) [
        'name' => $name,
        'vid' => $vid,
        'vocabulary_machine_name' => $vocab,
      ];
      taxonomy_term_save($term);
      $tid = $term->tid;
    }
    $output[] = [
      'tid' => $tid,
    ];
  }
  return $output;
}
